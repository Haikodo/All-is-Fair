document.addEventListener("DOMContentLoaded", function () {
    let units = ["Soldier 1", "Soldier 2", "Soldier 3", "Soldier 4", "Soldier 5"];
    let battleLog = document.getElementById("battle-log");
    let npcDialogue = document.getElementById("npc-dialogue");
    let npcText = document.getElementById("npc-text");

    function startBattle() {
        battleLog.innerHTML = "The battle begins...\n";
        let remainingUnits = [...units];

        // Simulate battle
        while (remainingUnits.length > 1) {
            let casualty = Math.floor(Math.random() * remainingUnits.length);
            let deadUnit = remainingUnits.splice(casualty, 1)[0];
            battleLog.innerHTML += `${deadUnit} has fallen!\n`;
        }

        // The last remaining unit is promoted to NPC
        let survivor = remainingUnits[0];
        battleLog.innerHTML += `${survivor} is the sole survivor of the battle...\n`;
        
        promoteToNPC(survivor);
    }

    function promoteToNPC(unitName) {
        npcDialogue.style.display = "block";

        // Randomly select one of the emotional responses
        let possibleDialogues = [
            `${unitName}: "I can't believe they are all dead... [Player], was it my fault?"`,
            `${unitName}: "I was RIGHT THERE! I could've saved them, [Player]!"`
        ];

        npcText.textContent = possibleDialogues[Math.floor(Math.random() * possibleDialogues.length)];
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
    window.startBattle = startBattle;
    window.setStance = setStance;
});
