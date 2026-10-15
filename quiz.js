/* =========================================================
   QUERYLENS — QUIZ + COMPETITIVE EXAM MODULE
========================================================= */

const QuizState = {
  questions: [],
  index: 0,
  score: 0,
  answered: false,
  log: []
};


/* ---------------------------------------------------------
   UTILITIES
   --------------------------------------------------------- */

function shuffle(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}


/* ---------------------------------------------------------
   DYNAMIC QUESTION GENERATION

   Builds new questions from the live statistics used by the
   cost model, so the pool never runs dry regardless of how
   many questions the user asks for.
   --------------------------------------------------------- */

function generateDynamicQuestion(difficulty){

  /* Fall back gracefully if cost-model.js is unavailable. */
  if(typeof STATS === "undefined"){
    return {
      q:"Which clause filters rows before grouping takes place?",
      options:["HAVING","WHERE","ORDER BY","LIMIT"],
      answer:1,
      explanation:"WHERE filters individual rows before GROUP BY runs. HAVING filters the groups afterwards.",
      tag:"Generated — SQL Semantics",
      exam:null,
      verified:false,
      difficulty
    };
  }

  const tables = Object.keys(STATS);
  const table = tables[Math.floor(Math.random() * tables.length)];
  const stats = STATS[table];

  const cols = Object.keys(stats.distinct);
  const col = cols[Math.floor(Math.random() * cols.length)];

  const distinct = stats.distinct[col];
  const expected = Math.max(1,Math.round(stats.rows / distinct));

  const variants = [

    /* Selectivity arithmetic */
    ()=>{
      const wrong = [
        expected * 2,
        expected * 10,
        stats.rows
      ].filter(v => v !== expected);

      const opts = shuffle([expected,...wrong].slice(0,4)).map(String);

      return {
        q:`Table ${table} has ${stats.rows.toLocaleString()} rows and ${distinct.toLocaleString()} distinct values of ${col}. Assuming a uniform distribution, how many rows match WHERE ${col} = <value>?`,
        options:opts,
        answer:opts.indexOf(String(expected)),
        explanation:`Selectivity of an equality predicate is 1/V(${col}) = 1/${distinct}. Expected rows = ${stats.rows} / ${distinct} = ${expected}.`,
        tag:"Generated — Selectivity",
        exam:null,
        verified:false,
        difficulty
      };
    },

    /* Access path selection */
    ()=>{
      const indexed = stats.indexes.some(ix => ix[0] === col);
      const opts = ["Index scan","Sequential scan","Hash join","External sort"];

      return {
        q:`In the QueryLens schema, which access path does the planner choose for WHERE ${table}.${col} = <value>?`,
        options:opts,
        answer:indexed ? 0 : 1,
        explanation:indexed
          ? `${table}.${col} is the leading column of an index, so the planner can seek directly to the matching range using an index scan.`
          : `No index on ${table} has ${col} as its leading column, so every row must be examined with a sequential scan.`,
        tag:"Generated — Access Paths",
        exam:null,
        verified:false,
        difficulty
      };
    },

    /* Conjunctive selectivity */
    ()=>{
      const opts = [
        "They are multiplied",
        "They are added",
        "The larger one is used",
        "They are ignored"
      ];

      return {
        q:`Two independent predicates on ${table} have selectivities 0.1 and 0.5. Under the independence assumption, how are they combined for an AND condition?`,
        options:opts,
        answer:0,
        explanation:"Conjunctive selectivity multiplies: 0.1 × 0.5 = 0.05, so about 5% of rows survive the filter.",
        tag:"Generated — Selectivity",
        exam:null,
        verified:false,
        difficulty
      };
    },

    /* Scan cost */
    ()=>{
      const pages = Math.ceil(stats.rows / 50);
      const wrong = [pages * 2, Math.round(pages / 2), stats.rows]
        .filter(v => v !== pages);

      const opts = shuffle([pages,...wrong].slice(0,4)).map(String);

      return {
        q:`Table ${table} holds ${stats.rows.toLocaleString()} rows at 50 rows per page. How many pages does a full sequential scan read?`,
        options:opts,
        answer:opts.indexOf(String(pages)),
        explanation:`Pages = ⌈rows / rows-per-page⌉ = ⌈${stats.rows} / 50⌉ = ${pages}.`,
        tag:"Generated — Cost Estimation",
        exam:null,
        verified:false,
        difficulty
      };
    }

  ];

  return variants[Math.floor(Math.random() * variants.length)]();
}


/* ---------------------------------------------------------
   QUIZ CONSTRUCTION
   --------------------------------------------------------- */

function buildQuiz(count,difficulty){

  const pool = shuffle(
    EXAM_BANK.filter(q => q.difficulty === difficulty)
  );

  const picked = pool.slice(0,count);

  /* Top up from the generator when the curated bank runs out
     for the chosen difficulty. */
  let guard = 0;

  while(picked.length < count && guard < 200){
    picked.push(generateDynamicQuestion(difficulty));
    guard++;
  }

  /* Shuffle the options so the correct index is unpredictable. */
  return picked.map(q=>{

    const pairs = q.options.map((text,i)=>({
      text,
      correct:i === q.answer
    }));

    const mixed = shuffle(pairs);

    return {
      ...q,
      options:mixed.map(p => p.text),
      answer:mixed.findIndex(p => p.correct)
    };
  });
}


/* ---------------------------------------------------------
   SOURCE NOTE

   Renders the provenance line shown under a revealed answer,
   so a reader can always tell a paraphrased concept from an
   original practice question.
   --------------------------------------------------------- */

function sourceNote(q){

  if(q.verified && q.exam){
    return `Source: ${escapeHTML(q.exam)} — verified against the official paper.`;
  }

  if(q.exam){
    return `Paraphrases a concept reported from ${escapeHTML(q.exam)}. Not a verbatim past-paper question — verify before citing.`;
  }

  return "GATE-style practice question. Not from a past paper.";
}


/* ---------------------------------------------------------
   MODAL CONTROL
   --------------------------------------------------------- */

function openQuizModal(){
  $("quizModal").classList.add("open");
  $("quizSetup").classList.remove("hidden");
  $("quizPlay").classList.add("hidden");
  $("quizSummary").classList.add("hidden");
  document.body.style.overflow = "hidden";
}


function closeQuizModal(){
  $("quizModal").classList.remove("open");
  document.body.style.overflow = "";
}


/* ---------------------------------------------------------
   QUIZ FLOW
   --------------------------------------------------------- */

function startQuiz(){

  const requested = Number($("quizCount").value);
  const count = Math.max(1,Math.min(25,Number.isFinite(requested) ? requested : 5));
  const difficulty = $("quizDifficulty").value;

  QuizState.questions = buildQuiz(count,difficulty);
  QuizState.index = 0;
  QuizState.score = 0;
  QuizState.answered = false;
  QuizState.log = [];

  $("quizSetup").classList.add("hidden");
  $("quizPlay").classList.remove("hidden");
  $("quizSummary").classList.add("hidden");

  renderQuestion();
}


function renderQuestion(){

  const q = QuizState.questions[QuizState.index];
  QuizState.answered = false;

  $("quizProgress").textContent =
    `Question ${QuizState.index + 1} of ${QuizState.questions.length}  •  Score ${QuizState.score}`;

  $("quizQuestion").textContent = q.q;
  $("quizTag").textContent = q.tag || "";

  $("quizOptions").innerHTML = q.options.map((opt,i)=>`
    <button class="quiz-option" data-choice="${i}" type="button">
      <span class="quiz-letter">${String.fromCharCode(65 + i)}</span>
      <span>${escapeHTML(opt)}</span>
    </button>
  `).join("");

  $("quizFeedback").classList.add("hidden");
  $("quizFeedback").innerHTML = "";
  $("quizNextBtn").classList.add("hidden");

  document.querySelectorAll(".quiz-option").forEach(btn=>{
    btn.addEventListener("click",()=>{
      submitAnswer(Number(btn.dataset.choice));
    });
  });
}


function submitAnswer(choice){

  if(QuizState.answered) return;

  QuizState.answered = true;

  const q = QuizState.questions[QuizState.index];
  const correct = choice === q.answer;

  if(correct) QuizState.score++;

  QuizState.log.push({
    question:q.q,
    chosen:q.options[choice],
    correct:q.options[q.answer],
    wasRight:correct,
    explanation:q.explanation,
    tag:q.tag,
    exam:q.exam || null,
    verified:Boolean(q.verified)
  });

  document.querySelectorAll(".quiz-option").forEach((btn,i)=>{
    btn.disabled = true;
    if(i === q.answer) btn.classList.add("option-correct");
    else if(i === choice) btn.classList.add("option-wrong");
  });

  $("quizFeedback").classList.remove("hidden");
  $("quizFeedback").innerHTML = `
    <strong class="${correct ? "feedback-right" : "feedback-wrong"}">
      ${correct
        ? "Yes, you have correctly answered the question."
        : "Yet to answer correctly."}
    </strong>
    <p><em>Correct answer:</em> ${String.fromCharCode(65 + q.answer)}) ${escapeHTML(q.options[q.answer])}</p>
    <p>${escapeHTML(q.explanation)}</p>
    <p class="exam-source">${sourceNote(q)}</p>
  `;

  $("quizNextBtn").classList.remove("hidden");
  $("quizNextBtn").textContent =
    QuizState.index === QuizState.questions.length - 1
      ? "Finish Quiz"
      : "Next Question";
}


function nextQuestion(){

  if(QuizState.index < QuizState.questions.length - 1){
    QuizState.index++;
    renderQuestion();
  }else{
    showSummary();
  }
}


function showSummary(){

  const total = QuizState.questions.length;
  const pct = Math.round((QuizState.score / total) * 100);

  let verdict;
  if(pct >= 80) verdict = "Excellent — a strong grasp of query optimisation.";
  else if(pct >= 50) verdict = "Good effort — revise indexing and selectivity estimation.";
  else verdict = "Review the Learn section and try again.";

  $("quizPlay").classList.add("hidden");
  $("quizSummary").classList.remove("hidden");

  $("quizSummary").innerHTML = `

    <span class="eyebrow">RESULT</span>

    <h3>Quiz Complete</h3>

    <div class="quiz-score-big">${QuizState.score} / ${total}</div>

    <p class="quiz-pct">${pct}% — ${escapeHTML(verdict)}</p>

    <div class="quiz-review">
      ${QuizState.log.map((item,i)=>`
        <div class="quiz-review-item ${item.wasRight ? "rev-right" : "rev-wrong"}">
          <strong>Q${i + 1}. ${escapeHTML(item.question)}</strong>
          <p>Your answer: ${escapeHTML(item.chosen)} ${item.wasRight ? "✓" : "✗"}</p>
          ${item.wasRight ? "" : `<p>Correct answer: ${escapeHTML(item.correct)}</p>`}
          <p class="quiz-exp">${escapeHTML(item.explanation)}</p>
        </div>
      `).join("")}
    </div>

    <div class="quiz-actions">
      <button class="primary-button small" id="quizRestartBtn" type="button">Take Another Quiz</button>
      <button class="secondary-button small" id="quizDownloadBtn" type="button">Download Result</button>
      <button class="ghost-button small" id="quizCloseBtn2" type="button">Close</button>
    </div>

  `;

  $("quizRestartBtn").addEventListener("click",openQuizModal);
  $("quizDownloadBtn").addEventListener("click",downloadQuizResult);
  $("quizCloseBtn2").addEventListener("click",closeQuizModal);
}


function downloadQuizResult(){

  const total = QuizState.questions.length;

  const text = `
QUERYLENS — QUIZ RESULT
========================================
Date: ${new Date().toLocaleString()}
Questions: ${total}
Score: ${QuizState.score} / ${total}
Percentage: ${Math.round((QuizState.score / total) * 100)}%

DETAILED REVIEW
----------------------------------------
${QuizState.log.map((it,i)=>`
Q${i + 1}. ${it.question}
Your answer : ${it.chosen} ${it.wasRight ? "(CORRECT)" : "(INCORRECT)"}
Correct     : ${it.correct}
Explanation : ${it.explanation}
Tag         : ${it.tag}
Source      : ${it.verified && it.exam
                 ? it.exam + " (verified)"
                 : it.exam
                   ? "Paraphrases a concept reported from " + it.exam + " — not a verbatim past-paper question"
                   : "GATE-style practice question, not from a past paper"}
`).join("\n")}
========================================
Generated by QueryLens
`.trim();

  downloadFile("querylens-quiz-result.txt",text,"text/plain");
}


/* ---------------------------------------------------------
   COMPETITIVE EXAM VIEWER — INTERACTIVE

   The user picks an option before the answer is revealed.
   Per-question state is held here so the panel can be
   re-rendered (filter, search) without losing attempts.
   --------------------------------------------------------- */

const ExamState = {
  attempts:{},   /* questionIndex -> chosen option index */
  revealed:{}    /* questionIndex -> true once answered  */
};


function examScore(){

  const keys = Object.keys(ExamState.revealed);

  const right = keys.filter(
    k => ExamState.attempts[k] === EXAM_BANK[k].answer
  ).length;

  return { attempted:keys.length, right };
}


function renderExamProgress(){

  const host = $("examProgress");
  if(!host) return;

  const { attempted, right } = examScore();

  if(!attempted){
    host.innerHTML =
      `<span class="exam-progress-idle">No questions attempted yet. Select an option to check your answer.</span>`;
    return;
  }

  host.innerHTML = `
    <span>Attempted <strong>${attempted}</strong> of ${EXAM_BANK.length}</span>
    <span class="exam-progress-right">Correct <strong>${right}</strong></span>
    <span class="exam-progress-wrong">Incorrect <strong>${attempted - right}</strong></span>
    <button class="ghost-button small" id="examResetBtn" type="button">Reset Attempts</button>
  `;

  $("examResetBtn").addEventListener("click",()=>{
    ExamState.attempts = {};
    ExamState.revealed = {};
    renderExamBank(
      $("examTopicFilter") ? $("examTopicFilter").value : "all",
      $("examSearch") ? $("examSearch").value : ""
    );
  });
}


function renderExamBank(filterTopic,search){

  const topic = filterTopic || "all";
  const term = (search || "").trim().toLowerCase();

  /* Keep the original index so attempt state survives filtering. */
  const list = EXAM_BANK
    .map((q,originalIndex)=>({ q, originalIndex }))
    .filter(({ q })=>{

      const topicOk = topic === "all" || q.topic === topic;

      const textOk = !term
        || q.q.toLowerCase().includes(term)
        || (q.tag || "").toLowerCase().includes(term)
        || (q.explanation || "").toLowerCase().includes(term);

      return topicOk && textOk;
    });

  $("examCount").textContent =
    `${list.length} of ${EXAM_BANK.length} questions`;

  renderExamProgress();

  if(!list.length){
    $("examList").innerHTML = `
      <div class="empty-state compact">
        <div class="empty-icon">◇</div>
        <p>No questions match that filter.</p>
      </div>
    `;
    return;
  }

  $("examList").innerHTML = list.map(({ q, originalIndex },displayIndex)=>{

    const revealed = ExamState.revealed[originalIndex];
    const chosen = ExamState.attempts[originalIndex];
    const wasRight = revealed && chosen === q.answer;

    const statusClass = !revealed
      ? ""
      : wasRight ? "exam-item-right" : "exam-item-wrong";

    return `

      <div class="exam-item ${statusClass}" data-q="${originalIndex}">

        <div class="exam-head">
          <span class="exam-num">${displayIndex + 1}</span>
          <span class="exam-q">${escapeHTML(q.q)}</span>
          <span class="exam-tag ${q.verified ? "tag-verified" : "tag-practice"}">
            ${escapeHTML(q.tag)}
          </span>
        </div>

        <div class="exam-choices">
          ${q.options.map((opt,j)=>{

            let cls = "exam-choice";

            if(revealed){
              if(j === q.answer) cls += " choice-correct";
              else if(j === chosen) cls += " choice-wrong";
              else cls += " choice-dim";
            }

            return `
              <button
                class="${cls}"
                type="button"
                data-q="${originalIndex}"
                data-choice="${j}"
                ${revealed ? "disabled" : ""}>
                <span class="quiz-letter">${String.fromCharCode(65 + j)}</span>
                <span>${escapeHTML(opt)}</span>
              </button>
            `;
          }).join("")}
        </div>

        ${revealed ? `
          <div class="exam-result">

            <strong class="${wasRight ? "feedback-right" : "feedback-wrong"}">
              ${wasRight
                ? "Yes, you have correctly answered the question."
                : "Yet to answer correctly."}
            </strong>

            <p class="exam-answer-line">
              Correct answer:
              <strong>${String.fromCharCode(65 + q.answer)})
              ${escapeHTML(q.options[q.answer])}</strong>
            </p>

            <div class="exam-solution">
              <strong>Solution</strong>
              <p>${escapeHTML(q.explanation)}</p>
            </div>

            <p class="exam-source">${sourceNote(q)}</p>

          </div>
        ` : ""}

      </div>
    `;
  }).join("");

  /* Wire the option buttons. */
  $("examList").querySelectorAll(".exam-choice").forEach(button=>{

    button.addEventListener("click",()=>{

      const qIndex = Number(button.dataset.q);
      const choice = Number(button.dataset.choice);

      if(ExamState.revealed[qIndex]) return;

      ExamState.attempts[qIndex] = choice;
      ExamState.revealed[qIndex] = true;

      renderExamBank(
        $("examTopicFilter") ? $("examTopicFilter").value : "all",
        $("examSearch") ? $("examSearch").value : ""
      );

      /* Keep the answered question in view after the re-render. */
      const target = $("examList")
        .querySelector(`.exam-item[data-q="${qIndex}"]`);

      if(target){
        target.scrollIntoView({ behavior:"smooth", block:"center" });
      }
    });
  });
}


function downloadExamBank(){

  const { attempted, right } = examScore();

  const attemptSummary = attempted
    ? `
YOUR ATTEMPT
----------------------------------------
Attempted : ${attempted} of ${EXAM_BANK.length}
Correct   : ${right}
Incorrect : ${attempted - right}
`
    : "";

  const text = `
QUERYLENS — COMPETITIVE EXAM QUESTION BANK
${EXAM_BANK.length} solved questions for GATE / PSU / UPSC preparation
========================================
${attemptSummary}
TAG NOTICE
----------------------------------------
Questions tagged with a GATE year paraphrase a concept
reported from that paper. They are NOT verbatim reproductions
of past-paper questions. Questions tagged "GATE-style Practice"
are original practice questions. Verify every year label
against the official GATE question papers and answer keys
before citing one.

========================================

${EXAM_BANK.map((q,i)=>{

  const chosen = ExamState.attempts[i];
  const answered = ExamState.revealed[i];

  const yourLine = answered
    ? `   Your Answer    : ${String.fromCharCode(65 + chosen)}) ${q.options[chosen]} ${chosen === q.answer ? "(CORRECT)" : "(INCORRECT)"}\n`
    : "";

  const source = q.verified && q.exam
    ? `${q.exam} (verified)`
    : q.exam
      ? `Paraphrases a concept reported from ${q.exam} — not verbatim`
      : "Original practice question";

  return `
Q${i + 1}. ${q.q}
${q.options.map((o,j)=>`   ${String.fromCharCode(65 + j)}) ${o}`).join("\n")}

${yourLine}   Correct Answer : ${String.fromCharCode(65 + q.answer)}) ${q.options[q.answer]}
   Solution       : ${q.explanation}
   Tag            : ${q.tag}
   Source         : ${source}
   Topic          : ${q.topic}
   Difficulty     : ${q.difficulty}`;

}).join("\n----------------------------------------\n")}

========================================
Generated by QueryLens
${new Date().toLocaleString()}
`.trim();

  downloadFile("querylens-competitive-exam-bank.txt",text,"text/plain");
}


/* ---------------------------------------------------------
   WIRING

   Every lookup is guarded so that one missing element cannot
   stop the rest of the module from initialising.
   --------------------------------------------------------- */

function on(id,event,handler){
  const element = $(id);
  if(element){
    element.addEventListener(event,handler);
  }else{
    console.warn(`QueryLens: element #${id} not found — skipping listener.`);
  }
}


function initQuizModule(){

  /* Quiz triggers */
  on("quizBtn","click",openQuizModal);
  on("quizBtnLearn","click",openQuizModal);

  /* Quiz controls */
  on("quizCloseBtn","click",closeQuizModal);
  on("quizStartBtn","click",startQuiz);
  on("quizNextBtn","click",nextQuestion);

  /* Click the backdrop to dismiss */
  on("quizModal","click",event=>{
    if(event.target.id === "quizModal") closeQuizModal();
  });

  /* Escape to dismiss */
  document.addEventListener("keydown",event=>{
    if(event.key === "Escape") closeQuizModal();
  });

  /* Exam filters */
  on("examTopicFilter","change",()=>{
    renderExamBank($("examTopicFilter").value,$("examSearch").value);
  });

  on("examSearch","input",()=>{
    renderExamBank($("examTopicFilter").value,$("examSearch").value);
  });

  on("examDownloadBtn","click",downloadExamBank);

  /* Initial render */
  if($("examList")){
    renderExamBank(
      $("examTopicFilter") ? $("examTopicFilter").value : "all",
      $("examSearch") ? $("examSearch").value : ""
    );
  }
}


/* ---------------------------------------------------------
   BOOTSTRAP

   script.js calls init() while it is being parsed, which is
   before this file exists. The module therefore starts itself
   here. The flag makes the call idempotent, so it does not
   matter which path runs first.
   --------------------------------------------------------- */

let quizModuleStarted = false;

function startQuizModule(){

  if(quizModuleStarted) return;

  quizModuleStarted = true;

  initQuizModule();
}


if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded",startQuizModule);
}else{
  startQuizModule();
}