/* =========================================================
   QUERYLENS
   Fully Client-Side / GitHub Pages Version
========================================================= */


/* =========================================================
   DEMO DATABASE
========================================================= */

const DB = {
  customers: [],
  products: [],
  orders: []
};

const COUNTRIES = [
  "India","USA","UK","Canada","Australia","Germany","Singapore","UAE"
];

const CITIES = [
  "Chennai","Mumbai","Delhi","Bangalore","Hyderabad",
  "Pune","New York","London","Toronto","Sydney"
];

const CATEGORIES = [
  "Electronics","Books","Clothing","Home","Sports","Beauty"
];

const PRODUCT_NAMES = [
  "Laptop","Wireless Mouse","Keyboard","Monitor","Headphones",
  "Backpack","Smartphone","Tablet","Running Shoes","Desk Lamp",
  "Office Chair","Water Bottle","Programming Book",
  "Gaming Controller","USB Hub"
];

const STATUSES = [
  "Delivered","Shipped","Processing","Cancelled"
];


/* =========================================================
   HELPERS
========================================================= */

const $ = id => document.getElementById(id);

function escapeHTML(value){
  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}


function randomItem(array){
  return array[Math.floor(Math.random() * array.length)];
}


function formatNumber(value){

  const number = Number(value);

  if(!Number.isFinite(number)){
    return String(value ?? "--");
  }

  return number.toLocaleString(undefined,{
    maximumFractionDigits:3
  });
}


function normalizeSQL(sql){
  return sql
    .replace(/--.*$/gm,"")
    .replace(/\s+/g," ")
    .trim()
    .replace(/;$/,"");
}


function stripQuotes(value){
  return String(value)
    .trim()
    .replace(/^['"]|['"]$/g,"");
}


/* Splits on commas that are outside quotes AND outside parentheses,
   so COUNT(a, b) and IN (1,2,3) survive intact. */
function splitCSV(text){

  const result = [];
  let current = "";
  let quote = null;
  let depth = 0;

  for(const char of text){

    if(char === "'" || char === '"'){
      if(quote === char){ quote = null; }
      else if(!quote){ quote = char; }
      current += char;
      continue;
    }

    if(!quote && char === "("){ depth++; current += char; continue; }
    if(!quote && char === ")"){ depth--; current += char; continue; }

    if(char === "," && !quote && depth === 0){
      result.push(current.trim());
      current = "";
    }else{
      current += char;
    }
  }

  if(current.trim()){
    result.push(current.trim());
  }

  return result;
}


/* True if the string contains a character outside of quoted literals. */
function containsOutsideQuotes(text,char){

  let quote = null;

  for(const c of text){
    if(c === "'" || c === '"'){
      if(quote === c){ quote = null; }
      else if(!quote){ quote = c; }
      continue;
    }
    if(!quote && c === char){ return true; }
  }

  return false;
}


function randomDate(){

  const start = new Date("2025-01-01").getTime();
  const end = new Date("2026-08-31").getTime();

  const date = new Date(start + Math.random() * (end - start));

  return date.toISOString().slice(0,10);
}


/* =========================================================
   GENERATE DATABASE
========================================================= */

function generateDatabase(){

  DB.customers = [];
  DB.products = [];
  DB.orders = [];


  /* CUSTOMERS */

  for(let i = 1; i <= 3000; i++){
    DB.customers.push({
      id:i,
      name:`Customer ${i}`,
      email:`customer${i}@example.com`,
      country:randomItem(COUNTRIES),
      city:randomItem(CITIES),
      created_at:randomDate()
    });
  }


  /* PRODUCTS */

  for(let i = 1; i <= 500; i++){
    DB.products.push({
      id:i,
      name:`${randomItem(PRODUCT_NAMES)} ${i}`,
      category:randomItem(CATEGORIES),
      price:Number((20 + Math.random() * 1980).toFixed(2))
    });
  }


  /* ORDERS */

  for(let i = 1; i <= 25000; i++){

    const product = DB.products[
      Math.floor(Math.random() * DB.products.length)
    ];

    const customer = DB.customers[
      Math.floor(Math.random() * DB.customers.length)
    ];

    const quantity = 1 + Math.floor(Math.random() * 5);

    DB.orders.push({
      id:i,
      customer_id:customer.id,
      product_id:product.id,
      order_date:randomDate(),
      quantity,
      amount:Number((product.price * quantity).toFixed(2)),
      status:randomItem(STATUSES)
    });
  }
}


/* =========================================================
   SCHEMA
========================================================= */

const SCHEMA = {

  customers:{
    rows:3000,
    columns:[
      ["id","INTEGER"],
      ["name","TEXT"],
      ["email","TEXT"],
      ["country","TEXT"],
      ["city","TEXT"],
      ["created_at","DATE"]
    ],
    indexes:[
      "idx_customers_country",
      "idx_customers_email"
    ]
  },

  products:{
    rows:500,
    columns:[
      ["id","INTEGER"],
      ["name","TEXT"],
      ["category","TEXT"],
      ["price","REAL"]
    ],
    indexes:[
      "idx_products_category"
    ]
  },

  orders:{
    rows:25000,
    columns:[
      ["id","INTEGER"],
      ["customer_id","INTEGER"],
      ["product_id","INTEGER"],
      ["order_date","DATE"],
      ["quantity","INTEGER"],
      ["amount","REAL"],
      ["status","TEXT"]
    ],
    indexes:[
      "idx_orders_customer",
      "idx_orders_product",
      "idx_orders_date",
      "idx_orders_status"
    ]
  }

};


function renderSchema(){

  $("schemaContainer").innerHTML =
    Object.entries(SCHEMA).map(([table,info])=>`

      <div class="schema-table">

        <div class="schema-table-header">
          <span>${table}</span>
          <span>${formatNumber(info.rows)} rows</span>
        </div>

        <div class="schema-columns">

          ${info.columns.map(column=>`
            <div class="schema-column">
              <span>${column[0]}</span>
              <span>${column[1]}</span>
            </div>
          `).join("")}

          <div class="schema-column">
            <span>Indexes</span>
            <span>${info.indexes.length}</span>
          </div>

        </div>

      </div>

    `).join("");
}


/* =========================================================
   THEME
========================================================= */

function applyTheme(theme){

  if(theme === "dark"){
    document.body.classList.add("dark");
    $("themeIcon").textContent = "☀";
  }else{
    document.body.classList.remove("dark");
    $("themeIcon").textContent = "☾";
  }
}


function initTheme(){

  const saved = localStorage.getItem("querylens-theme");

  if(saved){
    applyTheme(saved);
  }else{
    const prefers =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    applyTheme(prefers ? "dark" : "light");
  }
}


$("themeToggle").addEventListener("click",()=>{

  const next = document.body.classList.contains("dark")
    ? "light"
    : "dark";

  applyTheme(next);

  localStorage.setItem("querylens-theme",next);
});


/* =========================================================
   MOBILE NAV
========================================================= */

$("mobileMenu").addEventListener("click",()=>{
  document.querySelector(".nav-links").classList.toggle("mobile-open");
});


/* =========================================================
   DOWNLOAD MENU
========================================================= */

$("downloadBtn").addEventListener("click",event=>{
  event.stopPropagation();
  $("downloadMenu").classList.toggle("show");
});


$("downloadMenu").addEventListener("click",event=>{
  event.stopPropagation();
});


document.addEventListener("click",()=>{
  $("downloadMenu").classList.remove("show");
});


/* =========================================================
   SQL VALIDATION
========================================================= */

function validateSQL(sql){

  if(!sql.trim()){
    throw new Error("Please enter a SQL query.");
  }

  const normalized = normalizeSQL(sql);

  if(!/^select\b/i.test(normalized)){
    throw new Error("Only SELECT queries are supported.");
  }

  const dangerous =
    /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|ATTACH|DETACH|PRAGMA|VACUUM|REINDEX|REPLACE)\b/i;

  if(dangerous.test(normalized)){
    throw new Error(
      "Data modification and database administration commands are not allowed."
    );
  }

  /* Only reject semicolons that sit outside string literals, so a
     value such as 'a;b' no longer trips the multi-statement check. */
  if(containsOutsideQuotes(normalized,";")){
    throw new Error("Multiple SQL statements are not supported.");
  }

  if(!/\bFROM\b/i.test(normalized)){
    throw new Error("The query must contain a FROM clause.");
  }

  /* Balanced parentheses check. */
  let depth = 0;
  let quote = null;

  for(const c of normalized){
    if(c === "'" || c === '"'){
      if(quote === c){ quote = null; }
      else if(!quote){ quote = c; }
      continue;
    }
    if(quote) continue;
    if(c === "(") depth++;
    if(c === ")") depth--;
    if(depth < 0){
      throw new Error("Unbalanced parentheses in the query.");
    }
  }

  if(depth !== 0){
    throw new Error("Unbalanced parentheses in the query.");
  }

  if(quote){
    throw new Error("Unterminated string literal in the query.");
  }

  return normalized;
}


/* =========================================================
   TABLE PARSING
========================================================= */

function parseTable(sql){

  const match = sql.match(
    /\bFROM\s+([a-zA-Z_][\w]*)(?:\s+(?:AS\s+)?([a-zA-Z_]\w*))?/i
  );

  if(!match){
    throw new Error("Could not identify the table after FROM.");
  }

  const reserved = /^(where|group|order|limit|join|inner|left|having|on)$/i;

  const alias =
    match[2] && !reserved.test(match[2])
      ? match[2]
      : match[1];

  return {
    table:match[1].toLowerCase(),
    alias:alias.toLowerCase()
  };
}


/* =========================================================
   SQL VALUE PARSING
========================================================= */

function parseValue(value){

  value = String(value).trim();

  if(/^'.*'$/.test(value) || /^".*"$/.test(value)){
    return stripQuotes(value);
  }

  if(/^null$/i.test(value)){
    return null;
  }

  if(/^-?\d+(\.\d+)?$/.test(value)){
    return Number(value);
  }

  return value;
}


/* =========================================================
   COLUMN RESOLUTION

   Rows carry both qualified keys ("orders.amount") and plain
   keys ("amount"). A qualified reference resolves to the
   qualified key first, which removes the ambiguity that used
   to make c.id and o.id collide after a join.
========================================================= */

function getColumnValue(row,column){

  const key = String(column).trim().toLowerCase();

  if(Object.prototype.hasOwnProperty.call(row,key)){
    return row[key];
  }

  const bare = key.includes(".") ? key.split(".").pop() : key;

  if(Object.prototype.hasOwnProperty.call(row,bare)){
    return row[bare];
  }

  /* Last resort: a uniquely matching qualified key. */
  const matches = Object.keys(row).filter(
    k => k.endsWith(`.${bare}`)
  );

  if(matches.length === 1){
    return row[matches[0]];
  }

  return undefined;
}


/* =========================================================
   WHERE TOKENIZER

   Produces grouping parentheses, boolean keywords and opaque
   predicate chunks. Parentheses that belong to a predicate
   (IN lists, function calls) are absorbed into the chunk.
========================================================= */

function tokenizeCondition(text){

  const tokens = [];
  let buffer = "";
  let quote = null;
  let i = 0;

  const flush = ()=>{
    if(buffer.trim()){
      tokens.push({ type:"pred", value:buffer.trim() });
    }
    buffer = "";
  };

  const endsWithOperator = ()=>
    buffer.trim() === "" || /\b(AND|OR|NOT)\s*$/i.test(buffer);

  while(i < text.length){

    const char = text[i];

    if(char === "'" || char === '"'){
      if(quote === char){ quote = null; }
      else if(!quote){ quote = char; }
      buffer += char;
      i++;
      continue;
    }

    if(quote){
      buffer += char;
      i++;
      continue;
    }

    if(char === "("){

      if(endsWithOperator()){
        flush();
        tokens.push({ type:"lparen" });
        i++;
        continue;
      }

      /* Predicate-owned parenthesis: copy the balanced group. */
      let depth = 0;
      let inner = "";

      while(i < text.length){
        const c = text[i];
        if(c === "(") depth++;
        if(c === ")") depth--;
        inner += c;
        i++;
        if(depth === 0) break;
      }

      buffer += inner;
      continue;
    }

    if(char === ")"){
      flush();
      tokens.push({ type:"rparen" });
      i++;
      continue;
    }

    /* Boolean keywords. NOT is only a connector when it does not
       belong to NOT NULL / NOT LIKE / NOT IN / NOT BETWEEN. */
    const rest = text.slice(i);

    const andMatch = rest.match(/^\s+AND\s+/i);
    const orMatch  = rest.match(/^\s+OR\s+/i);

    if(andMatch && !/\bBETWEEN\b/i.test(buffer)){
      flush();
      tokens.push({ type:"and" });
      i += andMatch[0].length;
      continue;
    }

    if(orMatch){
      flush();
      tokens.push({ type:"or" });
      i += orMatch[0].length;
      continue;
    }

    const notMatch = rest.match(/^\s*\bNOT\b\s+/i);

    if(notMatch && endsWithOperator()){
      flush();
      tokens.push({ type:"not" });
      i += notMatch[0].length;
      continue;
    }

    buffer += char;
    i++;
  }

  flush();

  return tokens;
}


/* =========================================================
   WHERE PARSER (recursive descent)

   expr   := term (OR term)*
   term   := factor (AND factor)*
   factor := NOT factor | "(" expr ")" | predicate
========================================================= */

function parseCondition(text){

  const tokens = tokenizeCondition(text);
  let pos = 0;

  const peek = () => tokens[pos];

  function parseExpr(){
    let node = parseTerm();
    while(peek() && peek().type === "or"){
      pos++;
      node = { type:"or", left:node, right:parseTerm() };
    }
    return node;
  }

  function parseTerm(){
    let node = parseFactor();
    while(peek() && peek().type === "and"){
      pos++;
      node = { type:"and", left:node, right:parseFactor() };
    }
    return node;
  }

  function parseFactor(){

    const token = peek();

    if(!token){
      throw new Error("Incomplete WHERE condition.");
    }

    if(token.type === "not"){
      pos++;
      return { type:"not", child:parseFactor() };
    }

    if(token.type === "lparen"){
      pos++;
      const inner = parseExpr();
      if(!peek() || peek().type !== "rparen"){
        throw new Error("Missing closing parenthesis in WHERE clause.");
      }
      pos++;
      return inner;
    }

    if(token.type === "pred"){
      pos++;
      return { type:"pred", value:token.value };
    }

    throw new Error(
      `Unexpected token in WHERE clause near "${token.type}".`
    );
  }

  const tree = parseExpr();

  if(pos < tokens.length){
    throw new Error("Could not fully parse the WHERE clause.");
  }

  return tree;
}


/* =========================================================
   PREDICATE EVALUATION

   Throws on predicates it does not recognise, instead of the
   previous behaviour of silently returning true and letting
   every row through.
========================================================= */

function compareValues(left,operator,right){

  if(left === undefined || left === null || right === null){
    /* SQL three-valued logic: comparisons with NULL are UNKNOWN,
       which behaves as false in a WHERE clause. */
    return false;
  }

  if(typeof left === "string" && typeof right === "string"){

    const a = left.toLowerCase();
    const b = right.toLowerCase();

    switch(operator){
      case "=":  return a === b;
      case "!=":
      case "<>": return a !== b;
      case ">":  return a > b;
      case "<":  return a < b;
      case ">=": return a >= b;
      case "<=": return a <= b;
    }
  }

  const ln = Number(left);
  const rn = Number(right);

  switch(operator){
    case "=":  return left == right;
    case "!=":
    case "<>": return left != right;
    case ">":  return ln > rn;
    case "<":  return ln < rn;
    case ">=": return ln >= rn;
    case "<=": return ln <= rn;
    default:   return false;
  }
}


function likeToRegExp(pattern){

  const escaped = stripQuotes(pattern)
    .replace(/[.*+?^${}()|[\]\\]/g,"\\$&")
    .replace(/%/g,".*")
    .replace(/_/g,".");

  return new RegExp(`^${escaped}$`,"i");
}


function evaluatePredicate(row,predicate){

  const text = predicate.trim().replace(/^\((.*)\)$/s,"$1").trim();

  /* IS [NOT] NULL */
  let match = text.match(/^([\w.]+)\s+IS\s+(NOT\s+)?NULL$/i);

  if(match){
    const value = getColumnValue(row,match[1]);
    const isNull = value === null || value === undefined;
    return match[2] ? !isNull : isNull;
  }

  /* [NOT] BETWEEN a AND b */
  match = text.match(/^([\w.]+)\s+(NOT\s+)?BETWEEN\s+(.+?)\s+AND\s+(.+)$/i);

  if(match){
    const value = getColumnValue(row,match[1]);
    const low = parseValue(match[3]);
    const high = parseValue(match[4]);

    const inRange =
      compareValues(value,">=",low) &&
      compareValues(value,"<=",high);

    return match[2] ? !inRange : inRange;
  }

  /* [NOT] IN (...) */
  match = text.match(/^([\w.]+)\s+(NOT\s+)?IN\s*\((.*)\)$/i);

  if(match){
    const value = getColumnValue(row,match[1]);
    const list = splitCSV(match[3]).map(parseValue);

    const found = list.some(item=>{
      if(typeof value === "string" && typeof item === "string"){
        return value.toLowerCase() === item.toLowerCase();
      }
      return value == item;
    });

    return match[2] ? !found : found;
  }

  /* [NOT] LIKE 'pattern' */
  match = text.match(/^([\w.]+)\s+(NOT\s+)?LIKE\s+(['"].*['"])$/i);

  if(match){
    const value = getColumnValue(row,match[1]);

    if(value === undefined || value === null){
      return false;
    }

    const hit = likeToRegExp(match[3]).test(String(value));
    return match[2] ? !hit : hit;
  }

  /* column <op> value   OR   column <op> column */
  match = text.match(/^([\w.]+)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/);

  if(match){

    const left = getColumnValue(row,match[1]);
    const rawRight = match[3].trim();

    /* If the right side names a column present in the row, compare
       column to column rather than column to literal. */
    let right;

    if(/^[\w.]+$/.test(rawRight) && !/^-?\d/.test(rawRight)){
      const candidate = getColumnValue(row,rawRight);
      right = candidate !== undefined ? candidate : parseValue(rawRight);
    }else{
      right = parseValue(rawRight);
    }

    return compareValues(left,match[2],right);
  }

  throw new Error(
    `Unsupported condition in WHERE clause: "${text}". ` +
    "Supported forms are comparison, LIKE, IN, BETWEEN and IS NULL."
  );
}


function evaluateNode(row,node){

  switch(node.type){
    case "and":  return evaluateNode(row,node.left) && evaluateNode(row,node.right);
    case "or":   return evaluateNode(row,node.left) || evaluateNode(row,node.right);
    case "not":  return !evaluateNode(row,node.child);
    case "pred": return evaluatePredicate(row,node.value);
    default:     return true;
  }
}


/* Compiles once, then evaluates per row. */
function compileWhere(where){

  if(!where){
    return ()=>true;
  }

  const tree = parseCondition(where);

  return row => evaluateNode(row,tree);
}


/* Kept for backward compatibility with any external caller. */
function evaluateWhere(row,where){
  return compileWhere(where)(row);
}


/* =========================================================
   CLAUSE EXTRACTION
========================================================= */

function extractWhere(sql){

  const match = sql.match(
    /\bWHERE\b(.+?)(?=\bGROUP\s+BY\b|\bHAVING\b|\bORDER\s+BY\b|\bLIMIT\b|$)/i
  );

  return match ? match[1].trim() : "";
}


function extractHaving(sql){

  const match = sql.match(
    /\bHAVING\b(.+?)(?=\bORDER\s+BY\b|\bLIMIT\b|$)/i
  );

  return match ? match[1].trim() : "";
}


function extractLimit(sql){
  const match = sql.match(/\bLIMIT\s+(\d+)/i);
  return match ? Number(match[1]) : null;
}


/* =========================================================
   JOIN PROCESSING

   Handles every JOIN in the statement, not just the first,
   and uses a hash join instead of the previous O(n*m) pair
   of nested loops.
========================================================= */

function performJoins(rows,sql,baseAlias){

  const regex =
    /\b(?:(LEFT|RIGHT|INNER|CROSS)\s+)?(?:OUTER\s+)?JOIN\s+([a-zA-Z_]\w*)(?:\s+(?:AS\s+)?([a-zA-Z_]\w*))?\s+ON\s+([\w.]+)\s*=\s*([\w.]+)/gi;

  let current = rows;
  let match;
  let applied = 0;

  while((match = regex.exec(sql)) !== null){

    const kind = (match[1] || "INNER").toUpperCase();
    const joinTable = match[2].toLowerCase();

    const reserved = /^(on|where|group|order|limit|having|join|left|inner)$/i;

    const alias =
      match[3] && !reserved.test(match[3])
        ? match[3].toLowerCase()
        : joinTable;

    const target = DB[joinTable];

    if(!target){
      throw new Error(`Unknown joined table: ${joinTable}`);
    }

    const refA = match[4].toLowerCase();
    const refB = match[5].toLowerCase();

    /* Work out which side belongs to the table being joined in. */
    const prefixA = refA.includes(".") ? refA.split(".")[0] : null;
    const prefixB = refB.includes(".") ? refB.split(".")[0] : null;

    let outerRef;
    let innerRef;

    if(prefixB === alias || prefixB === joinTable){
      outerRef = refA; innerRef = refB;
    }else if(prefixA === alias || prefixA === joinTable){
      outerRef = refB; innerRef = refA;
    }else{
      /* Unprefixed: decide by which column actually exists inside
         the joined table. */
      const sample = target[0] || {};
      const bareA = refA.split(".").pop();
      const bareB = refB.split(".").pop();

      if(Object.prototype.hasOwnProperty.call(sample,bareB)){
        outerRef = refA; innerRef = refB;
      }else if(Object.prototype.hasOwnProperty.call(sample,bareA)){
        outerRef = refB; innerRef = refA;
      }else{
        throw new Error(
          `Could not resolve the ON condition "${refA} = ${refB}".`
        );
      }
    }

    const innerColumn = innerRef.split(".").pop();

    /* Build the hash table on the inner relation. */
    const buckets = new Map();

    for(const innerRow of target){
      const key = String(innerRow[innerColumn]);
      if(!buckets.has(key)) buckets.set(key,[]);
      buckets.get(key).push(innerRow);
    }

    const output = [];

    for(const outerRow of current){

      const outerValue = getColumnValue(outerRow,outerRef);
      const matches = buckets.get(String(outerValue)) || [];

      if(!matches.length){
        if(kind === "LEFT"){
          const padded = { ...outerRow };
          for(const key of Object.keys(target[0] || {})){
            padded[`${alias}.${key}`] = null;
            if(!(key in padded)) padded[key] = null;
          }
          output.push(padded);
        }
        continue;
      }

      for(const innerRow of matches){

        const merged = { ...outerRow };

        for(const [key,value] of Object.entries(innerRow)){
          merged[`${alias}.${key}`] = value;
          /* Keep a bare alias only when it is still unambiguous. */
          if(!(key in merged)){
            merged[key] = value;
          }
        }

        output.push(merged);
      }
    }

    current = output;
    applied++;
  }

  return { rows:current, applied };
}


/* =========================================================
   SELECT PARSING
========================================================= */

function extractSelectPart(sql){

  const match = sql.match(/^SELECT\s+(?:DISTINCT\s+)?(.+?)\s+FROM\s+/i);

  if(!match){
    throw new Error("Could not parse SELECT clause.");
  }

  return match[1].trim();
}


/* =========================================================
   ORDER BY
========================================================= */

function applyOrder(rows,orderText){

  if(!orderText){
    return rows;
  }

  const parts = splitCSV(orderText);

  return [...rows].sort((a,b)=>{

    for(const part of parts){

      const match = part.match(/^([\w.]+)(?:\s+(ASC|DESC))?$/i);

      if(!match){
        continue;
      }

      const reference = match[1].toLowerCase();
      const direction = (match[2] || "ASC").toUpperCase();

      /* Prefer the projected alias, then fall back to a column. */
      const av = Object.prototype.hasOwnProperty.call(a,reference)
        ? a[reference]
        : getColumnValue(a,reference);

      const bv = Object.prototype.hasOwnProperty.call(b,reference)
        ? b[reference]
        : getColumnValue(b,reference);

      if(av === bv){
        continue;
      }

      let comparison;

      if(typeof av === "number" && typeof bv === "number"){
        comparison = av - bv;
      }else{
        comparison = String(av ?? "").localeCompare(String(bv ?? ""));
      }

      return direction === "DESC" ? -comparison : comparison;
    }

    return 0;
  });
}


/* =========================================================
   GROUP BY
========================================================= */

function groupRows(rows,groupText){

  const references = splitCSV(groupText).map(
    column => column.trim().toLowerCase()
  );

  const groups = new Map();

  for(const row of rows){

    const key = references
      .map(reference => String(getColumnValue(row,reference)))
      .join("|");

    if(!groups.has(key)){
      groups.set(key,[]);
    }

    groups.get(key).push(row);
  }

  return [...groups.entries()].map(([key,group])=>({
    __groupKey:key,
    __groupRows:group,
    ...group[0]
  }));
}


/* =========================================================
   AGGREGATES
========================================================= */

function aggregateValue(rows,expression){

  const match = expression.match(
    /^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(DISTINCT\s+)?([\w.*]+)\s*\)$/i
  );

  if(!match){
    return null;
  }

  const fn = match[1].toUpperCase();
  const distinct = Boolean(match[2]);
  const reference = match[3];

  if(fn === "COUNT"){

    if(reference === "*"){
      return rows.length;
    }

    const values = rows
      .map(row => getColumnValue(row,reference))
      .filter(value => value !== null && value !== undefined);

    return distinct ? new Set(values).size : values.length;
  }

  let values = rows
    .map(row => Number(getColumnValue(row,reference)))
    .filter(value => Number.isFinite(value));

  if(distinct){
    values = [...new Set(values)];
  }

  if(!values.length){
    return 0;
  }

  if(fn === "SUM"){
    return Number(values.reduce((a,b)=>a+b,0).toFixed(2));
  }

  if(fn === "AVG"){
    return Number((values.reduce((a,b)=>a+b,0) / values.length).toFixed(2));
  }

  if(fn === "MIN"){
    return Math.min(...values);
  }

  if(fn === "MAX"){
    return Math.max(...values);
  }

  return 0;
}


/* =========================================================
   SELECT OUTPUT
========================================================= */

function executeSelect(rows,selectPart,options){

  const grouped = options && options.grouped;

  if(selectPart === "*"){

    return rows.map(row=>{

      const clean = {};

      for(const [key,value] of Object.entries(row)){
        if(!key.startsWith("__")){
          clean[key] = value;
        }
      }

      return clean;
    });
  }

  const expressions = splitCSV(selectPart);

  const hasAggregate = expressions.some(expression =>
    /^(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(expression.trim())
  );

  /* A bare aggregate with no GROUP BY collapses the whole input
     into exactly one output row. The previous build emitted one
     row per input row here. */
  const sourceRows =
    hasAggregate && !grouped
      ? [{ __groupRows:rows, ...(rows[0] || {}) }]
      : rows;

  const project = row=>{

    const output = {};

    for(const expression of expressions){

      const cleanExpression = expression.trim();

      const aliasMatch = cleanExpression.match(
        /^(.+?)\s+AS\s+([a-zA-Z_]\w*)$/i
      );

      const rawExpression = aliasMatch
        ? aliasMatch[1].trim()
        : cleanExpression;

      const alias = (aliasMatch
        ? aliasMatch[2]
        : rawExpression.split(".").pop().replace(/\(.*/,"").trim()
      ).toLowerCase();

      if(hasAggregate && /^(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(rawExpression)){

        output[alias] = aggregateValue(
          row.__groupRows || [row],
          rawExpression
        );

      }else{

        output[alias] = getColumnValue(row,rawExpression);
      }
    }

    return output;
  };

  return sourceRows.map(project);
}


/* =========================================================
   EXECUTE QUERY
========================================================= */

function executeQuery(sql){

  const start = performance.now();

  const tableInfo = parseTable(sql);

  if(!DB[tableInfo.table]){
    throw new Error(`Unknown table: ${tableInfo.table}`);
  }

  /* Seed rows with both plain and alias-qualified keys. */
  const baseRows = DB[tableInfo.table].map(row=>{
    const copy = { ...row };
    for(const [key,value] of Object.entries(row)){
      copy[`${tableInfo.alias}.${key}`] = value;
    }
    return copy;
  });

  let rows = baseRows;

  const declaredJoins = (sql.match(/\bJOIN\b/gi) || []).length;

  /* JOIN */

  let joinCount = 0;

  if(declaredJoins){
    const joined = performJoins(rows,sql,tableInfo.alias);
    rows = joined.rows;
    joinCount = joined.applied;

    if(joinCount < declaredJoins){
      throw new Error(
        "Each JOIN needs an ON condition of the form ON left_column = right_column."
      );
    }
  }

  /* WHERE */

  const where = extractWhere(sql);

  if(where){
    const predicate = compileWhere(where);
    rows = rows.filter(predicate);
  }

  const selectPart = extractSelectPart(sql);

  /* GROUP BY */

  const groupMatch = sql.match(
    /\bGROUP\s+BY\b(.+?)(?=\bHAVING\b|\bORDER\s+BY\b|\bLIMIT\b|$)/i
  );

  if(groupMatch){
    rows = groupRows(rows,groupMatch[1].trim());
  }

  /* HAVING — evaluated against each group before projection. */

  /* HAVING — evaluated against each group before projection.

     Aggregate calls are substituted with placeholder identifiers
     (__agg0, __agg1, ...) because the predicate matcher only
     accepts [\w.]+ on the left-hand side, and "COUNT(*)" contains
     parentheses that the pattern cannot match. The placeholders
     are plain identifiers, so they parse cleanly and resolve
     through the evaluation context. */

  const having = extractHaving(sql);

  if(having){

    if(!groupMatch){
      throw new Error("HAVING requires a GROUP BY clause.");
    }

    const AGGREGATE_CALL =
      /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(?:DISTINCT\s+)?[\w.*]+\s*\)/gi;

    /* Collect every aggregate call in the HAVING text, in order. */
    const aggregateCalls = having.match(AGGREGATE_CALL) || [];

    if(!aggregateCalls.length && !/[\w.]+\s*(=|!=|<>|>=|<=|>|<)/.test(having)){
      throw new Error(
        `Could not parse the HAVING clause: "${having}".`
      );
    }

    /* Rewrite the HAVING text, replacing each call with a placeholder. */
    let counter = 0;

    const rewritten = having.replace(
      AGGREGATE_CALL,
      () => `__agg${counter++}`
    );

    /* Parse once, then evaluate per group. */
    const tree = parseCondition(rewritten);

    rows = rows.filter(groupRow=>{

      const groupRows = groupRow.__groupRows || [groupRow];

      /* Context holds the group's columns plus one entry
         per aggregate placeholder. */
      const context = { ...groupRow };

      aggregateCalls.forEach((expression,i)=>{
        context[`__agg${i}`] = aggregateValue(groupRows,expression);
      });

      return evaluateNode(context,tree);
    });
  }

  /* SELECT */

  let result = executeSelect(rows,selectPart,{
    grouped:Boolean(groupMatch)
  });

  /* DISTINCT */

  const hasDistinct = /^SELECT\s+DISTINCT\b/i.test(sql);

  if(hasDistinct){
    const seen = new Set();
    result = result.filter(row=>{
      const key = JSON.stringify(row);
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /* ORDER BY */

  const orderMatch = sql.match(/\bORDER\s+BY\b(.+?)(?=\bLIMIT\b|$)/i);

  if(orderMatch){
    result = applyOrder(result,orderMatch[1].trim());
  }

  /* LIMIT */

  const limit = extractLimit(sql);

  if(limit !== null){
    result = result.slice(0,Math.max(0,limit));
  }

  const elapsed = performance.now() - start;

  return {
    rows:result.slice(0,100),
    totalRows:result.length,
    elapsed,
    sourceRows:baseRows.length,
    table:tableInfo.table,
    alias:tableInfo.alias,
    where,
    having,
    joinCount,
    hasGroupBy:Boolean(groupMatch),
    hasOrderBy:Boolean(orderMatch),
    hasLimit:limit !== null,
    hasDistinct,
    selectStar:selectPart === "*",
    selectPart
  };
}


/* =========================================================
   LEGACY PLAN ANALYSIS

   Superseded by analyzePlanV2 in cost-model.js. Retained so
   the two models can be compared during the demonstration.
========================================================= */

function analyzePlan(sql,execution){

  let fullScans = 0;
  let indexSearches = 0;
  let temporaryStructures = 0;
  const joins = execution.joinCount;

  if(!execution.where){
    fullScans += 1;
  }else{

    const indexedColumns = [
      "customers.country","customers.email","customers.id",
      "products.category","products.id",
      "orders.customer_id","orders.product_id",
      "orders.order_date","orders.status"
    ];

    const usefulIndex = indexedColumns.some(column=>{
      const shortColumn = column.split(".")[1];
      return new RegExp(
        `\\b${shortColumn}\\b\\s*(=|>=|<=|>|<|LIKE)`,"i"
      ).test(execution.where);
    });

    if(usefulIndex){ indexSearches += 1; }
    else{ fullScans += 1; }
  }

  if(execution.hasOrderBy) temporaryStructures += 1;
  if(execution.hasGroupBy) temporaryStructures += 1;
  if(/\bDISTINCT\b/i.test(sql)) temporaryStructures += 1;

  let cost =
    5 +
    fullScans * 30 +
    indexSearches * 8 +
    temporaryStructures * 22 +
    joins * 15;

  if(execution.where) cost -= 8;
  if(execution.hasLimit) cost -= 4;
  if(execution.selectStar) cost += 10;

  cost = Math.max(1,Math.round(cost));

  const score = Math.max(1,Math.min(100,Math.round(100 - cost * 1.05)));

  let category;
  if(score >= 80) category = "Low";
  else if(score >= 55) category = "Moderate";
  else category = "High";

  const plan = [];

  if(indexSearches){
    plan.push(`SEARCH ${execution.table} USING INDEX`);
  }else{
    plan.push(`SCAN ${execution.table}`);
  }

  if(joins){
    plan.push(`NESTED LOOP JOIN (${joins} join${joins > 1 ? "s" : ""})`);
  }

  if(execution.where) plan.push(`FILTER: ${execution.where}`);
  if(execution.hasGroupBy) plan.push("USE TEMPORARY STRUCTURE FOR GROUP BY");
  if(execution.hasOrderBy) plan.push("USE TEMPORARY STRUCTURE FOR ORDER BY");
  if(execution.hasLimit) plan.push("APPLY LIMIT");

  plan.push("RETURN RESULT");

  return {
    fullScans,
    indexSearches,
    temporaryStructures,
    joins,
    estimatedCost:cost,
    score,
    category,
    plan
  };
}


/* =========================================================
   RECOMMENDATIONS
========================================================= */

function generateRecommendations(sql,execution,plan){

  const recommendations = [];

  if(execution.selectStar){
    recommendations.push({
      title:"Avoid SELECT *",
      text:"Select only the columns required by the application. This reduces unnecessary data retrieval, lowers network cost and makes a covering index possible."
    });
  }

  if(plan.fullScans > 0){
    recommendations.push({
      title:"Full Table Scan Detected",
      text:`Approximately ${formatNumber(plan.rowsScanned || execution.sourceRows)} rows must be read because no index matches the filter. Index the columns you filter on most often.`
    });
  }

  if(plan.indexSearches > 0){
    recommendations.push({
      title:"Index Usage Detected",
      text:`The filter matches the leading column of an index${plan.usableIndex ? ` (${plan.usableIndex})` : ""}, so the engine can seek directly to the matching range instead of reading every row.`
    });
  }

  if(typeof plan.selectivity === "number" && plan.selectivity > 0.5 && execution.where){
    recommendations.push({
      title:"Low Filter Selectivity",
      text:`The WHERE clause keeps about ${(plan.selectivity * 100).toFixed(1)}% of rows. When a filter matches most of the table, an index scan is usually slower than a sequential scan.`
    });
  }

  if(execution.joinCount > 0){
    recommendations.push({
      title:`${execution.joinCount} Join${execution.joinCount > 1 ? "s" : ""} Detected`,
      text:"Ensure both sides of every join condition are indexed. An unindexed join degrades to a nested loop whose cost grows with the product of the two inputs."
    });
  }

  if(execution.hasGroupBy){
    recommendations.push({
      title:"Aggregation / Grouping",
      text:"GROUP BY builds a hash table or sorts the input. Filter rows in WHERE before grouping rather than in HAVING afterwards wherever the logic allows."
    });
  }

  if(execution.hasOrderBy && !execution.hasLimit){
    recommendations.push({
      title:"Unbounded Sort",
      text:"ORDER BY without LIMIT sorts the entire result set. Add a LIMIT, or create an index matching the ordering so the sort can be skipped."
    });
  }

  if(execution.hasDistinct){
    recommendations.push({
      title:"DISTINCT Detected",
      text:"Duplicate elimination is a blocking operation. Check whether the duplicates come from a join that fans out rows; fixing the join is cheaper than deduplicating afterwards."
    });
  }

  if(/\bLIKE\s+['"]%/i.test(sql)){
    recommendations.push({
      title:"Leading Wildcard",
      text:"A LIKE pattern beginning with % cannot use a B-tree index, because the start of the value is unknown and the tree cannot be traversed."
    });
  }

  if(!recommendations.length){
    recommendations.push({
      title:"Query Looks Efficient",
      text:"No issue was detected by the built-in checks. Review the execution plan and re-test against realistic data volumes before drawing conclusions."
    });
  }

  return recommendations;
}


/* =========================================================
   CURRENT ANALYSIS
========================================================= */

let currentAnalysis = null;


/* =========================================================
   RENDER ANALYSIS
========================================================= */

function renderAnalysis(execution,plan,recommendations,query){

  currentAnalysis = {
    query,
    execution,
    plan,
    recommendations,
    timestamp:new Date().toISOString()
  };

  $("emptyAnalysis").classList.add("hidden");
  $("analysisContent").classList.remove("hidden");

  $("scoreValue").textContent = plan.score;
  $("scoreCategory").textContent = plan.category;

  const descriptions = {
    Low:"The estimated work is close to the cheapest plan available for this data size.",
    Moderate:"The query contains operations that add a moderate amount of estimated work.",
    High:"The query contains operations associated with substantially higher estimated work. Review the execution plan and the suggested rewrites."
  };

  $("scoreDescription").textContent = descriptions[plan.category];

  $("scoreCircle").style.setProperty("--score",`${plan.score}%`);

  $("estimatedCost").textContent =
    typeof plan.estimatedCost === "number"
      ? plan.estimatedCost.toFixed(2)
      : plan.estimatedCost;

  $("executionTime").textContent = execution.elapsed.toFixed(3);

  $("rowsReturned").textContent = formatNumber(execution.totalRows);

  $("fullScans").textContent = plan.fullScans;
  $("planFullScans").textContent = plan.fullScans;
  $("indexSearches").textContent = plan.indexSearches;
  $("temporaryStructures").textContent = plan.temporaryStructures;
  $("joinCount").textContent = plan.joins;

  /* Cardinality metrics from the new cost model. */
  if($("estimatedRows")){

    $("estimatedRows").textContent =
      plan.estimatedRows !== undefined
        ? formatNumber(plan.estimatedRows)
        : "--";

    $("selectivityValue").textContent =
      typeof plan.selectivity === "number"
        ? `${(plan.selectivity * 100).toFixed(2)}%`
        : "--";

    $("indexUsed").textContent = plan.usableIndex || "none";
  }

  renderExecutionPlan(plan);

  renderVisualization(plan);

  renderRecommendations(recommendations);

  if(typeof generateRewrites === "function"){
    renderRewrites(generateRewrites(query,execution,plan));
  }

  renderResult(execution.rows);

  saveHistory(currentAnalysis);

  renderHistory();
}


/* =========================================================
   EXECUTION PLAN UI
========================================================= */

function renderExecutionPlan(plan){

  $("executionPlan").innerHTML = plan.plan.map((step,index)=>`
    <div class="plan-row">
      <strong>${index + 1}.</strong>
      ${escapeHTML(step)}
    </div>
  `).join("");
}


/* =========================================================
   VISUALIZATION
========================================================= */

function renderVisualization(plan){

  /* Prefer per-operator cost shares when the new model supplies
     them, since that shows where the time actually goes. */
  if(Array.isArray(plan.nodes) && plan.nodes.length){

    const max = Math.max(1,...plan.nodes.map(node => node.cost));

    $("costVisualization").innerHTML = plan.nodes.map(node=>{

      const width = node.cost === 0
        ? 0
        : Math.max(6,node.cost / max * 100);

      return `
        <div class="cost-bar-row">
          <span>${escapeHTML(node.op)}</span>
          <div class="cost-bar-track">
            <div class="cost-bar" style="width:${width}%"></div>
          </div>
          <strong>${node.share}%</strong>
        </div>
      `;
    }).join("");

    return;
  }

  const items = [
    ["Full Scans",plan.fullScans],
    ["Index Searches",plan.indexSearches],
    ["Temporary Structures",plan.temporaryStructures],
    ["Joins",plan.joins]
  ];

  const max = Math.max(1,...items.map(item => item[1]));

  $("costVisualization").innerHTML = items.map(([label,value])=>{

    const width = value === 0 ? 0 : Math.max(6,value / max * 100);

    return `
      <div class="cost-bar-row">
        <span>${label}</span>
        <div class="cost-bar-track">
          <div class="cost-bar" style="width:${width}%"></div>
        </div>
        <strong>${value}</strong>
      </div>
    `;
  }).join("");
}


/* =========================================================
   RECOMMENDATIONS UI
========================================================= */

function renderRecommendations(recommendations){

  $("recommendations").innerHTML = recommendations.map(item=>`
    <div class="recommendation">
      <strong>${escapeHTML(item.title)}</strong>
      <p>${escapeHTML(item.text)}</p>
    </div>
  `).join("");
}


/* =========================================================
   REWRITE SUGGESTIONS UI
========================================================= */

function renderRewrites(rewrites){

  const host = $("rewriteSuggestions");

  if(!host) return;

  if(!rewrites || !rewrites.length){
    host.innerHTML =
      `<div class="empty-state compact">
         <p>No rewrite suggestions — the query is already well-formed.</p>
       </div>`;
    return;
  }

  host.innerHTML = rewrites.map(item=>`
    <div class="rewrite-card">
      <strong>${escapeHTML(item.title)}</strong>
      <pre class="rewrite-sql">${escapeHTML(item.sql)}</pre>
      <button class="ghost-button small copy-sql" type="button">Copy</button>
    </div>
  `).join("");

  host.querySelectorAll(".copy-sql").forEach((button,index)=>{

    button.addEventListener("click",()=>{

      const text = rewrites[index].sql;

      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text);
      }else{
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }

      button.textContent = "Copied";
      setTimeout(()=>{ button.textContent = "Copy"; },1500);
    });
  });
}


/* =========================================================
   RESULT TABLE
========================================================= */

function renderResult(rows){

  if(!rows.length){
    $("resultTable").innerHTML = `
      <div style="padding:16px;color:var(--muted)">
        Query returned no rows.
      </div>
    `;
    return;
  }

  const columns = Object.keys(rows[0]);

  const cell = value =>
    value === null || value === undefined
      ? `<span class="null-value">NULL</span>`
      : escapeHTML(value);

  $("resultTable").innerHTML = `
    <table class="result-table">

      <thead>
        <tr>
          ${columns.map(column => `<th>${escapeHTML(column)}</th>`).join("")}
        </tr>
      </thead>

      <tbody>
        ${rows.map(row=>`
          <tr>
            ${columns.map(column => `<td>${cell(row[column])}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>

    </table>
  `;
}


/* =========================================================
   ANALYZE
========================================================= */

$("analyzeBtn").addEventListener("click",analyzeQuery);


function analyzeQuery(){

  clearError();

  const original = $("sqlInput").value.trim();

  try{

    const sql = validateSQL(original);

    const execution = executeQuery(sql);

    /* analyzePlanV2 comes from cost-model.js. Fall back to the
       legacy model if that file failed to load. */
    const plan = typeof analyzePlanV2 === "function"
      ? analyzePlanV2(sql,execution)
      : analyzePlan(sql,execution);

    const recommendations = generateRecommendations(sql,execution,plan);

    renderAnalysis(execution,plan,recommendations,sql);

  }catch(error){

    showError(error.message || "Unable to analyze query.");
  }
}


/* =========================================================
   EXAMPLE
========================================================= */

$("exampleBtn").addEventListener("click",()=>{

  $("sqlInput").value =
`SELECT
    c.country,
    COUNT(o.id) AS total_orders
FROM customers c
JOIN orders o
    ON c.id = o.customer_id
WHERE c.country = 'India'
GROUP BY c.country
ORDER BY total_orders DESC
LIMIT 10`;

  clearError();

  $("sqlInput").focus();
});


/* =========================================================
   CLEAR
========================================================= */

$("clearBtn").addEventListener("click",()=>{

  $("sqlInput").value = "";

  clearError();

  currentAnalysis = null;

  $("analysisContent").classList.add("hidden");
  $("emptyAnalysis").classList.remove("hidden");
});


/* =========================================================
   ERRORS
========================================================= */

function showError(message){
  $("errorMessage").textContent = message;
  $("errorMessage").classList.remove("hidden");
}


function clearError(){
  $("errorMessage").textContent = "";
  $("errorMessage").classList.add("hidden");
}


/* =========================================================
   HISTORY
========================================================= */

function getHistory(){
  try{
    return JSON.parse(
      localStorage.getItem("querylens-history") || "[]"
    );
  }catch{
    return [];
  }
}


function saveHistory(analysis){

  const history = getHistory();

  history.unshift({
    query:analysis.query,
    score:analysis.plan.score,
    category:analysis.plan.category,
    cost:analysis.plan.estimatedCost,
    time:analysis.execution.elapsed,
    timestamp:analysis.timestamp
  });

  localStorage.setItem(
    "querylens-history",
    JSON.stringify(history.slice(0,10))
  );
}


function renderHistory(){

  const history = getHistory();

  if(!history.length){
    $("historyContainer").innerHTML =
      `<div class="schema-container">
         <span style="color:var(--muted);font-size:.78rem">
           No previous analyses.
         </span>
       </div>`;
    return;
  }

  $("historyContainer").innerHTML = history.map((item,index)=>`
    <div class="history-item" data-index="${index}">

      <div class="history-query">
        ${escapeHTML(item.query)}
      </div>

      <div class="history-meta">
        ${escapeHTML(item.category)}
        • Score ${escapeHTML(item.score)}
        • Cost ${escapeHTML(item.cost)}
        • ${new Date(item.timestamp).toLocaleString()}
      </div>

    </div>
  `).join("");

  document.querySelectorAll(".history-item").forEach(element=>{

    element.addEventListener("click",()=>{

      const index = Number(element.dataset.index);
      const selected = history[index];

      if(!selected) return;

      $("sqlInput").value = selected.query;

      analyzeQuery();

      document.getElementById("analyser")
        .scrollIntoView({ behavior:"smooth" });
    });
  });
}


$("clearHistoryBtn").addEventListener("click",()=>{
  localStorage.removeItem("querylens-history");
  renderHistory();
});


/* =========================================================
   TESTING

   Each case now asserts a concrete expected outcome rather
   than merely checking that nothing threw.
========================================================= */

$("runTestsBtn").addEventListener("click",runTests);


function runTests(){

  const tests = [

    {
      name:"Indexed equality filter uses an index",
      query:"SELECT id, name FROM customers WHERE country = 'India';",
      check:(execution,plan)=>
        plan.indexSearches >= 1 && plan.fullScans === 0
    },

    {
      name:"Unfiltered SELECT * is a full scan",
      query:"SELECT * FROM customers;",
      check:(execution,plan)=>
        plan.fullScans >= 1 && execution.totalRows === 3000
    },

    {
      name:"JOIN returns merged columns",
      query:"SELECT c.name, o.amount FROM customers c JOIN orders o ON c.id = o.customer_id LIMIT 5;",
      check:(execution)=>
        execution.totalRows === 5 &&
        execution.rows.every(r => "name" in r && "amount" in r)
    },

    {
      name:"GROUP BY returns one row per category",
      query:"SELECT category, AVG(price) AS avg_price FROM products GROUP BY category;",
      check:(execution)=>
        execution.totalRows === 6 &&
        execution.rows.every(r => Number.isFinite(r.avg_price))
    },

    {
      name:"Range filter on a date column",
      query:"SELECT id, order_date, amount FROM orders WHERE order_date >= '2026-01-01' LIMIT 10;",
      check:(execution)=>
        execution.totalRows === 10 &&
        execution.rows.every(r => r.order_date >= "2026-01-01")
    },

    {
      name:"AND / OR precedence with parentheses",
      query:"SELECT id, country, city FROM customers WHERE country = 'India' AND (city = 'Chennai' OR city = 'Mumbai');",
      check:(execution)=>
        execution.rows.every(r =>
          r.country === "India" &&
          (r.city === "Chennai" || r.city === "Mumbai")
        )
    },

    {
      name:"IN list filter",
      query:"SELECT id, status FROM orders WHERE status IN ('Delivered', 'Shipped') LIMIT 20;",
      check:(execution)=>
        execution.rows.every(r =>
          r.status === "Delivered" || r.status === "Shipped"
        )
    },

    {
      name:"BETWEEN filter",
      query:"SELECT id, quantity FROM orders WHERE quantity BETWEEN 2 AND 4 LIMIT 20;",
      check:(execution)=>
        execution.rows.every(r => r.quantity >= 2 && r.quantity <= 4)
    },

    {
      name:"NOT operator",
      query:"SELECT id, country FROM customers WHERE NOT country = 'India' LIMIT 20;",
      check:(execution)=>
        execution.rows.every(r => r.country !== "India")
    },

    {
      name:"Bare aggregate collapses to one row",
      query:"SELECT COUNT(*) AS total FROM orders;",
      check:(execution)=>
        execution.totalRows === 1 && execution.rows[0].total === 25000
    },

    {
      name:"DISTINCT removes duplicates",
      query:"SELECT DISTINCT country FROM customers;",
      check:(execution)=>
        execution.totalRows === 8
    },

    {
      name:"HAVING filters groups",
      query:"SELECT status, COUNT(*) AS n FROM orders GROUP BY status HAVING COUNT(*) > 0;",
      check:(execution)=>
        execution.totalRows === 4 && execution.rows.every(r => r.n > 0)
    },

    {
      name:"Unsupported predicate is rejected",
      query:"SELECT id FROM customers WHERE country MATCHES 'India';",
      expectError:true
    },

    {
      name:"Non-SELECT statement is rejected",
      query:"DELETE FROM customers;",
      expectError:true
    },

    {
      name:"Unknown table is rejected",
      query:"SELECT * FROM suppliers;",
      expectError:true
    }

  ];

  const results = [];

  for(const test of tests){

    try{

      const sql = validateSQL(test.query);
      const execution = executeQuery(sql);

      const plan = typeof analyzePlanV2 === "function"
        ? analyzePlanV2(sql,execution)
        : analyzePlan(sql,execution);

      if(test.expectError){
        results.push({
          name:test.name,
          passed:false,
          detail:"expected an error but the query succeeded"
        });
        continue;
      }

      const passed = test.check ? Boolean(test.check(execution,plan)) : true;

      results.push({
        name:test.name,
        passed,
        detail:passed ? "" : "assertion failed"
      });

    }catch(error){

      results.push({
        name:test.name,
        passed:Boolean(test.expectError),
        detail:test.expectError ? "" : error.message
      });
    }
  }

  const passedCount = results.filter(r => r.passed).length;

  $("testResults").innerHTML = `
    <div class="test-summary">
      <strong>${passedCount} / ${results.length} passed</strong>
    </div>
  ` + results.map(result=>`
    <div class="test-item">

      <span>
        ${escapeHTML(result.name)}
        ${result.detail
          ? `<em class="test-detail">${escapeHTML(result.detail)}</em>`
          : ""}
      </span>

      <strong class="${result.passed ? "test-pass" : "test-fail"}">
        ${result.passed ? "PASS" : "FAIL"}
      </strong>

    </div>
  `).join("");
}


/* =========================================================
   REPORT
========================================================= */

function getReportText(){

  if(!currentAnalysis){
    return "No query has been analyzed yet.";
  }

  const a = currentAnalysis;

  const cost = typeof a.plan.estimatedCost === "number"
    ? a.plan.estimatedCost.toFixed(2)
    : a.plan.estimatedCost;

  const cardinality = a.plan.estimatedRows !== undefined
    ? `
CARDINALITY ESTIMATION
----------------------------------------
Rows Scanned: ${formatNumber(a.plan.rowsScanned)}
Filter Selectivity: ${(a.plan.selectivity * 100).toFixed(3)}%
Estimated Rows After Filter: ${formatNumber(a.plan.estimatedRows)}
Index Used: ${a.plan.usableIndex || "none"}
`
    : "";

  const nodeBreakdown = Array.isArray(a.plan.nodes) && a.plan.nodes.length
    ? `
COST BREAKDOWN BY OPERATOR
----------------------------------------
${a.plan.nodes.map(n =>
  `${n.op.padEnd(22)} rows=${String(n.rows).padStart(8)}  cost=${n.cost.toFixed(2).padStart(10)}  ${String(n.share).padStart(3)}%`
).join("\n")}
`
    : "";

  return `
QUERYLENS
SQL QUERY COST ANALYSER
========================================

USER INPUT
----------------------------------------
${a.query}

QUERY SCORE
----------------------------------------
Score: ${a.plan.score}/100
Category: ${a.plan.category}

COST
----------------------------------------
Estimated Cost: ${cost}
${cardinality}
EXECUTION
----------------------------------------
Execution Time: ${a.execution.elapsed.toFixed(3)} ms
Rows Returned: ${a.execution.totalRows}

PLAN METRICS
----------------------------------------
Full Scans: ${a.plan.fullScans}
Index Searches: ${a.plan.indexSearches}
Temporary Structures: ${a.plan.temporaryStructures}
Joins: ${a.plan.joins}

EXECUTION PLAN
----------------------------------------
${a.plan.plan.map((step,i) => `${i+1}. ${step}`).join("\n")}
${nodeBreakdown}
RECOMMENDATIONS
----------------------------------------
${a.recommendations.map(item => `- ${item.title}: ${item.text}`).join("\n")}

SAMPLE OUTPUT (first 10 rows)
----------------------------------------
${a.execution.rows.length
  ? a.execution.rows.slice(0,10).map(
      (row,i) => `${i+1}. ${JSON.stringify(row)}`
    ).join("\n")
  : "No rows returned."}

========================================
Generated by QueryLens
${new Date().toLocaleString()}
  `.trim();
}


/* =========================================================
   FILE DOWNLOAD
========================================================= */

function downloadFile(filename,content,type){

  const blob = new Blob([content],{ type });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}


/* =========================================================
   TEXT REPORT
========================================================= */

$("downloadText").addEventListener("click",()=>{

  if(!currentAnalysis){
    alert("Analyze a query first.");
    return;
  }

  downloadFile("querylens-report.txt",getReportText(),"text/plain");
});


/* =========================================================
   JSON REPORT
========================================================= */

$("downloadJson").addEventListener("click",()=>{

  if(!currentAnalysis){
    alert("Analyze a query first.");
    return;
  }

  downloadFile(
    "querylens-report.json",
    JSON.stringify(currentAnalysis,null,2),
    "application/json"
  );
});


/* =========================================================
   DOCUMENT REPORT
========================================================= */

$("downloadDoc").addEventListener("click",()=>{

  if(!currentAnalysis){
    alert("Analyze a query first.");
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>QueryLens Report</title>
<style>
body{ font-family:Arial,sans-serif; padding:40px; color:#222; }
h1{ color:#555cf0; }
pre{
  white-space:pre-wrap;
  background:#f3f3f3;
  padding:20px;
  border-radius:10px;
  font-family:Consolas,monospace;
  font-size:12px;
}
</style>
</head>
<body>

<h1>QueryLens</h1>
<h2>SQL Query Cost Analysis Report</h2>

<pre>${escapeHTML(getReportText())}</pre>

</body>
</html>
  `;

  downloadFile("querylens-report.doc",html,"application/msword");
});


/* =========================================================
   PRINT / PDF
========================================================= */

$("downloadPdf").addEventListener("click",()=>{

  if(!currentAnalysis){
    alert("Analyze a query first.");
    return;
  }

  window.print();
});


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

$("sqlInput").addEventListener("keydown",event=>{

  if((event.ctrlKey || event.metaKey) && event.key === "Enter"){
    event.preventDefault();
    analyzeQuery();
  }
});


/* =========================================================
   INITIALIZATION
========================================================= */

function init(){

  generateDatabase();

  renderSchema();

  renderHistory();

  initTheme();

    /* startQuizModule comes from quiz.js and is idempotent. */
  if(typeof startQuizModule === "function"){
    startQuizModule();
  }
}


init();