export function toggleButtons(buttonIds, activeButtonId) {
    buttonIds.forEach(buttonId => {
        document.getElementById(buttonId).disabled = (buttonId === activeButtonId);
    });
}

export function toggleInfo(infoId) {
    const infoSections = document.querySelectorAll('.info-container');
    infoSections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(infoId).style.display = 'block';
    console.log(`Displaying ${infoId}`);
}

export function switchMode(mode, logMessage, activeButtonId) {
    battleState = mode;
    battleLog.innerHTML = logMessage;
    console.log(`Switched to ${mode} mode.`);
    toggleButtons(['map-mode-button', 'deployment-mode-button', 'battle-mode-button'], activeButtonId);
}