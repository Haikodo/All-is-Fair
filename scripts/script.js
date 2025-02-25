import { showPlayerInfo, showNPCList, talkToNPC } from './npc.js';
import { switchToMapMode, switchToDeploymentMode, switchToBattleMode } from './battle.js';
import { toggleInfo } from './utils.js';

document.addEventListener("DOMContentLoaded", function () {
    let units = ["Soldier 1", "Soldier 2", "Soldier 3", "Soldier 4", "Soldier 5"];
    let battleLog = document.getElementById("battle-log");
    let npcDialogue = document.getElementById("npc-dialogue");
    let npcText = document.getElementById("npc-text");
    let npcs = []; // Array to store created NPCs
    let npcRegistry = {}; // Object to store NPCs by token ID
    let currentSaveSlot = "manualSave"; // Default save slot
    let autosaveIntervalId = null; // Variable to store the autosave interval ID

    class NPC {
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

    class Dialogue {
        constructor(npc) {
            this.npc = npc;
            this.possibleDialogues = dialogues.default; // Use default dialogues or customize as needed
        }

        getRandomDialogue() {
            return this.possibleDialogues[Math.floor(Math.random() * this.possibleDialogues.length)];
        }
    }

    // Function to save NPCs to localStorage
    function saveNPCs(slot = currentSaveSlot) {
        localStorage.setItem(slot, JSON.stringify(npcs));
        console.log(`NPCs saved to ${slot}.`);
    }

    // Function to load NPCs from localStorage
    function loadNPCs(slot = currentSaveSlot) {
        let storedNPCs = localStorage.getItem(slot);
        if (storedNPCs) {
            npcs = JSON.parse(storedNPCs).map(npcData => new NPC(
                npcData.name,
                npcData.personality,
                npcData.experience,
                npcData.loyalty,
                npcData.background,
                npcData.tokenId
            ));
            npcRegistry = {};
            npcs.forEach(npc => {
                npcRegistry[npc.tokenId] = npc;
            });
            console.log(`NPCs loaded from ${slot}.`);
        }
    }

    // Function to wipe localStorage
    function wipeLocalStorage() {
        localStorage.clear();
        npcs = [];
        npcRegistry = {};
        console.log("LocalStorage wiped.");
    }

    // Get a random NPC name
    function getRandomName() {
        return NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    }

    // Get a random NPC personality
    function getRandomPersonality() {
        return personalityPool[Math.floor(Math.random() * personalityPool.length)];
    }

    // Get a random NPC background
    function getRandomBackground() {
        return backgroundPool[Math.floor(Math.random() * backgroundPool.length)];
    }

    // Function to generate a unique token ID for each NPC
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

    function debugNPCs() {
        console.log("Current NPCs:", npcs);
        console.log("NPC Registry:",
            Object.keys(npcRegistry).map(tokenId => {
                return {
                    tokenId: tokenId,
                    name: npcRegistry[tokenId].name
                };
            })
        );
    }

    // Expose functions globally
    window.startBattle = startBattle; // Start the battle
    window.setStance = setStance; // Set the stance of the player
    window.debugNPCs = debugNPCs; // Debug NPCs

    // Function to add or overwrite an NPC
    function addOrUpdateNPC(npc) {
        npcRegistry[npc.tokenId] = npc; // If token ID already exists, it will overwrite
    }
    console.log(npcRegistry);

    // Expose addOrUpdateNPC function globally
    window.addOrUpdateNPC = addOrUpdateNPC;

    // Export NPCs as JSON file
    function exportNPCs() {
        let dataStr = JSON.stringify(npcs, null, 2);
        let blob = new Blob([dataStr], { type: "application/json" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "npcs.json";
        a.click();
    }

    // Import NPCs from JSON file
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

    // Validate NPC data
    function validateNPCData(npcData) {
        return npcData &&
            typeof npcData.name === 'string' &&
            typeof npcData.personality === 'string' &&
            typeof npcData.experience === 'number' &&
            typeof npcData.loyalty === 'number' &&
            typeof npcData.background === 'string' &&
            typeof npcData.tokenId === 'string';
    }

    // Create export/import buttons
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
});