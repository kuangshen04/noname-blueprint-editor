/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import * as Zh from "blockly/msg/zh-hans";
import "./ui/plugins/toolbox-search";
import * as SuggestedBlocks from "./ui/plugins/suggested-blocks";
import { WorkspaceSearch } from "@blockly/plugin-workspace-search";
import "./ui/blocks/text";
import  "./ui/blocks/noname";
import { forBlock } from "./generators/javascript";
import { javascriptGenerator } from "blockly/javascript";
import { save, load } from "./serialization";
import { toolbox } from "./ui/blocks/toolbox";
import "./index.css";
import {ToolboxManager} from "./ui/blocks/ToolboxManager";

Blockly.setLocale(Zh);
(window as any).Blockly = Blockly; // Make Blockly globally available for debugging

ToolboxManager.getInstance().initBlocks();
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById("generatedCode")?.firstChild;
const outputDiv = document.getElementById("output");
const blocklyDiv = document.getElementById("blocklyDiv");

if (!blocklyDiv) {
	throw new Error(`div with id 'blocklyDiv' not found`);
}
const workspace = Blockly.inject(blocklyDiv, {
	toolbox,
	zoom: {
		controls: true,
	},
});
const workspaceSearch = new WorkspaceSearch(workspace);
workspaceSearch.init();
// workspaceSearch.open();

SuggestedBlocks.init(workspace);

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
	// const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
	// if (codeDiv) codeDiv.textContent = code;

	// if (outputDiv) outputDiv.innerHTML = "";

	// eval(code);
	const json = Blockly.serialization.workspaces.save(workspace);
	if (json) {
		const code = JSON.stringify(json, null, 2);
		if (codeDiv) codeDiv.textContent = code;
	}
};

if (workspace) {
	// Load the initial state from storage and run the code.
	load(workspace);
	runCode();

	// Every time the workspace changes state, save the changes to storage.
	workspace.addChangeListener((e: Blockly.Events.Abstract) => {
		// UI events are things like scrolling, zooming, etc.
		// No need to save after one of these.
		if (e.isUiEvent) return;
		save(workspace);
	});

	// Whenever the workspace changes meaningfully, run the code again.
	workspace.addChangeListener((e: Blockly.Events.Abstract) => {
		// Don't run the code when the workspace finishes loading; we're
		// already running it once when the application starts.
		// Don't run the code during drags; we might have invalid state.
		if (
			e.isUiEvent ||
			e.type == Blockly.Events.FINISHED_LOADING ||
			workspace.isDragging()
		) {
			return;
		}
		runCode();
	});
}
