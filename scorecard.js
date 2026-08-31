// ── Media Buy Trio — Free Marketing Scorecard ─────────────────────────────
(function () {

  const QUESTIONS = [
    {
      id: 'website', category: 'Website',
      prompt: 'How would you describe your brand\u2019s website or online store?',
      options: [
        { text: 'We don\u2019t have one yet', score: 1 },
        { text: 'It exists, but it\u2019s outdated or slow', score: 2 },
        { text: 'It works fine, nothing special', score: 3 },
        { text: 'Fast, mobile-friendly, and built to convert', score: 4 }
      ]
    },
    {
      id: 'social', category: 'Social Media',
      prompt: 'How consistent is your posting on Instagram / TikTok / Facebook?',
      options: [
        { text: 'We post rarely, no real plan', score: 1 },
        { text: 'A few times a month, inconsistent', score: 2 },
        { text: 'Regular posting, decent engagement', score: 3 },
        { text: 'Consistent content calendar with strong engagement', score: 4 }
      ]
    },
    {
      id: 'branding', category: 'Branding',
      prompt: 'How consistent is your brand identity (logo, colors, tone) across platforms?',
      options: [
        { text: 'Not consistent at all', score: 1 },
        { text: 'Somewhat consistent, could be tighter', score: 2 },
        { text: 'Mostly consistent across channels', score: 3 },
        { text: 'Fully consistent — instantly recognizable', score: 4 }
      ]
    },
    {
      id: 'content', category: 'Content',
      prompt: 'How would you rate your product photography and video content?',
      options: [
        { text: 'Mostly phone snaps, no real production', score: 1 },
        { text: 'A mix of decent and rough content', score: 2 },
        { text: 'Solid, professional-looking content', score: 3 },
        { text: 'High-end shoots that match our brand every time', score: 4 }
      ]
    },
    {
      id: 'advertising', category: 'Advertising',
      prompt: 'Are you currently running paid ads (Meta, Google, TikTok)?',
      options: [
        { text: 'No paid ads at all', score: 1 },
        { text: 'We\u2019ve boosted a few posts, nothing structured', score: 2 },
        { text: 'Running ads, but not sure they\u2019re profitable', score: 3 },
        { text: 'Structured campaigns with tracked ROAS', score: 4 }
      ]
    },
    {
      id: 'seo', category: 'SEO',
      prompt: 'Can people find your brand easily when they search on Google?',
      options: [
        { text: 'Not sure / we don\u2019t show up', score: 1 },
        { text: 'We show up for our brand name only', score: 2 },
        { text: 'We rank for some relevant searches', score: 3 },
        { text: 'Strong visibility for brand and product searches', score: 4 }
      ]
    },
    {
      id: 'conversion', category: 'Conversion',
      prompt: 'Once someone lands on your store, how well does it turn them into a customer?',
      options: [
        { text: 'Most visitors leave without buying', score: 1 },
        { text: 'Some convert, but drop-off feels high', score: 2 },
        { text: 'Decent conversion, room to improve', score: 3 },
        { text: 'Strong, optimized checkout and conversion rate', score: 4 }
      ]
    },
    {
      id: 'overall', category: 'Overall Presence',
      prompt: 'Overall, how would you rate your brand\u2019s digital presence today?',
      options: [
        { text: 'Just starting out', score: 1 },
        { text: 'Getting there, but scattered', score: 2 },
        { text: 'Solid, but not fully optimized', score: 3 },
        { text: 'Strong and working well across the board', score: 4 }
      ]
    }
  ];

  const RECS = {
    website:     { low: 'A faster, mobile-first website would turn more of your visitors into buyers.', high: 'Your website is a strong foundation — keep it fast and fresh each season.' },
    social:      { low: 'A structured content calendar would keep your feed active between drops.', high: 'Your social presence is working — a paid boost could extend its reach.' },
    branding:    { low: 'Tightening your visual identity across channels would build more recognition.', high: 'Your brand identity is consistent and recognizable — a real asset.' },
    content:     { low: 'Professional photo & video shoots would lift how your products present online.', high: 'Your content quality is a genuine strength for your campaigns.' },
    advertising: { low: 'Structured, tracked paid campaigns would unlock consistent, predictable sales.', high: 'Your paid media is active — refining targeting could improve ROAS further.' },
    seo:         { low: 'Basic SEO work would help new customers discover you through search.', high: 'Your search visibility is solid — keep building on it with fresh content.' },
    conversion:  { low: 'Optimizing your checkout flow could recover a meaningful share of lost sales.', high: 'Your conversion rate is healthy — small tweaks could push it further.' },
    overall:     { low: 'A unified strategy across channels would close the gap fastest.', high: 'Your overall presence is strong — the focus now is scaling what works.' }
  };

  let current = 0;
  const answers = {};

  const $ = (sel) => document.querySelector(sel);
  const introEl   = $('#sc-intro');
  const quizEl    = $('#sc-quiz');
  const loadingEl = $('#sc-loading');
  const resultsEl = $('#sc-results');
  const progressBar = $('#sc-progress-bar');
  const qcount = $('#sc-qcount');
  const qcat = $('#sc-qcat');
  const qtext = $('#sc-question');
  const optionsWrap = $('#sc-options');
  const nextBtn = $('#sc-next');
  const leadEl = $('#sc-lead');
  const backBtn = $('#sc-back');

  function startQuiz() {
    introEl.classList.remove('active');
    quizEl.classList.add('active');
    renderQuestion();
  }

  function renderQuestion() {
    const q = QUESTIONS[current];
    qcount.textContent = 'Question ' + (current + 1) + ' of ' + QUESTIONS.length;
    qcat.textContent = q.category;
    qtext.textContent = q.prompt;
    progressBar.style.width = Math.round((current / QUESTIONS.length) * 100) + '%';

    optionsWrap.innerHTML = '';
    q.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sc-option' + (answers[q.id] && answers[q.id].text === opt.text ? ' selected' : '');
      btn.innerHTML = '<span class="sc-option-dot"></span><span>' + opt.text + '</span>';
      btn.addEventListener('click', () => {
        answers[q.id] = { text: opt.text, score: opt.score, category: q.category };
        optionsWrap.querySelectorAll('.sc-option').forEach(o => o.classList.remove('selected'));
        btn.classList.add('selected');
        nextBtn.classList.add('enabled');
      });
      optionsWrap.appendChild(btn);
    });

    nextBtn.classList.toggle('enabled', !!answers[q.id]);
    nextBtn.textContent = (current === QUESTIONS.length - 1) ? 'See My Score \u2192' : 'Next \u2192';
    backBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
  }

  function nextQuestion() {
    if (!answers[QUESTIONS[current].id]) return;
    if (current < QUESTIONS.length - 1) {
      current++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function prevQuestion() {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  }

  const SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx07IPvYFODDEJytNubZP9tFHQhhiXg1eHzHpUNf8I_ehfrJRNhThzxdumAh25S0rcn/exec';

  function overallScore() {
    const cats = Object.values(answers);
    return Math.round((cats.reduce((s, a) => s + a.score, 0) / (cats.length * 4)) * 100);
  }

  function verdictFor(pct) {
    if (pct >= 85) return 'Excellent Digital Presence';
    if (pct >= 70) return 'Strong, With Room To Grow';
    if (pct >= 50) return 'Building Momentum';
    return 'Just Getting Started';
  }

  function saveToSheet(lead) {
    const payload = {
      type: 'scorecard',
      name: lead.name || '',
      email: lead.email || '',
      brand: lead.brand || '',
      phone: lead.phone || '',
      score: overallScore(),
      verdict: verdictFor(overallScore()),
      answers: QUESTIONS.map(function (q) {
        const a = answers[q.id] || {};
        return { id: q.id, category: q.category, question: q.prompt, answer: a.text || '', score: a.score || 0 };
      })
    };
    try {
      fetch(SHEET_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (e) { /* never block the results */ }
  }

  function finishQuiz() {
    quizEl.classList.remove('active');
    leadEl.classList.add('active');
    progressBar.style.width = '100%';
  }

  function submitLead() {
    const name = ($('#sc-name').value || '').trim();
    const email = ($('#sc-email').value || '').trim();
    const err = $('#sc-lead-err');
    if (!name) { err.textContent = 'Please enter your name.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Please enter a valid email address.'; return; }
    err.textContent = '';
    saveToSheet({
      name: name,
      email: email,
      brand: ($('#sc-brand').value || '').trim(),
      phone: ($('#sc-phone').value || '').trim()
    });
    leadEl.classList.remove('active');
    loadingEl.classList.add('active');
    setTimeout(showResults, 900);
  }

  function showResults() {
    loadingEl.classList.remove('active');
    resultsEl.classList.add('active');

    const cats = Object.values(answers);
    const overallPct = Math.round((cats.reduce((s, a) => s + a.score, 0) / (cats.length * 4)) * 100);

    // Score ring
    const ring = $('#sc-score-fill');
    const circumference = 2 * Math.PI * 78;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;
    $('#sc-score-number').textContent = overallPct;
    setTimeout(() => {
      ring.style.strokeDashoffset = circumference - (overallPct / 100) * circumference;
    }, 60);

    let verdict = 'Just Getting Started';
    if (overallPct >= 85) verdict = 'Excellent Digital Presence';
    else if (overallPct >= 70) verdict = 'Strong, With Room To Grow';
    else if (overallPct >= 50) verdict = 'Building Momentum';
    $('#sc-verdict').textContent = verdict;


    // Strengths / improvements
    const sorted = QUESTIONS.map(q => ({ q, a: answers[q.id] })).sort((x, y) => y.a.score - x.a.score);
    const strengths = sorted.filter(x => x.a.score >= 3).slice(0, 3);
    const improvements = sorted.filter(x => x.a.score <= 2).slice(-3).reverse();

    const strengthsList = $('#sc-strengths');
    const improveList = $('#sc-improve');
    strengthsList.innerHTML = '';
    improveList.innerHTML = '';

    if (strengths.length) {
      strengths.forEach(s => {
        const li = document.createElement('li');
        li.textContent = RECS[s.q.id].high;
        strengthsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'There\u2019s room to build strengths across every area — a great place for us to start.';
      strengthsList.appendChild(li);
    }

    if (improvements.length) {
      improvements.forEach(s => {
        const li = document.createElement('li');
        li.textContent = RECS[s.q.id].low;
        improveList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No major gaps — the focus now is scaling what\u2019s already working.';
      improveList.appendChild(li);
    }
  }

  function restart() {
    current = 0;
    Object.keys(answers).forEach(k => delete answers[k]);
    resultsEl.classList.remove('active');
    leadEl.classList.remove('active');
    introEl.classList.add('active');
    progressBar.style.width = '0%';
  }

  $('#sc-start-btn').addEventListener('click', startQuiz);
  nextBtn.addEventListener('click', nextQuestion);
  backBtn.addEventListener('click', prevQuestion);
  $('#sc-lead-submit').addEventListener('click', submitLead);
  $('#sc-restart-btn').addEventListener('click', restart);

})();
