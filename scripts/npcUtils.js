import { NPC_NAMES, personalityPool, backgroundPool } from './chrdata.js';

export function getRandomName() {
    return NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
}

export function getRandomPersonality() {
    return personalityPool[Math.floor(Math.random() * personalityPool.length)];
}

export function getRandomBackground() {
    return backgroundPool[Math.floor(Math.random() * backgroundPool.length)];
}

export function generateTokenId() {
    return 'npc_' + Math.random().toString(36).substr(2, 9);
}