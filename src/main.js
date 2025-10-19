import { loadFromBackend, syncToBackend } from './api/client.js';

// Minimal hook (no-op to keep demo index.html in control)
window.addEventListener('DOMContentLoaded', () => {
  // loadFromBackend(); // keep disabled for the demo
});

export { loadFromBackend, syncToBackend };