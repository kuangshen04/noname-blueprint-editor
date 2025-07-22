import {Order} from "blockly/javascript";
import {JavascriptBlockGenerator} from "@/generators/GeneratorManager";

export const forBlock: Record<string, JavascriptBlockGenerator> = {
    trigger_container: function (block, generator) {
        const name = block.getFieldValue("name") || "效果";
        const trigger = generator.valueToCode(block, "trigger", Order.ATOMIC) || "[]";
        const filter = generator.valueToCode(block, "filter", Order.ATOMIC) || "true";
        const content = generator.statementToCode(block, "content") || "";

        return `"${name}": {
            trigger: {
                global: ${trigger},
            },
            filter: function (trigger, player) { return ${filter}; },
            content: async function (event, trigger, player) {${content}},
        },\n`;
    },

    trigger_timing: function (block, generator) {
        let event = generator.valueToCode(block, "event", Order.ATOMIC);
        if (!event) return "";
        event = event.replaceAll('"', '');
        const timingMap = {
            before: "Before",
            begin: "Begin",
            end: "End",
            after: "After",
        };
        const timing = block.getFieldValue("timing") as keyof typeof timingMap;
        return [`["${event}${timingMap[timing]}"]`, Order.ATOMIC];
    },
    event_phaseZhunbei: function (block, generator) {
        return [`"phaseZhunbei"`, Order.ATOMIC];
    },
    event_phaseJudge: function (block, generator) {
        return [`"phaseJudge"`, Order.ATOMIC];
    },
    event_phaseDraw: function (block, generator) {
        return [`"phaseDraw"`, Order.ATOMIC];
    },
    event_phaseUse: function (block, generator) {
        return [`"phaseUse"`, Order.ATOMIC];
    },
    event_phaseDiscard: function (block, generator) {
        return [`"phaseDiscard"`, Order.ATOMIC];
    },
    event_phaseJieshu: function (block, generator) {
        return [`"phaseJieshu"`, Order.ATOMIC];
    },
    trigger_eventPlayer: function(block, generator) {
        return [`trigger.player`, Order.MEMBER];
    },
    event_phaseDraw_changeNum: function(block, generator) {
        const num = generator.valueToCode(block, "count", Order.ATOMIC) || "0";
        const operatorMap = {
            "increase": "+=",
            "decrease": "-=",
            "set": "=",
        }
        const operator = block.getFieldValue("action") as keyof typeof operatorMap;
        return `event.num ${operatorMap[operator]} ${num};\n`;
    },
    player_draw: function (block, generator) {
        const player = generator.valueToCode(block, "player", Order.ATOMIC) || "player";
        const count = generator.valueToCode(block, "count", Order.ATOMIC) || "1";
        return `await ${player}.draw(${count});\n`;
    },
    player_recover: function (block, generator) {
        const player = generator.valueToCode(block, "player", Order.ATOMIC) || "player";
        const count = generator.valueToCode(block, "count", Order.ATOMIC) || "1";
        return `await ${player}.recover(${count});\n`;
    },
    player_damage: function (block, generator) {
        const player = generator.valueToCode(block, "player", Order.ATOMIC) || "player";
        const count = generator.valueToCode(block, "count", Order.ATOMIC) || "1";
        return `await ${player}.damage(${count});\n`;
    },
    player_loseHp: function (block, generator) {
        const player = generator.valueToCode(block, "player", Order.ATOMIC) || "player";
        const count = generator.valueToCode(block, "count", Order.ATOMIC) || "1";
        return `await ${player}.loseHp(${count});\n`;
    },
    player_changeMaxHp: function (block, generator) {
        const player = generator.valueToCode(block, "player", Order.ATOMIC) || "player";
        const count = generator.valueToCode(block, "count", Order.ATOMIC) || "1";
        const operator = block.getFieldValue("action");
        switch (operator) {
            case "increase":
                return `await ${player}.gainMaxHp(${count});\n`;
            case "decrease":
                return `await ${player}.loseMaxHp(${count});\n`;
            default:
                return `
                    let count = ${count} - player.hp;
                    if (count > 0) await ${player}.gainMaxHp(count);
                    else if (count < 0) await ${player}.loseMaxHp(-count);
                `;
        }
    },
    selector_player_self: function (block, generator) {
        return ["player", Order.ATOMIC];
    },
    selector_player_all: function (block, generator) {
        return ["game.players", Order.MEMBER];
    },
}


