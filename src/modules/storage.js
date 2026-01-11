// Damit werden alle DOM-Änderungen und das Kategoriefeld überwacht
export function setupAutoSave() {
    const questionsContainer = document.querySelector('.demo-questions');
    const catInput = document.getElementById('category-input'); // Referenz zum Kategoriefeld
    
    if (!questionsContainer) return;
    
    // Beim Laden gespeicherte Fragen laden
    const savedQuestions = localStorage.getItem('autoSavedQuestions');
    if (savedQuestions) {
        questionsContainer.innerHTML = savedQuestions;
    }

    //Beim Laden gespeicherten Kategorienamen laden
    if (catInput) {
        const savedCategory = localStorage.getItem('autoSavedCategory');
        if (savedCategory) {
            catInput.value = savedCategory;
        }

        // Event-Listener für manuelle Eingaben im Kategoriefeld
        catInput.addEventListener('input', () => {
            localStorage.setItem('autoSavedCategory', catInput.value);
        });
    }
    
    // Observer für alle Änderungen im Fragen-Container
    const observer = new MutationObserver(() => {
        localStorage.setItem('autoSavedQuestions', questionsContainer.innerHTML);
    });
    
    // Alle Arten von Änderungen im Fragen-Container überwachen
    observer.observe(questionsContainer, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });
}