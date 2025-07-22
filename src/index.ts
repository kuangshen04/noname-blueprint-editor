/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import * as Zh from "blockly/msg/zh-hans";
import "@/index.css";
import "@/ui/plugins/toolbox-search";
import * as SuggestedBlocks from "@/ui/plugins/suggested-blocks";
import { WorkspaceSearch } from "@blockly/plugin-workspace-search";
import { save, load } from "@/serialization";
import { toolbox } from "@/ui/blocks/toolbox";
import {ToolboxManager} from "@/ui/ToolboxManager";
import {JavascriptGeneratorManager} from "@/generators/GeneratorManager";
import {javascriptGenerator} from "blockly/javascript";
import {format} from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import prettierPluginEstree from "prettier/plugins/estree";
import {pluginInfo as genericConnectionCheckerInfo} from "@/ui/GenericConnectionChecker";
import {DisableTopBlocks} from '@/ui/DisableTopBlocks';
import {InputModal} from "@/ui/plugins/typed-variable-modal/InputModal";
import {TYPES} from "@/types";

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

new WorkspaceSearch(workspace).init();

SuggestedBlocks.init(workspace);

new DisableTopBlocks().init(workspace);
/**
 * Create the typed variable flyout.
 * @param workspace The Blockly workspace.
 * @returns Array of XML block elements.
 */
const createFlyout = function (workspace: Blockly.WorkspaceSvg): Element[] {
	let xmlList: Element[] = [];
	const button = document.createElement('button');
	button.setAttribute('text', '创建变量...');
	button.setAttribute('callbackKey', 'CREATE_TYPED_VARIABLE');

	xmlList.push(button);

	const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(workspace);
	xmlList = xmlList.concat(blockList);
	return xmlList;
};

const types = [
	['any', ''],
	['Number', 'Number'],
	['String', 'String'],
	['Boolean', 'Boolean'],
	['Array', 'Array'],
	['Trigger', TYPES.Trigger],
	['Event', TYPES.Event],
	['Card', TYPES.Card],
	['Player', TYPES.Player],
];
workspace.registerToolboxCategoryCallback(
	'CREATE_TYPED_VARIABLE',
	createFlyout,
);
const typedVarModal = new InputModal(
	workspace,
	'CREATE_TYPED_VARIABLE',
	types
);
typedVarModal.init();

const workspaceToCode = async (workspace: Blockly.Workspace, name: string) => {

	const code = [];
	javascriptGenerator.init(workspace);
	const blocks = workspace.getTopBlocks(true).filter(block => !(block.outputConnection || block.previousConnection));
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
	let codeString = `lib.skill["${name}"] = {
		group: [${blocks.map(block => '"' + name + "_" + block.getFieldValue("name") + '"').join(", ")}],
		subSkill: {
			${code.join('\n')}
		},
	};`;
	codeString = javascriptGenerator.finish(codeString);
	return await format(codeString, {
		parser: "babel",
		plugins: [parserBabel, prettierPluginEstree]
	}).catch((err) => err.message || err.toString());
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
