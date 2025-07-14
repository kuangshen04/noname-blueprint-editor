/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A backpack that lives on top of the workspace.
 * @author kozbial@google.com (Monica Kozbial)
 */

/* eslint-disable @typescript-eslint/naming-convention */

import * as Blockly from "blockly/core";

import {registerContextMenus, unregisterContextMenus} from "./ContextMenuRegistry";
import { Options, parseOptions } from "./options";
import { Backpackable, isBackpackable } from "./backpackable";

/** Map from workspaces to ToolboxFavouriteCategory objects. */
export const toolboxFavouritesLookup = new WeakMap<Blockly.WorkspaceSvg, ToolboxFavouritesCategory>();
/**
 * Class for backpack that can be used save blocks from the workspace for
 * future use.
 */
export class ToolboxFavouritesCategory extends Blockly.ToolboxCategory {

    static readonly FAVOURITE_CATEGORY_KIND = "favourite";
    /** The unique id for this component. */
    id = "favourite";

    /**
     * The backpack options, such as which context menus to show, whether to
     * allow opening the backpack when empty and whether to use a different
     * image when the backpack contains blocks.
     */
    private options: Options;

    /** A list of JSON (stored as strings) representing blocks in the backpack. */
    protected contents_: string[] = [];

    isInFavouritesFlyout(): boolean {
        return this.workspace_.getToolbox()?.getSelectedItem() === this;
    }

    constructor(
        categoryDef: Blockly.utils.toolbox.CategoryInfo,
        parentToolbox: Blockly.IToolbox,
        opt_parent?: Blockly.ICollapsibleToolboxItem,
        options?: Options
    ) {
        super(categoryDef, parentToolbox, opt_parent);
        this.options = parseOptions(options);
        this.registerSerializer();
        toolboxFavouritesLookup.set(this.workspace_, this);
    }

    /**
     * Registers the serializer for the backpack.
     */
    private registerSerializer() {
        if (
            Blockly.registry.hasItem(
                Blockly.registry.Type.SERIALIZER,
                "favourites"
            )
        ) {
            return;
        }

        Blockly.serialization.registry.register(
            "favourites",
            new FavouritesSerializer()
        );
    }

    /**
     * Initializes the backpack.
     */
    override init() {
        super.init();
        this.matchBlocks();
        registerContextMenus(this.options);
    }

    /**
     * Disposes of workspace search.
     * Unlink from all DOM elements and remove all event listeners
     * to prevent memory leaks.
     */
    override dispose() {
        super.dispose();
        Blockly.ShortcutRegistry.registry.unregister(
            ToolboxFavouritesCategory.FAVOURITE_CATEGORY_KIND,
        );
        unregisterContextMenus();
        toolboxFavouritesLookup.delete(this.workspace_);
    }

    /**
     * Returns the count of items in the backpack.
     *
     * @returns The count of items.
     */
    getCount(): number {
        return this.contents_.length;
    }

    /**
     * Returns backpack contents.
     *
     * @returns The backpack contents.
     */
    getContent(): string[] {
        // Return a shallow copy of the contents array.
        return [...this.contents_];
    }

    /**
     * Sets backpack contents.
     *
     * @param contents The new backpack contents.
     */
    setContent(contents: string[]) {
        this.contents_ = this.filterDuplicates(contents);
        this.onContentChange();
    }

    /**
     * Handles content change.
     */
    protected onContentChange() {
        this.matchBlocks();
    }

    /**
     * Filters the available blocks based on the current query string.
     */
    matchBlocks() {
        this.flyoutItems_ = this.contents_.map((text) => JSON.parse(text));

        if (!this.contents_.length) {
            this.flyoutItems_.push({
                kind: "label",
                text: Blockly.Msg["FAVOURITES_EMPTY"],
            });
        }
        if (this.workspace_.getToolbox()?.getSelectedItem() === this) {
            this.parentToolbox_.refreshSelection();
            Blockly.getFocusManager().focusNode(this);
        }
    }

    /**
     * Converts the provided block into a JSON string and
     * cleans the JSON of any unnecessary attributes
     *
     * @param block The block to convert.
     * @returns The JSON object as a string.
     */
    private blockToJsonString(block: Blockly.Block): string {
        const json = Blockly.serialization.blocks.save(block);

        // Add a 'kind' key so the flyout can recognize it as a block.
        (json as Blockly.utils.toolbox.FlyoutItemInfo).kind = "BLOCK";

        // The keys to remove.
        const keys = ["id", "height", "width", "pinned", "enabled"];

        // Traverse the JSON recursively.
        const traverseJson = function (json: StateWithIndex, keys: string[]) {
            for (const key in json) {
                if (key) {
                    if (keys.indexOf(key) !== -1) {
                        delete json[key];
                    }
                    if (json[key] && typeof json[key] === "object") {
                        traverseJson(json[key] as StateWithIndex, keys);
                    }
                }
            }
        };

        if (json) {
            traverseJson(json as StateWithIndex, keys);
        }
        return JSON.stringify(json);
    }

    /**
     * Returns whether the backpack contains a duplicate of the provided Block.
     *
     * @param block The block to check.
     * @returns Whether the backpack contains a duplicate of the
     *     provided block.
     */
    containsBlock(block: Blockly.Block): boolean {
        if (isBackpackable(block)) {
            return this.containsBackpackable(block);
        } else {
            return this.contents_.indexOf(this.blockToJsonString(block)) !== -1;
        }
    }

    /**
     * Adds the specified block to backpack.
     *
     * @param block The block to be added to the backpack.
     */
    addBlock(block: Blockly.Block) {
        if (isBackpackable(block)) {
            this.addBackpackable(block);
        } else {
            this.addItem(this.blockToJsonString(block));
        }
    }

    /**
     * Removes the specified block from the backpack.
     *
     * @param block The block to be removed from the backpack.
     */
    removeBlock(block: Blockly.Block) {
        if (isBackpackable(block)) {
            this.removeBackpackable(block);
        } else {
            this.removeItem(this.blockToJsonString(block));
        }
    }

    /**
     * @param backpackable The backpackable we want to check for existence within
     *     the backpack.
     * @return whether the backpack contains a duplicate of the provided
     *     backpackable.
     */
    containsBackpackable(backpackable: Backpackable): boolean {
        return backpackable
            .toFlyoutInfo()
            .every(
                (info) => this.contents_.indexOf(JSON.stringify(info)) !== -1
            );
    }

    /**
     * @param backpackable The backpackable to add to the backpack.
     */
    addBackpackable(backpackable: Backpackable) {
        this.addBackpackables([backpackable]);
    }

    /** @param backpackables The backpackables to add to the backpack. */
    addBackpackables(backpackables: Backpackable[]) {
        this.addItems(
            backpackables
                .map((b) => b.toFlyoutInfo())
                .reduce((acc, curr) => [...acc, ...curr])
                .map((info) => JSON.stringify(info))
        );
    }

    /** @param backpackable The backpackable to remove from the backpack. */
    removeBackpackable(backpackable: Backpackable) {
        for (const info of backpackable.toFlyoutInfo()) {
            this.removeItem(JSON.stringify(info));
        }
    }

    /**
     * Adds item to backpack.
     *
     * @param item Text representing the JSON of a block to add,
     *     cleaned of all unnecessary attributes.
     */
    addItem(item: string) {
        this.addItems([item]);
    }

    /**
     * Adds multiple items to the backpack.
     *
     * @param items The backpack contents to add.
     */
    addItems(items: string[]) {
        const addedItems = this.filterDuplicates(items);
        if (addedItems.length) {
            this.contents_.unshift(...addedItems);
            this.onContentChange();
        }
    }

    /**
     * Removes item from the backpack.
     *
     * @param item Text representing the JSON of a block to remove,
     * cleaned of all unnecessary attributes.
     */
    removeItem(item: string) {
        const itemIndex = this.contents_.indexOf(item);
        if (itemIndex !== -1) {
            this.contents_.splice(itemIndex, 1);
            this.onContentChange();
        }
    }

    /**
     * Empties the backpack's contents. If the contents-flyout is currently open
     * it will be closed.
     */
    empty() {
        if (!this.getCount()) {
            return;
        }
        if (this.contents_.length) {
            this.contents_ = [];
            this.onContentChange();
        }
    }


    /**
     * Returns a filtered list without duplicates within itself and without any
     * shared elements with this.contents_.
     *
     * @param array The array of items to filter.
     * @returns The filtered list.
     */
    private filterDuplicates(array: string[]): string[] {
        return array.filter((item, idx) => {
            return (
                array.indexOf(item) === idx &&
                this.contents_.indexOf(item) === -1
            );
        });
    }
}

/**
 * Custom serializer so that the backpack can save and later recall which
 * blocks have been saved in a workspace.
 */
class FavouritesSerializer implements Blockly.serialization.ISerializer {
    /**
     * The priority for deserializing block suggestion data.
     * Should be after blocks, procedures, and variables.
     */
    priority = Blockly.serialization.priorities.BLOCKS - 10;

    /**
     * Saves a target workspace's state to serialized JSON.
     *
     * @param workspace the workspace to save
     * @returns the serialized JSON if present
     */
    save(workspace: Blockly.WorkspaceSvg): object[] | null {
        const backpack = toolboxFavouritesLookup.get(workspace);
        return backpack?.getContent().map((text) => JSON.parse(text)) || null;
    }

    /**
     * Loads a serialized state into the target workspace.
     *
     * @param state the serialized state JSON
     * @param workspace the workspace to load into
     */
    load(state: object[], workspace: Blockly.WorkspaceSvg) {
        const jsonStrings = state.map((j) => JSON.stringify(j));
        const backpack = toolboxFavouritesLookup.get(workspace);
        backpack?.setContent(jsonStrings);
    }

    /**
     * Resets the state of a workspace.
     *
     * @param workspace the workspace to reset
     */
    clear(workspace: Blockly.WorkspaceSvg) {
        const backpack = toolboxFavouritesLookup.get(workspace);
        backpack?.empty();
    }
}

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    ToolboxFavouritesCategory.FAVOURITE_CATEGORY_KIND,
    ToolboxFavouritesCategory,
);

interface StateWithIndex extends Blockly.serialization.blocks.State {
    [key: string]: unknown;
}
