import { dialogues } from './chrdata.js';

export class Dialogue {
    constructor(npc) {
        this.npc = npc;
        this.possibleDialogues = dialogues.default; // Use default dialogues or customize as needed
    }

    getRandomDialogue() {
        return this.possibleDialogues[Math.floor(Math.random() * this.possibleDialogues.length)];
    }
}