export class NPC {
    constructor(name, personality, experience, loyalty, background, uniqueId) {
        this.name = name;
        this.personality = personality;
        this.experience = experience;
        this.loyalty = loyalty;
        this.background = background;
        this.tokenId = uniqueId; // Assign unique token ID
    }

    gainExperience() {
        this.experience++;
    }

    adjustLoyalty(amount) {
        this.loyalty += amount;
    }

    getIntroduction() {
        return `${this.name}, a ${this.background}, seems ${this.personality.toLowerCase()}.`;
    }
}