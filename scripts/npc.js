import { toggleButtons, toggleInfo } from './utils.js';

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