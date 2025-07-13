/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helper and utility methods for the favourites plugin.
 * @author kozbial@google.com (Monica Kozbial)
 */

import * as Blockly from "blockly/core";

import {ToolboxFavouritesCategory, toolboxFavouritesLookup} from "./BlockFavourites";

import {Options} from "./options";

/**
 * Registers a context menu option to empty the favourites.
 */
function registerEmptyFavourites() {
    if (Blockly.ContextMenuRegistry.registry.getItem("empty_favourites")) {
        return;
    }
    const emptyFavourites: Blockly.ContextMenuRegistry.RegistryItem = {
        displayText: function (scope: Blockly.ContextMenuRegistry.Scope) {
            const workspace = scope.workspace;
            if (!workspace) {
                return "";
            }
            const favourites = toolboxFavouritesLookup.get(workspace) as ToolboxFavouritesCategory;
            const favouritesCount = favourites.getCount();
            return `${Blockly.Msg["EMPTY_FAVOURITES"]} (${favouritesCount})`;
        },
        preconditionFn: function (scope: Blockly.ContextMenuRegistry.Scope) {
            if (!scope.workspace) return "hidden";
            const favourites = toolboxFavouritesLookup.get(scope.workspace) as ToolboxFavouritesCategory;
            if (favourites.getCount() > 0) {
                return "enabled";
            }
            return "disabled";
        },
        callback: function (scope: Blockly.ContextMenuRegistry.Scope) {
            if (!scope.workspace) return;
            const favourites = toolboxFavouritesLookup.get(scope.workspace) as ToolboxFavouritesCategory;
            if (confirm(Blockly.Msg["EMPTY_FAVOURITES_CONFIRM"])) favourites.empty();
        },
        scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
        id: "empty_favourites",
        // Use a larger weight to push the option lower on the context menu.
        weight: 200,
    };
    Blockly.ContextMenuRegistry.registry.register(emptyFavourites);
}

/**
 * Registers a context menu option to remove a block from the favourites.
 */
function registerRemoveFromFavourites() {
    if (Blockly.ContextMenuRegistry.registry.getItem("remove_from_favourites")) {
        return;
    }
    const removeFromFavourites: Blockly.ContextMenuRegistry.RegistryItem = {
        displayText: Blockly.Msg["REMOVE_FROM_FAVOURITES"],
        preconditionFn: function (scope: Blockly.ContextMenuRegistry.Scope) {
            if (!scope.block || !scope.block.workspace.targetWorkspace) return "hidden";
            const favourites = toolboxFavouritesLookup.get(scope.block.workspace.targetWorkspace) as ToolboxFavouritesCategory;
            if (scope.block!.isInFlyout && favourites.isInFavouritesFlyout()) {
                return "enabled";
            }
            return "hidden";
        },
        callback: function (scope: Blockly.ContextMenuRegistry.Scope) {
            if (!scope.block || !scope.block.workspace.targetWorkspace) return;
            const favourites = toolboxFavouritesLookup.get(scope.block.workspace.targetWorkspace) as ToolboxFavouritesCategory;
            favourites.removeBlock(scope.block);
        },
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        id: "remove_from_favourites",
        // Use a larger weight to push the option lower on the context menu.
        weight: 200,
    };
    Blockly.ContextMenuRegistry.registry.register(removeFromFavourites);
}

/**
 * Registers context menu options for adding a block to the favourites.
 */
function registerCopyToFavourites() {
    if (Blockly.ContextMenuRegistry.registry.getItem("copy_to_favourites")) {
        return;
    }
    const copyToFavourites: Blockly.ContextMenuRegistry.RegistryItem = {
        displayText: function (scope: Blockly.ContextMenuRegistry.Scope) {
            const workspace = scope.block?.workspace;
            if (!workspace) {
                return "";
            }
            const favourites = toolboxFavouritesLookup.get(workspace) as ToolboxFavouritesCategory;
            const favouritesCount = favourites.getCount();
            return `${Blockly.Msg["COPY_TO_FAVOURITES"]} (${favouritesCount})`;
        },
        preconditionFn: function (scope: Blockly.ContextMenuRegistry.Scope) {
            if (!scope.block) return "hidden";
            const ws = scope.block.workspace;
            if (!ws.isFlyout) {
                const favourites = toolboxFavouritesLookup.get(ws) as ToolboxFavouritesCategory;
                if (favourites) {
                    return favourites.containsBlock(scope.block)
                        ? "disabled"
                        : "enabled";
                }
            }
            return "hidden";
        },
        callback: function (scope: Blockly.ContextMenuRegistry.Scope) {
            if (!scope.block) return;
            const favourites = toolboxFavouritesLookup.get(scope.block.workspace) as ToolboxFavouritesCategory;
            favourites.addBlock(scope.block);
        },
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        id: "copy_to_favourites",
        // Use a larger weight to push the option lower on the context menu.
        weight: 200,
    };
    Blockly.ContextMenuRegistry.registry.register(copyToFavourites);
}

/**
 * Register all context menu options.
 *
 * @param contextMenuOptions The favourites context menu options.
 */
export function registerContextMenus(
    contextMenuOptions: Options
) {
    if (contextMenuOptions.emptyFavourites) {
        registerEmptyFavourites();
    }
    if (contextMenuOptions.removeFromFavourites) {
        registerRemoveFromFavourites();
    }
    if (contextMenuOptions.copyToFavourites) {
        registerCopyToFavourites();
    }
}

export function unregisterContextMenus() {
    if (Blockly.ContextMenuRegistry.registry.getItem("empty_favourites")) {
        Blockly.ContextMenuRegistry.registry.unregister("empty_favourites");
    }
    if (Blockly.ContextMenuRegistry.registry.getItem("remove_from_favourites")) {
        Blockly.ContextMenuRegistry.registry.unregister("remove_from_favourites");
    }
    if (Blockly.ContextMenuRegistry.registry.getItem("copy_to_favourites")) {
        Blockly.ContextMenuRegistry.registry.unregister("copy_to_favourites");
    }
}
