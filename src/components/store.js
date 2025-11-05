/*

// Store für Fragen, Undo/Redo, Seed-Daten

// Enum für Fragetypen (Single/Multi-Choice)
export const QuestionType = { SINGLE: 'single', MULTI: 'multi' };

const MAX_HISTORY = 20; // Maximale Undo-Schritte

// Haupt-Store-Objekt für Fragenverwaltung, Undo/Redo und Listener
const store = {
  state: {
    questions: [...seedQuestions], // Aktuelle Fragenliste
    history: [],                   // Undo-Stack (Vergangenheit)
    future: []                     // Redo-Stack (Zukunft)
  },
  listeners: [], // Array für Listener-Funktionen (z.B. UI-Updates)

  // Registrierung eines Listeners (UI-Komponenten können sich anmelden)
  subscribe(fn) {
    this.listeners.push(fn);
  },

  // Benachrichtigt alle Listener über Änderungen an der Fragenliste
  notify() {
    this.listeners.forEach(fn => fn(this.state.questions));
  },

  // Setzt die gesamte Fragenliste neu (mit Undo)
  setAll(arr) {
    this._pushHistory();
    this.state.questions = arr.map((q, i) => ({ ...q, order: i + 1, id: q.id || crypto.randomUUID() }));
    this.notify();
  },

  // Alias für setAll (gleiche Funktionalität)
  replaceAll(arr) {
    this.setAll(arr);
  },

  // Fügt eine neue Frage hinzu (mit Undo)
  add(q) {
    this._pushHistory();
    const order = this.state.questions.length + 1;
    this.state.questions.push({ ...q, id: q.id || crypto.randomUUID(), order });
    this.notify();
  },

  // Aktualisiert eine Frage anhand der ID (mit Undo)
  update(id, patch) {
    this._pushHistory();
    this.state.questions = this.state.questions.map(q => q.id === id ? { ...q, ...patch } : q);
    this.notify();
  },

  // Entfernt eine Frage anhand der ID (mit Undo)
  remove(id) {
    this._pushHistory();
    this.state.questions = this.state.questions.filter(q => q.id !== id);
    this._reindexOrders();
    this.notify();
  },

  // Verschiebt eine Frage nach oben (mit Undo)
  moveUp(id) {
    const idx = this.state.questions.findIndex(q => q.id === id);
    if (idx > 0) {
      this._pushHistory();
      [this.state.questions[idx - 1], this.state.questions[idx]] = [this.state.questions[idx], this.state.questions[idx - 1]];
      this._reindexOrders();
      this.notify();
    }
  },

  // Verschiebt eine Frage nach unten (mit Undo)
  moveDown(id) {
    const idx = this.state.questions.findIndex(q => q.id === id);
    if (idx > -1 && idx < this.state.questions.length - 1) {
      this._pushHistory();
      [this.state.questions[idx + 1], this.state.questions[idx]] = [this.state.questions[idx], this.state.questions[idx + 1]];
      this._reindexOrders();
      this.notify();
    }
  },

  // Undo: Setzt die Fragenliste auf den letzten Zustand zurück
  undo() {
    if (this.state.history.length) {
      this.state.future.push([...this.state.questions]);
      this.state.questions = this.state.history.pop();
      this.notify();
    }
  },

  // Redo: Stellt einen rückgängig gemachten Zustand wieder her
  redo() {
    if (this.state.future.length) {
      this.state.history.push([...this.state.questions]);
      this.state.questions = this.state.future.pop();
      this.notify();
    }
  },

  // Interner Helper: Speichert aktuellen Zustand für Undo
  _pushHistory() {
    this.state.history.push(this.state.questions.map(q => ({ ...q, options: q.options.map(o => ({ ...o })) })));
    if (this.state.history.length > MAX_HISTORY) this.state.history.shift();
    this.state.future = [];
  },

  // Interner Helper: Aktualisiert die Reihenfolge (order) aller Fragen
  _reindexOrders() {
    this.state.questions.forEach((q, i) => { q.order = i + 1; });
  }
};

export default store;

*/