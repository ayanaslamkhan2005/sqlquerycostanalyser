/* =========================================================
   QUERYLENS — COMPETITIVE EXAM BANK
   50 GATE DBMS PYQs — Answers and Solutions
   Complete revision set across every DBMS topic
   ========================================================= */

const EXAM_BANK = [
  {
    "id": 1,
    "q": "Which statement about a weak entity is correct?",
    "options": [
      "It always has a standalone primary key.",
      "It depends on an owner entity for identification.",
      "It cannot have attributes.",
      "It cannot participate in relationships."
    ],
    "answer": 1,
    "explanation": "A weak entity is identified using its partial key together with the key of its owner entity. It cannot exist without its identifying (owner) entity set.",
    "exam": "GATE 2024, Set 2",
    "tag": "GATE 2024 Set 2",
    "section": "A. ER model and relational model",
    "topic": "relational",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 2,
    "q": "An ER specification says instructors teach courses, students register for courses, courses are assigned classrooms, and instructors guide students. What should an ER diagram represent?",
    "options": [
      "Only student and instructor relationships",
      "All four relationships, with the correct participating entity sets and cardinalities from the original specification",
      "Classrooms as attributes of courses without a relationship",
      "Guide and teach combined into a single relationship"
    ],
    "answer": 1,
    "explanation": "All four relationships, with the correct participating entity sets and cardinalities from the original specification. An ER model must preserve each stated relationship; one relationship cannot be inferred from another unless explicitly specified.",
    "exam": "GATE 2024, Set 1",
    "tag": "GATE 2024 Set 1",
    "section": "A. ER model and relational model",
    "topic": "relational",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 3,
    "q": "What is the degree (arity) of a relation in the relational model?",
    "options": [
      "The number of tuples (rows) in the relation",
      "The number of attributes (columns) in the relation",
      "The cardinality of the candidate key",
      "The count of foreign key constraints"
    ],
    "answer": 1,
    "explanation": "The degree (arity) is the number of attributes (columns) in the relation. A relation with attributes A, B, C, D has degree 4, regardless of how many tuples it contains.",
    "exam": "GATE 2022",
    "tag": "GATE 2022",
    "section": "A. ER model and relational model",
    "topic": "relational",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 4,
    "q": "Given functional dependencies P → R and Q → S, which dependency must hold?",
    "options": [
      "PQ → RS",
      "P → QS",
      "R → P",
      "RS → PQ"
    ],
    "answer": 0,
    "explanation": "PQ → RS. By Armstrong's Augmentation rule, P → R implies PQ → RQ, and Q → S implies RQ → RS. By Transitivity (or Union rule with PQ → R and PQ → S), PQ → RS must hold.",
    "exam": "GATE 2026, Set 1",
    "tag": "GATE 2026 Set 1",
    "section": "B. Functional dependencies and normalization",
    "topic": "normalization",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 5,
    "q": "Can a relation in First Normal Form (1NF) have a composite candidate key?",
    "options": [
      "No, 1NF permits only single-attribute primary keys",
      "Yes, 1NF requires atomic values, not single-attribute keys",
      "No, composite candidate keys are only allowed in 2NF and higher",
      "Only if all attributes in the key are numeric"
    ],
    "answer": 1,
    "explanation": "Yes. 1NF requires all attribute values to be atomic (no repeating groups or multi-valued attributes), and imposes no restriction prohibiting composite candidate keys.",
    "exam": "GATE 2024, Set 1",
    "tag": "GATE 2024 Set 1",
    "section": "B. Functional dependencies and normalization",
    "topic": "normalization",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 6,
    "q": "For R(A, B, C, D, E), let the functional dependencies be AB → C, BC → D, and C → E. Find the number of superkeys.",
    "options": [
      "4",
      "6",
      "8",
      "16"
    ],
    "answer": 2,
    "explanation": "8. Both A and B must be present in every key because neither appears on any right-hand side. Computing the closure: (AB)+ = {A, B, C, D, E}. Hence, AB is the only candidate key. Any superset of AB is a superkey. With 3 remaining attributes (C, D, E), the number of subsets is 2^3 = 8.",
    "exam": "GATE 2022",
    "tag": "GATE 2022",
    "section": "B. Functional dependencies and normalization",
    "topic": "normalization",
    "difficulty": "hard",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 7,
    "q": "Can a relation have more than one foreign key?",
    "options": [
      "No, relational theory strictly restricts each table to at most one foreign key",
      "Yes, a relation can reference multiple relations, and self-referencing foreign keys are also permitted",
      "Only in unnormalized flat tables",
      "Only if all foreign keys reference the same primary table"
    ],
    "answer": 1,
    "explanation": "Yes. A relation can reference multiple other relations (e.g. an Orders table having foreign keys for customer_id and product_id), and a self-referencing foreign key is also permitted.",
    "exam": "GATE 2021, Set 2",
    "tag": "GATE 2021 Set 2",
    "section": "B. Functional dependencies and normalization",
    "topic": "constraints",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 8,
    "q": "A publication relation has key (VOLUME, NUMBER, STARTPAGE, ENDPAGE), with (VOLUME, NUMBER) → YEAR. If the design is decomposed to separate the year, what anomaly is addressed?",
    "options": [
      "Transitive dependency and deletion anomaly",
      "Partial dependency and the associated redundancy",
      "Multivalued dependency",
      "Loss of serializability"
    ],
    "answer": 1,
    "explanation": "Partial dependency and the associated redundancy. YEAR depends on only part of the composite candidate key (VOLUME, NUMBER), violating 2NF. Decomposing it into a separate relation removes that partial dependency.",
    "exam": "GATE 2016, Set 1",
    "tag": "GATE 2016 Set 1",
    "section": "B. Functional dependencies and normalization",
    "topic": "normalization",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 9,
    "q": "What is a prime attribute in relational database design?",
    "options": [
      "Any attribute with a UNIQUE constraint",
      "An attribute that belongs to at least one candidate key",
      "The first column declared in the table schema",
      "An attribute with no NULL values"
    ],
    "answer": 1,
    "explanation": "A prime attribute is an attribute that belongs to at least one candidate key of the relation. Non-prime attributes are those that do not appear in any candidate key.",
    "exam": "GATE 2014, Set 3",
    "tag": "GATE 2014 Set 3",
    "section": "B. Functional dependencies and normalization",
    "topic": "normalization",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 10,
    "q": "Is a lossless, dependency-preserving BCNF decomposition always possible for any relational schema?",
    "options": [
      "Yes, BCNF decomposition always preserves every functional dependency",
      "No, BCNF decomposition can always be lossless but may not preserve every functional dependency",
      "No, BCNF decomposition is neither lossless nor dependency preserving",
      "Yes, provided the relation is already in 3NF"
    ],
    "answer": 1,
    "explanation": "No. A decomposition into BCNF is guaranteed to be lossless-join, but it may not always preserve all functional dependencies (unlike 3NF decomposition, which can always achieve both).",
    "exam": "GATE 1994",
    "tag": "GATE 1994",
    "section": "B. Functional dependencies and normalization",
    "topic": "normalization",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 11,
    "q": "A query selects suppliers whose catalogue cost is greater than the average cost of product P4. Which SQL expression calculates that average?",
    "options": [
      "SELECT AVG(cost) FROM Catalogue WHERE pno = 'P4';",
      "SELECT cost / COUNT(*) FROM Catalogue WHERE pno = 'P4';",
      "SELECT AVG(cost) FROM Catalogue GROUP BY pno;",
      "SELECT SUM(cost) FROM Catalogue WHERE pno = 'P4';"
    ],
    "answer": 0,
    "explanation": "SELECT AVG(cost) FROM Catalogue WHERE pno = 'P4'; WHERE restricts rows to product P4, and AVG(cost) calculates the average over those rows.",
    "exam": "GATE 2020",
    "tag": "GATE 2020",
    "section": "C. SQL",
    "topic": "sql",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 12,
    "q": "Given table Student with rows (Roll, Gender, Marks): (1, 'M', 62), (2, 'F', 70), (3, 'F', 80), (4, 'M', 82), (5, 'F', 65). How many rows are returned by: SELECT * FROM Student WHERE gender = 'F' AND marks > 65;?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": 1,
    "explanation": "2 rows. Female students have marks 70, 80, and 65. The condition marks > 65 is satisfied by rows with marks 70 and 80. A mark of exactly 65 does not satisfy the strict inequality marks > 65.",
    "exam": "GATE 2023",
    "tag": "GATE 2023",
    "section": "C. SQL",
    "topic": "sql",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 13,
    "q": "A query selects students for whom there is no course in department D01 that they have not registered for. What does the query return?",
    "options": [
      "Students registered for at least one course in department D01",
      "Students registered for every course in department D01",
      "Students registered for no courses in department D01",
      "Students registered only for non-D01 courses"
    ],
    "answer": 1,
    "explanation": "Students registered for every course in department D01. The inner set difference identifies courses in D01 not registered for by a student. NOT EXISTS ensures that this set of unregistered courses is empty, which represents relational division (universal quantification / for-all).",
    "exam": "GATE 2022",
    "tag": "GATE 2022",
    "section": "C. SQL",
    "topic": "sql",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 14,
    "q": "An employee query groups female employees whose salaries exceed the overall average salary by department: SELECT deptId, COUNT(*) FROM Employee WHERE gender = 'F' AND salary > (SELECT AVG(salary) FROM Employee) GROUP BY deptId; What does each output row represent?",
    "options": [
      "The total count of all employees in each department",
      "A department and the count of its qualifying female employees",
      "The average salary of female employees in each department",
      "The department with the highest earning female employee"
    ],
    "answer": 1,
    "explanation": "A department and the count of its qualifying female employees. The subquery calculates the overall average salary. WHERE filters female employees who earn more than this average, and GROUP BY deptId groups the qualifying rows.",
    "exam": "GATE 2021, Set 2",
    "tag": "GATE 2021 Set 2",
    "section": "C. SQL",
    "topic": "sql",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 15,
    "q": "Students and courses are connected through an Enrolled relation. How can SQL retrieve the names of students enrolled in a particular course?",
    "options": [
      "Join Students with Enrolled using the student identifier, filter by the course identifier, and select student names",
      "Project student names directly from Students without Enrolled",
      "Cartesian product Students and Enrolled with no condition",
      "Union of Students and Courses"
    ],
    "answer": 0,
    "explanation": "Join Students with Enrolled using the student identifier, filter by the course identifier, and select student names. The enrollment table supplies the many-to-many relationship between students and courses.",
    "exam": "GATE 2025, Set 2",
    "tag": "GATE 2025 Set 2",
    "section": "C. SQL",
    "topic": "joins",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 16,
    "q": "A sports database contains player, team, coach, and members tables. What information does a query joining player and members on pid provide?",
    "options": [
      "Coach assignments for every team",
      "Player information matched with the team-membership records",
      "Teams that currently have no players assigned",
      "Unregistered players and free agents only"
    ],
    "answer": 1,
    "explanation": "Player information matched with the team-membership records. The join matches rows with equal player IDs (pid).",
    "exam": "GATE 2025, Set 1",
    "tag": "GATE 2025 Set 1",
    "section": "C. SQL",
    "topic": "joins",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 17,
    "q": "What is the relational algebra equivalent of a SELECT DISTINCT query using several tables R1, ..., Rn and a WHERE predicate?",
    "options": [
      "π_{selected attributes} ( σ_{predicate} (R1 × ... × Rn) )",
      "σ_{predicate} ( π_{selected attributes} (R1 × ... × Rn) )",
      "π_{selected attributes} ( R1 ∪ ... ∪ Rn )",
      "σ_{predicate} ( R1 ∩ ... ∩ Rn )"
    ],
    "answer": 0,
    "explanation": "π_{selected attributes} ( σ_{predicate} (R1 × ... × Rn) ). The Cartesian product combines relations, selection (σ) applies the predicate, and projection (π) retains the requested attributes. Classical relational algebra removes duplicates by definition.",
    "exam": "GATE 2003",
    "tag": "GATE 2003",
    "section": "C. SQL",
    "topic": "relational",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 18,
    "q": "What does an INNER JOIN return when matching keys exist in both tables?",
    "options": [
      "All rows from both tables, filling unmatched fields with NULL",
      "Only matching row pairs",
      "All rows from the left table and matching rows from the right",
      "Cartesian product of all rows"
    ],
    "answer": 1,
    "explanation": "Only matching row pairs. Rows without a match in either input are excluded. An outer join preserves unmatched rows from its specified side or both sides.",
    "exam": "GATE 2020",
    "tag": "GATE 2020",
    "section": "C. SQL",
    "topic": "joins",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 19,
    "q": "What is the main difference between LEFT OUTER JOIN and INNER JOIN?",
    "options": [
      "LEFT JOIN preserves all rows from the left table",
      "INNER JOIN preserves all rows from the left table",
      "LEFT JOIN always yields fewer rows than INNER JOIN",
      "INNER JOIN pads unmatched attributes with NULL"
    ],
    "answer": 0,
    "explanation": "LEFT JOIN preserves all rows from the left table. If a left-side row has no match, right-side columns are filled with NULL. An inner join drops that row.",
    "exam": "GATE 2020",
    "tag": "GATE 2020",
    "section": "C. SQL",
    "topic": "joins",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 20,
    "q": "Which join preserves unmatched rows from both tables?",
    "options": [
      "INNER JOIN",
      "FULL OUTER JOIN",
      "NATURAL JOIN",
      "CROSS JOIN"
    ],
    "answer": 1,
    "explanation": "FULL OUTER JOIN. Matched rows are combined, and unmatched rows from either table are included with NULL values for missing columns.",
    "exam": "GATE 2020",
    "tag": "GATE 2020",
    "section": "C. SQL",
    "topic": "joins",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 21,
    "q": "Relations R(A, B) and S(A, C) contain 5 tuples each. What is the maximum possible number of tuples in their natural join on attribute A?",
    "options": [
      "5",
      "10",
      "25",
      "50"
    ],
    "answer": 2,
    "explanation": "25. All tuples could share the same value of A, allowing every tuple in R to match every tuple in S. Thus, 5 × 5 = 25.",
    "exam": "GATE 2024, Set 1",
    "tag": "GATE 2024 Set 1",
    "section": "D. Relational algebra",
    "topic": "relational",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 22,
    "q": "Relations Employee, Brand, and Own describe employees and brands they own. Which relational algebra operation retrieves employees who own every brand?",
    "options": [
      "Relational division",
      "Natural join",
      "Set intersection",
      "Projection"
    ],
    "answer": 0,
    "explanation": "Relational division. Division returns entities associated with every value in the divisor relation. A join alone generally returns entities associated with at least one brand.",
    "exam": "GATE 2022",
    "tag": "GATE 2022",
    "section": "D. Relational algebra",
    "topic": "relational",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 23,
    "q": "A relation with 1,200 tuples is decomposed into two relations. The decomposition is lossy. Can the natural join be guaranteed to return exactly 1,200 tuples?",
    "options": [
      "Yes, natural join always preserves the original tuple count",
      "No. A lossy decomposition can produce spurious tuples when the decomposed relations are joined",
      "Yes, provided primary keys are retained in both relations",
      "No, it will always return strictly fewer than 1,200 tuples"
    ],
    "answer": 1,
    "explanation": "No. A lossy decomposition can produce spurious tuples when the decomposed relations are joined. The result may contain more tuples than the original relation.",
    "exam": "GATE 2005",
    "tag": "GATE 2005",
    "section": "D. Relational algebra",
    "topic": "relational",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 24,
    "q": "A relation R1 has a foreign key referencing the primary key of R2. Which statement follows from referential integrity?",
    "options": [
      "Every primary key in R2 must appear in R1",
      "Every non-NULL foreign-key value must match a referenced key value in R2",
      "R1 and R2 must have the exact same number of tuples",
      "Deleting any row from R1 must trigger deletion in R2"
    ],
    "answer": 1,
    "explanation": "Every non-NULL foreign-key value must match a referenced key value in R2. This constraint prevents dangling references to nonexistent parent records.",
    "exam": "GATE 2004",
    "tag": "GATE 2004",
    "section": "D. Relational algebra",
    "topic": "constraints",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 25,
    "q": "Relations R and S have m and n tuples respectively. What is the maximum size of their join?",
    "options": [
      "m + n",
      "mn",
      "max(m, n)",
      "2^(m + n)"
    ],
    "answer": 1,
    "explanation": "mn. The maximum occurs when every tuple from one relation matches every tuple from the other, as in a Cartesian product or a join condition satisfied by all pairs.",
    "exam": "GATE 1999",
    "tag": "GATE 1999",
    "section": "D. Relational algebra",
    "topic": "relational",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 26,
    "q": "Which query type cannot always be expressed using only the basic relational algebra operations (σ, π, ∪, -, ×, ρ)?",
    "options": [
      "Row selection based on boolean predicates",
      "A query requiring unrestricted aggregation, such as calculating an average",
      "Cartesian product of two tables",
      "Set difference of two compatible tables"
    ],
    "answer": 1,
    "explanation": "A query requiring unrestricted aggregation, such as calculating an average. Basic relational algebra includes selection, projection, union, difference, Cartesian product and rename. Standard aggregate operations are not part of this basic set.",
    "exam": "GATE 2000",
    "tag": "GATE 2000",
    "section": "D. Relational algebra",
    "topic": "relational",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 27,
    "q": "Three buffers are available, one reserved for output. Which relation should be used as the outer relation in a block nested-loop join to reduce I/O, assuming the smaller relation fits the available outer buffers?",
    "options": [
      "The larger relation",
      "The smaller relation",
      "Either relation yields identical I/O",
      "The relation with fewer attributes"
    ],
    "answer": 1,
    "explanation": "The smaller relation. Using the smaller relation as the outer input reduces the number of block iterations over the inner relation.",
    "exam": "GATE 2014, Set 2",
    "tag": "GATE 2014 Set 2",
    "section": "D. Relational algebra",
    "topic": "joins",
    "difficulty": "hard",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 28,
    "q": "Two transactions access the same data item X. When do their operations conflict?",
    "options": [
      "Whenever both operations are reads",
      "When they belong to different transactions, access the same item, and at least one operation is a write",
      "Only when both operations are aborts",
      "When they commit at the same millisecond"
    ],
    "answer": 1,
    "explanation": "When they belong to different transactions, access the same item, and at least one operation is a write. Read–read operations do not conflict. Read–write, write–read, and write–write operations on the same item do conflict.",
    "exam": "GATE 2026, Set 2",
    "tag": "GATE 2026 Set 2",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 29,
    "q": "Consider this schedule: R1(X), W1(Y), R2(X), R2(Y), R3(Y), ABORT(T1). Which other transactions must roll back under cascading rollback rules?",
    "options": [
      "Only T2",
      "T2 and T3",
      "Only T3",
      "Neither transaction"
    ],
    "answer": 1,
    "explanation": "T2 and T3. T2 read Y, which was written by T1 but not committed. T3 also read that uncommitted value of Y. When T1 aborts, both dependent transactions must roll back.",
    "exam": "GATE 2025, Set 1",
    "tag": "GATE 2025 Set 1",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "medium",
    "verified": true,
    "source": "W3Colleges"
  },
  {
    "id": 30,
    "q": "What are the two phases of Two-Phase Locking (2PL)?",
    "options": [
      "Locking and Unlocking",
      "Growing and shrinking",
      "Shared and Exclusive",
      "Validation and Commit"
    ],
    "answer": 1,
    "explanation": "Growing and shrinking. A transaction acquires locks in the growing phase. After it releases its first lock, it enters the shrinking phase and cannot acquire any new lock.",
    "exam": "GATE 2016",
    "tag": "GATE 2016",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 31,
    "q": "How do you test whether a concurrent schedule is conflict-serializable?",
    "options": [
      "Verify that all transactions commit without timeouts",
      "Construct its precedence graph and check for cycles",
      "Check that all reads occur before any write",
      "Ensure transactions hold exclusive locks throughout"
    ],
    "answer": 1,
    "explanation": "Construct its precedence graph and check for cycles. Create one vertex per transaction and add an edge Ti → Tj when a conflicting operation of Ti precedes one of Tj. An acyclic graph means the schedule is conflict-serializable.",
    "exam": "GATE 2016",
    "tag": "GATE 2016",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 32,
    "q": "What is the relationship between conflict serializability and serial schedules?",
    "options": [
      "A conflict-serializable schedule cannot contain concurrent operations",
      "A conflict-serializable schedule is conflict-equivalent to some serial schedule",
      "Every non-serial schedule is conflict non-serializable",
      "Conflict serializability guarantees deadlock-free execution"
    ],
    "answer": 1,
    "explanation": "A conflict-serializable schedule is conflict-equivalent to some serial schedule. The schedule may interleave operations, but its conflicting operations preserve the order of an equivalent serial execution.",
    "exam": "GATE 2015",
    "tag": "GATE 2015",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 33,
    "q": "Two transactions each hold one lock and wait for a lock held by the other. What condition has occurred?",
    "options": [
      "Starvation",
      "Deadlock",
      "Cascading abort",
      "Livelock"
    ],
    "answer": 1,
    "explanation": "Deadlock. Each transaction waits indefinitely for the other to release a resource. A wait-for graph with a cycle indicates deadlock under the usual single-instance resource assumptions.",
    "exam": "GATE 2014",
    "tag": "GATE 2014",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 34,
    "q": "Transaction T2 reads a value written by T1. What must happen for the schedule to be recoverable?",
    "options": [
      "T2 must commit before T1 commits",
      "T1 must commit before T2 commits",
      "Both transactions must abort",
      "T1 must release all locks before T2 reads"
    ],
    "answer": 1,
    "explanation": "T1 must commit before T2 commits. If T2 commits first and T1 later aborts, T2 has committed based on a dirty value that was never valid.",
    "exam": "GATE 2012",
    "tag": "GATE 2012",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 35,
    "q": "What is a dirty read in transaction management?",
    "options": [
      "Reading data from a table that has no indexes",
      "Reading an uncommitted value written by another transaction",
      "Reading records from an archived log file",
      "Reading duplicate rows from a Cartesian product"
    ],
    "answer": 1,
    "explanation": "Reading an uncommitted value written by another transaction. If the writer aborts, the reader has consumed a value that must be undone.",
    "exam": "GATE 2010",
    "tag": "GATE 2010",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 36,
    "q": "A transaction commits, then a system crash occurs before its modified data pages are written to disk. Which property must recovery preserve?",
    "options": [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability"
    ],
    "answer": 3,
    "explanation": "Durability. Durability requires that committed changes persist across system failures. The recovery system uses logging and redo, when required, to restore committed changes.",
    "exam": "GATE 2024",
    "tag": "GATE 2024",
    "section": "E. Transactions and concurrency control",
    "topic": "transactions",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 37,
    "q": "Which index is generally preferable for equality searches, and which supports efficient range searches?",
    "options": [
      "B+ tree for equality only; Hash index for range searches",
      "Hashing is generally preferable for equality searches; B+ trees support equality and range searches",
      "Bitmap index for range searches; Dense index for equality only",
      "Linear hashing for range queries; Secondary index for equality"
    ],
    "answer": 1,
    "explanation": "Hashing is generally preferable for equality searches; B+ trees support equality and range searches. Hashing does not preserve key order, so range scans are typically less efficient.",
    "exam": "GATE 2026, Set 2",
    "tag": "GATE 2026 Set 2",
    "section": "F. File organization and indexing",
    "topic": "indexing",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 38,
    "q": "Which file organization is generally I/O-efficient for scanning a large fraction of a table?",
    "options": [
      "Unordered heap file with random hashing",
      "Sequential or ordered file organization",
      "Clustered hash table",
      "Inverted index file"
    ],
    "answer": 1,
    "explanation": "Sequential or ordered file organization. Sequential access reduces random I/O when many records must be read. The exact best organization depends on the storage layout and query pattern.",
    "exam": "GATE 2024, Set 2",
    "tag": "GATE 2024 Set 2",
    "section": "F. File organization and indexing",
    "topic": "indexing",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 39,
    "q": "For which node in a B+ tree is the minimum half-full occupancy condition relaxed?",
    "options": [
      "Internal nodes",
      "Leaf nodes",
      "The root",
      "Sibling nodes"
    ],
    "answer": 2,
    "explanation": "The root. The root has special occupancy requirements: it can have as few as 2 pointers (or 1 key if it is also a leaf). A root that is also a leaf is subject to the corresponding root-leaf rules.",
    "exam": "GATE 2024, Set 1",
    "tag": "GATE 2024 Set 1",
    "section": "F. File organization and indexing",
    "topic": "indexing",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 40,
    "q": "A file has 150,000 student records and a disk block size of 4,096 bytes. What information is needed to calculate the number of data blocks?",
    "options": [
      "The primary key data type only",
      "The record size and the blocking/packing convention",
      "The number of indexes on the file",
      "The disk controller RPM"
    ],
    "answer": 1,
    "explanation": "The record size and the blocking/packing convention. If each record has size r bytes and records cannot span blocks, the blocking factor is ⌊4096/r⌋, and the number of blocks is ⌈150000/blocking factor⌉.",
    "exam": "GATE 2019",
    "tag": "GATE 2019",
    "section": "F. File organization and indexing",
    "topic": "indexing",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 41,
    "q": "Why is a B+ tree considered balanced?",
    "options": [
      "The number of keys in the left and right subtrees are equal",
      "All leaf nodes are at the same depth",
      "It contains an equal number of internal and leaf nodes",
      "Its height is always less than 3"
    ],
    "answer": 1,
    "explanation": "All leaf nodes are at the same depth. A search from the root to any leaf traverses the same number of tree levels.",
    "exam": "GATE 2016, Set 2",
    "tag": "GATE 2016 Set 2",
    "section": "F. File organization and indexing",
    "topic": "indexing",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 42,
    "q": "A range query asks for all keys from 7 inclusive to 15 exclusive. Why are linked B+ tree leaves useful?",
    "options": [
      "They allow hashing the range boundaries directly",
      "After finding the first qualifying leaf entry, the index can scan sequentially through linked leaves until reaching 15",
      "They double the fanout of internal nodes",
      "They eliminate the need for index locks"
    ],
    "answer": 1,
    "explanation": "After finding the first qualifying leaf entry, the index can scan sequentially through linked leaves until reaching 15. This avoids searching from the root for each individual key.",
    "exam": "GATE 2015, Set 2",
    "tag": "GATE 2015 Set 2",
    "section": "F. File organization and indexing",
    "topic": "indexing",
    "difficulty": "medium",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 43,
    "q": "A B+ tree node can contain at most 5 keys. What is the minimum number of keys in a non-root node under the standard half-full rule?",
    "options": [
      "1 key",
      "2 keys",
      "3 keys",
      "4 keys"
    ],
    "answer": 1,
    "explanation": "2 keys. Under standard B+ tree definitions where a node holds at most 5 keys (fanout order p = 6), a non-root internal node must hold at least ⌈p/2⌉ - 1 = ⌈6/2⌉ - 1 = 2 keys.",
    "exam": "GATE 2010",
    "tag": "GATE 2010",
    "section": "F. File organization and indexing",
    "topic": "indexing",
    "difficulty": "hard",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 44,
    "q": "A foreign key references a primary key in another table. What happens if a non-NULL foreign-key value has no matching referenced key?",
    "options": [
      "The DBMS creates a stub parent row",
      "The database rejects the operation if it violates the referential-integrity constraint",
      "The foreign-key is silently replaced with NULL",
      "The row is stored in a temporary heap table"
    ],
    "answer": 1,
    "explanation": "The database rejects the operation if it violates the referential-integrity constraint. A foreign key must reference an existing key value, unless NULL is permitted and used.",
    "exam": "GATE 2021",
    "tag": "GATE 2021",
    "section": "G. Query processing, integrity constraints and recovery",
    "topic": "constraints",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 45,
    "q": "Why is normalization used in relational database design?",
    "options": [
      "To maximize physical disk usage",
      "To reduce redundancy and prevent insertion, deletion, and update anomalies",
      "To convert SQL queries into relational algebra",
      "To eliminate the need for primary keys"
    ],
    "answer": 1,
    "explanation": "To reduce redundancy and prevent insertion, deletion, and update anomalies. Decomposing relations according to functional dependencies reduces repeated storage of the same facts.",
    "exam": "GATE 2005",
    "tag": "GATE 2005",
    "section": "G. Query processing, integrity constraints and recovery",
    "topic": "normalization",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 46,
    "q": "If functional dependencies are A → B, B → C, and C → D, what is the attribute closure A+ for relation R(A, B, C, D)?",
    "options": [
      "{A}",
      "{A, B}",
      "{A, B, C, D}",
      "{B, C, D}"
    ],
    "answer": 2,
    "explanation": "{A, B, C, D}. Starting from A: A → B gives {A, B}; B → C gives {A, B, C}; C → D gives {A, B, C, D}. Since the closure contains every attribute, A is a candidate key.",
    "exam": "GATE 2014",
    "tag": "GATE 2014",
    "section": "G. Query processing, integrity constraints and recovery",
    "topic": "normalization",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 47,
    "q": "What is the name of an index where the data records are stored in the same or nearly the same order as the index entries?",
    "options": [
      "Dense secondary index",
      "A clustering index",
      "Hash index",
      "Bitmap index"
    ],
    "answer": 1,
    "explanation": "A clustering index. A clustering index groups records with similar search-key values in physical sorted order, which can dramatically improve access to groups of records.",
    "exam": "GATE 2015",
    "tag": "GATE 2015",
    "section": "G. Query processing, integrity constraints and recovery",
    "topic": "indexing",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 48,
    "q": "What is the purpose of query optimization in a DBMS?",
    "options": [
      "To format SQL text with indentation",
      "To select an efficient execution plan that returns the same query result",
      "To encrypt data stored in data blocks",
      "To prevent users from writing SELECT queries"
    ],
    "answer": 1,
    "explanation": "To select an efficient execution plan that returns the same query result. The optimizer estimates the costs of alternative plans, including disk I/O, join order, and available indexes.",
    "exam": "GATE 2016",
    "tag": "GATE 2016",
    "section": "G. Query processing, integrity constraints and recovery",
    "topic": "optimization",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 49,
    "q": "What is the purpose and rule of Write-Ahead Logging (WAL)?",
    "options": [
      "Data pages must be written to disk before log records",
      "The relevant log records must be written to stable storage before the corresponding modified data pages are written",
      "Logs are written only when the system restarts",
      "WAL replaces database indexes with sequential files"
    ],
    "answer": 1,
    "explanation": "The relevant log records must be written to stable storage before the corresponding modified data pages are written. WAL allows recovery to use the log to undo or redo changes after a crash.",
    "exam": "GATE 2019",
    "tag": "GATE 2019",
    "section": "G. Query processing, integrity constraints and recovery",
    "topic": "optimization",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  },
  {
    "id": 50,
    "q": "Why does a DBMS create checkpoints in the write-ahead log?",
    "options": [
      "To stop all incoming connections",
      "To reduce the amount of work needed during crash recovery",
      "To delete all old committed transactions from tables",
      "To invalidate the buffer cache completely"
    ],
    "answer": 1,
    "explanation": "To reduce the amount of work needed during crash recovery. Checkpoints record recovery-relevant state so the recovery process does not necessarily need to scan the entire transaction log from its beginning.",
    "exam": "GATE 2020",
    "tag": "GATE 2020",
    "section": "G. Query processing, integrity constraints and recovery",
    "topic": "optimization",
    "difficulty": "easy",
    "verified": true,
    "source": "ExamSIDE.Com"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { EXAM_BANK };
}
