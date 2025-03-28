document.addEventListener("DOMContentLoaded", function () {
    // Variables
    let units = ["Soldier 1", "Soldier 2", "Soldier 3", "Soldier 4", "Soldier 5"];
    let battleLog = document.getElementById("battle-log");
    let npcDialogue = document.getElementById("npc-dialogue");
    let npcText = document.getElementById("npc-text");
    let npcs = []; // Array to store created NPCs
    let npcRegistry = {}; // Object to store NPCs by token ID
    let currentSaveSlot = "manualSave"; // Default save slot
    let autosaveIntervalId = null; // Variable to store the autosave interval ID

    // Classes
    class NPC {
        constructor(name, personality, background, experience, loyalty, uniqueId) {
            this.name = name;
            this.personality = personality;
            this.background = background;
            this.experience = experience;
            this.loyalty = loyalty;
            this.tokenId = uniqueId; // Assign unique token ID
            this.memory = new NPCMemory(this); // Create a memory object
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

        getMemory() {
            return this.memory;
        }
    }

    class NPCMemory {
        constructor(npcEvents = []) {
            this.Relationships = new Relationship(); // Remove the 0
            this.Events = npcEvents;
        }
    }

    class Relationship {
        constructor(friends = [], enemies = [], npcOpinions = {}) {
            this.opinionPlayer = 0; // Default opinion towards the player
            this.friends = friends;
            this.enemies = enemies;
            this.npcOpinions = npcOpinions; // Object to store opinions on specific NPCs
        }

        setOpinion(npcTokenId, opinion) {
            this.npcOpinions[npcTokenId] = opinion;
        }

        getOpinion(npcTokenId) {
            return this.npcOpinions[npcTokenId] || 0; // Default opinion is 0 if not set
        }

        getOpinionsWithNames(npcRegistry) {
            return Object.keys(this.npcOpinions).map(tokenId => {
                return {
                    name: npcRegistry[tokenId] ? npcRegistry[tokenId].name : "Unknown NPC",
                    opinion: this.npcOpinions[tokenId]
                };
            });
        }
    }

    class Dialogue {
        constructor(npc) {
            this.npc = npc;
            this.possibleDialogues = dialogues.default; // Use default dialogues or customize as needed
        }

        getRandomDialogue() {
            return this.possibleDialogues[Math.floor(Math.random() * this.possibleDialogues.length)];
        }
    }

    // Functions
    function saveNPCs(slot = currentSaveSlot) {
        const npcData = npcs.map(npc => {
            const memoryCopy = {
                Relationships: {
                    opinionPlayer: npc.memory.Relationships.opinionPlayer,
                    friends: npc.memory.Relationships.friends,
                    enemies: npc.memory.Relationships.enemies,
                    npcOpinions: npc.memory.Relationships.npcOpinions
                },
                Events: Array.isArray(npc.memory.Events) ? npc.memory.Events.map(event => ({ ...event })) : [] // Ensure Events is an array
            };
            return {
                name: npc.name,
                personality: npc.personality,
                background: npc.background,
                experience: npc.experience,
                loyalty: npc.loyalty,
                tokenId: npc.tokenId,
                memory: memoryCopy
            };
        });
        localStorage.setItem(slot, JSON.stringify(npcData));
        console.log(`NPCs saved to ${slot}.`);
    }

    function loadNPCs(slot = currentSaveSlot) {
        let storedNPCs = localStorage.getItem(slot);
        if (storedNPCs) {
            npcs = JSON.parse(storedNPCs).map(npcData => {
                const npc = new NPC(
                    npcData.name,
                    npcData.personality,
                    npcData.background,
                    npcData.experience,
                    npcData.loyalty,
                    npcData.tokenId
                );
                npc.memory.Relationships.opinionPlayer = npcData.memory.Relationships.opinionPlayer;
                npc.memory.Relationships.friends = npcData.memory.Relationships.friends;
                npc.memory.Relationships.enemies = npcData.memory.Relationships.enemies;
                npc.memory.Relationships.npcOpinions = npcData.memory.Relationships.npcOpinions;
                npc.memory.Events = npcData.memory.Events;
                return npc;
            });
            npcRegistry = {};
            npcs.forEach(npc => {
                npcRegistry[npc.tokenId] = npc;
            });
            console.log(`NPCs loaded from ${slot}.`);
        }
    }

    function wipeLocalStorage() {
        localStorage.clear();
        npcs = [];
        npcRegistry = {};
        console.log("LocalStorage wiped.");
    }

    function getRandomName() {
        return NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    }

    function getRandomPersonality() {
        return personalityPool[Math.floor(Math.random() * personalityPool.length)];
    }

    function getRandomBackground() {
        return backgroundPool[Math.floor(Math.random() * backgroundPool.length)];
    }

    function generateTokenId() {
        return 'npc_' + Math.random().toString(36).substr(2, 9); // Simple unique token ID
    }

    function startBattle() {
        battleLog.innerHTML = "The battle begins...\n";
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
        let background = getRandomBackground();
        let experience = Math.floor(Math.random() * 100);
        let loyalty = Math.floor(Math.random() * 100);
        let uniqueId = generateTokenId();

        let newNPC = new NPC(npcName, personality, background, experience, loyalty, uniqueId);
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
                friends: newNPC.memory.Relationships.friends.map(friendId => npcRegistry[friendId] ? npcRegistry[friendId].name : "Unknown NPC"),
                enemies: newNPC.memory.Relationships.enemies.map(enemyId => npcRegistry[enemyId] ? npcRegistry[enemyId].name : "Unknown NPC")
            }
        });
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

    function debugNPCs() {
        console.log("Current NPCs:", npcs.map(npc => ({
            name: npc.name,
            tokenId: npc.tokenId,
            personality: npc.personality,
            experience: npc.experience,
            loyalty: npc.loyalty,
            memory: {
                opinions: npc.memory.Relationships.getOpinionsWithNames(npcRegistry),
                friends: npc.memory.Relationships.friends.map(friendId => npcRegistry[friendId] ? npcRegistry[friendId].name : "Unknown NPC"),
                enemies: npc.memory.Relationships.enemies.map(enemyId => npcRegistry[enemyId] ? npcRegistry[enemyId].name : "Unknown NPC")
            }
        })));
        console.log("NPC Registry:",
            Object.keys(npcRegistry).map(tokenId => ({
                tokenId: tokenId,
                name: npcRegistry[tokenId].name
            }))
        );
    }

    // Expose debugNPCs function globally
    window.debugNPCs = debugNPCs;

    function addOrUpdateNPC(npc) {
        npcRegistry[npc.tokenId] = npc; // If token ID already exists, it will overwrite
        const existingNPCIndex = npcs.findIndex(existingNPC => existingNPC.tokenId === npc.tokenId);
        if (existingNPCIndex !== -1) {
            npcs[existingNPCIndex] = npc; // Update existing NPC
        } else {
            npcs.push(npc); // Add new NPC
        }
    }

    function exportNPCs() {
        let dataStr = JSON.stringify(npcs, null, 2);
        let blob = new Blob([dataStr], { type: "application/json" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "npcs.json";
        a.click();
    }

    function importNPCs(event) {
        let file = event.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = function (e) {
            try {
                let importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    importedData.forEach(npcData => {
                        if (validateNPCData(npcData)) {
                            let existingNPCIndex = npcs.findIndex(npc => npc.tokenId === npcData.tokenId);
                            let newNPC = new NPC(npcData.name, npcData.personality, npcData.experience, npcData.loyalty, npcData.background, npcData.tokenId);
                            
                            if (existingNPCIndex !== -1) {
                                // Update existing NPC
                                npcs[existingNPCIndex] = newNPC;
                                console.log(`${npcData.name} with tokenId ${npcData.tokenId} has been overwritten.`);
                            } else {
                                // Add new NPC
                                npcs.push(newNPC);
                            }
                            
                            // Update the registry
                            npcRegistry[newNPC.tokenId] = newNPC;
                        } else {
                            console.error("Invalid NPC data:", npcData);
                        }
                    });
                    console.log("NPCs imported successfully:", npcs);
                } else {
                    console.error("Invalid data format. Expected an array of NPCs.");
                }
            } catch (error) {
                console.error("Error importing NPCs:", error);
            }
        };
        reader.readAsText(file);
    }

    function validateNPCData(npcData) {
        return npcData &&
            typeof npcData.name === 'string' &&
            typeof npcData.personality === 'string' &&
            typeof npcData.experience === 'number' &&
            typeof npcData.loyalty === 'number' &&
            typeof npcData.background === 'string' &&
            typeof npcData.tokenId === 'string';
    }

    function createDevTools() {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.id = "importNPCFile";
        input.style.display = "none";
        input.addEventListener("change", importNPCs);
        document.body.appendChild(input);

        let exportButton = document.createElement("button");
        exportButton.textContent = "Export NPCs";
        exportButton.onclick = exportNPCs;

        let importButton = document.createElement("button");
        importButton.textContent = "Import NPCs";
        importButton.onclick = function () {
            document.getElementById("importNPCFile").click();
        };

        let loadautobutton = document.createElement("button");
        loadautobutton.textContent = "Load Autosave";
        loadautobutton.onclick = function () {
            loadNPCs("autoSave");
        }

        let saveButton1 = document.createElement("button");
        saveButton1.textContent = "Save Slot 1";
        saveButton1.onclick = function () {
            saveNPCs("saveSlot1");
        };

        let loadButton1 = document.createElement("button");
        loadButton1.textContent = "Load Slot 1";
        loadButton1.onclick = function () {
            loadNPCs("saveSlot1");
        };

        let saveButton2 = document.createElement("button");
        saveButton2.textContent = "Save Slot 2";
        saveButton2.onclick = function () {
            saveNPCs("saveSlot2");
        };

        let loadButton2 = document.createElement("button");
        loadButton2.textContent = "Load Slot 2";
        loadButton2.onclick = function () {
            loadNPCs("saveSlot2");
        };

        let saveButton3 = document.createElement("button");
        saveButton3.textContent = "Save Slot 3";
        saveButton3.onclick = function () {
            saveNPCs("saveSlot3");
        };

        let loadButton3 = document.createElement("button");
        loadButton3.textContent = "Load Slot 3";
        loadButton3.onclick = function () {
            loadNPCs("saveSlot3");
        };

        let wipeButton = document.createElement("button");
        wipeButton.textContent = "Wipe LocalStorage";
        wipeButton.onclick = wipeLocalStorage;

        let toggleAutosaveButton = document.createElement("button");
        toggleAutosaveButton.textContent = "Toggle Autosave";
        toggleAutosaveButton.onclick = toggleAutosave;

        let devToolsContainer = document.getElementById("dev-tools-container");
        devToolsContainer.appendChild(exportButton);
        devToolsContainer.appendChild(importButton);
        devToolsContainer.appendChild(loadautobutton);
        devToolsContainer.appendChild(saveButton1);
        devToolsContainer.appendChild(loadButton1);
        devToolsContainer.appendChild(saveButton2);
        devToolsContainer.appendChild(loadButton2);
        devToolsContainer.appendChild(saveButton3);
        devToolsContainer.appendChild(loadButton3);
        devToolsContainer.appendChild(wipeButton);
        devToolsContainer.appendChild(toggleAutosaveButton);
    }

    function toggleDevTools() {
        let devToolsContainer = document.getElementById("dev-tools-container");
        if (devToolsContainer.style.display === "none") {
            devToolsContainer.style.display = "block";
        } else {
            devToolsContainer.style.display = "none";
        }
    }

    function toggleAutosave() {
        if (autosaveIntervalId === null) {
            autosaveIntervalId = setInterval(() => saveNPCs("autoSave"), 30000);
            console.log("Autosave enabled.");
        } else {
            clearInterval(autosaveIntervalId);
            autosaveIntervalId = null;
            console.log("Autosave disabled.");
        }
    }

    function showTab(tabName) {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.style.display = 'none';
        });
        document.getElementById(`${tabName}-tab`).style.display = 'block';
        console.log(`Switched to ${tabName} tab.`);

        // Disable the active tab button
        document.getElementById('battle-tab-button').disabled = (tabName === 'battle');
        document.getElementById('npc-tab-button').disabled = (tabName === 'npc');
    }

    function switchToMapMode() {
        battleState = "map";
        battleLog.innerHTML = "You are in Map mode. Select a battlefield to start the battle.";
        console.log("Switched to Map mode.");

        // Disable the active mode button
        document.getElementById('map-mode-button').disabled = true;
        document.getElementById('deployment-mode-button').disabled = false;
        document.getElementById('battle-mode-button').disabled = false;
    }

    function switchToDeploymentMode() {
        battleState = "deployment";
        battleLog.innerHTML = "You are in Deployment mode. Deploy your units.";
        console.log("Switched to Deployment mode.");

        // Disable the active mode button
        document.getElementById('map-mode-button').disabled = false;
        document.getElementById('deployment-mode-button').disabled = true;
        document.getElementById('battle-mode-button').disabled = false;
    }

    function switchToBattleMode() {
        battleState = "battle";
        battleLog.innerHTML = "The battle begins...\n";
        console.log("Switched to Battle mode.");
        startBattle();

        // Disable the active mode button
        document.getElementById('map-mode-button').disabled = false;
        document.getElementById('deployment-mode-button').disabled = false;
        document.getElementById('battle-mode-button').disabled = true;
    }

    function toggleInfo(infoId) {
        const infoSections = document.querySelectorAll('.info-container');
        infoSections.forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(infoId).style.display = 'block';
        console.log(`Displaying ${infoId}`);
    }

    function showPlayerInfo() {
        toggleInfo('player-info');
        // Populate player info
        document.getElementById('player-info').innerHTML = `
            <h2>Player Info</h2>
            <p>Name: ${player.name}</p>
            <p>Experience: ${player.experience}</p>
        `;
        console.log("Player info displayed.");

        // Disable the active info button
        document.getElementById('player-info-button').disabled = true;
        document.getElementById('npc-list-button').disabled = false;
    }

    function showNPCList() {
        toggleInfo('npc-list');
        // Populate NPC list
        let npcListHtml = '<h2>Talk to...</h2>';
        npcs.forEach(npc => {
            npcListHtml += `<button onclick="talkToNPC('${npc.tokenId}')">${npc.name}</button>`;
        });
        document.getElementById('npc-list').innerHTML = npcListHtml;
        console.log("NPC list displayed.");

        // Disable the active info button
        document.getElementById('player-info-button').disabled = false;
        document.getElementById('npc-list-button').disabled = true;
    }

    function talkToNPC(npcId) {
        const npc = npcRegistry[npcId];
        let npcIntroDialogue = npc.getIntroduction();
        toggleInfo('npc-dialoguebox');
        //populate npc dialogue box
        document.getElementById('npc-dialoguebox').innerHTML = `
        <h3>${npc.name}</h3>
        <p id="npcChatBox">${npcIntroDialogue}</p>`;
        
        if (npc) {
            alert(`Talking to ${npc.name}`);
            console.log(`Talking to NPC: ${npc.name}`);
            // Implement the dialogue interaction here
        }
    }

    function playerNPCInteraction() {
        const npc = npcRegistry[npcId];
        document.getElementById('npc-dialoguebox').innerHTML = `
        <h2>${npc.name}</h2>
        <p id="npcChatBox"></p>`;
        if (npc) {
            let dialogue = new Dialogue(npc);
            npcText.textContent = dialogue.getIntroduction();
            document.getElementById('npc-dialoguebox').innerHTML = npcText;
        }
        // Implement player-NPC interaction here
    }

    // Expose functions globally
    window.showTab = showTab;
    window.switchToMapMode = switchToMapMode;
    window.switchToDeploymentMode = switchToDeploymentMode;
    window.switchToBattleMode = switchToBattleMode;
    window.toggleInfo = toggleInfo;
    window.showPlayerInfo = showPlayerInfo;
    window.showNPCList = showNPCList;
    window.talkToNPC = talkToNPC;

    // Show the battle tab by default
    showTab('battle');

    createDevTools();

    // Load NPCs from localStorage on page load
    loadNPCs();

    // Start autosave by default
    toggleAutosave();

    // Expose save and load functions globally
    window.saveNPCs = saveNPCs;
    window.loadNPCs = loadNPCs;
    window.toggleDevTools = toggleDevTools;
    window.wipeLocalStorage = wipeLocalStorage;
    window.toggleAutosave = toggleAutosave;

    // Function to perform a status check
    function statusCheck() {
        try {
            console.log("%cStarting status check...", "color: blue;");

            // Test NPC creation
            let testNPC = new NPC(getRandomName(), getRandomPersonality(), getRandomBackground(), 50, 50, generateTokenId());
            addOrUpdateNPC(testNPC);
            console.log("%cNPC creation test passed.", "color: green;");

            // Test battle mode
            switchToBattleMode();
            console.log("%cBattle mode test passed.", "color: green;");

            // Test player info display
            showPlayerInfo();
            console.log("%cPlayer info display test passed.", "color: green;");

            // Test NPC list display
            showNPCList();
            console.log("%cNPC list display test passed.", "color: green;");

            // Remove the test NPC
            delete npcRegistry[testNPC.tokenId];
            npcs = npcs.filter(npc => npc.tokenId !== testNPC.tokenId);
            console.log("%cTest NPC removed.", "color: green;");

            // Refresh the NPC list display to ensure the test NPC is removed from the UI
            showNPCList();

            console.log("%cStatus check completed successfully.", "color: green; font-weight: bold;");
        } catch (error) {
            console.error("%cStatus check failed:", "color: red; font-weight: bold;", error);
        }
    }

    // Expose statusCheck function globally
    window.statusCheck = statusCheck;

});