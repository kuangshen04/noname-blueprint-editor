import {BlockDefinitionMap} from "@/ui/BlockDefinition";
import {TYPES} from "@/types";
import {FieldDropdown} from "blockly/core";
import {ToolboxItemInfo} from "blockly/core/utils/toolbox";

export const blocks: BlockDefinitionMap = {
    player_draw: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("count").setCheck("Number")
                .appendField("摸")
            this.appendDummyInput("text")
                .appendField("张牌");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip("摸牌");
            this.setHelpUrl("");
            this.setColour(180);
        },
    },
    player_discard: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("cards").setCheck(TYPES.CardList)
                .appendField("弃置");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setInputsInline(true);
            this.setTooltip("弃牌");
            this.setHelpUrl("");
            this.setColour(180);
        },
    },
    player_recover: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("count").setCheck("Number")
                .appendField("回复")
            this.appendDummyInput("text")
                .appendField("点体力");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip("回复体力");
            this.setHelpUrl("");
            this.setColour(180);
        }
    },
    player_damage: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("count").setCheck("Number")
                .appendField("受到")
            this.appendDummyInput("text")
                .appendField("点伤害");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip("受到伤害");
            this.setHelpUrl("");
            this.setColour(180);
        },
    },
    player_loseHp: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("count").setCheck("Number")
                .appendField("失去")
            this.appendDummyInput("text")
                .appendField("点体力");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip("失去体力");
            this.setHelpUrl("");
            this.setColour(180);
        },
    },
    player_changeMaxHp: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("count").setCheck("Number")
                .appendField("的体力上限")
                .appendField(
                    new FieldDropdown([
                        ["增加", "increase"],
                        ["减少", "decrease"],
                        ["改为", "set"],
                    ]),
                    "action"
                );
            this.appendDummyInput('dummy')
                .appendField('点');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip("更改体力上限");
            this.setHelpUrl("");
            this.setColour(180);
        },
    },
    player_choose_confirm: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("text").setCheck("String")
                .appendField("进行确认：")
            this.setOutput(true, "Boolean");
            this.setInputsInline(true);
            this.setTooltip("玩家进行确认操作，通常用于技能发动时的确认");
            this.setHelpUrl("");
            this.setColour(180);
        },
    },
    player_choose_target: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("count").setCheck("Number")
                .appendField("选择");
            this.appendValueInput("text").setCheck("String")
                .appendField("个目标：")
            this.setOutput(true, TYPES.PlayerList);
            this.setInputsInline(true);
            this.setTooltip("玩家选择目标，通常用于技能发动时的目标选择");
            this.setHelpUrl("");
            this.setColour(180);
        },
    },
    player_choose_card: {
        init() {
            this.appendValueInput("player").setCheck(TYPES.Player);
            this.appendValueInput("count").setCheck("Number")
                .appendField("选择");
            this.appendValueInput("text").setCheck("String")
                .appendField("张牌：");
            this.setOutput(true, TYPES.CardList);
            this.setInputsInline(true);
            this.setTooltip("玩家选择牌，通常用于技能发动时的牌选择");
            this.setHelpUrl("");
            this.setColour(180);
        },
    },

}


export const actionToolbox: ToolboxItemInfo[] = [
    {
        kind: 'block',
        type: 'player_draw',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
            count: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: 1,
                    },
                },
            },
        },
    },
    {
        kind: 'block',
        type: 'player_discard',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
        },
    },
    {
        kind: 'block',
        type: 'player_recover',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
            count: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: 1,
                    },
                },
            },
        },
    },
    {
        kind: 'block',
        type: 'player_damage',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
            count: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: 1,
                    },
                },
            },
        },
    },
    {
        kind: 'block',
        type: 'player_loseHp',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
            count: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: 1,
                    },
                },
            },
        },
    },
    {
        kind: 'block',
        type: 'player_changeMaxHp',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
            count: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: 1,
                    },
                },
            },
        }
    },
    {
        kind: 'block',
        type: 'player_choose_confirm',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
            text: {
                shadow: {
                    type: 'text',
                    fields: {
                        TEXT: "",
                    },
                },
            },
        },
    },
    {
        kind: 'block',
        type: 'player_choose_target',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
            count: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: 1,
                    },
                },
            },
            text: {
                shadow: {
                    type: 'text',
                    fields: {
                        TEXT: "请选择目标",
                    },
                },
            },
        },
    },
    {
        kind: 'block',
        type: 'player_choose_card',
        inputs: {
            player: {
                shadow: {
                    type: 'selector_player_self',
                },
            },
            count: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: 1,
                    },
                },
            },
            text: {
                shadow: {
                    type: 'text',
                    fields: {
                        TEXT: "请选择牌",
                    },
                },
            },
        },
    },
];