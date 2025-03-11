//this repeats a LOT of stuff already in the script.js file, but I'm not sure how to make it work otherwise.
//It will break the game if I don't include it here, so I'm leaving it in for now.

let units = ["Soldier 1", "Soldier 2", "Soldier 3", "Soldier 4", "Soldier 5"];
let battleLog = document.getElementById("battle-log");
let battlefieldName = document.getElementById("battlefield-name");
let battleState = "map"; // Initial state

function setBattlefieldName(name) {
    battlefieldName.innerHTML = `Battlefield: ${name}`;
}

function switchToMapMode() {
    battleState = "map";
    battleLog.innerHTML = "You are in Map mode. Select a battlefield to start the battle.";
    console.log("Switched to Map mode.");
}

function switchToDeploymentMode() {
    battleState = "deployment";
    battleLog.innerHTML = "You are in Deployment mode. Deploy your units.";
    console.log("Switched to Deployment mode.");
}

function switchToBattleMode() {
    battleState = "battle";
    battleLog.innerHTML = "The battle begins...\n";
    console.log("Switched to Battle mode.");
    startBattle();
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

function promoteToNPC(unitName) {
    let npcName = getRandomName();
    let personality = getRandomPersonality();
    let experience = Math.floor(Math.random() * 100);
    let loyalty = Math.floor(Math.random() * 100);
    let background = getRandomBackground();
    let uniqueId = generateTokenId();

    let newNPC = new NPC(npcName, personality, experience, loyalty, background, uniqueId);
    npcs.push(newNPC);
    npcRegistry[newNPC.tokenId] = newNPC; // Add NPC to registry

    npcDialogue.style.display = "block";

    let dialogue = new Dialogue(newNPC);
    npcText.textContent = `${newNPC.name}: ` + dialogue.getRandomDialogue();
    console.log("New NPC Created:", newNPC);
}

function setStance(stance) {
    let responseLog = {
        "positive": "You console the survivor, reassuring them that they did what they could.",
        "negative": "You rebuke them for surviving while others perished.",
        "neutral": "You remain neutral, offering no strong reaction.",
        "none": "You say nothing, letting silence hang in the air."
    };

    battleLog.innerHTML += responseLog[stance] + "\n";
    npcDialogue.style.display = "none";
}

// Expose functions globally
window.setBattlefieldName = setBattlefieldName;
window.switchToMapMode = switchToMapMode;
window.switchToDeploymentMode = switchToDeploymentMode;
window.switchToBattleMode = switchToBattleMode;
window.startBattle = startBattle;
window.setStance = setStance;