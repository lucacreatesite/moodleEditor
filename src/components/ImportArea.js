// Import-Bereich mit Drag&Drop und Datei-Input für JSON/CSV
// Wird von der UI-Komponente genutzt, um Import zu ermöglichen
export function renderImportArea(container) {
  container.innerHTML = '';
  const dropZone = document.createElement('div');
  dropZone.className = 'drop-zone';
  dropZone.tabIndex = 0;
  dropZone.textContent = 'Datei hierher ziehen oder klicken, um auszuwählen (.json, .csv)';
  dropZone.style.padding = '2em';
  dropZone.style.textAlign = 'center';
  dropZone.style.cursor = 'pointer';
  dropZone.setAttribute('data-testid', 'import-area');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json,.csv';
  fileInput.style.display = 'none';
  fileInput.setAttribute('data-testid', 'file-input');

  // Klick auf Dropzone öffnet Datei-Dialog
  dropZone.addEventListener('click', () => fileInput.click());

  // Drag&Drop-Events für visuelles Feedback
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('hover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    // Datei-Handling hier (Demo: keine echte Verarbeitung)
    alert('Datei-Import Demo: Datei angenommen!');
  });

  // Datei-Auswahl über Dialog
  fileInput.addEventListener('change', e => {
    if (fileInput.files.length) {
      alert('Datei-Import Demo: Datei angenommen!');
    }
  });

  container.appendChild(dropZone);
  container.appendChild(fileInput);
}