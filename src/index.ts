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
import { save, load } from "./serialization";
import { toolbox } from "./ui/blocks/toolbox";
import "./index.css";
import {ToolboxManager} from "./ui/ToolboxManager";
import {JavascriptGeneratorManager} from "./generators/GeneratorManager";
import {javascriptGenerator} from "blockly/javascript";
import {format} from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import prettierPluginEstree from "prettier/plugins/estree";
import {pluginInfo as genericConnectionCheckerInfo} from "@/ui/GenericConnectionChecker";

Blockly.setLocale(Zh as unknown as Record<string, string>);
(window as any).Blockly = Blockly; // Make Blockly globally available for debugging

ToolboxManager.getInstance().init();
JavascriptGeneratorManager.getInstance().init();

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById("generatedCode")?.firstChild;
const outputDiv = document.getElementById("output");
const blocklyDiv = document.getElementById("blocklyDiv");

if (!blocklyDiv) {
	throw new Error(`div with id 'blocklyDiv' not found`);
}
const workspace = Blockly.inject(blocklyDiv, {
	toolbox,
	plugins: {
		...genericConnectionCheckerInfo
	},
	zoom: {
		controls: true,
	},
});
const workspaceSearch = new WorkspaceSearch(workspace);
workspaceSearch.init();
// workspaceSearch.open();

SuggestedBlocks.init(workspace);

const workspaceToCode = async (workspace: Blockly.Workspace, name: string) => {

	const code = [];
	javascriptGenerator.init(workspace);
	const blocks = workspace.getTopBlocks(true).filter(block => block.type === "trigger_container");
	for (let i = 0, block; (block = blocks[i]); i++) {
		let line = javascriptGenerator.blockToCode(block);
		if (Array.isArray(line)) {
			// Value blocks return tuples of code and operator order.
			// Top-level blocks don't care about operator order.
			line = line[0];
		}
		if (line) {
			if (block.outputConnection) {
				// This block is a naked value.  Ask the language's code generator if
				// it wants to append a semicolon, or something.
				line = javascriptGenerator.scrubNakedValue(line);
				if (javascriptGenerator.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
					line = javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block) + line;
				}
				if (javascriptGenerator.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
					line = line + javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block);
				}
			}
			code.push(line);
		}
	}
	// Blank line between each section.
	let codeString = `lib.skill[${name}] = {
		group: [${blocks.map(block => '"' + name + "_" + block.getFieldValue("name") + '"').join(", ")}],
		subSkill: {
			${code.join('\n')}
		},
	};`;
	codeString = javascriptGenerator.finish(codeString);
	return await format(codeString, {
		parser: "babel",
		plugins: [parserBabel, prettierPluginEstree]
	});
}
// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = async () => {
	const code = await workspaceToCode(workspace, "name");
	if (codeDiv) codeDiv.textContent = code;

	// if (outputDiv) outputDiv.innerHTML = "";

	// eval(code);
	// const json = Blockly.serialization.workspaces.save(workspace);
	// if (json) {
	// 	const code = JSON.stringify(json, null, 2);
	// 	if (codeDiv) codeDiv.textContent = code;
	// }
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
