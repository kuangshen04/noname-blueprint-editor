import {JavascriptBlockGenerator} from "@/generators/GeneratorManager";
import {Order} from "blockly/javascript";
import {Block} from "blockly/core";

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

    trigger_timing_connector: function (block, generator) {
        const createWithBlock = block as Block & {itemCount_: number};
        const elements = [];
        for (let i = 0; i < createWithBlock.itemCount_; i++) {
            let trigger = generator.valueToCode(block, 'ADD' + i, Order.NONE);
            if (!trigger) continue;
            trigger = trigger.slice(1,-1); // Remove the surrounding brackets
            elements.push(trigger);
        }
        const code = '[' + elements.join(', ') + ']';
        return [code, Order.ATOMIC];
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

    trigger_eventPlayer: function(block, generator) {
        return [`trigger.player`, Order.MEMBER];
    },
}