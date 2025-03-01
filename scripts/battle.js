import { toggleButtons } from './utils.js';
import { promoteToNPC } from './npc.js';

let units = ["Soldier 1", "Soldier 2", "Soldier 3", "Soldier 4", "Soldier 5"];
let battleLog = document.getElementById("battle-log");
let battlefieldName = document.getElementById("battlefield-name");
let battleState = "map"; // Initial state

function setBattlefieldName(name) {
    battlefieldName.innerHTML = `Battlefield: ${name}`;
}

export function switchMode(mode, logMessage, activeButtonId) {
    battleState = mode;
    battleLog.innerHTML = logMessage;
    console.log(`Switched to ${mode} mode.`);
    toggleButtons(['map-mode-button', 'deployment-mode-button', 'battle-mode-button'], activeButtonId);
}

export function switchToMapMode() {
    switchMode('map', "You are in Map mode. Select a battlefield to start the battle.", 'map-mode-button');
}

export function switchToDeploymentMode() {
    switchMode('deployment', "You are in Deployment mode. Deploy your units.", 'deployment-mode-button');
}

export function switchToBattleMode() {
    switchMode('battle', "The battle begins...\n", 'battle-mode-button');
}

function startBattle() {
    if (battleState !== "battle") {
        console.error("Cannot start battle. Not in Battle mode.");
        return;
    }

    let remainingUnits = [...units];

    while (remainingUnits.length > 1) {
        let casualty = Math.floor(Math.random() * remainingUnits.length);
        let deadUnit = remainingUnits.splice(casualty, 1)[0];
        battleLog.innerHTML += `${deadUnit} has fallen!\n`;
    }

    let survivor = remainingUnits[0];
    battleLog.innerHTML += `${survivor} is the sole survivor of the battle...\n`;
    
    promoteToNPC(survivor);
}

document.addEventListener("DOMContentLoaded", function () {
    const dialoguesElement = document.getElementById('npc-dialogue'); // Ensure this ID matches the HTML

    function setStance(stance) {
        let responseLog = {
            "positive": "You console the survivor, reassuring them that they did what they could.",
            "negative": "You rebuke them for surviving while others perished.",
            "neutral": "You remain neutral, offering no strong reaction.",
            "none": "You say nothing, letting silence hang in the air."
        };

        battleLog.innerHTML += responseLog[stance] + "\n";
        dialoguesElement.style.display = "none";
    }

    // Expose functions globally
    window.setStance = setStance;
});

// Expose functions globally
window.setBattlefieldName = setBattlefieldName;
window.switchToMapMode = switchToMapMode;
window.switchToDeploymentMode = switchToDeploymentMode;
window.switchToBattleMode = switchToBattleMode;
window.startBattle = startBattle;