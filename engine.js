/* VLSI Recall: local progress, validated backups, and FSRS-6 scheduling. */
(function (root) {
  'use strict';
  const KEY = 'vlsi-recall-progress-v1';
  const LIMIT = 5000;
  let overwriteBlocked = false;
  const importedStates = new WeakSet();
  const api = { KEY, fresh, load, save, scheduler, cardFor, status, metrics, applyRating,
    buildQueue, validateImport, formatInterval, shuffle, loadWarning: '', saveWarning: '' };

  function questions() { return root.QUESTIONS || []; }
  function validIds() { return new Set(questions().map(q => Number(q.id))); }
  function own(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
  function object(value, name) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Invalid ' + name + '.');
    return value;
  }
  function number(value, name, min = 0, max = 1000000, integer = false) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max ||
        (integer && !Number.isInteger(value))) throw Error('Invalid ' + name + '.');
    return value;
  }
  function count(value, name, max = 1000000) { return number(value, name, 0, max, true); }
  function bool(value, name) {
    if (typeof value !== 'boolean') throw Error('Invalid ' + name + '.');
    return value;
  }
  function iso(value, name) {
    const isDate = Object.prototype.toString.call(value) === '[object Date]';
    if (!isDate && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value))) throw Error('Invalid ' + name + '.');
    const d = new Date(value);
    if (!Number.isFinite(d.getTime()) || d.getFullYear() < 1970 || d.getFullYear() > 2400) throw Error('Invalid ' + name + '.');
    const result = d.toISOString();
    if (!isDate && result !== value) throw Error('Invalid ' + name + '.');
    return result;
  }
  function knownId(value, ids) {
    if (!Number.isInteger(value) || !ids.has(value)) throw Error('Backup contains an unknown question.');
    return value;
  }
  function idList(value, ids, max = LIMIT, unique = false) {
    if (!Array.isArray(value) || value.length > max) throw Error('Invalid question list.');
    const list = value.map(id => knownId(id, ids));
    if (unique && new Set(list).size !== list.length) throw Error('Duplicate question in exam.');
    return list;
  }
  function letter(value, allowNull = false, questionId = null) {
    if (allowNull && value === null) return null;
    if (typeof value !== 'string' || !/^[A-F]$/.test(value)) throw Error('Invalid answer choice.');
    if (questionId !== null) {
      const question = questions().find(q => Number(q.id) === questionId);
      const choices = question && (question.options || question.choices);
      if (!question) throw Error('No question for this answer.');
      if (Array.isArray(choices) && choices.length > 0) {
        const labels = choices.every(choice => typeof choice === 'string' && /^[A-F]$/.test(choice));
        if (labels ? !choices.includes(value) : value.charCodeAt(0) - 65 >= choices.length) throw Error('Answer choice does not exist.');
      }
    }
    return value;
  }
  function answerMap(value, ids, examIds) {
    object(value, 'answers');
    const result = {};
    for (const key of Object.keys(value)) {
      const id = knownId(Number(key), ids);
      if (String(id) !== key || !examIds.includes(id)) throw Error('Invalid exam answer.');
      result[id] = letter(value[key], false, id);
    }
    return result;
  }
  function serialCard(value) {
    object(value, 'scheduler card');
    const result = {
      due: iso(value.due, 'review date'),
      stability: number(value.stability, 'stability', 0, 36500),
      difficulty: number(value.difficulty, 'difficulty', 0, 10),
      elapsed_days: count(value.elapsed_days, 'elapsed days', 200000),
      scheduled_days: count(value.scheduled_days, 'scheduled days', 36500),
      learning_steps: count(value.learning_steps, 'learning step', 100),
      reps: count(value.reps, 'review count'),
      lapses: count(value.lapses, 'lapse count'),
      state: count(value.state, 'scheduler state', 3)
    };
    if (value.last_review != null) result.last_review = iso(value.last_review, 'last review');
    if (result.lapses > result.reps) throw Error('Invalid lapse count.');
    if (result.reps > 0 && (!result.last_review || result.stability <= 0 || result.difficulty < 1 || result.state === 0)) throw Error('Incomplete reviewed card.');
    if (result.reps === 0 && result.state !== 0) throw Error('Invalid new card.');
    if (result.last_review && result.due < result.last_review) throw Error('Review is due before its last answer.');
    return result;
  }
  function cleanEntry(value) {
    object(value, 'progress entry');
    const result = {
      card: serialCard(value.card), attempts: count(value.attempts, 'attempt count'),
      correct: count(value.correct, 'correct count'), wrong: count(value.wrong, 'wrong count'),
      streak: count(value.streak, 'correct streak'), successDays: [], lastCorrect: bool(value.lastCorrect, 'last answer')
    };
    if (result.correct + result.wrong !== result.attempts || result.streak > result.correct ||
        result.card.reps !== result.attempts || result.attempts === 0) throw Error('Inconsistent progress counts.');
    if (!Array.isArray(value.successDays) || value.successDays.length > LIMIT) throw Error('Invalid successful review days.');
    result.successDays = [...new Set(value.successDays.map(day => {
      if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
          iso(day + 'T00:00:00.000Z', 'review day').slice(0, 10) !== day) throw Error('Invalid review day.');
      return day;
    }))].sort();
    if (result.successDays.length > result.correct || (!result.lastCorrect && result.streak !== 0)) throw Error('Inconsistent review streak.');
    return result;
  }
  function cleanSession(value, ids) {
    if (value == null) return null;
    object(value, 'learning session');
    const queue = idList(value.queue, ids);
    if (!['smart', 'all', 'weak', 'bookmarked', 'custom', 'path'].includes(value.kind)) throw Error('Invalid session mode.');
    const result = { queue, index: count(value.index, 'session position', queue.length),
      done: count(value.done, 'session answer count', LIMIT), correct: count(value.correct, 'session score', LIMIT),
      startedAt: iso(value.startedAt, 'session start'), kind: value.kind,
      revealed: bool(value.revealed, 'answer visibility'), selected: letter(value.selected, true),
      rated: bool(value.rated, 'rating state'), lastResult: null,
      initialCount: count(value.initialCount, 'session size', questions().length) };
    if (result.correct > result.done || result.done > queue.length) throw Error('Invalid session score.');
    if (result.selected !== null) {
      if (result.index >= queue.length) throw Error('Answer beyond the end of a session.');
      letter(result.selected, false, queue[result.index]);
    }
    if (value.lastResult != null) {
      object(value.lastResult, 'last result');
      result.lastResult = { correct: bool(value.lastResult.correct, 'last result'),
        rating: number(value.lastResult.rating, 'rating', 1, 4, true), due: iso(value.lastResult.due, 'next review') };
    }
    return result;
  }
  function cleanExam(value, ids, saved = false) {
    if (value == null && !saved) return null;
    object(value, 'exam');
    const list = idList(value.ids, ids, questions().length, true);
    if (!list.length) throw Error('Empty exam.');
    const result = { ids: list, answers: answerMap(value.answers, ids, list), startedAt: iso(value.startedAt, 'exam start') };
    if (!saved) result.index = count(value.index, 'exam position', list.length - 1);
    else {
      if (typeof value.id !== 'string' || !/^\d{1,20}$/.test(value.id)) throw Error('Invalid exam identifier.');
      result.id = value.id;
      result.finishedAt = iso(value.finishedAt, 'exam finish');
      result.total = count(value.total, 'exam total', questions().length);
      result.correct = count(value.correct, 'exam correct', result.total);
      result.score = number(value.score, 'exam score', 0, 100);
      if (result.total !== list.length || result.finishedAt < result.startedAt) throw Error('Inconsistent exam.');
      const scored = list.reduce((n, id) => n + (result.answers[id] === questions().find(q => Number(q.id) === id).answer ? 1 : 0), 0);
      if (scored !== result.correct || Math.abs(result.score - 100 * scored / result.total) > 1) throw Error('Inconsistent exam score.');
    }
    return result;
  }
  function normalize(data, forImport) {
    object(data, 'backup');
    if (data.version !== 1) throw Error('This backup version is not supported.');
    const ids = validIds();
    const result = fresh();
    result.createdAt = iso(data.createdAt, 'creation date');
    object(data.settings, 'settings');
    result.settings.retention = number(data.settings.retention, 'target retention', 0.7, 0.99);
    object(data.cards, 'cards');
    for (const key of Object.keys(data.cards)) {
      const id = knownId(Number(key), ids);
      if (String(id) !== key) throw Error('Invalid question identifier.');
      result.cards[id] = cleanEntry(data.cards[key]);
    }
    result.bookmarks = [...new Set(idList(data.bookmarks, ids, questions().length))];
    if (!Array.isArray(data.history) || data.history.length > LIMIT) throw Error('Invalid review history.');
    result.history = data.history.map(value => {
      object(value, 'history entry');
      return { id: knownId(value.id, ids), rating: number(value.rating, 'rating', 1, 4, true),
        correct: bool(value.correct, 'history result'), at: iso(value.at, 'history date'),
        due: iso(value.due, 'history review date'), stability: number(value.stability, 'history stability', 0, 36500) };
    });
    if (!Array.isArray(data.exams) || data.exams.length > LIMIT) throw Error('Invalid exam history.');
    result.exams = data.exams.map(exam => cleanExam(exam, ids, true));
    result.session = forImport ? null : cleanSession(data.session, ids);
    result.exam = forImport ? null : cleanExam(data.exam, ids);
    return result;
  }
  function fresh() {
    return { version: 1, cards: {}, history: [], exams: [], session: null, exam: null,
      bookmarks: [], settings: { retention: 0.9 }, createdAt: new Date().toISOString() };
  }
  function load() {
    api.loadWarning = '';
    let raw;
    try { raw = root.localStorage.getItem(KEY); }
    catch (_) { api.loadWarning = 'Browser storage is unavailable. Export a backup before closing this page.'; return fresh(); }
    if (raw == null) { overwriteBlocked = false; return fresh(); }
    try { const result = normalize(JSON.parse(raw), false); overwriteBlocked = false; return result; }
    catch (_) {
      overwriteBlocked = true;
      api.loadWarning = 'Saved progress could not be read. It has been preserved. Import a valid backup or use Reset progress to start saving again.';
      return fresh();
    }
  }
  function save(state) {
    api.saveWarning = '';
    try {
      if (overwriteBlocked && root.localStorage.getItem(KEY) !== null && !importedStates.has(state)) {
        api.saveWarning = 'Existing unreadable progress is protected. Import a valid backup or reset progress before saving.';
        return false;
      }
      const clean = normalize(state, false);
      root.localStorage.setItem(KEY, JSON.stringify(clean));
      overwriteBlocked = false;
      api.loadWarning = '';
      return true;
    } catch (_) {
      api.saveWarning = 'Progress could not be saved. Browser storage may be full or disabled. Export a backup before closing.';
      return false;
    }
  }
  function scheduler(state) {
    return root.FSRS.fsrs({ request_retention: number(state.settings.retention, 'target retention', 0.7, 0.99),
      maximum_interval: 365, enable_fuzz: false, enable_short_term: true,
      learning_steps: ['1m', '10m'], relearning_steps: ['1m', '10m'] });
  }
  function cardFor(state, id) {
    knownId(Number(id), validIds());
    if (!own(state.cards, id)) return root.FSRS.createEmptyCard(new Date());
    const card = { ...state.cards[id].card, due: new Date(state.cards[id].card.due) };
    if (card.last_review) card.last_review = new Date(card.last_review);
    return card;
  }
  function recallOf(state, id, now = new Date()) {
    const entry = state.cards[id];
    if (!entry || !entry.attempts) return 0;
    const value = scheduler(state).get_retrievability(cardFor(state, id), now, false);
    return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  }
  function status(state, id) {
    const entry = state.cards[id];
    if (!entry || !entry.attempts) return 'new';
    if (!entry.lastCorrect) return 'weak';
    return entry.successDays.length >= 3 && entry.card.stability >= 7 && recallOf(state, id) >= 0.85 ? 'stable' : 'learning';
  }
  function metrics(state) {
    const result = { seen: 0, due: 0, stable: 0, weak: 0, newCount: 0, attempts: 0, correct: 0, accuracy: 0, recall: 0 };
    const now = new Date();
    for (const q of questions()) {
      const entry = state.cards[q.id];
      if (!entry || !entry.attempts) { result.newCount++; continue; }
      result.seen++;
      if (new Date(entry.card.due) <= now) result.due++;
      const tag = status(state, q.id);
      if (tag === 'stable') result.stable++;
      if (tag === 'weak') result.weak++;
      result.attempts += entry.attempts;
      result.correct += entry.correct;
      result.recall += recallOf(state, q.id, now) * 100;
    }
    result.accuracy = result.attempts ? Math.round(100 * result.correct / result.attempts) : 0;
    result.recall = result.seen ? Math.round(result.recall / result.seen) : 0;
    return result;
  }
  function dayOf(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }
  function applyRating(state, id, rating, correct, now = new Date()) {
    id = knownId(Number(id), validIds());
    number(rating, 'rating', 1, 4, true);
    bool(correct, 'answer result');
    const date = new Date(iso(now, 'review time'));
    const previous = state.cards[id];
    if (previous && previous.card.last_review && date < new Date(previous.card.last_review)) throw Error('Review time cannot precede the last review.');
    // A wrong or revealed-without-recall answer cannot advance the schedule.
    correct = correct && rating !== 1;
    if (!correct) rating = 1;
    const result = scheduler(state).next(cardFor(state, id), date, rating);
    const entry = { card: serialCard(result.card), attempts: (previous?.attempts || 0) + 1,
      correct: (previous?.correct || 0) + (correct ? 1 : 0),
      wrong: (previous?.wrong || 0) + (correct ? 0 : 1),
      streak: correct ? (previous?.streak || 0) + 1 : 0,
      successDays: correct ? [...new Set([...(previous?.successDays || []), dayOf(date)])].slice(-LIMIT) : [],
      lastCorrect: correct };
    state.cards[id] = entry;
    state.history.push({ id, rating, correct, at: date.toISOString(), due: entry.card.due, stability: entry.card.stability });
    if (state.history.length > LIMIT) state.history.splice(0, state.history.length - LIMIT);
    return entry;
  }
  function shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function interleave(list) {
    const groups = new Map();
    for (const q of list) {
      const key = String(q.lecture);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(q);
    }
    const result = [];
    while (groups.size) for (const [key, group] of groups) {
      result.push(group.shift());
      if (!group.length) groups.delete(key);
    }
    return result;
  }
  function buildQueue(state, options = {}) {
    const { lecture = 'all', difficulty = 'all', scope = 'smart', limit = 20 } = options;
    const countLimit = Math.max(0, Math.min(questions().length, Number.isFinite(Number(limit)) ? Math.floor(Number(limit)) : 20));
    const filtered = questions().filter(q => (lecture === 'all' || Number(q.lecture) === Number(lecture)) &&
      (difficulty === 'all' || String(q.difficulty).toLowerCase() === String(difficulty).toLowerCase()));
    let result;
    if (scope === 'smart') {
      const now = Date.now();
      const due = filtered.filter(q => state.cards[q.id] && new Date(state.cards[q.id].card.due).getTime() <= now)
        .sort((a, b) => Number(state.cards[a.id].lastCorrect) - Number(state.cards[b.id].lastCorrect) ||
          new Date(state.cards[a.id].card.due) - new Date(state.cards[b.id].card.due));
      const unseen = shuffle(filtered.filter(q => !state.cards[q.id]));
      result = [...interleave(due.filter(q => !state.cards[q.id].lastCorrect)),
        ...interleave(due.filter(q => state.cards[q.id].lastCorrect)), ...interleave(unseen)];
    } else if (scope === 'weak') result = interleave(shuffle(filtered.filter(q => state.cards[q.id] && !state.cards[q.id].lastCorrect)));
    else if (scope === 'bookmarked') result = interleave(shuffle(filtered.filter(q => state.bookmarks.includes(q.id))));
    else result = interleave(shuffle(filtered));
    return result.slice(0, countLimit).map(q => Number(q.id));
  }
  function validateImport(data) {
    const result = normalize(data, true);
    importedStates.add(result);
    return result;
  }
  function formatInterval(date, now = new Date()) {
    const ms = new Date(date).getTime() - new Date(now).getTime();
    if (!Number.isFinite(ms)) return 'Not scheduled';
    if (ms <= 0) return 'Due now';
    if (ms < 60000) return 'Less than 1 minute';
    if (ms < 3600000) return Math.ceil(ms / 60000) + ' min';
    if (ms < 86400000) return Math.ceil(ms / 3600000) + ' hr';
    const days = Math.ceil(ms / 86400000);
    return days + (days === 1 ? ' day' : ' days');
  }
  root.RecallEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
