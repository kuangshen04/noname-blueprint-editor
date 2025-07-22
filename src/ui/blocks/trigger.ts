import {BlockDefinition, BlockDefinitionMap} from "@/ui/BlockDefinition";
import {Block, Connection, FieldDropdown, FieldTextInput, icons, Msg} from "blockly/core";
import {inputs} from "blockly/core";
import {ToolboxItemInfo} from "blockly/core/utils/toolbox";
import {BlockSvg} from "blockly/core";
import {TYPES} from "@/types";

export const blocks: BlockDefinitionMap = {}


interface triggerContainerBlock extends Block {
    updateShape_(): void;
}
const triggerContainer: BlockDefinition<triggerContainerBlock> = {
    init() {
        this.appendDummyInput("name")
            .appendField("效果名")
            .appendField(new FieldTextInput("效果"), "name");
        this.appendValueInput("trigger")
            .setCheck(TYPES.Trigger)
            .appendField("当")
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
        this.setTooltip("被动效果");
        this.setHelpUrl("");
        this.setColour(0);
    }
};
blocks['trigger_container'] = triggerContainer;

blocks['trigger_eventPlayer'] = {
    init: function () {
        this.appendDummyInput("dummy").appendField("当前玩家");
        this.setOutput(true, TYPES.Player);
        this.setTooltip("当前时机的玩家");
        this.setHelpUrl("");
        this.setColour(225);
    },
};

interface TriggerTimingConnector extends Block {
    itemCount_: number,
    updateShape_(): void
}
interface TriggerTimingConnectorItem extends Block {
    valueConnection_: Connection | undefined
}

const triggerTimingConnector: BlockDefinition<TriggerTimingConnector> = {

    /**
     * Block for creating a list with any number of elements of any type.
     */
    init: function () {
        this.setStyle('list_blocks');
        this.itemCount_ = 3;
        this.updateShape_();
        this.setOutput(true, 'Trigger');
        this.setMutator(
            new icons.MutatorIcon(['trigger_timing_connector_item'], this as unknown as BlockSvg),
        ); // BUG(#6905)
        this.setTooltip("创建联合时机，技能将会在其包含的所有时机中触发。");
        this.setHelpUrl("");
    },
    /**
     * Returns the state of this block as a JSON serializable object.
     *
     * @returns The state of this block, ie the item count.
     */
    saveExtraState: function (): {itemCount: number} {
        return {
            'itemCount': this.itemCount_,
        };
    },
    /**
     * Applies the given state to this block.
     *
     * @param state The state to apply to this block, ie the item count.
     */
    loadExtraState: function (state) {
        this.itemCount_ = state['itemCount'];
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     *
     * @param workspace Mutator's workspace.
     * @returns Root block in mutator.
     */
    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('trigger_timing_connector_container') as BlockSvg;
        containerBlock.initSvg();
        let connection = containerBlock.getInput('STACK')!.connection;
        for (let i = 0; i < this.itemCount_; i++) {
            const itemBlock = workspace.newBlock('trigger_timing_connector_item') as BlockSvg;
            itemBlock.initSvg();
            if (!itemBlock.previousConnection) {
                throw new Error('itemBlock has no previousConnection');
            }
            connection!.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     *
     * @param containerBlock Root block in mutator.
     */
    compose: function (containerBlock) {
        let itemBlock = containerBlock.getInputTargetBlock('STACK') as TriggerTimingConnectorItem | null;
        // Count number of inputs.
        const connections: Connection[] = [];
        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock() as TriggerTimingConnectorItem | null;
                continue;
            }
            connections.push(itemBlock.valueConnection_!);
            itemBlock = itemBlock.getNextBlock() as TriggerTimingConnectorItem | null;
        }
        // Disconnect any children that don't belong.
        for (let i = 0; i < this.itemCount_; i++) {
            const connection = this.getInput('ADD' + i)!.connection!.targetConnection as Connection;
            if (connection && !connections.includes(connection)) {
                connection.disconnect();
            }
        }
        this.itemCount_ = connections.length;
        this.updateShape_();
        // Reconnect any child blocks.
        for (let i = 0; i < this.itemCount_; i++) {
            connections[i]?.reconnect(this, 'ADD' + i);
        }
    },
    /**
     * Store pointers to any connected child blocks.
     *
     * @param containerBlock Root block in mutator.
     */
    saveConnections: function (containerBlock) {
        let itemBlock = containerBlock.getInputTargetBlock('STACK') as TriggerTimingConnectorItem | null;
        let i = 0;
        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock() as TriggerTimingConnectorItem | null;
                continue;
            }
            const input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input?.connection!.targetConnection as Connection;
            itemBlock = itemBlock.getNextBlock() as TriggerTimingConnectorItem | null;
            i++;
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     */
    updateShape_: function () {
        if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY').appendField("空时机");
        }
        // Add new inputs.
        for (let i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {
                const input = this.appendValueInput('ADD' + i)
                    .setCheck(TYPES.Trigger)
                    .setAlign(inputs.Align.RIGHT);
                if (i === 0) {
                    input.appendField("联合时机：");
                }
            }
        }
        // Remove deleted inputs.
        for (let i = this.itemCount_; this.getInput('ADD' + i); i++) {
            this.removeInput('ADD' + i);
        }
    },
};
const trigger_timing_connector_container: BlockDefinition = {
    /**
     * Mutator block for list container.
     */
    init: function () {
        this.setStyle('list_blocks');
        this.appendDummyInput().appendField("时机列表");
        this.appendStatementInput('STACK');
        this.setTooltip("联合时机的数量");
        this.contextMenu = false;
    },
};
const trigger_timing_connector_item: BlockDefinition<TriggerTimingConnectorItem> = {
    /**
     * Mutator block for adding items.
     */
    init: function () {
        this.setStyle('list_blocks');
        this.appendDummyInput().appendField("时机");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("时机");
        this.contextMenu = false;
    },
};

blocks['trigger_timing_connector'] = triggerTimingConnector;
blocks['trigger_timing_connector_container'] = trigger_timing_connector_container;
blocks['trigger_timing_connector_item'] = trigger_timing_connector_item;

const timingTooltip: Record<string, string> = {
    before: "事件开始前的时机",
    begin: "事件开始的时机",
    end: "事件结束的时机",
    after: "事件结束后的时机"
}

blocks['trigger_timing'] = {
    init() {
        this.appendValueInput("event").setCheck(TYPES.Event);
        this.appendDummyInput("dummy")
            .appendField(
                new FieldDropdown([
                    ["开始前", "before"],
                    ["开始时", "begin"],
                    ["结束时", "end"],
                    ["结束后", "after"],
                ]),
                "timing"
            );
        this.setOutput(true, TYPES.Trigger);
        this.setTooltip((): string => {
            const value = this.getFieldValue('timing');
            return timingTooltip[value];
        });
        this.setHelpUrl("");
        this.setColour(45);
    },
};

// blocks['trigger_timing_judge']= {
//     init() {
//         this.appendDummyInput('dummy')
//             .appendField('判定牌亮出时');
//         this.setOutput(true, TYPES.Trigger);
//         this.setTooltip('判定牌亮出的时机，可以用于改判');
//         this.setHelpUrl('');
//         this.setColour(45);
//     }
// };

export const triggerToolbox: ToolboxItemInfo[] = [
    {
        kind: 'block',
        type: 'trigger_container',
    },
    {
        kind: 'block',
        type: 'trigger_timing_connector',
    },
    {
        kind: 'block',
        type: 'trigger_eventPlayer',
    },
    {
        kind: 'block',
        type: 'trigger_timing',
        fields: {
            timing: 'before',
        },
    },
    {
        kind: 'block',
        type: 'trigger_timing',
        fields: {
            timing: 'begin',
        },
    },
    {
        kind: 'block',
        type: 'trigger_timing',
        fields: {
            timing: 'end',
        },
    },
    {
        kind: 'block',
        type: 'trigger_timing',
        fields: {
            timing: 'after',
        },
    },
    // {
    //     kind: 'block',
    //     type: 'trigger_timing_judge',
    // },
];