/**
 * Copyright (c) 2025 Alexandros Panagiotakopoulos
 * 
 * This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 
 * International License. To view a copy of this license, visit 
 * http://creativecommons.org/licenses/by-nd/4.0/
 */

//=============================================================================
// DebugStatsExporter.js
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [1.0.0] Exports all actor stats, growth, and skills to a text file for balance analysis
 * @author Alexandros Panagiotakopoulos
 * @version 1.0.0
 * @url alexandrospanag.github.io
 * @license CC-BY-ND-4.0
 *
 * @command exportStats
 * @text Export Actor Stats
 * @desc Exports all actor data to a downloadable text file
 *
 * @help DebugStatsExporter.js
 *
 * This plugin adds a plugin command to export all actor data including:
 * - Base stats and growth per level
 * - HP/MP gain per level
 * - All learned skills with level requirements
 * - Equipment proficiencies
 * - Traits and features
 *
 * Plugin Command:
 *   exportStats - Downloads a text file with all actor data
 *
 * You can also call this from the console:
 *   SceneManager._scene.exportActorStats()
 */

(() => {
    const pluginName = "DebugStatsExporter";

    PluginManager.registerCommand(pluginName, "exportStats", args => {
        if (SceneManager._scene) {
            SceneManager._scene.exportActorStats();
        }
    });

    Scene_Base.prototype.exportActorStats = function() {
        let output = "=".repeat(80) + "\n";
        output += "RPG MAKER MZ - ACTOR STATS EXPORT\n";
        output += "Generated: " + new Date().toLocaleString() + "\n";
        output += "=".repeat(80) + "\n\n";

        // Iterate through all actors
        for (let i = 1; i < $dataActors.length; i++) {
            const actorData = $dataActors[i];
            if (!actorData) continue;

            output += this.formatActorData(actorData);
            output += "\n" + "=".repeat(80) + "\n\n";
        }

        // Create and download the file
        this.downloadTextFile(output, "ActorStats_Export.txt");
        
        console.log("Actor stats exported successfully!");
        if ($gameMessage && !DataManager.isBattleTest() && !DataManager.isEventTest()) {
            $gameMessage.add("Actor stats exported successfully!");
        }
    };

    Scene_Base.prototype.formatActorData = function(actor) {
        let output = "";
        
        // Basic Info
        output += `ACTOR #${actor.id}: ${actor.name}\n`;
        output += "-".repeat(80) + "\n";
        output += `Nickname: ${actor.nickname}\n`;
        output += `Class: ${$dataClasses[actor.classId]?.name || "None"}\n`;
        output += `Initial Level: ${actor.initialLevel}\n`;
        output += `Max Level: ${actor.maxLevel}\n\n`;

        // Get stat values using Game_Actor for proper calculation
        const tempActor = new Game_Actor(actor.id);
        
        // Initial Stats
        output += "INITIAL STATS (at Initial Level):\n";
        tempActor.changeLevel(actor.initialLevel, false);
        output += `  Max HP: ${tempActor.param(0)}\n`;
        output += `  Max MP: ${tempActor.param(1)}\n`;
        output += `  ATK: ${tempActor.param(2)}\n`;
        output += `  DEF: ${tempActor.param(3)}\n`;
        output += `  MAT: ${tempActor.param(4)}\n`;
        output += `  MDF: ${tempActor.param(5)}\n`;
        output += `  AGI: ${tempActor.param(6)}\n`;
        output += `  LUK: ${tempActor.param(7)}\n\n`;

        // Stats Growth Per Level
        output += "STAT GROWTH BY LEVEL:\n";
        output += "Level | HP    | MP    | ATK | DEF | MAT | MDF | AGI | LUK\n";
        output += "-".repeat(70) + "\n";
        
        const levelStats = [];
        for (let lvl = 1; lvl <= Math.min(actor.maxLevel, 99); lvl++) {
            tempActor.changeLevel(lvl, false);
            const stats = {
                level: lvl,
                hp: tempActor.param(0),
                mp: tempActor.param(1),
                atk: tempActor.param(2),
                def: tempActor.param(3),
                mat: tempActor.param(4),
                mdf: tempActor.param(5),
                agi: tempActor.param(6),
                luk: tempActor.param(7)
            };
            levelStats.push(stats);
            
            output += `${String(lvl).padStart(5)} | ${String(stats.hp).padStart(5)} | ${String(stats.mp).padStart(5)} | `;
            output += `${String(stats.atk).padStart(3)} | ${String(stats.def).padStart(3)} | ${String(stats.mat).padStart(3)} | `;
            output += `${String(stats.mdf).padStart(3)} | ${String(stats.agi).padStart(3)} | ${String(stats.luk).padStart(3)}\n`;
        }
        output += "\n";

        // HP/MP Gain Per Level
        output += "HP/MP GAINS PER LEVEL:\n";
        output += "Level | HP Gain | MP Gain\n";
        output += "-".repeat(30) + "\n";
        
        for (let i = 1; i < levelStats.length; i++) {
            const hpGain = levelStats[i].hp - levelStats[i-1].hp;
            const mpGain = levelStats[i].mp - levelStats[i-1].mp;
            output += `${String(levelStats[i].level).padStart(5)} | ${String(hpGain).padStart(7)} | ${String(mpGain).padStart(7)}\n`;
        }
        output += "\n";

        // Skills
        output += "LEARNED SKILLS:\n";
        if (actor.traits) {
            const skillLearnTraits = actor.traits.filter(t => t.code === 11);
            if (skillLearnTraits.length > 0) {
                output += "Initial Skills:\n";
                skillLearnTraits.forEach(trait => {
                    const skill = $dataSkills[trait.dataId];
                    if (skill) {
                        output += `  - ${skill.name} (ID: ${skill.id})\n`;
                    }
                });
                output += "\n";
            }
        }
        
        const classData = $dataClasses[actor.classId];
        if (classData && classData.learnings && classData.learnings.length > 0) {
            output += "Skills by Level:\n";
            classData.learnings.forEach(learning => {
                const skill = $dataSkills[learning.skillId];
                if (skill) {
                    output += `  Lv ${learning.level}: ${skill.name} (ID: ${skill.id})\n`;
                    output += `    Type: ${$dataSystem.skillTypes[skill.stypeId] || "None"}\n`;
                    output += `    MP Cost: ${skill.mpCost} | TP Cost: ${skill.tpCost}\n`;
                    if (skill.description) {
                        output += `    Description: ${skill.description}\n`;
                    }
                }
            });
        } else {
            output += "  No skills learned by level\n";
        }
        output += "\n";

        // Traits
        output += "TRAITS:\n";
        if (actor.traits && actor.traits.length > 0) {
            actor.traits.forEach(trait => {
                output += this.formatTrait(trait);
            });
        } else {
            output += "  No special traits\n";
        }
        output += "\n";

        // Equipment Types
        output += "EQUIPMENT SLOTS:\n";
        tempActor.changeLevel(actor.initialLevel, false);
        const equipSlots = tempActor.equipSlots();
        if (equipSlots && equipSlots.length > 0) {
            equipSlots.forEach((slotType, index) => {
                const typeName = $dataSystem.equipTypes[slotType] || "Unknown";
                output += `  Slot ${index + 1}: ${typeName}\n`;
            });
        } else {
            output += "  No equipment slots\n";
        }
        output += "\n";

        // Note/Profile
        if (actor.profile) {
            output += "PROFILE:\n";
            output += `${actor.profile}\n\n`;
        }

        if (actor.note) {
            output += "NOTES:\n";
            output += `${actor.note}\n`;
        }

        return output;
    };

    Scene_Base.prototype.formatTrait = function(trait) {
        const traitNames = {
            11: "Skill",
            12: "Weapon Type",
            13: "Armor Type",
            14: "Equip Lock",
            21: "Parameter",
            22: "Ex-Parameter",
            23: "Sp-Parameter",
            31: "Attack Element",
            32: "Attack State",
            33: "Attack Speed",
            34: "Attack Times+",
            41: "Skill Type Add",
            42: "Skill Type Seal",
            43: "Skill Add",
            44: "Skill Seal",
            51: "Weapon",
            52: "Armor",
            53: "Equip Fix",
            54: "Equip Seal",
            55: "Slot Type",
            61: "Action Times+",
            62: "Special Flag",
            63: "Collapse Effect",
            64: "Party Ability"
        };

        let output = `  - ${traitNames[trait.code] || "Unknown Trait"}: `;
        
        if (trait.code === 21) { // Parameter trait
            const paramNames = ["MHP", "MMP", "ATK", "DEF", "MAT", "MDF", "AGI", "LUK"];
            output += `${paramNames[trait.dataId]} x${trait.value}\n`;
        } else if (trait.code === 22) { // Ex-Parameter
            const exParamNames = ["HIT", "EVA", "CRI", "CEV", "MEV", "MRF", "CNT", "HRG", "MRG", "TRG"];
            output += `${exParamNames[trait.dataId]} +${(trait.value * 100).toFixed(1)}%\n`;
        } else if (trait.code === 23) { // Sp-Parameter
            const spParamNames = ["TGR", "GRD", "REC", "PHA", "MCR", "TCR", "PDR", "MDR", "FDR", "EXR"];
            output += `${spParamNames[trait.dataId]} x${trait.value}\n`;
        } else if (trait.code === 11) { // Added Skill
            const skill = $dataSkills[trait.dataId];
            output += `${skill ? skill.name : "Unknown"} (ID: ${trait.dataId})\n`;
        } else if (trait.code === 31) { // Attack Element
            const element = $dataSystem.elements[trait.dataId];
            output += `${element || "Unknown"}\n`;
        } else if (trait.code === 41) { // Skill Type Add
            const skillType = $dataSystem.skillTypes[trait.dataId];
            output += `${skillType || "Unknown"}\n`;
        } else {
            output += `Data ${trait.dataId}, Value ${trait.value}\n`;
        }

        return output;
    };

    Scene_Base.prototype.downloadTextFile = function(content, filename) {
        // Create a blob with the content
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

})();
