import {Order} from "blockly/javascript";
import {JavascriptBlockGenerator} from "@/generators/GeneratorManager";

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock: Record<string, JavascriptBlockGenerator> = {
    trigger_container: function (block, generator) {
        const name = block.getFieldValue("name") || "效果";
        const trigger = generator.valueToCode(block, "trigger", Order.ATOMIC) || "[]";
        const filter = generator.valueToCode(block, "filter", Order.ATOMIC) || "true";
        const content = generator.statementToCode(block, "content") || "";

        return `lib.skill["${name}"] = {
    trigger: {
        global: ${trigger},
    },
    filter: function (trigger, player) {
return ${filter};
    }
    content: async function (event, trigger, player) {
${content}},
};\n`;
    },

    trigger_timing_before: function (block, generator) {
        const event = generator.valueToCode(block, "event", Order.ATOMIC);
        if (!event) return "";
        return [`"${event}Before"`, Order.ATOMIC];
    },
    trigger_timing_begin: function (block, generator) {
        const event = generator.valueToCode(block, "event", Order.ATOMIC);
        if (!event) return "";
        return [`"${event}Begin"`, Order.ATOMIC];
    },
    trigger_timing_end: function (block, generator) {
        const event = generator.valueToCode(block, "event", Order.ATOMIC);
        if (!event) return "";
        return [`"${event}End"`, Order.ATOMIC];
    },
    trigger_timing_after: function (block, generator) {
        const event = generator.valueToCode(block, "event", Order.ATOMIC);
        if (!event) return "";
        return [`"${event}After"`, Order.ATOMIC];
    },
    event_phaseDraw: function (block, generator) {
        return ["phaseDraw", Order.ATOMIC];
    },
    event_phaseJieshu: function (block, generator) {
        return ["phaseJieshu", Order.ATOMIC];
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
    selector_player_self: function (block, generator) {
        return ["player", Order.ATOMIC];
    },
}


