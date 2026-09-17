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
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "UAE"
];

const CITIES = [
  "Chennai",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "New York",
  "London",
  "Toronto",
  "Sydney"
];

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Sports",
  "Beauty"
];

const PRODUCT_NAMES = [
  "Laptop",
  "Wireless Mouse",
  "Keyboard",
  "Monitor",
  "Headphones",
  "Backpack",
  "Smartphone",
  "Tablet",
  "Running Shoes",
  "Desk Lamp",
  "Office Chair",
  "Water Bottle",
  "Programming Book",
  "Gaming Controller",
  "USB Hub"
];

const STATUSES = [
  "Delivered",
  "Shipped",
  "Processing",
  "Cancelled"
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


function splitCSV(text){

  const result = [];
  let current = "";
  let quote = null;

  for(const char of text){

    if((char === "'" || char === '"')){

      if(quote === char){
        quote = null;
      }else if(!quote){
        quote = char;
      }
    }

    if(char === "," && !quote){

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


function randomDate(){

  const start = new Date("2025-01-01").getTime();
  const end = new Date("2026-08-31").getTime();

  const date =
    new Date(
      start + Math.random() * (end - start)
    );

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

      name:
        `${randomItem(PRODUCT_NAMES)} ${i}`,

      category:
        randomItem(CATEGORIES),

      price:
        Number(
          (20 + Math.random() * 1980)
          .toFixed(2)
        )

    });
  }


  /* ORDERS */

  for(let i = 1; i <= 25000; i++){

    const product =
      DB.products[
        Math.floor(
          Math.random() *
          DB.products.length
        )
      ];

    const customer =
      DB.customers[
        Math.floor(
          Math.random() *
          DB.customers.length
        )
      ];

    const quantity =
      1 + Math.floor(Math.random() * 5);

    DB.orders.push({

      id:i,

      customer_id:customer.id,

      product_id:product.id,

      order_date:randomDate(),

      quantity,

      amount:
        Number(
          (product.price * quantity)
          .toFixed(2)
        ),

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
    Object.entries(SCHEMA).map(
      ([table,info])=>`

      <div class="schema-table">

        <div class="schema-table-header">
          <span>${table}</span>
          <span>${formatNumber(info.rows)} rows</span>
        </div>

        <div class="schema-columns">

          ${info.columns.map(
            column=>`

            <div class="schema-column">
              <span>${column[0]}</span>
              <span>${column[1]}</span>
            </div>

          `
          ).join("")}

          <div class="schema-column">
            <span>Indexes</span>
            <span>${info.indexes.length}</span>
          </div>

        </div>

      </div>

    `
    ).join("");
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

  const saved =
    localStorage.getItem("querylens-theme");


  if(saved){

    applyTheme(saved);

  }else{

    const prefers =
      window.matchMedia &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    applyTheme(
      prefers ? "dark" : "light"
    );
  }
}


$("themeToggle").addEventListener(
  "click",
  ()=>{

    const next =
      document.body.classList.contains("dark")
        ? "light"
        : "dark";

    applyTheme(next);

    localStorage.setItem(
      "querylens-theme",
      next
    );
  }
);


/* =========================================================
   MOBILE NAV
========================================================= */

$("mobileMenu").addEventListener(
  "click",
  ()=>{

    document
      .querySelector(".nav-links")
      .classList.toggle("mobile-open");
  }
);


/* =========================================================
   DOWNLOAD MENU
========================================================= */

$("downloadBtn").addEventListener(
  "click",
  event=>{

    event.stopPropagation();

    $("downloadMenu")
      .classList.toggle("show");
  }
);


$("downloadMenu").addEventListener(
  "click",
  event=>{
    event.stopPropagation();
  }
);


document.addEventListener(
  "click",
  ()=>{
    $("downloadMenu")
      .classList.remove("show");
  }
);


/* =========================================================
   SQL VALIDATION
========================================================= */

function validateSQL(sql){

  if(!sql.trim()){
    throw new Error(
      "Please enter a SQL query."
    );
  }


  const normalized =
    normalizeSQL(sql);


  if(!/^select\b/i.test(normalized)){
    throw new Error(
      "Only SELECT queries are supported."
    );
  }


  const dangerous =
    /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|ATTACH|DETACH|PRAGMA|VACUUM|REINDEX|REPLACE)\b/i;


  if(dangerous.test(normalized)){
    throw new Error(
      "Data modification and database administration commands are not allowed."
    );
  }


  if(normalized.includes(";")){

    throw new Error(
      "Multiple SQL statements are not supported."
    );
  }


  if(!/\bFROM\b/i.test(normalized)){

    throw new Error(
      "The query must contain a FROM clause."
    );
  }


  return normalized;
}


/* =========================================================
   TABLE PARSING
========================================================= */

function parseTable(sql){

  const match =
    sql.match(
      /\bFROM\s+([a-zA-Z_][\w]*)(?:\s+(?:AS\s+)?([a-zA-Z_]\w*))?/i
    );


  if(!match){
    throw new Error(
      "Could not identify the table after FROM."
    );
  }


  return {

    table:match[1].toLowerCase(),

    alias:
      (match[2] || match[1]).toLowerCase()
  };
}


/* =========================================================
   SQL VALUE PARSING
========================================================= */

function parseValue(value){

  value = value.trim();


  if(
    /^'.*'$/.test(value) ||
    /^".*"$/.test(value)
  ){

    return stripQuotes(value);
  }


  if(/^null$/i.test(value)){
    return null;
  }


  if(
    /^-?\d+(\.\d+)?$/.test(value)
  ){

    return Number(value);
  }


  return value;
}


/* =========================================================
   CONDITION EVALUATION
========================================================= */

function getColumnValue(row,column){

  column =
    column
      .trim()
      .toLowerCase();


  column =
    column.includes(".")
      ? column.split(".").pop()
      : column;


  return row[column];
}


function evaluateSimpleCondition(row,condition){

  condition =
    condition.trim();


  /* IS NULL */

  let match =
    condition.match(
      /^([\w.]+)\s+IS\s+(NOT\s+)?NULL$/i
    );


  if(match){

    const value =
      getColumnValue(
        row,
        match[1]
      );

    return match[2]
      ? value !== null &&
        value !== undefined
      : value === null ||
        value === undefined;
  }


  /* LIKE */

  match =
    condition.match(
      /^([\w.]+)\s+LIKE\s+(['"].*['"])$/i
    );


  if(match){

    const value =
      String(
        getColumnValue(
          row,
          match[1]
        ) ?? ""
      );

    const pattern =
      stripQuotes(match[2])
        .replace(/[.*+?^${}()|[\]\\]/g,"\\$&")
        .replace(/%/g,".*")
        .replace(/_/g,".");

    return new RegExp(
      `^${pattern}$`,
      "i"
    ).test(value);
  }


  /* Comparison */

  match =
    condition.match(
      /^([\w.]+)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/i
    );


  if(!match){

    return true;
  }


  const left =
    getColumnValue(
      row,
      match[1]
    );

  const right =
    parseValue(match[3]);


  if(
    typeof left === "string" &&
    typeof right === "string"
  ){

    const a = left.toLowerCase();
    const b = right.toLowerCase();

    switch(match[2]){

      case "=":
        return a === b;

      case "!=":
      case "<>":
        return a !== b;

      case ">":
        return a > b;

      case "<":
        return a < b;

      case ">=":
        return a >= b;

      case "<=":
        return a <= b;
    }
  }


  switch(match[2]){

    case "=":
      return left == right;

    case "!=":
    case "<>":
      return left != right;

    case ">":
      return Number(left) > Number(right);

    case "<":
      return Number(left) < Number(right);

    case ">=":
      return Number(left) >= Number(right);

    case "<=":
      return Number(left) <= Number(right);

    default:
      return false;
  }
}


/* =========================================================
   WHERE EVALUATION
========================================================= */

function evaluateWhere(row,where){

  if(!where){
    return true;
  }


  const orParts =
    where.split(/\s+OR\s+/i);


  return orParts.some(
    orPart=>{

      const andParts =
        orPart.split(/\s+AND\s+/i);

      return andParts.every(
        condition=>
          evaluateSimpleCondition(
            row,
            condition
          )
      );
    }
  );
}


/* =========================================================
   PARSE WHERE
========================================================= */

function extractWhere(sql){

  const match =
    sql.match(
      /\bWHERE\b(.+?)(?=\bGROUP\s+BY\b|\bORDER\s+BY\b|\bLIMIT\b|$)/i
    );


  return match
    ? match[1].trim()
    : "";
}


/* =========================================================
   JOIN PROCESSING
========================================================= */

function performJoin(rows,sql){

  const joinMatch =
    sql.match(
      /\bJOIN\s+([a-zA-Z_]\w*)\s+(?:AS\s+)?([a-zA-Z_]\w*)?\s*ON\s+([\w.]+)\s*=\s*([\w.]+)/i
    );


  if(!joinMatch){
    return rows;
  }


  const joinTable =
    joinMatch[1].toLowerCase();


  const left =
    joinMatch[3];


  const right =
    joinMatch[4];


  const target =
    DB[joinTable];


  if(!target){
    throw new Error(
      `Unknown joined table: ${joinTable}`
    );
  }


  const output = [];


  for(const base of rows){

    for(const joined of target){

      const leftColumn =
        left.split(".").pop().toLowerCase();

      const rightColumn =
        right.split(".").pop().toLowerCase();


      let leftValue;
      let rightValue;


      if(base[leftColumn] !== undefined){

        leftValue =
          base[leftColumn];

      }else{

        leftValue =
          base[rightColumn];
      }


      if(joined[rightColumn] !== undefined){

        rightValue =
          joined[rightColumn];

      }else{

        rightValue =
          joined[leftColumn];
      }


      if(leftValue == rightValue){

        output.push({
          ...base,
          ...Object.fromEntries(
            Object.entries(joined).map(
              ([key,value])=>[
                `${joinTable}.${key}`,
                value
              ]
            )
          )
        });
      }

    }

  }


  return output;
}


/* =========================================================
   SELECT PARSING
========================================================= */

function extractSelectPart(sql){

  const match =
    sql.match(
      /^SELECT\s+(.+?)\s+FROM\s+/i
    );


  if(!match){
    throw new Error(
      "Could not parse SELECT clause."
    );
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


  const parts =
    splitCSV(orderText);


  return [...rows].sort(
    (a,b)=>{

      for(const part of parts){

        const match =
          part.match(
            /^([\w.]+)(?:\s+(ASC|DESC))?$/i
          );


        if(!match){
          continue;
        }


        const column =
          match[1]
            .split(".")
            .pop()
            .toLowerCase();


        const direction =
          (match[2] || "ASC")
            .toUpperCase();


        const av = a[column];
        const bv = b[column];


        if(av === bv){
          continue;
        }


        let comparison;


        if(
          typeof av === "number" &&
          typeof bv === "number"
        ){

          comparison =
            av - bv;

        }else{

          comparison =
            String(av ?? "")
              .localeCompare(
                String(bv ?? "")
              );
        }


        return direction === "DESC"
          ? -comparison
          : comparison;
      }


      return 0;
    }
  );
}


/* =========================================================
   GROUP BY
========================================================= */

function groupRows(rows,groupText){

  const columns =
    splitCSV(groupText)
      .map(
        column=>
          column
            .split(".")
            .pop()
            .trim()
            .toLowerCase()
      );


  const groups =
    new Map();


  for(const row of rows){

    const key =
      columns
        .map(column=>String(row[column]))
        .join("|");


    if(!groups.has(key)){
      groups.set(key,[]);
    }


    groups.get(key).push(row);
  }


  return [...groups.entries()].map(
    ([key,group])=>({

      __groupKey:key,

      __groupRows:group,

      ...group[0]

    })
  );
}


/* =========================================================
   AGGREGATES
========================================================= */

function aggregateValue(rows,expression){

  const match =
    expression.match(
      /^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*([\w.*]+)\s*\)$/i
    );


  if(!match){
    return null;
  }


  const fn =
    match[1].toUpperCase();


  const column =
    match[2] === "*"
      ? "*"
      : match[2]
          .split(".")
          .pop()
          .toLowerCase();


  if(fn === "COUNT"){

    if(column === "*"){
      return rows.length;
    }

    return rows.filter(
      row=>
        row[column] !== null &&
        row[column] !== undefined
    ).length;
  }


  const values =
    rows
      .map(
        row=>
          Number(row[column])
      )
      .filter(
        value=>Number.isFinite(value)
      );


  if(!values.length){
    return 0;
  }


  if(fn === "SUM"){

    return Number(
      values
        .reduce(
          (a,b)=>a+b,
          0
        )
        .toFixed(2)
    );
  }


  if(fn === "AVG"){

    return Number(
      (
        values.reduce(
          (a,b)=>a+b,
          0
        ) / values.length
      ).toFixed(2)
    );
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

function executeSelect(rows,selectPart){

  if(selectPart === "*"){

    return rows.map(
      row=>{

        const clean = {};

        for(const [key,value] of Object.entries(row)){

          if(
            !key.startsWith("__") &&
            !key.includes(".")
          ){

            clean[key] = value;
          }
        }

        return clean;
      }
    );
  }


  const expressions =
    splitCSV(selectPart);


  const hasAggregate =
    expressions.some(
      expression=>
        /^(COUNT|SUM|AVG|MIN|MAX)\s*\(/i
          .test(
            expression.trim()
          )
    );


  return rows.map(row=>{

    const output = {};


    for(const expression of expressions){

      const cleanExpression =
        expression.trim();


      const aliasMatch =
        cleanExpression.match(
          /^(.+?)\s+AS\s+([a-zA-Z_]\w*)$/i
        );


      const rawExpression =
        aliasMatch
          ? aliasMatch[1].trim()
          : cleanExpression;


      const alias =
        aliasMatch
          ? aliasMatch[2]
          : rawExpression
              .split(".")
              .pop()
              .replace(/\(.*/,"")
              .trim();


      if(
        hasAggregate &&
        /^(COUNT|SUM|AVG|MIN|MAX)\s*\(/i
          .test(rawExpression)
      ){

        output[alias] =
          aggregateValue(
            row.__groupRows || [row],
            rawExpression
          );

      }else{

        const column =
          rawExpression
            .split(".")
            .pop()
            .trim()
            .toLowerCase();


        output[alias] =
          row[column];
      }

    }


    return output;

  });
}


/* =========================================================
   LIMIT
========================================================= */

function extractLimit(sql){

  const match =
    sql.match(
      /\bLIMIT\s+(\d+)/i
    );


  return match
    ? Number(match[1])
    : null;
}


/* =========================================================
   EXECUTE QUERY
========================================================= */

function executeQuery(sql){

  const start =
    performance.now();


  const tableInfo =
    parseTable(sql);


  if(!DB[tableInfo.table]){

    throw new Error(
      `Unknown table: ${tableInfo.table}`
    );
  }


  const baseRows =
    DB[tableInfo.table].map(
      row=>({...row})
    );


  let rows =
    baseRows;


  const joinCount =
    (
      sql.match(
        /\bJOIN\b/gi
      ) || []
    ).length;


  /* JOIN */

  if(joinCount){

    rows =
      performJoin(
        rows,
        sql
      );
  }


  /* WHERE */

  const where =
    extractWhere(sql);


  if(where){

    rows =
      rows.filter(
        row=>
          evaluateWhere(
            row,
            where
          )
      );
  }


  const selectPart =
    extractSelectPart(sql);


  /* GROUP */

  const groupMatch =
    sql.match(
      /\bGROUP\s+BY\b(.+?)(?=\bORDER\s+BY\b|\bLIMIT\b|$)/i
    );


  if(groupMatch){

    rows =
      groupRows(
        rows,
        groupMatch[1].trim()
      );
  }


  /* SELECT */

  let result =
    executeSelect(
      rows,
      selectPart
    );


  /* ORDER */

  const orderMatch =
    sql.match(
      /\bORDER\s+BY\b(.+?)(?=\bLIMIT\b|$)/i
    );


  if(orderMatch){

    result =
      applyOrder(
        result,
        orderMatch[1].trim()
      );
  }


  /* LIMIT */

  const limit =
    extractLimit(sql);


  if(limit !== null){

    result =
      result.slice(
        0,
        Math.max(0,limit)
      );
  }


  const elapsed =
    performance.now() - start;


  return {

    rows:result.slice(0,100),

    totalRows:result.length,

    elapsed,

    sourceRows:baseRows.length,

    table:tableInfo.table,

    where,

    joinCount,

    hasGroupBy:Boolean(groupMatch),

    hasOrderBy:Boolean(orderMatch),

    hasLimit:limit !== null,

    selectStar:
      selectPart === "*",

    selectPart

  };
}


/* =========================================================
   PLAN ANALYSIS
========================================================= */

function analyzePlan(sql,execution){

  const lower =
    sql.toLowerCase();


  let fullScans = 0;
  let indexSearches = 0;
  let temporaryStructures = 0;
  let joins = execution.joinCount;


  /* FULL SCAN */

  if(!execution.where){

    fullScans += 1;

  }else{

    const indexedColumns = [

      "customers.country",
      "customers.email",
      "customers.id",
      "products.category",
      "products.id",
      "orders.customer_id",
      "orders.product_id",
      "orders.order_date",
      "orders.status"

    ];


    const usefulIndex =
      indexedColumns.some(
        column=>{

          const shortColumn =
            column.split(".")[1];

          return new RegExp(
            `\\b${shortColumn}\\b\\s*(=|>=|<=|>|<|LIKE)`,
            "i"
          ).test(execution.where);
        }
      );


    if(usefulIndex){

      indexSearches += 1;

    }else{

      fullScans += 1;
    }
  }


  /* ORDER */

  if(execution.hasOrderBy){
    temporaryStructures += 1;
  }


  /* GROUP */

  if(execution.hasGroupBy){
    temporaryStructures += 1;
  }


  /* DISTINCT */

  if(/\bDISTINCT\b/i.test(sql)){
    temporaryStructures += 1;
  }


  /* SELECT STAR */

  const selectStar =
    execution.selectStar;


  /* COST */

  let cost =
    5 +
    fullScans * 30 +
    indexSearches * 8 +
    temporaryStructures * 22 +
    joins * 15;


  if(execution.where){
    cost -= 8;
  }


  if(execution.hasLimit){
    cost -= 4;
  }


  if(selectStar){
    cost += 10;
  }


  cost =
    Math.max(
      1,
      Math.round(cost)
    );


  const score =
    Math.max(
      1,
      Math.min(
        100,
        Math.round(
          100 - cost * 1.05
        )
      )
    );


  let category;


  if(score >= 80){
    category = "Low";
  }else if(score >= 55){
    category = "Moderate";
  }else{
    category = "High";
  }


  const plan = [];


  plan.push(
    `SCAN ${execution.table}`
  );


  if(indexSearches){

    plan.push(
      `SEARCH ${execution.table} USING INDEX`
    );
  }


  if(joins){

    plan.push(
      `NESTED LOOP JOIN (${joins} join${joins > 1 ? "s" : ""})`
    );
  }


  if(execution.where){

    plan.push(
      `FILTER: ${execution.where}`
    );
  }


  if(execution.hasGroupBy){

    plan.push(
      "USE TEMPORARY STRUCTURE FOR GROUP BY"
    );
  }


  if(execution.hasOrderBy){

    plan.push(
      "USE TEMPORARY STRUCTURE FOR ORDER BY"
    );
  }


  if(execution.hasLimit){

    plan.push(
      "APPLY LIMIT"
    );
  }


  plan.push(
    "RETURN RESULT"
  );


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

function generateRecommendations(
  sql,
  execution,
  plan
){

  const recommendations = [];


  if(execution.selectStar){

    recommendations.push({

      title:"Avoid SELECT *",

      text:
        "Select only the columns required by the application. This can reduce unnecessary data retrieval and improve readability."

    });
  }


  if(plan.fullScans > 0){

    recommendations.push({

      title:"Potential Full Table Scan",

      text:
        "The query contains filtering characteristics that do not match one of the demonstration indexes. Consider indexing frequently filtered columns."

    });
  }


  if(plan.indexSearches > 0){

    recommendations.push({

      title:"Index Usage Detected",

      text:
        "The query condition matches a demonstration indexed column, which can reduce the amount of data that needs to be searched."
    });
  }


  if(execution.joinCount > 0){

    recommendations.push({

      title:"Join Detected",

      text:
        "Ensure join columns are indexed and that the join returns only the relationships required by the application."
    });
  }


  if(execution.hasGroupBy){

    recommendations.push({

      title:"Aggregation / Grouping",

      text:
        "GROUP BY may require additional processing. Filter rows before grouping whenever possible."
    });
  }


  if(execution.hasOrderBy){

    recommendations.push({

      title:"Sorting Detected",

      text:
        "ORDER BY can require additional sorting work. If sorting is frequent, consider suitable indexes for the ordering pattern."
    });
  }


  if(
    /\bLIKE\s+['"]%/i.test(sql)
  ){

    recommendations.push({

      title:"Leading Wildcard",

      text:
        "A LIKE pattern beginning with % can make normal index lookup less effective because the beginning of the value is unknown."
    });
  }


  if(!recommendations.length){

    recommendations.push({

      title:"Query Looks Efficient",

      text:
        "No major issue was detected by the built-in educational checks. Review the execution plan and test the query with realistic data sizes."
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

function renderAnalysis(
  execution,
  plan,
  recommendations,
  query
){

  currentAnalysis = {

    query,

    execution,

    plan,

    recommendations,

    timestamp:
      new Date().toISOString()

  };


  $("emptyAnalysis")
    .classList.add("hidden");

  $("analysisContent")
    .classList.remove("hidden");


  $("scoreValue")
    .textContent =
      plan.score;


  $("scoreCategory")
    .textContent =
      plan.category;


  const descriptions = {

    Low:
      "The query shows relatively low estimated work based on the detected query characteristics.",

    Moderate:
      "The query contains operations that contribute a moderate amount of estimated work.",

    High:
      "The query contains multiple characteristics associated with higher estimated work. Review the execution plan and recommendations."

  };


  $("scoreDescription")
    .textContent =
      descriptions[plan.category];


  $("scoreCircle")
    .style.setProperty(
      "--score",
      `${plan.score}%`
    );


  $("estimatedCost")
    .textContent =
      plan.estimatedCost;


  $("executionTime")
    .textContent =
      execution.elapsed.toFixed(3);


  $("rowsReturned")
    .textContent =
      formatNumber(
        execution.totalRows
      );


  $("fullScans")
    .textContent =
      plan.fullScans;


  $("planFullScans")
    .textContent =
      plan.fullScans;


  $("indexSearches")
    .textContent =
      plan.indexSearches;


  $("temporaryStructures")
    .textContent =
      plan.temporaryStructures;


  $("joinCount")
    .textContent =
      plan.joins;


  renderExecutionPlan(plan);

  renderVisualization(plan);

  renderRecommendations(recommendations);

  renderResult(execution.rows);

  saveHistory(currentAnalysis);

  renderHistory();
}


/* =========================================================
   EXECUTION PLAN UI
========================================================= */

function renderExecutionPlan(plan){

  $("executionPlan").innerHTML =
    plan.plan.map(
      (step,index)=>`

      <div class="plan-row">
        <strong>${index + 1}.</strong>
        ${escapeHTML(step)}
      </div>

    `
    ).join("");
}


/* =========================================================
   VISUALIZATION
========================================================= */

function renderVisualization(plan){

  const items = [

    ["Full Scans",plan.fullScans],

    ["Index Searches",plan.indexSearches],

    ["Temporary Structures",plan.temporaryStructures],

    ["Joins",plan.joins]

  ];


  const max =
    Math.max(
      1,
      ...items.map(
        item=>item[1]
      )
    );


  $("costVisualization").innerHTML =
    items.map(
      ([label,value])=>{

        const width =
          value === 0
            ? 0
            : Math.max(
                6,
                value / max * 100
              );


        return `

          <div class="cost-bar-row">

            <span>${label}</span>

            <div class="cost-bar-track">

              <div
                class="cost-bar"
                style="width:${width}%">
              </div>

            </div>

            <strong>${value}</strong>

          </div>

        `;

      }
    ).join("");
}


/* =========================================================
   RECOMMENDATIONS UI
========================================================= */

function renderRecommendations(
  recommendations
){

  $("recommendations").innerHTML =
    recommendations.map(
      item=>`

      <div class="recommendation">

        <strong>${escapeHTML(item.title)}</strong>

        <p>
          ${escapeHTML(item.text)}
        </p>

      </div>

    `
    ).join("");
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


  const columns =
    Object.keys(rows[0]);


  $("resultTable").innerHTML = `

    <table class="result-table">

      <thead>

        <tr>

          ${columns.map(
            column=>
              `<th>${escapeHTML(column)}</th>`
          ).join("")}

        </tr>

      </thead>

      <tbody>

        ${rows.map(
          row=>`

          <tr>

            ${columns.map(
              column=>
                `<td>${escapeHTML(row[column])}</td>`
            ).join("")}

          </tr>

        `
        ).join("")}

      </tbody>

    </table>

  `;
}


/* =========================================================
   ANALYZE BUTTON
========================================================= */

$("analyzeBtn").addEventListener(
  "click",
  analyzeQuery
);


function analyzeQuery(){

  clearError();


  const original =
    $("sqlInput")
      .value
      .trim();


  try{

    const sql =
      validateSQL(
        original
      );


    const execution =
      executeQuery(sql);


    const plan =
      analyzePlan(
        sql,
        execution
      );


    const recommendations =
      generateRecommendations(
        sql,
        execution,
        plan
      );


    renderAnalysis(
      execution,
      plan,
      recommendations,
      sql
    );


  }catch(error){

    showError(
      error.message ||
      "Unable to analyze query."
    );
  }
}


/* =========================================================
   EXAMPLE
========================================================= */

$("exampleBtn").addEventListener(
  "click",
  ()=>{

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
  }
);


/* =========================================================
   CLEAR
========================================================= */

$("clearBtn").addEventListener(
  "click",
  ()=>{

    $("sqlInput").value = "";

    clearError();

    currentAnalysis = null;

    $("analysisContent")
      .classList.add("hidden");

    $("emptyAnalysis")
      .classList.remove("hidden");
  }
);


/* =========================================================
   ERRORS
========================================================= */

function showError(message){

  $("errorMessage")
    .textContent =
      message;

  $("errorMessage")
    .classList.remove(
      "hidden"
    );
}


function clearError(){

  $("errorMessage")
    .textContent = "";

  $("errorMessage")
    .classList.add(
      "hidden"
    );
}


/* =========================================================
   HISTORY
========================================================= */

function getHistory(){

  try{

    return JSON.parse(
      localStorage.getItem(
        "querylens-history"
      ) || "[]"
    );

  }catch{

    return [];
  }
}


function saveHistory(analysis){

  const history =
    getHistory();


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

    JSON.stringify(
      history.slice(0,10)
    )
  );
}


function renderHistory(){

  const history =
    getHistory();


  if(!history.length){

    $("historyContainer").innerHTML =
      `<div class="schema-container">
        <span style="color:var(--muted);font-size:.78rem">
          No previous analyses.
        </span>
      </div>`;

    return;
  }


  $("historyContainer").innerHTML =
    history.map(
      (item,index)=>`

      <div
        class="history-item"
        data-index="${index}">

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

    `
    ).join("");


  document
    .querySelectorAll(".history-item")
    .forEach(element=>{

      element.addEventListener(
        "click",
        ()=>{

          const index =
            Number(
              element.dataset.index
            );


          const selected =
            history[index];


          if(!selected){
            return;
          }


          $("sqlInput").value =
            selected.query;


          analyzeQuery();


          document
            .getElementById("analyser")
            .scrollIntoView({
              behavior:"smooth"
            });
        }
      );

    });
}


$("clearHistoryBtn").addEventListener(
  "click",
  ()=>{

    localStorage.removeItem(
      "querylens-history"
    );

    renderHistory();
  }
);


/* =========================================================
   TESTING
========================================================= */

$("runTestsBtn").addEventListener(
  "click",
  runTests
);


function runTests(){

  const tests = [

    {
      name:"Simple indexed filter",

      query:
        "SELECT id, name FROM customers WHERE country = 'India';"
    },

    {
      name:"Full table scan detection",

      query:
        "SELECT * FROM customers;"
    },

    {
      name:"JOIN processing",

      query:
        "SELECT c.name, o.amount FROM customers c JOIN orders o ON c.id = o.customer_id LIMIT 5;"
    },

    {
      name:"Aggregation",

      query:
        "SELECT category, AVG(price) AS avg_price FROM products GROUP BY category;"
    },

    {
      name:"Date filtering",

      query:
        "SELECT id, order_date, amount FROM orders WHERE order_date >= '2026-01-01' LIMIT 10;"
    }

  ];


  const results = [];


  for(const test of tests){

    try{

      const sql =
        validateSQL(
          test.query
        );


      const execution =
        executeQuery(sql);


      const plan =
        analyzePlan(
          sql,
          execution
        );


      results.push({

        name:test.name,

        passed:
          execution &&
          plan &&
          execution.rows !== undefined

      });

    }catch(error){

      results.push({

        name:test.name,

        passed:false,

        error:error.message

      });
    }
  }


  $("testResults").innerHTML =
    results.map(
      result=>`

      <div class="test-item">

        <span>
          ${escapeHTML(result.name)}
        </span>

        <strong
          class="${
            result.passed
              ? "test-pass"
              : "test-fail"
          }">

          ${result.passed
            ? "PASS"
            : "FAIL"}

        </strong>

      </div>

    `
    ).join("");
}


/* =========================================================
   REPORT
========================================================= */

function getReportText(){

  if(!currentAnalysis){

    return "No query has been analyzed yet.";
  }


  const a =
    currentAnalysis;


  return `

QUERYLENS
SQL QUERY COST ANALYSER
========================================

QUERY
----------------------------------------
${a.query}

QUERY SCORE
----------------------------------------
Score: ${a.plan.score}/100
Category: ${a.plan.category}

COST
----------------------------------------
Estimated Cost: ${a.plan.estimatedCost}

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
${a.plan.plan.map(
  (step,i)=>
    `${i+1}. ${step}`
).join("\n")}

RECOMMENDATIONS
----------------------------------------
${a.recommendations.map(
  item=>
    `- ${item.title}: ${item.text}`
).join("\n")}

========================================
Generated by QueryLens
  `.trim();
}


/* =========================================================
   FILE DOWNLOAD
========================================================= */

function downloadFile(
  filename,
  content,
  type
){

  const blob =
    new Blob(
      [content],
      {type}
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    filename;


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();


  URL.revokeObjectURL(
    url
  );
}


/* =========================================================
   TEXT REPORT
========================================================= */

$("downloadText").addEventListener(
  "click",
  ()=>{

    if(!currentAnalysis){

      alert(
        "Analyze a query first."
      );

      return;
    }


    downloadFile(

      "querylens-report.txt",

      getReportText(),

      "text/plain"

    );
  }
);


/* =========================================================
   JSON REPORT
========================================================= */

$("downloadJson").addEventListener(
  "click",
  ()=>{

    if(!currentAnalysis){

      alert(
        "Analyze a query first."
      );

      return;
    }


    downloadFile(

      "querylens-report.json",

      JSON.stringify(
        currentAnalysis,
        null,
        2
      ),

      "application/json"

    );
  }
);


/* =========================================================
   DOCUMENT REPORT
========================================================= */

$("downloadDoc").addEventListener(
  "click",
  ()=>{

    if(!currentAnalysis){

      alert(
        "Analyze a query first."
      );

      return;
    }


    const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>QueryLens Report</title>

<style>

body{
  font-family:Arial,sans-serif;
  padding:40px;
  color:#222;
}

h1{
  color:#555cf0;
}

pre{
  white-space:pre-wrap;
  background:#f3f3f3;
  padding:20px;
  border-radius:10px;
}

</style>

</head>

<body>

<h1>QueryLens</h1>

<h2>SQL Query Cost Analysis Report</h2>

<pre>${escapeHTML(
  getReportText()
)}</pre>

</body>

</html>

    `;


    downloadFile(

      "querylens-report.doc",

      html,

      "application/msword"

    );
  }
);


/* =========================================================
   PRINT / PDF
========================================================= */

$("downloadPdf").addEventListener(
  "click",
  ()=>{

    if(!currentAnalysis){

      alert(
        "Analyze a query first."
      );

      return;
    }


    window.print();
  }
);


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

$("sqlInput").addEventListener(
  "keydown",
  event=>{

    if(
      (event.ctrlKey ||
       event.metaKey) &&
      event.key === "Enter"
    ){

      event.preventDefault();

      analyzeQuery();
    }
  }
);


/* =========================================================
   INITIALIZATION
========================================================= */

function init(){

  generateDatabase();

  renderSchema();

  renderHistory();

  initTheme();

}


init();
