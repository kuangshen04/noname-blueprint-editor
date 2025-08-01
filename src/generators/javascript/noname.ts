import {Order} from "blockly/javascript";
import {JavascriptBlockGenerator} from "@/generators/GeneratorManager";
import {Block} from "blockly/core";

export const forBlock: Record<string, JavascriptBlockGenerator> = {
    active_container: function (block, generator) {
        const name = block.getFieldValue("name") || "效果";
        const active = generator.valueToCode(block, "active", Order.ATOMIC) || "[]";
        const filter = generator.valueToCode(block, "filter", Order.ATOMIC) || "true";
        const content = generator.statementToCode(block, "content") || "";

        return `"${name}": {
            enable: ${active},
            filter: function (trigger, player) { return ${filter}; },
            content: async function (event, trigger, player) {${content}},
        },\n`;
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
    event_phaseDraw_changeNum: function(block, generator) {
        const num = generator.valueToCode(block, "count", Order.ATOMIC) || "0";
        const operatorMap = {
            "increase": "+=",
            "decrease": "-=",
            "set": "=",
        }
        const operator = block.getFieldValue("action") as keyof typeof operatorMap;
        return `trigger.num ${operatorMap[operator]} ${num};\n`;
    },
    selector_player_self: function (block, generator) {
        return ["player", Order.ATOMIC];
    },
    selector_player_all: function (block, generator) {
        return ["game.players", Order.MEMBER];
    },
}


