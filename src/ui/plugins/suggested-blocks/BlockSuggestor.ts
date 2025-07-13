/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utility functions for handling suggestions.
 */
import * as Blockly from "blockly/core";
import { BlockCreate } from "blockly/core/events/events_block_create";

/** Map from workspaces to BlockSuggestor objects. */
export const suggestorLookup = new WeakMap<Blockly.WorkspaceSvg, BlockSuggestor>();

/**
 * Class that tracks all blocks created in a workspace and suggests future
 * blocks to use.
 */
export class BlockSuggestor {
	/**
	 * Saves the full JSON data for each block type the first time it's used.
	 * This helps store what initial configuration / sub-blocks each block type
	 * would be expected to have.
	 */
	defaultJsonForBlockLookup: Record<string, object> = {};
	/**
	 * List of recently used block types
	 */
	recentlyUsedBlocks: string[] = [];
	/**
	 * Checks if the workspace is finished loading, to avoid taking action on
	 * all the BLOCK_CREATE events during workspace loading.
	 */
	workspaceHasFinishedLoading: boolean = false;
	/**
	 * Config parameter which sets the size of the toolbox categories.
	 */
	numBlocksPerCategory: number;
	/**
	 * Maximum number of blocks to store.
	 */
	maxBlocks: number;

	/**
	 * Constructs a BlockSuggestor object.
	 * @param numBlocksPerCategory the size of each toolbox category
	 * @param maxBlocks the maximum number of blocks to store in the
	 * recently used list
	 */
	constructor(numBlocksPerCategory: number = 10, maxBlocks: number = 100) {
		this.numBlocksPerCategory = numBlocksPerCategory;
		this.maxBlocks = maxBlocks;
		this.registerSerializer();
	}

    /**
     * Registers the serializer for the backpack.
     */
	private registerSerializer() {
		if (
			Blockly.registry.hasItem(
				Blockly.registry.Type.SERIALIZER,
				"suggested-blocks"
			)
		) {
			return;
		}
	
		Blockly.serialization.registry.register(
			"suggested-blocks",
			new BlockSuggestorSerializer()
		);
	}

	/**
	 * Generates a list of the 10 most frequently used blocks, in order.
	 * Includes a secondary sort by most recent blocks.
	 * @returns A list of block JSON
	 */
	getMostUsed(): Blockly.utils.toolbox.BlockInfo[] {
		// Store the frequency of each block, as well as the index first appears at.
		const countMap = new Map<string, number>();
		const recencyMap = new Map<string, number>();
		for (const [index, key] of this.recentlyUsedBlocks.entries()) {
			countMap.set(key, (countMap.get(key) || 0) + 1);
			if (!recencyMap.has(key)) {
				recencyMap.set(key, index + 1);
			}
		}

		// Get a sorted list.
		const freqUsedBlockTypes: string[] = [];
		for (const key of countMap.keys()) {
			freqUsedBlockTypes.push(key);
		}
		// Use recency as a tiebreak.
		freqUsedBlockTypes.sort(
			(a, b) => {
				if (countMap.get(a) === countMap.get(b)) {
					return (recencyMap.get(a) as number) - (recencyMap.get(b) as number);
				}
				// Sort by frequency, then recency.
				return (countMap.get(a) as number) - (countMap.get(b) as number);
			}
		);

		return this.generateBlockData(
			freqUsedBlockTypes
		) as Blockly.utils.toolbox.BlockInfo[];
	}

	/**
	 * Generates a list of the 10 most recently used blocks.
	 * @returns A list of block JSON objects
	 */
	getRecentlyUsed(): Blockly.utils.toolbox.BlockInfo[] {
		const uniqueRecentBlocks = [...new Set(this.recentlyUsedBlocks)];
		const recencyMap = new Map<string, number>();
		for (const [index, key] of this.recentlyUsedBlocks.entries()) {
			if (!recencyMap.has(key)) {
				recencyMap.set(key, index + 1);
			}
		}
		uniqueRecentBlocks.sort(
			(a, b) =>
				(recencyMap.get(a) as number) - (recencyMap.get(b) as number)
		);
		return this.generateBlockData(
			uniqueRecentBlocks
		) as Blockly.utils.toolbox.BlockInfo[];
	}

	/**
	 * Converts a list of block types to a full-fledged list of block data.
	 * @param blockTypeList the list of block types
	 * @returns the block data list
	 */
	generateBlockData(blockTypeList: string[]): object[] {
		const blockList = blockTypeList
			.slice(0, this.numBlocksPerCategory)
			.map((key) => {
				const json: any = this.defaultJsonForBlockLookup[key] || {};
				json["kind"] = "BLOCK";
				json["type"] = key;
				json["x"] = null;
				json["y"] = null;
				return json as object;
			});

		if (blockList.length == 0) {
			blockList.push({
				kind: "LABEL",
				text: "No blocks have been used yet!",
			});
		}
		return blockList;
	}

	/**
	 * Loads the state of this object from a serialized JSON.
	 * @param data the serialized data payload to load from
	 */
	loadFromSerializedData(data: {
		defaultJsonForBlockLookup: Record<string, object>;
		recentlyUsedBlocks: string[];
	}) {
		this.defaultJsonForBlockLookup = data.defaultJsonForBlockLookup;
		this.recentlyUsedBlocks = data.recentlyUsedBlocks;
	}

	/**
	 * Saves the state of this object to a serialized JSON.
	 * @returns a serialized data object including this object's state
	 */
	saveToSerializedData() {
		const recentlyUsedBlocks = this.recentlyUsedBlocks.slice(
			0,
			this.maxBlocks
		);
		const uniqueRecentBlocks = [...new Set(recentlyUsedBlocks)];
		const defaultJsonForBlockLookup: Record<string, object> = {};
		for (const blockType of uniqueRecentBlocks) {
			defaultJsonForBlockLookup[blockType] =
				this.defaultJsonForBlockLookup[blockType];
		}
		return {
			defaultJsonForBlockLookup,
			recentlyUsedBlocks,
		};
	}

	/**
	 * Resets the internal state of this object.
	 */
	clearPriorBlockData() {
		this.defaultJsonForBlockLookup = {};
		this.recentlyUsedBlocks = [];
	}

	/**
	 * Callback for when the workspace sends out events.
	 * @param e the event object
	 */
	eventListener(e: Blockly.Events.Abstract) {
		if (e.type == Blockly.Events.FINISHED_LOADING) {
			this.workspaceHasFinishedLoading = true;
			return;
		}
		if (
			e.type == Blockly.Events.BLOCK_CREATE &&
			this.workspaceHasFinishedLoading
		) {
			const json = (e as BlockCreate).json;
			if (!json) return;
			const newBlockType = json.type;
			// If this is the first time creating this block, store its default
			// configuration so we know how exactly to render it in the toolbox.
			if (!this.defaultJsonForBlockLookup[newBlockType]) {
				this.defaultJsonForBlockLookup[newBlockType] = json;
			}
			this.recentlyUsedBlocks.unshift(newBlockType);
		}
	}
}

/**
 * Custom serializer so that the block suggestor can save and later recall which
 * blocks have been used in a workspace.
 */
class BlockSuggestorSerializer implements Blockly.serialization.ISerializer {
	/**
	 * The priority for deserializing block suggestion data.
	 * Should be less than the priority for blocks so that this state is
	 * applied after the blocks are loaded.
	 */
	priority: number = Blockly.serialization.priorities.BLOCKS - 10;

	/**
	 * Saves a target workspace's state to serialized JSON.
	 * @param workspace the workspace to save
	 * @returns the serialized JSON if present
	 */
	save(workspace: Blockly.WorkspaceSvg): object | null {
		return suggestorLookup.get(workspace)?.saveToSerializedData() || null;
	}

	/**
	 * Loads a serialized state into the target workspace.
	 * @param state the serialized state JSON
	 * @param workspace the workspace to load into
	 */
	load(state: object, workspace: Blockly.WorkspaceSvg) {
		suggestorLookup.get(workspace)?.loadFromSerializedData(state as any);
	}

	/**
	 * Resets the state of a workspace.
	 * @param workspace the workspace to reset
	 */
	clear(workspace: Blockly.WorkspaceSvg) {
		suggestorLookup.get(workspace)?.clearPriorBlockData();
	}
}
