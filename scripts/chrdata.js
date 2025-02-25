export const player = {
    name: 'John Doe',
    experience: 100
};

export const npcs = [
    // Example NPCs
    { name: 'NPC 1', tokenId: 'npc_1' },
    { name: 'NPC 2', tokenId: 'npc_2' }
];

export const npcRegistry = {
    'npc_1': npcs[0],
    'npc_2': npcs[1]
};

// A list of possible NPC names
export const NPC_NAMES = [
    "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Marcus", "Lucius", "Felix", "Cassius", "Tiberius", "Gaius", "Julius", "Vitus", "Darius", "Quintus", "Hector", "Isabella", "Jasper", "Katherine", "Leon", "Mira", "Nina", "Oscar", "Penelope", "Quincy",
    "Rufus", "Sophia", "Thomas", "Ursula", "Victor", "Wendy", "Xander", "Yara", "Zane", "Darius", "Felix", "Lucia", "Morgan", "Talia", "Reiner", "Elena", "Hector", "Isabella", "Jasper", "Katherine", "Leon", "Mira", "Nina", "Oscar", "Penelope", "Quincy", "Rufus", "Sophia", "Thomas", "Ursula", "Victor", "Wendy", "Xander", "Yara", "Zane"
];

export const dialogues = {
    default: [
        `I can't believe they are all dead... ${player.name}, was it my fault?`,
        `I was RIGHT THERE! I could've saved them, ${player.name}!`,
        `Why did this have to happen? ${player.name}, what do we do now?`,
        `I feel so lost without them... ${player.name}, can you help me?`,
        `This is all too much... ${player.name}, I don't know if I can go on.`
    ],
    battle: [
        `We fought bravely, but it wasn't enough... ${player.name}, what now?`,
        `The battle was fierce, but we survived... ${player.name}, what's next?`,
        `I can't shake the images of the battlefield... ${player.name}, how do you cope?`,
        `Victory came at a great cost... ${player.name}, was it worth it?`,
        `We lost many good people today... ${player.name}, how do we honor them?`
    ],
    personal: [
        `I've been thinking a lot about my past... ${player.name}, do you ever regret your choices?`,
        `Sometimes I wonder if I made the right decisions... ${player.name}, what about you?`,
        `I miss my family... ${player.name}, do you have anyone waiting for you?`,
        `It's hard to stay strong all the time... ${player.name}, how do you do it?`,
        `I have dreams of a better future... ${player.name}, do you think it's possible?`
    ]
};

export const personalityPool = ["Brave", "Cautious", "Hotheaded", "Loyal", "Stoic", "Curious", "Friendly", "Grumpy", "Optimistic", "Pessimistic"];
export const backgroundPool = ["former farmer", "city guard", "escaped slave", "wandering mercenary", "battle-scarred veteran", "noble's child", "orphan", "scholar", "merchant", "blacksmith"];

