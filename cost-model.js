/* =========================================================
   QUERYLENS — CARDINALITY-AWARE COST MODEL
   Replaces the flat-constant scoring in script.js
   ========================================================= */

/* Per-table statistics. rows = cardinality,
   distinct = approximate number of distinct values per column.
   These drive selectivity estimation. */
const STATS = {
  customers: {
    rows: 3000,
    distinct: { id: 3000, name: 3000, email: 3000, country: 8, city: 10, created_at: 600 },
    indexes: [["country"], ["email"], ["id"]]
  },
  products: {
    rows: 500,
    distinct: { id: 500, name: 500, category: 6, price: 480 },
    indexes: [["category"], ["id"]]
  },
  orders: {
    rows: 25000,
    distinct: {
      id: 25000, customer_id: 3000, product_id: 500,
      order_date: 600, quantity: 5, amount: 20000, status: 4
    },
    indexes: [["customer_id"], ["product_id"], ["order_date"], ["status"], ["id"]]
  }
};

/* Cost constants, loosely modelled on PostgreSQL's planner. */
const COST = {
  SEQ_PAGE: 1.0,      // cost to read one sequential page
  RANDOM_PAGE: 4.0,   // cost to read one random page (index lookup)
  CPU_TUPLE: 0.01,    // cost to process one row
  CPU_OPERATOR: 0.0025, // cost to evaluate one predicate
  ROWS_PER_PAGE: 50
};

/* ---------------------------------------------------------
   PREDICATE EXTRACTION
   Splits a WHERE string into individual predicates while
   respecting parentheses and quoted strings.
   --------------------------------------------------------- */

function splitPredicates(where) {
  if (!where) return [];

  const out = [];
  let depth = 0, quote = null, current = "";

  const tokens = where.split(/(\s+AND\s+|\s+OR\s+|\(|\))/i);

  for (const token of tokens) {
    if (token === "(") { depth++; current += token; continue; }
    if (token === ")") { depth--; current += token; continue; }

    if (depth === 0 && /^\s+(AND|OR)\s+$/i.test(token)) {
      if (current.trim()) out.push(current.trim());
      current = "";
      continue;
    }
    current += token;
  }

  if (current.trim()) out.push(current.trim());
  return out;
}

/* ---------------------------------------------------------
   SELECTIVITY ESTIMATION
   Returns a fraction 0..1 of rows expected to survive.
   --------------------------------------------------------- */

function estimateSelectivity(predicate, table) {
  const stats = STATS[table];
  if (!stats) return 0.33;

  const p = predicate.trim();

  // column IS NULL / IS NOT NULL
  let m = p.match(/^\(?\s*([\w.]+)\s+IS\s+(NOT\s+)?NULL\s*\)?$/i);
  if (m) return m[2] ? 0.95 : 0.05;

  // column IN (a, b, c)
  m = p.match(/^\(?\s*([\w.]+)\s+IN\s*\(([^)]*)\)\s*\)?$/i);
  if (m) {
    const col = m[1].split(".").pop().toLowerCase();
    const n = m[2].split(",").length;
    const d = stats.distinct[col] || stats.rows;
    return Math.min(1, n / d);
  }

  // column BETWEEN a AND b
  m = p.match(/^\(?\s*([\w.]+)\s+BETWEEN\s+/i);
  if (m) return 0.25;

  // column LIKE 'pattern'
  m = p.match(/^\(?\s*([\w.]+)\s+LIKE\s+(['"])(.*?)\2\s*\)?$/i);
  if (m) {
    const pattern = m[3];
    if (pattern.startsWith("%")) return 0.60;  // leading wildcard, no index help
    if (pattern.includes("%")) return 0.12;    // prefix match, index-friendly
    return 0.01;
  }

  // column <op> value
  m = p.match(/^\(?\s*([\w.]+)\s*(=|!=|<>|>=|<=|>|<)\s*(.+?)\s*\)?$/);
  if (m) {
    const col = m[1].split(".").pop().toLowerCase();
    const op = m[2];
    const d = stats.distinct[col] || stats.rows;

    if (op === "=") return 1 / d;
    if (op === "!=" || op === "<>") return 1 - (1 / d);
    return 0.30; // range comparison default
  }

  return 0.33; // unrecognised predicate
}

/* Combine selectivities. AND multiplies, OR uses inclusion-exclusion. */
function combinedSelectivity(where, table) {
  if (!where) return 1;

  const hasOr = /\sOR\s/i.test(where);
  const preds = splitPredicates(where);
  if (!preds.length) return 1;

  const sels = preds.map(p => estimateSelectivity(p, table));

  if (hasOr) {
    // P(A or B) = 1 - (1-A)(1-B)
    return Math.min(1, 1 - sels.reduce((acc, s) => acc * (1 - s), 1));
  }
  return sels.reduce((acc, s) => acc * s, 1);
}

/* ---------------------------------------------------------
   INDEX MATCHING
   Only matches an index on the CORRECT table, and only for
   operators an index can actually serve.
   --------------------------------------------------------- */

function findUsableIndex(where, table) {
  const stats = STATS[table];
  if (!stats || !where) return null;

  const preds = splitPredicates(where);

  for (const index of stats.indexes) {
    const leading = index[0]; // leftmost-prefix rule

    for (const pred of preds) {
      const m = pred.match(/^\(?\s*([\w.]+)\s*(=|>=|<=|>|<|\s+LIKE\s+|\s+IN\s+|\s+BETWEEN\s+)/i);
      if (!m) continue;

      const col = m[1].split(".").pop().toLowerCase();
      if (col !== leading) continue;

      // A leading-wildcard LIKE cannot use an index.
      if (/LIKE/i.test(m[2])) {
        const lit = pred.match(/LIKE\s+(['"])(.*?)\1/i);
        if (lit && lit[2].startsWith("%")) continue;
      }

      return { index, column: col, predicate: pred };
    }
  }
  return null;
}

/* ---------------------------------------------------------
   NODE COSTS
   --------------------------------------------------------- */

function seqScanCost(rows) {
  const pages = Math.ceil(rows / COST.ROWS_PER_PAGE);
  return pages * COST.SEQ_PAGE + rows * COST.CPU_TUPLE;
}

function indexScanCost(totalRows, matchedRows) {
  const height = Math.max(1, Math.ceil(Math.log2(Math.max(2, totalRows)) / 4));
  return height * COST.RANDOM_PAGE
       + matchedRows * (COST.RANDOM_PAGE * 0.5 + COST.CPU_TUPLE);
}

function sortCost(rows) {
  if (rows <= 1) return 0;
  return rows * Math.log2(rows) * COST.CPU_OPERATOR * 2;
}

function hashAggCost(rows) {
  return rows * COST.CPU_OPERATOR * 3;
}

function nestedLoopCost(outerRows, innerRows) {
  return outerRows * seqScanCost(innerRows);
}

function hashJoinCost(outerRows, innerRows) {
  return seqScanCost(innerRows) + outerRows * COST.CPU_OPERATOR * 2;
}

/* ---------------------------------------------------------
   MAIN ENTRY — drop-in replacement for analyzePlan()
   --------------------------------------------------------- */

function analyzePlanV2(sql, execution) {
  const table = execution.table;
  const stats = STATS[table] || { rows: execution.sourceRows, distinct: {}, indexes: [] };
  const baseRows = stats.rows;

  const where = execution.where || "";
  const selectivity = combinedSelectivity(where, table);
  const estimatedRows = Math.max(1, Math.round(baseRows * selectivity));

  const nodes = [];
  let totalCost = 0;
  let fullScans = 0;
  let indexSearches = 0;
  let temporaryStructures = 0;

  /* --- access path --- */
  const usableIndex = findUsableIndex(where, table);

  if (usableIndex) {
    const c = indexScanCost(baseRows, estimatedRows);
    totalCost += c;
    indexSearches++;
    nodes.push({
      op: "INDEX SCAN",
      detail: `${table} using idx_${table}_${usableIndex.column} (${usableIndex.column})`,
      rows: estimatedRows,
      cost: c
    });
  } else {
    const c = seqScanCost(baseRows);
    totalCost += c;
    fullScans++;
    nodes.push({
      op: "SEQ SCAN",
      detail: where ? `${table} (no usable index for filter)` : `${table} (no filter)`,
      rows: estimatedRows,
      cost: c
    });
  }

  if (where) {
    const c = baseRows * COST.CPU_OPERATOR * splitPredicates(where).length;
    totalCost += c;
    nodes.push({
      op: "FILTER",
      detail: where,
      rows: estimatedRows,
      cost: c
    });
  }

  /* --- joins --- */
  let currentRows = estimatedRows;
  const joinTables = [];
  const joinRegex = /\bJOIN\s+([a-zA-Z_]\w*)/gi;
  let jm;
  while ((jm = joinRegex.exec(sql)) !== null) {
    joinTables.push(jm[1].toLowerCase());
  }

  for (const jt of joinTables) {
    const jStats = STATS[jt];
    if (!jStats) continue;

    const joinIndexed = jStats.indexes.some(ix =>
      new RegExp(`\\b${jt}\\.${ix[0]}\\b|\\b${ix[0]}\\s*=`, "i").test(sql)
    );

    const c = joinIndexed
      ? hashJoinCost(currentRows, jStats.rows)
      : nestedLoopCost(currentRows, jStats.rows);

    totalCost += c;
    if (!joinIndexed) fullScans++;

    // Join cardinality estimate: |A|*|B| / max(distinct keys)
    const keyDistinct = Math.max(
      jStats.distinct.id || jStats.rows,
      stats.distinct.id || baseRows
    );
    currentRows = Math.max(1, Math.round((currentRows * jStats.rows) / keyDistinct));

    nodes.push({
      op: joinIndexed ? "HASH JOIN" : "NESTED LOOP JOIN",
      detail: `${table} ⋈ ${jt} (${jStats.rows.toLocaleString()} inner rows)`,
      rows: currentRows,
      cost: c
    });
  }

  /* --- group by --- */
  if (execution.hasGroupBy) {
    const c = hashAggCost(currentRows);
    totalCost += c;
    temporaryStructures++;
    const groupCols = (sql.match(/\bGROUP\s+BY\b(.+?)(?=\bHAVING\b|\bORDER\s+BY\b|\bLIMIT\b|$)/i) || [])[1];
    const groupDistinct = Math.max(1, Math.round(Math.sqrt(currentRows)));
    currentRows = Math.min(currentRows, groupDistinct);
    nodes.push({
      op: "HASH AGGREGATE",
      detail: `GROUP BY ${(groupCols || "").trim()}`,
      rows: currentRows,
      cost: c
    });
  }

  /* --- distinct --- */
  if (/\bDISTINCT\b/i.test(sql)) {
    const c = hashAggCost(currentRows);
    totalCost += c;
    temporaryStructures++;
    nodes.push({ op: "UNIQUE", detail: "DISTINCT", rows: currentRows, cost: c });
  }

  /* --- order by --- */
  if (execution.hasOrderBy) {
    const c = sortCost(currentRows);
    totalCost += c;
    temporaryStructures++;
    const orderCols = (sql.match(/\bORDER\s+BY\b(.+?)(?=\bLIMIT\b|$)/i) || [])[1];
    nodes.push({
      op: "SORT",
      detail: `ORDER BY ${(orderCols || "").trim()}`,
      rows: currentRows,
      cost: c
    });
  }

  /* --- limit --- */
  if (execution.hasLimit) {
    const lm = sql.match(/\bLIMIT\s+(\d+)/i);
    const n = lm ? Number(lm[1]) : currentRows;
    currentRows = Math.min(currentRows, n);
    nodes.push({ op: "LIMIT", detail: `${n} rows`, rows: currentRows, cost: 0 });
  }

  /* --- projection penalty for SELECT * --- */
  if (execution.selectStar) {
    const c = currentRows * COST.CPU_TUPLE * 2;
    totalCost += c;
    nodes.push({
      op: "PROJECT",
      detail: "SELECT * — all columns materialised",
      rows: currentRows,
      cost: c
    });
  }

  const estimatedCost = Math.max(0.01, Number(totalCost.toFixed(2)));

  /* --- score: log-scaled against an ideal baseline --- */
  const idealCost = seqScanCost(Math.min(100, baseRows));
  const ratio = estimatedCost / Math.max(idealCost, 0.01);
  const score = Math.max(
    1,
    Math.min(100, Math.round(100 - 22 * Math.log10(Math.max(1, ratio))))
  );

  let category;
  if (score >= 75) category = "Low";
  else if (score >= 45) category = "Moderate";
  else category = "High";

  /* % contribution per node */
  nodes.forEach(n => {
    n.share = estimatedCost > 0 ? Math.round((n.cost / estimatedCost) * 100) : 0;
  });

  return {
    fullScans,
    indexSearches,
    temporaryStructures,
    joins: joinTables.length,
    estimatedCost,
    score,
    category,
    selectivity: Number(selectivity.toFixed(5)),
    estimatedRows,
    rowsScanned: baseRows,
    usableIndex: usableIndex ? usableIndex.column : null,
    nodes,
    plan: nodes.map(n =>
      `${n.op}  (rows=${n.rows.toLocaleString()} cost=${n.cost.toFixed(2)} ${n.share}%)  ${n.detail}`
    ).concat("RETURN RESULT")
  };
}

/* ---------------------------------------------------------
   REWRITE SUGGESTIONS — generates actual DDL / SQL
   --------------------------------------------------------- */

function generateRewrites(sql, execution, plan) {
  const out = [];
  const table = execution.table;
  const stats = STATS[table];

  if (execution.selectStar && stats) {
    const cols = Object.keys(stats.distinct).map(c => `${table}.${c}`).join(", ");
    out.push({
      title: "Replace SELECT * with explicit columns",
      sql: sql.replace(/^SELECT\s+\*/i, `SELECT ${cols}`)
    });
  }

  if (plan.fullScans > 0 && execution.where && stats) {
    const preds = splitPredicates(execution.where);
    for (const p of preds) {
      const m = p.match(/^\(?\s*([\w.]+)\s*(=|>=|<=|>|<)/);
      if (!m) continue;
      const col = m[1].split(".").pop().toLowerCase();
      const indexed = stats.indexes.some(ix => ix[0] === col);
      if (!indexed && stats.distinct[col] !== undefined) {
        out.push({
          title: `Add an index on ${table}.${col}`,
          sql: `CREATE INDEX idx_${table}_${col} ON ${table} (${col});`
        });
      }
    }
  }

  if (/\bLIKE\s+(['"])%/i.test(sql)) {
    out.push({
      title: "Leading wildcard prevents index use",
      sql: "-- Rewrite LIKE '%term%' as LIKE 'term%' if business rules allow,\n-- or add a full-text / trigram index."
    });
  }

  if (!execution.hasLimit && plan.estimatedRows > 1000) {
    out.push({
      title: "Add a LIMIT for exploratory queries",
      sql: sql.replace(/;?$/, " LIMIT 100;")
    });
  }

  return out;
}