import {JavascriptBlockGenerator} from "@/generators/GeneratorManager";
import {Order} from "blockly/javascript";

export const forBlock: Record<string, JavascriptBlockGenerator> = {
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
    player_choose_confirm: function (block, generator) {
        const player = generator.valueToCode(block, "player", Order.ATOMIC) || "player";
        const text = generator.valueToCode(block, "text", Order.ATOMIC) || '"请确认"';
        return [`(await ${player}.chooseBool(${text}).forResult()).bool`, Order.MEMBER];
    },
    player_choose_target: function (block, generator) {
        const player = generator.valueToCode(block, "player", Order.ATOMIC) || "player";
        const count = generator.valueToCode(block, "count", Order.ATOMIC) || "1";
        const text = generator.valueToCode(block, "text", Order.ATOMIC) || '"请选择目标"';
        return [`(await ${player}.chooseTarget(${count}, ${text}).forResult()).targets`, Order.MEMBER];
    }
}