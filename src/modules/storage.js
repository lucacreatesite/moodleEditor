//Damit werden alle DOM-Änderungen überwacht
export function setupAutoSave() {
    const questionsContainer = document.querySelector('.demo-questions');
    if (!questionsContainer) return;
    
    // Beim Laden gespeicherte Fragen laden
    const saved = localStorage.getItem('autoSavedQuestions');
    if (saved) {
        questionsContainer.innerHTML = saved;
    }
    
    // Observer für alle Änderungen im Container
    const observer = new MutationObserver(() => {
        localStorage.setItem('autoSavedQuestions', questionsContainer.innerHTML);
    });
    
    // Alle Arten von Änderungen überwachen
    observer.observe(questionsContainer, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });
}