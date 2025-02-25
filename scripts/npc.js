import { toggleButtons, toggleInfo } from './utils.js';
import { player, npcs, npcRegistry, dialogues } from './chrdata.js';
import { getRandomName, getRandomPersonality, getRandomBackground, generateTokenId } from './npcUtils.js';
import { NPC } from './npcClass.js';
import { Dialogue } from './dialogueClass.js';

const dialoguesElement = document.getElementById('npc-dialogue'); // Ensure this ID matches the HTML
const npcText = document.getElementById('npc-text'); // Ensure this ID matches the HTML

export function showPlayerInfo() {
    toggleInfo('player-info');
    // Populate player info
    document.getElementById('player-info').innerHTML = `
        <h2>Player Info</h2>
        <p>Name: ${player.name}</p>
        <p>Experience: ${player.experience}</p>
    `;
    console.log("Player info displayed.");

    // Disable the active info button
    toggleButtons(['player-info-button', 'npc-list-button'], 'player-info-button');
}

export function showNPCList() {
    toggleInfo('npc-list');
    // Populate NPC list
    let npcListHtml = '<h2>Talk to...</h2>';
    npcs.forEach(npc => {
        npcListHtml += `<button onclick="talkToNPC('${npc.tokenId}')">${npc.name}</button>`;
    });
    document.getElementById('npc-list').innerHTML = npcListHtml;
    console.log("NPC list displayed.");

    // Disable the active info button
    toggleButtons(['player-info-button', 'npc-list-button'], 'npc-list-button');
}

export function talkToNPC(npcId) {
    const npc = npcRegistry[npcId];
    if (npc) {
        alert(`Talking to ${npc.name}`);
        console.log(`Talking to NPC: ${npc.name}`);
        // Implement the dialogue interaction here
    }
}

export function promoteToNPC(unitName) {
    let npcName = getRandomName();
    let personality = getRandomPersonality();
    let experience = Math.floor(Math.random() * 100);
    let loyalty = Math.floor(Math.random() * 100);
    let background = getRandomBackground();
    let uniqueId = generateTokenId();

    let newNPC = new NPC(npcName, personality, experience, loyalty, background, uniqueId);
    npcs.push(newNPC);
    npcRegistry[newNPC.tokenId] = newNPC; // Add NPC to registry

    dialoguesElement.style.display = "block";

    let dialogue = new Dialogue(newNPC);
    npcText.textContent = `${newNPC.name}: ` + dialogue.getRandomDialogue();
    console.log("New NPC Created:", newNPC);
}