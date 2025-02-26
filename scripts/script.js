import { showPlayerInfo, showNPCList, talkToNPC, promoteToNPC } from './npc.js';
import { switchToMapMode, switchToDeploymentMode, switchToBattleMode } from './battle.js';
import { toggleInfo } from './utils.js';
import { getRandomName, getRandomPersonality, getRandomBackground, generateTokenId } from './npcUtils.js';
import { NPC } from './npcClass.js';

document.addEventListener("DOMContentLoaded", function () {
    let units = ["Soldier 1", "Soldier 2", "Soldier 3", "Soldier 4", "Soldier 5"];
    let battleLog = document.getElementById("battle-log");
    let npcDialogue = document.getElementById("npc-dialogue");
    let npcs = []; // Array to store created NPCs
    let npcRegistry = {}; // Object to store NPCs by token ID
    let currentSaveSlot = "manualSave"; // Default save slot
    let autosaveIntervalId = null; // Variable to store the autosave interval ID

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

    // Function to add or overwrite an NPC
    function addOrUpdateNPC(npc) {
        npcRegistry[npc.tokenId] = npc; // If token ID already exists, it will overwrite
    }

    // Function to perform a status check
    function statusCheck() {
        try {
            console.log("Starting status check...");

            // Test NPC creation
            let testNPC = new NPC(getRandomName(), getRandomPersonality(), 50, 50, getRandomBackground(), generateTokenId());
            addOrUpdateNPC(testNPC);
            console.log("%cNPC creation test passed.", 'color: green;');

            // Test battle mode
            switchToBattleMode();
            console.log("%cBattle mode test passed.", 'color: green;');

            // Test player info display
            showPlayerInfo();
            console.log("%cPlayer info display test passed.", 'color: green;');

            // Test NPC list display
            showNPCList();
            console.log("%cNPC list display test passed.", 'color: green;');

            console.log("%cStatus check completed successfully.", 'color: green; font-weight: bold;');
        } catch (error) {
            console.error("%cStatus check failed:", error, 'color: red; font-weight: bold;');
        }
    }

    // Expose functions globally
    window.startBattle = startBattle; // Start the battle
    window.setStance = setStance; // Set the stance of the player
    window.debugNPCs = debugNPCs; // Debug NPCs
    window.addOrUpdateNPC = addOrUpdateNPC; // Add or update an NPC
    window.statusCheck = statusCheck; // Perform a status check

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
                            console.error("%cInvalid NPC data:", npcData, "color: red;");
                        }
                    });
                    console.log("%cNPCs imported successfully:", npcs, "color: green;");
                } else {
                    console.error("%cInvalid data format. Expected an array of NPCs.", "color: red:");
                }
            } catch (error) {
                console.error("%cError importing NPCs:", error, "color: red;");
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

        let statusCheckButton = document.createElement("button");
        statusCheckButton.textContent = "Status Check";
        statusCheckButton.onclick = statusCheck;

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
        devToolsContainer.appendChild(statusCheckButton);
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

    console.log("%cScript loaded successfully.", "color: green; font-weight: bold;");
});