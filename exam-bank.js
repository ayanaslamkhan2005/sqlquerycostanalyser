/* =========================================================
   QUERYLENS — COMPETITIVE EXAM BANK
   50 solved SQL / DBMS questions for GATE preparation

   TAG HONESTY
   -----------
   verified:false  — GATE-style practice question written to
                     match the syllabus. NOT a verbatim past
                     paper question. The "exam" field records
                     the paper whose CONCEPT it paraphrases,
                     where a source reported one.
   verified:true   — reserved for questions cross-checked
                     against an official GATE paper and key.
                     None are currently marked true.

   Before presenting any year label as fact, verify it against
   the official GATE question papers and answer keys.
========================================================= */

const EXAM_BANK = [

  /* ---------- PART A — SQL (paraphrased PYQ concepts) ---------- */

  {
    q:"In relational algebra, which operation is equivalent to the SQL WHERE clause when it filters rows according to a condition?",
    options:["Projection","Selection","Union","Cartesian product"],
    answer:1,
    explanation:"Selection, denoted σ, chooses rows satisfying a condition. For example SELECT * FROM Student WHERE marks > 80 selects students scoring above 80. Projection, denoted π, chooses columns instead.",
    exam:"GATE CSE 2015 Set 1",
    verified:false,
    tag:"GATE CSE 2015 Set 1 (concept)",
    topic:"relational", difficulty:"easy"
  },
  {
    q:"Consider two tables Book(isbn, bname) and Stock(isbn, copies). Which join preserves all rows from both tables, including unmatched rows?",
    options:["INNER JOIN","LEFT OUTER JOIN","RIGHT OUTER JOIN","FULL OUTER JOIN"],
    answer:3,
    explanation:"An inner join returns only matching rows. A left join preserves every row from the left table, a right join every row from the right. A full outer join preserves all rows from both sides and fills the missing side with NULL.",
    exam:"GATE CSE 2018",
    verified:false,
    tag:"GATE CSE 2018 (concept)",
    topic:"joins", difficulty:"easy"
  },
  {
    q:"Given Cinema(theater, address, capacity), which condition retrieves theaters whose capacity is the maximum?",
    options:[
      "WHERE capacity = MAX(capacity)",
      "WHERE capacity >= ALL (SELECT capacity FROM Cinema)",
      "WHERE capacity > ALL (SELECT capacity FROM Cinema)",
      "WHERE capacity = MIN(capacity)"
    ],
    answer:1,
    explanation:">= ALL requires the capacity to be at least every capacity in the table, which is exactly the maximum, and ties are included. Option A illegally uses an aggregate directly in WHERE. Option C excludes the maximum, because no value can be strictly greater than itself.",
    exam:"GATE CSE 2015 Set 3",
    verified:false,
    tag:"GATE CSE 2015 Set 3 (concept)",
    topic:"subqueries", difficulty:"medium"
  },
  {
    q:"Which statement about SQL GROUP BY and HAVING is correct?",
    options:[
      "HAVING is always illegal without GROUP BY",
      "Every GROUP BY column must appear in SELECT",
      "HAVING can be used without an explicit GROUP BY",
      "WHERE and HAVING are always interchangeable"
    ],
    answer:2,
    explanation:"SQL permits HAVING without an explicit GROUP BY, treating the whole result as a single group in aggregate contexts. Grouping columns need not all appear in SELECT. WHERE filters rows before grouping; HAVING filters groups after aggregation.",
    exam:"GATE CSE 2012",
    verified:false,
    tag:"GATE CSE 2012 (concept)",
    topic:"aggregates", difficulty:"medium"
  },
  {
    q:"A table R(a, b, c) has the composite primary key (a, b). Which declaration correctly references that key from another table?",
    options:[
      "FOREIGN KEY (a) REFERENCES R",
      "FOREIGN KEY (a, b) REFERENCES R(a, b)",
      "FOREIGN KEY (c) REFERENCES R(a, b)",
      "FOREIGN KEY (a, b, c) REFERENCES R(a, b)"
    ],
    answer:1,
    explanation:"A foreign key referencing a composite primary key must match the complete referenced key, in both the number and the order of columns. A single column cannot reference a two-column primary key unless that column independently carries a suitable unique or primary-key constraint.",
    exam:"GATE CSE 2014 Set 1",
    verified:false,
    tag:"GATE CSE 2014 Set 1 (concept)",
    topic:"constraints", difficulty:"medium"
  },
  {
    q:"Given Passenger(pid, pname, age) and Reservation(pid, class, tid), which condition finds reservations made by passengers older than 65?",
    options:[
      "EXISTS (SELECT * FROM Passenger WHERE age > 65)",
      "EXISTS (SELECT * FROM Passenger P WHERE P.age > 65 AND P.pid = Reservation.pid)",
      "Reservation.pid = Passenger.age",
      "NOT EXISTS (SELECT * FROM Passenger WHERE age > 65)"
    ],
    answer:1,
    explanation:"The subquery must be correlated with the current reservation through P.pid = Reservation.pid. Without that equality, option A merely checks whether any passenger over 65 exists anywhere, which would wrongly include every reservation.",
    exam:"GATE CSE 2010",
    verified:false,
    tag:"GATE CSE 2010 (concept)",
    topic:"subqueries", difficulty:"medium"
  },
  {
    q:"Students contains 120 tuples and Enroll contains 8 tuples. What are the general upper and lower bounds on the number of tuples in their natural join, with no additional constraints given?",
    options:[
      "Maximum 128, minimum 0",
      "Maximum 960, minimum 0",
      "Maximum 120, minimum 8",
      "Maximum 960, minimum 8"
    ],
    answer:1,
    explanation:"In the worst case every tuple of one relation matches every tuple of the other, giving 120 × 8 = 960. If no join values match at all, the result may contain zero tuples.",
    exam:"GATE CSE 2004",
    verified:false,
    tag:"GATE CSE 2004 (concept)",
    topic:"joins", difficulty:"medium"
  },
  {
    q:"SELECT deptId, COUNT(*) FROM emp WHERE gender = 'female' AND salary > (SELECT AVG(salary) FROM emp) GROUP BY deptId; — what does this count?",
    options:[
      "All employees in each department",
      "Female employees whose salary is below the average",
      "Female employees whose salary is above the overall average, grouped by department",
      "Departments whose average salary exceeds the overall average"
    ],
    answer:2,
    explanation:"The subquery computes the average salary across the whole emp table. WHERE filters by gender and salary before GROUP BY forms the departmental groups. COUNT(*) then counts the qualifying rows within each department.",
    exam:"GATE CSE 2021 Set 2",
    verified:false,
    tag:"GATE CSE 2021 Set 2 (concept)",
    topic:"aggregates", difficulty:"medium"
  },
  {
    q:"A Student table contains three rows with names Raj, Rohit and Raj. Each student has at least one performance record. A query groups the joined rows by Student_Name and computes SUM(Marks). How many output rows are produced?",
    options:["1","2","3","One per performance record"],
    answer:1,
    explanation:"Grouping uses the VALUE of Student_Name, not the number of student records. Both Raj rows fall into one group and Rohit into another, producing two groups.",
    exam:"GATE CSE 2015 Set 1",
    verified:false,
    tag:"GATE CSE 2015 Set 1 (concept)",
    topic:"aggregates", difficulty:"medium"
  },
  {
    q:"Which expression is logically closest to SELECT * FROM R WHERE a IN (SELECT a FROM S); ?",
    options:[
      "SELECT R.* FROM R WHERE EXISTS (SELECT * FROM S WHERE S.a = R.a)",
      "SELECT R.* FROM R WHERE NOT EXISTS (SELECT * FROM S WHERE S.a = R.a)",
      "SELECT * FROM R CROSS JOIN S",
      "SELECT * FROM R WHERE a NOT IN (SELECT a FROM S)"
    ],
    answer:0,
    explanation:"IN tests membership. The correlated EXISTS tests whether at least one row of S matches the current R.a. Both return each qualifying R row exactly once, even when several S rows share that value — unlike a join, which would duplicate.",
    exam:"GATE CSE 2014 Set 2",
    verified:false,
    tag:"GATE CSE 2014 Set 2 (concept)",
    topic:"subqueries", difficulty:"medium"
  },
  {
    q:"Every employee is a sales representative for at least one customer. Which clause returns employees for whom no customer has a rating other than 'GOOD'?",
    options:[
      "WHERE EXISTS (SELECT * FROM customer C WHERE C.salesRepId = E.empId AND C.rating <> 'GOOD')",
      "WHERE NOT EXISTS (SELECT * FROM customer C WHERE C.salesRepId = E.empId AND C.rating <> 'GOOD')",
      "WHERE E.empId IS NULL",
      "WHERE C.rating = 'GOOD'"
    ],
    answer:1,
    explanation:"NOT EXISTS is true only when the subquery returns no rows, so the employee is included when no associated customer violates the rating condition. The stated assumption that every employee has at least one customer prevents customer-less employees from qualifying vacuously.",
    exam:"GATE CSE 2014 Set 3",
    verified:false,
    tag:"GATE CSE 2014 Set 3 (concept)",
    topic:"subqueries", difficulty:"hard"
  },
  {
    q:"A table has five rows and column bonus contains 100, NULL, 200, NULL, 300. What do COUNT(*) and COUNT(bonus) return?",
    options:["3 and 5","5 and 3","5 and 5","3 and 3"],
    answer:1,
    explanation:"COUNT(*) counts every row including those with NULLs, giving 5. COUNT(bonus) counts only non-NULL values, giving 3.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"nulls", difficulty:"easy"
  },
  {
    q:"Which condition correctly identifies rows where salary has no value?",
    options:["salary = NULL","salary <> NULL","salary IS NULL","salary == NULL"],
    answer:2,
    explanation:"SQL uses three-valued logic: TRUE, FALSE and UNKNOWN. A comparison such as salary = NULL evaluates to UNKNOWN, never TRUE. Only IS NULL and IS NOT NULL test for nullness.",
    exam:"GATE CSE 2000",
    verified:false,
    tag:"GATE CSE 2000 (concept)",
    topic:"nulls", difficulty:"easy"
  },
  {
    q:"Which query removes duplicate pairs of values from the result?",
    options:[
      "SELECT a, b FROM R",
      "SELECT DISTINCT a, b FROM R",
      "SELECT UNIQUE ROWS a, b FROM R",
      "SELECT ALL DISTINCT a, b FROM R"
    ],
    answer:1,
    explanation:"DISTINCT removes duplicate result tuples based on the ENTIRE selected combination (a, b). Two rows sharing a but differing in b remain separate rows.",
    exam:"GATE CSE 1999",
    verified:false,
    tag:"GATE CSE 1999 (concept)",
    topic:"sql", difficulty:"easy"
  },
  {
    q:"For a table containing no rows, which aggregate normally returns zero rather than NULL?",
    options:["COUNT(*)","SUM(amount)","AVG(amount)","MAX(amount)"],
    answer:0,
    explanation:"COUNT(*) returns 0 on an empty input. SUM, AVG, MIN and MAX all return NULL for an empty set — a frequently tested edge case.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"aggregates", difficulty:"medium"
  },
  {
    q:"If a subquery used by NOT IN returns at least one NULL, what is the main danger?",
    options:[
      "The query always returns every row",
      "The condition may evaluate to UNKNOWN, excluding otherwise expected rows",
      "SQL automatically deletes the null row",
      "NOT IN becomes equivalent to EXISTS"
    ],
    answer:1,
    explanation:"If R.x = 5 and the subquery returns (1, NULL), then 5 NOT IN (1, NULL) expands to 5 <> 1 AND 5 <> NULL. The second comparison is UNKNOWN, so the conjunction is never TRUE and the row is dropped. Prefer NOT EXISTS with an explicit equality.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"nulls", difficulty:"hard"
  },
  {
    q:"Department 5 has salaries 30,000 and 50,000. Which condition finds employees earning more than every salary in that department?",
    options:[
      "salary > ANY (SELECT salary FROM employee WHERE department = 5)",
      "salary >= ANY (SELECT salary FROM employee WHERE department = 5)",
      "salary > ALL (SELECT salary FROM employee WHERE department = 5)",
      "salary < ALL (SELECT salary FROM employee WHERE department = 5)"
    ],
    answer:2,
    explanation:"> ALL means greater than every returned value, so the employee must earn more than 50,000. > ANY only requires exceeding at least one value, which 40,000 would satisfy.",
    exam:"GATE CSE 2007",
    verified:false,
    tag:"GATE CSE 2007 (concept)",
    topic:"subqueries", difficulty:"medium"
  },
  {
    q:"Two derived tables share a common column Bank_Manager. What does a NATURAL JOIN do?",
    options:[
      "Joins on every column regardless of name",
      "Joins on all same-named columns and removes the duplicate copies of those join columns",
      "Joins only rows with identical primary keys",
      "Always returns the Cartesian product"
    ],
    answer:1,
    explanation:"A natural join matches equal values across all identically named columns and projects away the duplicate copy. Those columns need not be keys. If no common columns exist at all, the natural join degenerates into a Cartesian product.",
    exam:"GATE CSE 2011",
    verified:false,
    tag:"GATE CSE 2011 (concept)",
    topic:"joins", difficulty:"medium"
  },
  {
    q:"Balances are 100, 100 and 80. Under the rule that ties share a rank and subsequent ranks are skipped, what is the rank sequence?",
    options:["1, 1, 2","1, 2, 3","1, 1, 3","2, 2, 3"],
    answer:2,
    explanation:"The two largest balances tie at rank 1, so rank 2 is skipped and the next value receives rank 3. This is the behaviour of RANK(); DENSE_RANK() would instead produce 1, 1, 2.",
    exam:"GATE CSE 2006",
    verified:false,
    tag:"GATE CSE 2006 (concept)",
    topic:"sql", difficulty:"medium"
  },
  {
    q:"A query wraps NOT EXISTS around the set difference between all courses offered by a department and the courses a student registered for. What does it test?",
    options:[
      "The student registered for at least one course",
      "The student registered for no courses",
      "The student registered for every course in that department",
      "The student registered only for courses in another department"
    ],
    answer:2,
    explanation:"The difference holds the department's courses the student has NOT registered for. If that set is empty, nothing is missing, so the student took them all. This double-negation pattern is the standard way to express a universal quantifier in SQL.",
    exam:"GATE CSE 2022",
    verified:false,
    tag:"GATE CSE 2022 (concept)",
    topic:"subqueries", difficulty:"hard"
  },

  /* ---------- PART B — SQL and relational practice ---------- */

  {
    q:"Which query correctly finds departments with more than 10 employees?",
    options:[
      "SELECT dept, COUNT(*) FROM Emp WHERE COUNT(*) > 10 GROUP BY dept;",
      "SELECT dept, COUNT(*) FROM Emp GROUP BY dept HAVING COUNT(*) > 10;",
      "SELECT dept, COUNT(*) FROM Emp HAVING dept > 10;",
      "SELECT dept FROM Emp WHERE dept > 10;"
    ],
    answer:1,
    explanation:"COUNT(*) is an aggregate computed per group, so it can only be filtered after grouping — that is HAVING's job. WHERE runs before grouping and therefore cannot reference a group aggregate.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"aggregates", difficulty:"easy"
  },
  {
    q:"A table contains salaries 20, 20 and 30. What does COUNT(DISTINCT salary) return?",
    options:["1","2","3","70"],
    answer:1,
    explanation:"The distinct non-NULL values are 20 and 30, so the result is 2. Plain COUNT(salary) would return 3.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"aggregates", difficulty:"easy"
  },
  {
    q:"Query 1 returns (1, 2) and Query 2 returns (2, 3). How many rows does Query1 UNION Query2 produce?",
    options:["2","3","4","1"],
    answer:1,
    explanation:"UNION concatenates the results and then eliminates duplicates, giving {1, 2, 3} = 3 rows. UNION ALL would keep both copies of 2 and return 4 rows.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"sql", difficulty:"easy"
  },
  {
    q:"Relation R has 4 tuples and relation S has 6 tuples. How many tuples are in R × S?",
    options:["10","24","6","4"],
    answer:1,
    explanation:"The Cartesian product pairs each tuple of R with every tuple of S, giving 4 × 6 = 24 tuples.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"relational", difficulty:"easy"
  },
  {
    q:"R(A) contains the values (1, 1, 2) and S(A) contains (1, 2, 2). How many rows does R JOIN S ON R.A = S.A produce?",
    options:["2","3","4","6"],
    answer:2,
    explanation:"For value 1 there are 2 rows in R and 1 in S, giving 2 × 1 = 2 matches. For value 2 there is 1 row in R and 2 in S, giving 1 × 2 = 2 matches. Total = 4.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"joins", difficulty:"medium"
  },
  {
    q:"A contains IDs {1, 2, 3} and B contains IDs {2, 3, 4}. How many rows result from A LEFT JOIN B ON A.id = B.id?",
    options:["1","2","3","4"],
    answer:2,
    explanation:"A left outer join preserves every row of A. IDs 2 and 3 match; ID 1 is preserved with NULLs in B's columns. ID 4 from B is discarded. Output = 3 rows.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"joins", difficulty:"easy"
  },
  {
    q:"Employee(empId, managerId) stores employee–manager relationships. Which operation retrieves each employee's manager name from the same table?",
    options:[
      "Self-join using two aliases",
      "Cartesian product without a condition",
      "UNION the table with itself",
      "GROUP BY managerId only"
    ],
    answer:0,
    explanation:"Use Employee E JOIN Employee M ON E.managerId = M.empId. The first alias represents the employee row and the second the manager row, with the join condition linking them.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"joins", difficulty:"easy"
  },
  {
    q:"A scalar subquery used as salary > (subquery) returns two rows. What is the normal result?",
    options:[
      "SQL automatically selects the larger row",
      "The comparison is valid and uses both rows",
      "A scalar-subquery cardinality error occurs",
      "SQL silently discards both rows"
    ],
    answer:2,
    explanation:"A subquery in a scalar comparison must return at most one row and one column. Returning more raises a cardinality error. Use MAX, MIN, or an explicit ANY/ALL comparison when multiple values are intended.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"subqueries", difficulty:"medium"
  },
  {
    q:"What makes a subquery correlated?",
    options:[
      "It contains an aggregate function",
      "It references a column from the outer query",
      "It contains DISTINCT",
      "It returns exactly one row"
    ],
    answer:1,
    explanation:"A correlated subquery references values from the outer query and is therefore logically re-evaluated for each outer row. Optimisers often rewrite such subqueries into semi-joins.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"subqueries", difficulty:"easy"
  },
  {
    q:"What does EXISTS (SELECT ...) test?",
    options:[
      "Whether the subquery returns at least one row",
      "Whether the subquery returns exactly one row",
      "Whether every value is non-null",
      "Whether the subquery returns a numeric value greater than zero"
    ],
    answer:0,
    explanation:"EXISTS depends only on whether any row is returned; the selected values are irrelevant, so SELECT 1 works fine. NOT EXISTS is true when the subquery returns no rows at all.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"subqueries", difficulty:"easy"
  },
  {
    q:"Which LIKE pattern matches every string beginning with A?",
    options:["LIKE '%A'","LIKE 'A%'","LIKE '_A'","LIKE '%A%'"],
    answer:1,
    explanation:"% matches zero or more characters and _ matches exactly one. So 'A%' matches strings starting with A, '%A' those ending with A, and '%A%' those containing A anywhere.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"sql", difficulty:"easy"
  },
  {
    q:"Which values satisfy marks BETWEEN 60 AND 80?",
    options:[
      "Only values strictly greater than 60 and strictly less than 80",
      "Values from 60 through 80, including both endpoints",
      "Values below 60 or above 80",
      "Only 60 and 80"
    ],
    answer:1,
    explanation:"BETWEEN x AND y is inclusive and is exactly equivalent to marks >= 60 AND marks <= 80, so both endpoints qualify.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"sql", difficulty:"easy"
  },
  {
    q:"What does ORDER BY salary DESC do?",
    options:[
      "Sorts salaries in ascending order",
      "Sorts salaries in descending order",
      "Removes duplicate salaries",
      "Groups equal salaries"
    ],
    answer:1,
    explanation:"DESC sorts from larger values to smaller. ASC sorts ascending and is the default when no direction is given.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"sql", difficulty:"easy"
  },
  {
    q:"Column x contains 10, NULL and 20. What does AVG(x) return?",
    options:["10","15","10, because NULL is treated as zero","NULL, because one value is null"],
    answer:1,
    explanation:"SQL aggregates ignore NULLs entirely. AVG computes (10 + 20) / 2 = 15 — it divides by the count of non-NULL values, not by the row count.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"nulls", difficulty:"medium"
  },
  {
    q:"Which property must a primary key satisfy?",
    options:[
      "It may contain duplicate values",
      "It must be non-null and unique",
      "It must always be a single integer column",
      "It must reference another table"
    ],
    answer:1,
    explanation:"A primary key uniquely identifies each row, so its values can be neither NULL nor duplicated. It may span multiple columns and need not be an integer.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"constraints", difficulty:"easy"
  },
  {
    q:"Orders.customerId is a foreign key referencing Customer.customerId. Which insertion is valid under ordinary foreign-key rules?",
    options:[
      "Insert an order with a non-null customer ID absent from Customer",
      "Insert an order referencing an existing customer ID",
      "Insert an order referencing two customer IDs in one scalar column",
      "Insert an order referencing a nonexistent customer while the constraint is enforced"
    ],
    answer:1,
    explanation:"A non-null foreign-key value must match an existing referenced key. A missing referenced row violates referential integrity. A nullable foreign key may be NULL unless other constraints forbid it.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"constraints", difficulty:"easy"
  },
  {
    q:"In Enrollment(studentId, courseId) the pair (studentId, courseId) is the primary key. Which statement is correct?",
    options:[
      "A student may appear only once in the entire table",
      "A course may appear only once in the entire table",
      "The same student–course pair cannot appear twice",
      "Neither column may repeat individually"
    ],
    answer:2,
    explanation:"Uniqueness applies to the COMBINATION. A student may enrol in many courses and a course may hold many students, but the same pair cannot be recorded twice.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"constraints", difficulty:"medium"
  },
  {
    q:"A candidate key is:",
    options:[
      "Any attribute containing a numeric value",
      "A minimal set of attributes that uniquely identifies each tuple",
      "Every attribute in the relation",
      "A foreign key referencing another relation"
    ],
    answer:1,
    explanation:"A candidate key must be both unique and minimal — removing any attribute must destroy uniqueness. One candidate key is chosen as the primary key; the rest are alternate keys.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"normalization", difficulty:"easy"
  },
  {
    q:"Given the functional dependency A → B, what does it mean?",
    options:[
      "Every value of B determines exactly one value of A",
      "Equal values of A must imply equal values of B",
      "A and B must both be primary keys",
      "A and B must always have different values"
    ],
    answer:1,
    explanation:"A → B means the value of A uniquely determines the value of B. Several rows may share an A value, but all such rows must agree on B. The dependency is not symmetric.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"normalization", difficulty:"medium"
  },
  {
    q:"Which condition is associated with first normal form (1NF)?",
    options:[
      "Every table must have exactly two columns",
      "Attribute values must be atomic, without repeating groups",
      "Every non-key attribute must depend on the entire key",
      "Every non-key attribute must depend directly on the primary key and nothing else"
    ],
    answer:1,
    explanation:"1NF requires atomic attribute values with no repeating groups or nested relations. Option C states the 2NF requirement and option D gestures at 3NF.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"normalization", difficulty:"easy"
  },
  {
    q:"A relation is in 2NF if it is in 1NF and:",
    options:[
      "It has no foreign keys",
      "It has no partial dependency of a non-prime attribute on a proper subset of a candidate key",
      "Every determinant is a superkey",
      "It contains no functional dependencies"
    ],
    answer:1,
    explanation:"A partial dependency occurs when a non-prime attribute depends on only part of a composite candidate key. Eliminating these is precisely what separates 2NF from 1NF. Option C describes BCNF.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"normalization", difficulty:"medium"
  },
  {
    q:"Which condition is sufficient for a relation to be in BCNF?",
    options:[
      "Every determinant of a non-trivial functional dependency is a superkey",
      "Every attribute is numeric",
      "Every relation has exactly one candidate key",
      "Every non-key attribute depends on only one column"
    ],
    answer:0,
    explanation:"BCNF requires that for every non-trivial dependency X → Y, X is a superkey. This is strictly stronger than 3NF, which additionally permits dependencies whose right-hand side consists of prime attributes.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"normalization", difficulty:"hard"
  },
  {
    q:"R(A, B, C) is decomposed into R1(A, B) and R2(B, C). Which condition guarantees a lossless decomposition under the binary-decomposition test?",
    options:[
      "A → C",
      "B → A or B → C",
      "A → B only",
      "No functional dependencies hold"
    ],
    answer:1,
    explanation:"The common attribute is B. A binary decomposition is lossless if the common attributes functionally determine all attributes of at least one fragment. B → A makes B a key for R1; B → C makes it a key for R2.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"normalization", difficulty:"hard"
  },
  {
    q:"Which relational algebra expression selects students whose marks exceed 80?",
    options:["π(marks>80)(Student)","σ(marks>80)(Student)","Student × marks>80","ρ(marks>80)(Student)"],
    answer:1,
    explanation:"Selection σ filters tuples by a predicate. Projection π chooses attributes, × is the Cartesian product and ρ is rename.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"relational", difficulty:"easy"
  },
  {
    q:"Which expression retrieves only the name attribute from Student?",
    options:["σ(name)(Student)","π(name)(Student)","Student ⋈ name","ρ(name)(Student)"],
    answer:1,
    explanation:"Projection π selects columns. Note that classical relational algebra eliminates duplicates from the projection, whereas SQL retains them unless DISTINCT is specified.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"relational", difficulty:"easy"
  },

  /* ---------- PART C — Broader DBMS ---------- */

  {
    q:"Which ACID property ensures that a transaction either completes entirely or has no effect?",
    options:["Consistency","Isolation","Atomicity","Durability"],
    answer:2,
    explanation:"Atomicity treats a transaction as one indivisible unit. If a bank transfer debits one account but fails before crediting the other, the whole transaction rolls back. Consistency preserves constraints, Isolation governs concurrent interaction, Durability guarantees committed changes survive failure.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"transactions", difficulty:"easy"
  },
  {
    q:"A precedence graph for a transaction schedule contains a directed cycle. What can be concluded?",
    options:[
      "The schedule is conflict-serializable",
      "The schedule is not conflict-serializable",
      "The schedule must be recoverable",
      "The schedule contains no conflicting operations"
    ],
    answer:1,
    explanation:"A schedule is conflict-serializable if and only if its precedence graph is acyclic. A cycle means the transactions impose mutually incompatible ordering constraints, so no equivalent serial order exists.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"transactions", difficulty:"medium"
  },
  {
    q:"What is a key characteristic of a B+ tree index?",
    options:[
      "All records must be stored in the root node",
      "Search keys and record pointers are stored at the leaves, which are linked for sequential access",
      "Every internal node must have exactly two children",
      "It cannot support range queries efficiently"
    ],
    answer:1,
    explanation:"B+ trees keep a balanced structure where internal nodes only guide the search and the leaves hold data entries, linked together. That linkage is exactly what makes range scans efficient.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"indexing", difficulty:"medium"
  },
  {
    q:"Why is a clustered index often useful for a range query over consecutive key values?",
    options:[
      "It eliminates the need for all storage",
      "Related records are stored in an order that can reduce the I/O needed to retrieve the range",
      "It guarantees that every query runs in constant time",
      "It prevents insertions into the table"
    ],
    answer:1,
    explanation:"When rows are physically ordered by the indexed key, a range retrieval reads neighbouring pages sequentially rather than issuing scattered random reads. There can be at most one clustered index per table.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"indexing", difficulty:"medium"
  },
  {
    q:"A table stores StudentID, StudentName, DepartmentID and DepartmentName, with StudentID → DepartmentID and DepartmentID → DepartmentName. What is the main reason to decompose it?",
    options:[
      "To introduce duplicate department names",
      "To remove a transitive dependency and reduce update anomalies",
      "To make StudentID cease being a key",
      "To eliminate all joins from the database"
    ],
    answer:1,
    explanation:"DepartmentName is transitively dependent on StudentID via DepartmentID, which violates 3NF. Splitting into Student(StudentID, StudentName, DepartmentID) and Department(DepartmentID, DepartmentName) stores each department name once, preventing inconsistent updates.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"normalization", difficulty:"medium"
  },

  /* ---------- Query optimisation (keeps the project topic represented) ---------- */

  {
    q:"A relation has 20,000 tuples at 10 tuples per block. A linear search for a non-key equality match costs how many block transfers in the worst case?",
    options:["1000","2000","100","20000"],
    answer:1,
    explanation:"20,000 / 10 = 2,000 blocks. Because the attribute is not a key, matching tuples may appear anywhere, so all 2,000 blocks must be read. For a key attribute the average would be about half.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"cost", difficulty:"medium"
  },
  {
    q:"Which rule is a valid heuristic in relational-algebra query optimisation?",
    options:[
      "Perform Cartesian products before selections",
      "Push selections down as close to the leaves as possible",
      "Perform projections only at the root of the tree",
      "Always materialise every intermediate relation"
    ],
    answer:1,
    explanation:"Pushing selections toward the leaves shrinks intermediate relations early, which is the single most effective heuristic transformation. The other three options all increase intermediate sizes.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"optimization", difficulty:"easy"
  },
  {
    q:"SELECT name FROM emp WHERE UPPER(dept) = 'SALES'; performs poorly despite an index on dept. Why?",
    options:[
      "UPPER is not a valid SQL function",
      "Applying a function to the indexed column makes the predicate non-sargable",
      "The index is corrupted",
      "String comparison is never indexed"
    ],
    answer:1,
    explanation:"Wrapping the column in a function destroys the ordering the B+ tree relies on, so no seek is possible. Fix it with a functional index on UPPER(dept), or restructure the comparison to leave the column bare.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"optimization", difficulty:"medium"
  },
  {
    q:"For independent predicates P1 (selectivity 0.1) and P2 (selectivity 0.2), what is the selectivity of P1 OR P2?",
    options:["0.3","0.02","0.28","0.12"],
    answer:2,
    explanation:"By inclusion–exclusion, P(A ∪ B) = 1 − (1 − 0.1)(1 − 0.2) = 1 − 0.72 = 0.28. Simply adding to 0.3 would double-count the overlap.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"selectivity", difficulty:"medium"
  },
  {
    q:"A query returns 9 million of a table's 10 million rows. Which access path will the optimiser most likely choose?",
    options:["Index scan","Sequential scan","Nested loop","Bitmap index scan only"],
    answer:1,
    explanation:"At high selectivity, scattered random index lookups cost far more than reading the table sequentially. The crossover typically sits around 5–20% of rows.",
    exam:null,
    verified:false,
    tag:"GATE-style Practice",
    topic:"optimization", difficulty:"medium"
  }

];