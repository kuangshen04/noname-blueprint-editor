/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import "./index.css";
import * as Blockly from "blockly";
import {load, save} from "@/serialization";
import {createWorkspace} from "@/workspace";
import {workspaceToCode, workspaceToCodeWithFormat} from "@/generators/generator";

(window as any).Blockly = Blockly; // Expose Blockly globally for debugging

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById("generatedCode")?.firstChild;
const blocklyDiv = document.getElementById("blocklyDiv") as HTMLElement;

const workspace = createWorkspace(blocklyDiv);

const runCode = async () => {
    const code = await workspaceToCodeWithFormat(workspace, "name");
    if (codeDiv) codeDiv.textContent = code;
};

if (workspace) {
    // Load initial data if available
    load(workspace);
    runCode();

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
        save(workspace);
        runCode();
    });
}
