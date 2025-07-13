import * as Blockly from "blockly/core";
import './msg';
import { BlockSuggestor, suggestorLookup } from "./BlockSuggestor";
import  "./BlockFavourites";

/**
 * Main entry point to initialize the suggested blocks categories.
 * @param workspace the workspace to load into
 * @param numBlocksPerCategory how many blocks should be included per
 * category. Defaults to 10.
 * @param waitForFinishedLoading whether to wait until we hear the
 * FINISHED_LOADING event before responding to BLOCK_CREATE events. Set to false
 * if you disable events during initial load. Defaults to true.
 * @param maxBlocks the maximum number of blocks to store in the recently used
 * list. Defaults to 100.
 */
export const init = function (
    workspace: Blockly.WorkspaceSvg,
    numBlocksPerCategory: number = 10,
    waitForFinishedLoading: boolean = true,
    maxBlocks: number = 100
) {
    const suggestor = new BlockSuggestor(numBlocksPerCategory, maxBlocks);
    workspace.registerToolboxCategoryCallback(
        "MOST_USED",
        suggestor.getMostUsed.bind(suggestor)
    );
    workspace.registerToolboxCategoryCallback(
        "RECENTLY_USED",
        suggestor.getRecentlyUsed.bind(suggestor)
    );
    // If user says not to wait to hear FINISHED_LOADING event,
    // then always respond to BLOCK_CREATE events.
    if (!waitForFinishedLoading) suggestor.workspaceHasFinishedLoading = true;
    workspace.addChangeListener(suggestor.eventListener.bind(suggestor));
    suggestorLookup.set(workspace, suggestor);
};