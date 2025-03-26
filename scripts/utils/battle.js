// This file contains functions related to battle mechanics, including starting battles and promoting units to NPCs.

import { NPC } from '../classes/NPC.js';
import { generateTokenId, getRandomName, getRandomPersonality, getRandomBackground, promoteToNPC } from './npcManagement.js';

function startBattle() {
    let battleLog = document.getElementById("battle-log");
    let units = ["Soldier 1", "Soldier 2", "Soldier 3", "Soldier 4", "Soldier 5"];
    battleLog.innerHTML = "The battle begins...\n";
    let remainingUnits = [...units];
        let casualty = Math.floor(Math.random() * remainingUnits.length);
        let deadUnit = remainingUnits.splice(casualty, 1)[0];
        battleLog.innerHTML += `${deadUnit} has fallen!\n`;
    }

    let survivor = remainingUnits[0];
    battleLog.innerHTML += `${survivor} is the sole survivor of the battle...\n`;

    promoteToNPC(survivor);
}

export function promoteToNPC(unitName, npcs, npcRegistry, npcDialogue, npcText) {
    let npcName = getRandomName();
    let personality = getRandomPersonality();
    let background = getRandomBackground();
    let experience = Math.floor(Math.random() * 100);
    let loyalty = Math.floor(Math.random() * 100);
    let uniqueId = generateTokenId();

    let newNPC = new NPC(
        npcName,
        personality,
        background,
        experience,
        loyalty,
        uniqueId
    );
    npcs.push(newNPC);
    npcRegistry[newNPC.tokenId] = newNPC; // Add NPC to registry

    npcDialogue.style.display = "block";

    let dialogue = new Dialogue(newNPC);
    npcText.textContent = `${newNPC.name}: ` + dialogue.getRandomDialogue();

    // Log NPC details in the specified order
    console.log("New NPC Created:", {
        name: newNPC.name,
        tokenId: newNPC.tokenId,
        personality: newNPC.personality,
        experience: newNPC.experience,
        loyalty: newNPC.loyalty,
        memory: {
            opinions: newNPC.memory.Relationships.getOpinionsWithNames(npcRegistry),
            friends: newNPC.memory.Relationships.friends.map((friendId) =>
                npcRegistry[friendId] ? npcRegistry[friendId].name : "Unknown NPC"
            ),
            enemies: newNPC.memory.Relationships.enemies.map((enemyId) =>
                npcRegistry[enemyId] ? npcRegistry[enemyId].name : "Unknown NPC"
            ),
        },
    });
}