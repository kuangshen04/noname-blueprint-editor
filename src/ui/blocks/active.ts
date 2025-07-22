import {BlockDefinition, BlockDefinitionMap} from "@/ui/BlockDefinition";
import {ToolboxItemInfo} from "blockly/core/utils/toolbox";
import {FieldTextInput, inputs} from "blockly/core";
import {TYPES} from "@/types";

export const blocks: BlockDefinitionMap = {};

const activeContainer: BlockDefinition = {
    init() {
        this.appendDummyInput("name")
            .appendField("效果名")
            .appendField(new FieldTextInput("效果"), "name");
        this.appendValueInput("active")
            .setCheck(TYPES.Active)
            .appendField("在")
            .setAlign(inputs.Align.RIGHT);
        this.appendValueInput("filter")
            .setCheck("Boolean")
            .appendField("若")
            .setAlign(inputs.Align.RIGHT);
        this.appendStatementInput("content")
            .setCheck("Content")
            .appendField("执行")
            .setAlign(inputs.Align.RIGHT);
        // this.setNextStatement(true, null);
        this.setTooltip("主动效果");
        this.setHelpUrl("");
        this.setColour(0);
    }
};
blocks['active_container'] = activeContainer;

export const activeToolbox: ToolboxItemInfo[] = [
    {
        kind: 'block',
        type: 'active_container',
    },
];

