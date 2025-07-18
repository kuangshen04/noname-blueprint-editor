import {BlockDefinition, BlockDefinitionMap} from "@/ui/BlockDefinition";
import {Block, Connection, FieldTextInput, Msg} from "blockly/core";
import {inputs} from "blockly/core";
import {ToolboxItemInfo} from "blockly/core/utils/toolbox";
import {Workspace, BlockSvg} from "blockly/core";
import {MutatorIcon} from "blockly/core/icons/mutator_icon";
import {TYPES} from "@/types";

export const blocks: BlockDefinitionMap = {}


interface triggerContainerBlock extends Block {
    itemCount_: number;
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
        this.setTooltip("一个被动技能的起点");
        this.setHelpUrl("");
        this.setColour(0);
    },
    // /**
    //  * Block for creating a list with any number of elements of any type.
    //  */
    // init: function () {
    //     this.setHelpUrl(Msg['LISTS_CREATE_WITH_HELPURL']);
    //     this.setStyle('list_blocks');
    //     this.itemCount_ = 3;
    //     this.updateShape_();
    //     this.setOutput(true, 'Array');
    //     this.setMutator(
    //         new MutatorIcon(['lists_create_with_item'], this as unknown as BlockSvg),
    //     ); // BUG(#6905)
    //     this.setTooltip(Msg['LISTS_CREATE_WITH_TOOLTIP']);
    // },
    // /**
    //  * Returns the state of this block as a JSON serializable object.
    //  *
    //  * @returns The state of this block, ie the item count.
    //  */
    // saveExtraState: function (): {itemCount: number} {
    //     return {
    //         'itemCount': this.itemCount_,
    //     };
    // },
    // /**
    //  * Applies the given state to this block.
    //  *
    //  * @param state The state to apply to this block, ie the item count.
    //  */
    // loadExtraState: function (state: any) {
    //     this.itemCount_ = state['itemCount'];
    //     this.updateShape_();
    // },
    // /**
    //  * Populate the mutator's dialog with this block's components.
    //  *
    //  * @param workspace Mutator's workspace.
    //  * @returns Root block in mutator.
    //  */
    // decompose: function (
    //     workspace: Workspace,
    // ): ContainerBlock {
    //     const containerBlock = workspace.newBlock(
    //         'lists_create_with_container',
    //     ) as ContainerBlock;
    //     (containerBlock as BlockSvg).initSvg();
    //     let connection = containerBlock.getInput('STACK')!.connection;
    //     for (let i = 0; i < this.itemCount_; i++) {
    //         const itemBlock = workspace.newBlock(
    //             'lists_create_with_item',
    //         ) as ItemBlock;
    //         (itemBlock as BlockSvg).initSvg();
    //         if (!itemBlock.previousConnection) {
    //             throw new Error('itemBlock has no previousConnection');
    //         }
    //         connection!.connect(itemBlock.previousConnection);
    //         connection = itemBlock.nextConnection;
    //     }
    //     return containerBlock;
    // },
    // /**
    //  * Reconfigure this block based on the mutator dialog's components.
    //  *
    //  * @param containerBlock Root block in mutator.
    //  */
    // compose: function (containerBlock: Block) {
    //     let itemBlock: ItemBlock | null = containerBlock.getInputTargetBlock(
    //         'STACK',
    //     ) as ItemBlock;
    //     // Count number of inputs.
    //     const connections: Connection[] = [];
    //     while (itemBlock) {
    //         if (itemBlock.isInsertionMarker()) {
    //             itemBlock = itemBlock.getNextBlock() as ItemBlock | null;
    //             continue;
    //         }
    //         connections.push(itemBlock.valueConnection_ as Connection);
    //         itemBlock = itemBlock.getNextBlock() as ItemBlock | null;
    //     }
    //     // Disconnect any children that don't belong.
    //     for (let i = 0; i < this.itemCount_; i++) {
    //         const connection = this.getInput('ADD' + i)!.connection!.targetConnection;
    //         if (connection && !connections.includes(connection)) {
    //             connection.disconnect();
    //         }
    //     }
    //     this.itemCount_ = connections.length;
    //     this.updateShape_();
    //     // Reconnect any child blocks.
    //     for (let i = 0; i < this.itemCount_; i++) {
    //         connections[i]?.reconnect(this, 'ADD' + i);
    //     }
    // },
    // /**
    //  * Store pointers to any connected child blocks.
    //  *
    //  * @param containerBlock Root block in mutator.
    //  */
    // saveConnections: function (containerBlock: Block) {
    //     let itemBlock: ItemBlock | null = containerBlock.getInputTargetBlock(
    //         'STACK',
    //     ) as ItemBlock;
    //     let i = 0;
    //     while (itemBlock) {
    //         if (itemBlock.isInsertionMarker()) {
    //             itemBlock = itemBlock.getNextBlock() as ItemBlock | null;
    //             continue;
    //         }
    //         const input = this.getInput('ADD' + i);
    //         itemBlock.valueConnection_ = input?.connection!
    //             .targetConnection as Connection;
    //         itemBlock = itemBlock.getNextBlock() as ItemBlock | null;
    //         i++;
    //     }
    // },
    // /**
    //  * Modify this block to have the correct number of inputs.
    //  */
    // updateShape_: function (this: triggerContainerBlock) {
    //     if (this.itemCount_ && this.getInput('EMPTY')) {
    //         this.removeInput('EMPTY');
    //     } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
    //         this.appendDummyInput('EMPTY').appendField(
    //             Msg['LISTS_CREATE_EMPTY_TITLE'],
    //         );
    //     }
    //     // Add new inputs.
    //     for (let i = 0; i < this.itemCount_; i++) {
    //         if (!this.getInput('ADD' + i)) {
    //             const input = this.appendValueInput('ADD' + i).setAlign(inputs.Align.RIGHT);
    //             if (i === 0) {
    //                 input.appendField(Msg['LISTS_CREATE_WITH_INPUT_WITH']);
    //             }
    //         }
    //     }
    //     // Remove deleted inputs.
    //     for (let i = this.itemCount_; this.getInput('ADD' + i); i++) {
    //         this.removeInput('ADD' + i);
    //     }
    // },
};
blocks['trigger_container'] = triggerContainer;

// /** Type for a 'lists_create_with_container' block. */
// type ContainerBlock = Block & ContainerMutator;
// interface ContainerMutator extends ContainerMutatorType {}
// type ContainerMutatorType = typeof LISTS_CREATE_WITH_CONTAINER;
//
// const LISTS_CREATE_WITH_CONTAINER = {
//     /**
//      * Mutator block for list container.
//      */
//     init: function (this: ContainerBlock) {
//         this.setStyle('list_blocks');
//         this.appendDummyInput().appendField(
//             Msg['LISTS_CREATE_WITH_CONTAINER_TITLE_ADD'],
//         );
//         this.appendStatementInput('STACK');
//         this.setTooltip(Msg['LISTS_CREATE_WITH_CONTAINER_TOOLTIP']);
//         this.contextMenu = false;
//     },
// };
// blocks['lists_create_with_container'] = LISTS_CREATE_WITH_CONTAINER;

// /** Type for a 'lists_create_with_item' block. */
// type ItemBlock = Block & ItemMutator;
// interface ItemMutator extends ItemMutatorType {
//     valueConnection_?: Connection;
// }
// type ItemMutatorType = typeof LISTS_CREATE_WITH_ITEM;
//
// const LISTS_CREATE_WITH_ITEM = {
//     /**
//      * Mutator block for adding items.
//      */
//     init: function (this: ItemBlock) {
//         this.setStyle('list_blocks');
//         this.appendDummyInput().appendField(Msg['LISTS_CREATE_WITH_ITEM_TITLE']);
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//         this.setTooltip(Msg['LISTS_CREATE_WITH_ITEM_TOOLTIP']);
//         this.contextMenu = false;
//     },
// };
// blocks['lists_create_with_item'] = LISTS_CREATE_WITH_ITEM;
export const triggerContainerToolbox: ToolboxItemInfo = {
    kind: 'block',
    type: 'trigger_container',
};