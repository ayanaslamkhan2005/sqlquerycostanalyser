# QueryLens – SQL Query Cost Analyser

**Understand the cost behind your SQL queries.**

QueryLens is a browser-based SQL Query Cost Analyser designed to help users understand how database queries are processed, estimate their computational cost, visualize execution plans, and identify opportunities for SQL optimization.

**Live Demo:** https://ayanaslamkhan2005.github.io/sqlquerycostanalyser/

---

## 📌 Overview

QueryLens is an interactive educational tool developed as a Database Management Systems (DBMS) project.

The application allows users to enter SQL queries and examine how different query structures affect estimated computational work. It analyses query operations, estimates row cardinality and selectivity, identifies index usage, generates execution plans, and provides optimization recommendations.

The platform also includes dedicated learning and examination modules, making it useful for understanding SQL query processing as well as preparing for DBMS-related competitive examinations.

The entire application runs inside the browser using JavaScript, without requiring a database server or backend connection.

---

## ✨ Features

### 1. SQL Query Cost Analyser

- Interactive SQL editor for entering queries.
- Predefined SQL demonstration queries.
- Upload and analyse `.sql` and `.txt` files.
- Drag-and-drop SQL file support.
- Automatic SQL validation and error handling.
- Browser-based query execution against a generated demonstration database.
- Keyboard shortcut for analysing queries (`Ctrl + Enter`).

### 2. Query Cost Analysis

Every analysed query generates a detailed breakdown containing:

- **Query Score:** A score between 1 and 100 indicating the estimated efficiency of the query.
- **Estimated Cost:** The computational cost calculated by the cost model.
- **Execution Time:** Time taken by the browser-side query execution.
- **Rows Returned:** Number of records returned by the query.
- **Full Scans:** Number of sequential table scans.
- **Estimated Rows:** Estimated number of rows surviving filtering.
- **Selectivity:** Estimated proportion of rows retained by a filter.
- **Index Used:** Information about the index selected for the query.

### 3. Execution Plan Visualization

QueryLens generates a browser-side execution plan showing the operations involved in processing a query.

The cost model represents operations such as:

- Sequential Scan
- Index Scan
- Filter
- Hash Join
- Nested Loop Join
- Hash Aggregate
- Sort
- Unique
- Limit
- Projection

Each operation contributes to the estimated query cost, allowing users to understand which parts of a query require more computational work.

### 4. Optimization Advisor

The application analyses SQL structure and generates recommendations to help users write more efficient queries.

Examples include:

- Avoiding unnecessary `SELECT *`.
- Using indexes on frequently filtered columns.
- Reducing expensive full table scans.
- Improving filter selectivity.
- Avoiding unnecessarily large sorting operations.
- Using indexed columns for joins.
- Optimizing the use of `DISTINCT`.

### 5. Suggested SQL Rewrites

QueryLens provides copy-ready SQL and DDL suggestions based on detected query issues.

These suggestions help users understand how an inefficient query could be rewritten or how an appropriate index could improve query performance.

### 6. Analysis History

- Stores the ten most recent query analyses.
- Displays previous queries with their scores and estimated costs.
- Allows users to load and reanalyse previous queries.
- Provides an option to clear analysis history.

### 7. Report Generation

Users can export query analysis reports in multiple formats:

- Text Report (`.txt`)
- Document Report (`.doc`)
- JSON Report (`.json`)
- Print / Save as PDF

Reports include the SQL query, execution plan, cost breakdown, recommendations, and sample result rows.

### 8. Built-in Testing and Verification

The application includes predefined test cases to verify different aspects of query processing.

Tests cover:

- Indexed equality filters.
- Full table scans.
- JOIN operations.
- GROUP BY and aggregate queries.
- Date-range filtering.
- AND / OR conditions and parentheses.
- IN-list filtering.
- Invalid SQL statements.

---

## 🗄️ Demonstration Database

QueryLens uses a generated demonstration database containing three interconnected tables.

| Table | Records | Description |
|---|---:|---|
| `customers` | 3,000 | Customer information |
| `products` | 500 | Product information |
| `orders` | 25,000 | Customer orders and transaction details |

### Database Schema

**1. Customers**

Stores customer-related information.

| Column | Data Type | Description |
|---|---|---|
| `id` | INTEGER | Customer ID |
| `name` | TEXT | Customer name |
| `email` | TEXT | Customer email |
| `country` | TEXT | Customer's country |
| `city` | TEXT | Customer's city |
| `created_at` | DATE | Account creation date |

**Indexes:** `id`, `country`, `email`

**2. Products**

Stores product information.

| Column | Data Type | Description |
|---|---|---|
| `id` | INTEGER | Product ID |
| `name` | TEXT | Product name |
| `category` | TEXT | Product category |
| `price` | REAL | Product price |

**Indexes:** `id`, `category`

**3. Orders**

Stores order and transaction information.

| Column | Data Type | Description |
|---|---|---|
| `id` | INTEGER | Order ID |
| `customer_id` | INTEGER | Associated customer |
| `product_id` | INTEGER | Associated product |
| `order_date` | DATE | Date of order |
| `quantity` | INTEGER | Quantity ordered |
| `amount` | REAL | Total order amount |
| `status` | TEXT | Order status |

**Indexes:** `id`, `customer_id`, `product_id`, `order_date`, `status`

The demonstration dataset is generated dynamically in the browser. Its table sizes remain fixed, while individual generated records and query results can vary between page loads.

---

## 💻 Supported SQL Operations

QueryLens supports a practical subset of SQL focused on SELECT queries and query optimization.

| SQL Feature | Support |
|---|---|
| SELECT columns / `*` | ✅ |
| Column aliases (`AS`) | ✅ |
| DISTINCT | ✅ |
| WHERE conditions | ✅ |
| AND / OR / NOT | ✅ |
| Parentheses in conditions | ✅ |
| IN / NOT IN | ✅ |
| IN subqueries | ✅ |
| BETWEEN | ✅ |
| LIKE / NOT LIKE | ✅ |
| IS NULL / IS NOT NULL | ✅ |
| INNER JOIN | ✅ |
| LEFT JOIN | ✅ |
| Multiple JOINs | ✅ |
| COUNT, SUM, AVG, MIN, MAX | ✅ |
| GROUP BY | ✅ |
| HAVING | ✅ |
| ORDER BY | ✅ |
| LIMIT | ✅ |

JOIN conditions currently use equality comparisons in the form `ON table1.column = table2.column`.

### Example Queries

**1. Basic SELECT**

```sql
SELECT *
FROM customers
WHERE country = 'India';
```

**2. Filtering and Sorting**

```sql
SELECT name, email
FROM customers
WHERE country = 'India'
ORDER BY name ASC
LIMIT 10;
```

**3. Aggregate Functions**

```sql
SELECT
    category,
    COUNT(id) AS total_products,
    AVG(price) AS avg_price
FROM products
GROUP BY category
ORDER BY avg_price DESC;
```

**4. JOIN Operation**

```sql
SELECT
    c.name,
    o.amount,
    o.order_date
FROM customers c
JOIN orders o
    ON c.id = o.customer_id
WHERE o.status = 'Delivered'
LIMIT 10;
```

**5. Multiple JOINs**

```sql
SELECT
    c.name AS customer_name,
    p.name AS product_name,
    o.amount
FROM customers c
JOIN orders o
    ON c.id = o.customer_id
JOIN products p
    ON o.product_id = p.id
WHERE o.status = 'Delivered'
LIMIT 25;
```

**6. Subquery**

```sql
SELECT *
FROM customers
WHERE id IN (
    SELECT customer_id
    FROM orders
    WHERE amount > 500
);
```

**7. BETWEEN**

```sql
SELECT id, order_date, amount
FROM orders
WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31'
ORDER BY amount DESC
LIMIT 10;
```

---

## ⚙️ Cost Model and Query Optimization

The cost estimation engine is implemented in `cost-model.js`.

It uses a cardinality-aware cost model with predefined table statistics, approximate distinct-value counts, index metadata, and computational cost constants.

The model is loosely based on concepts used by PostgreSQL's query planner.

### 1. Table Statistics

The cost model maintains information about:

- Number of rows in each table.
- Approximate distinct values for individual columns.
- Available indexes.
- Table cardinality.

These statistics are used to estimate the number of records expected to satisfy a query condition.

### 2. Selectivity Estimation

Selectivity represents the proportion of rows expected to survive a filtering condition.

For an equality condition, the model uses the approximate number of distinct values in a column to estimate selectivity.

For example:

```sql
SELECT *
FROM customers
WHERE country = 'India';
```

If a column has eight distinct values, the model estimates equality selectivity as:

```text
Selectivity = 1 / 8
```

The estimated number of matching rows is then calculated using the table's row count.

The model also handles combined AND and OR predicates using selectivity calculations.

### 3. Index Detection

The cost model checks whether a query condition can use an available index.

It considers index metadata and the leading indexed column when determining whether an index scan is applicable.

For example:

```sql
SELECT *
FROM customers
WHERE country = 'India';
```

The `country` column has an associated index, making it eligible for an index scan.

In comparison:

```sql
SELECT *
FROM customers
WHERE city = 'Mumbai';
```

The `city` column does not have a corresponding index in the demonstration schema, so the model estimates a sequential scan.

### 4. Cost Calculation

The cost model uses predefined constants for different computational operations.

| Cost Constant | Value |
|---|---:|
| Sequential Page Read | 1.0 |
| Random Page Read | 4.0 |
| CPU Tuple Processing | 0.01 |
| CPU Operator Processing | 0.0025 |
| Rows Per Page | 50 |

It estimates the cost of operations such as:

- Sequential scans.
- Index scans.
- Filtering.
- Joins.
- Sorting.
- Aggregation.
- DISTINCT processing.
- Projection.

The individual operation costs are combined to calculate an overall estimated query cost.

### 5. Query Scoring

The application converts the estimated cost into a score between 1 and 100.

The score is categorized as:

| Score | Category |
|---|---|
| 75–100 | Low |
| 45–74 | Moderate |
| 1–44 | High |

A higher score indicates a more efficient estimated query plan within the model.

**Important:** The estimated cost and execution plan are produced by a simulated cost model, not by an actual PostgreSQL, MySQL, or Oracle query optimizer. Execution time measures the browser-side JavaScript execution and is not a real database-server execution benchmark.

---

## 📚 Learning Module

QueryLens includes a dedicated learning section covering SQL query processing and optimization concepts.

The learning module helps users understand:

- SQL fundamentals.
- Database query processing.
- Query execution plans.
- Sequential scans and index scans.
- Cardinality and selectivity.
- Indexing concepts.
- Query optimization strategies.
- How database management systems estimate query costs.

It also includes an educational video and external learning resources, including:

- [SQLite Query Planner](https://www.sqlite.org/queryplanner.html)
- [SQLite EXPLAIN QUERY PLAN](https://www.sqlite.org/eqp.html)
- [PostgreSQL Planner Statistics](https://www.postgresql.org/docs/current/planner-stats.html)
- [W3Schools SQL](https://www.w3schools.com/sql/)
- [GeeksforGeeks DBMS](https://www.geeksforgeeks.org/dbms/)

---

## 📝 Competitive Exam Preparation – GATE DBMS

The application includes a dedicated competitive examination module containing **50 GATE DBMS practice questions with answers and explanations**.

Questions are organized into seven sections:

| Section | Topics | Questions |
|---|---|---:|
| A | ER Model and Relational Model | 1–3 |
| B | Functional Dependencies and Normalization | 4–10 |
| C | SQL Queries and Filtering | 11–20 |
| D | Relational Algebra and Joins | 21–27 |
| E | Transactions and Concurrency | 28–36 |
| F | File Organization and Indexing | 37–43 |
| G | Query Processing and Recovery | 44–50 |

### Features

- 50-question DBMS question bank.
- Search questions using keywords, topics, and examination years.
- Filter questions by topic or section.
- Multiple-choice questions.
- Immediate answer feedback.
- Explanations for individual questions.
- Attempt tracking and score calculation.
- Reset attempts functionality.
- Download all 50 questions as a text file.

---

## 🎯 Interactive Quiz Module

QueryLens also provides an interactive quiz system to help users test their DBMS and SQL knowledge.

Users can configure:

- Number of questions.
- Difficulty level.

Available difficulty levels:

- Easy
- Medium
- Hard

### Quiz Features

- Randomized question selection.
- Shuffled answer options.
- Immediate feedback after selecting an answer.
- Correct-answer explanations.
- Score calculation.
- Final performance summary.
- Downloadable quiz results.

The quiz combines questions from the curated examination bank with dynamically generated questions based on the database statistics used by the cost model.

---

## 📂 Project Structure

The repository is organized into the following files:

```text
sqlquerycostanalyser/
│
├── images/
│   ├── ayan.jpg
│   ├── devansh.jpg
│   ├── shaurya.jpg
│   └── guide.jpg
│
├── index.html
├── style.css
├── script.js
├── cost-model.js
├── exam-bank.js
├── quiz.js
│
├── learn.html
├── exam.html
├── quiz.html
├── help.html
├── developed.html
│
├── sample_query.sql
└── README.md
```

### File Descriptions

| File | Description |
|---|---|
| `index.html` | Main QueryLens interface and SQL analyser layout |
| `style.css` | Application styling, layout, themes, and responsive design |
| `script.js` | SQL parsing, browser-side query execution, result rendering, history, reports, and testing |
| `cost-model.js` | Cardinality-aware cost estimation and execution plan generation |
| `exam-bank.js` | Curated GATE DBMS question bank |
| `quiz.js` | Quiz functionality, question generation, scoring, and examination interface |
| `learn.html` | SQL and query optimization learning module |
| `exam.html` | GATE DBMS question bank interface |
| `quiz.html` | Standalone quiz page |
| `help.html` | User guide, SQL reference, examples, and troubleshooting |
| `developed.html` | Project information page |
| `sample_query.sql` | Sample SQL queries for experimentation |
| `images/` | Project images |

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure and layout of the application |
| CSS3 | Styling, responsive design, and visual presentation |
| JavaScript (Vanilla JS) | SQL parsing, query execution, cost estimation, and application logic |
| LocalStorage API | Storing query history and theme preferences |
| File API | Reading uploaded SQL and text files |
| Git | Version control |
| GitHub Pages | Hosting and deployment |

The project is built using native web technologies without requiring a frontend framework or external database server.

---

## 🚀 Getting Started

You can run QueryLens locally by following these steps.

### 1. Clone the Repository

```bash
git clone https://github.com/ayanaslamkhan2005/sqlquerycostanalyser.git
```

### 2. Navigate to the Project Directory

```bash
cd sqlquerycostanalyser
```

### 3. Open the Application

Open `index.html` in your preferred web browser.

Alternatively, use the Live Server extension in Visual Studio Code to serve the project locally.

No package installation, build process, or backend configuration is required.

---

## 📖 How to Use QueryLens

1. Open the [QueryLens website](https://ayanaslamkhan2005.github.io/sqlquerycostanalyser/).
2. Navigate to the **Analyze** section.
3. Enter a supported SQL `SELECT` query in the editor.
4. Alternatively, select one of the predefined demonstration queries.
5. Click **Analyze Query** or press `Ctrl + Enter`.
6. Review the estimated query score and cost metrics.
7. Examine the generated execution plan.
8. Read the optimization recommendations and suggested rewrites.
9. Inspect the returned query results.
10. Download the analysis report if required.

You can also upload `.sql` or `.txt` files containing multiple SQL statements. QueryLens identifies the SELECT statements and allows you to choose which one to analyse.

---

## 🎓 Learning Objectives

This project demonstrates practical concepts related to:

- Database Management Systems.
- SQL query processing and parsing.
- Query optimization.
- Cost-based query estimation.
- Cardinality and selectivity estimation.
- Database indexing.
- Sequential and index scans.
- JOIN algorithms.
- Query execution plans.
- Aggregate operations.
- Browser-based data processing.
- JavaScript programming and DOM manipulation.
- Interactive web application development.

---

## 📄 License

No license has currently been specified for this repository.
