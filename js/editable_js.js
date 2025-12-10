export function setupEditable() {
    document.querySelectorAll('[contenteditable][id]').forEach(el => {
        const key = 'demo_' + el.id;
        const saved = localStorage.getItem(key);
        if (saved) el.textContent = saved;
        if (!el._boundEditable) {
            el.addEventListener('input', () => {
                localStorage.setItem(key, el.textContent);
            });
            el._boundEditable = true;
        }
    });
}

export function setupRemoveButtons() {
    document.querySelectorAll('.remove-question-btn').forEach(btn => {
        btn.onclick = function () {
            const qid = btn.getAttribute('data-qid');
            const qDiv = document.getElementById(qid);
            if (qDiv) qDiv.remove();
            localStorage.removeItem('demo_' + qid + '-text');
            for (let i = 1; i <= 4; i++) localStorage.removeItem('demo_' + qid + '-opt' + i);
        };
    });
}

export function setupAutoSave() {
    const questionsContainer = document.querySelector('.demo-questions');
    if (!questionsContainer) return;
    
    const saved = localStorage.getItem('autoSavedQuestions');
    if (saved) {
        questionsContainer.innerHTML = saved;
    }
    
    const observer = new MutationObserver(() => {
        localStorage.setItem('autoSavedQuestions', questionsContainer.innerHTML);
    });
    
    observer.observe(questionsContainer, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });
}