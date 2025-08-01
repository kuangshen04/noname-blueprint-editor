/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Plugin for changing the context menu to match the
 * `disableOrphans` event handler.
 */

import * as Blockly from 'blockly/core';
import {Block, WorkspaceSvg, Events, BlockSvg} from "blockly/core";
import {Abstract} from "blockly/core/events/events_abstract";
import {common} from "blockly";

/**
 * This plugin changes the logic of the enable/disable context menu item. It is
 * enabled for all blocks except top-level blocks that have output or
 * previous connections. In other words, the option is disabled for orphan
 * blocks. Using this plugin allows users to disable valid non-orphan blocks,
 * but not re-enable blocks that have been automatically disabled by
 * `disableOrphans`.
 */
export class DisableTopBlocks {
    static TOP_BLOCKS_DISABLED_REASON = 'TOP_BLOCK';

    /**
     * A block is an orphan if its parent is an orphan, or if it doesn't have a
     * parent but it does have a previous or output connection (so it expects to be
     * attached to something). This means all children of orphan blocks are also
     * orphans and cannot be manually re-enabled.
     * @param block Block to check.
     * @returns Whether the block is an orphan.
     */
    static isOrphan(block: Block): boolean {
        return !!(block.outputConnection || block.previousConnection);
    }

    private topBlocks: BlockSvg[] = [];

    init(workspace: Blockly.Workspace) {
        workspace.addChangeListener(this.disableTopBlocks.bind(this));
        workspace.addChangeListener(Blockly.Events.disableOrphans);
    }

    private disableTopBlocks(event: Abstract) {
        if (event.type === Events.BLOCK_MOVE || event.type === Events.BLOCK_CREATE) {
            const blockEvent = event as Events.BlockMove | Events.BlockCreate;
            if (!blockEvent.workspaceId) return;

            const eventWorkspace = common.getWorkspaceById(
                blockEvent.workspaceId,
            ) as WorkspaceSvg;

            const blocks = eventWorkspace.getTopBlocks(false).filter(DisableTopBlocks.isOrphan);
            for (const block of this.topBlocks) {
                if (!blocks.includes(block)) {
                    block.setDisabledReason(false, DisableTopBlocks.TOP_BLOCKS_DISABLED_REASON);
                }
            }
            this.topBlocks = blocks;
            for (const block of this.topBlocks) {
                if (!block.hasDisabledReason(DisableTopBlocks.TOP_BLOCKS_DISABLED_REASON)) {
                    block.setDisabledReason(true, DisableTopBlocks.TOP_BLOCKS_DISABLED_REASON);
                }
            }
        }
    }
}