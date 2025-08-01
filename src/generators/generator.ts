import {javascriptGenerator} from "blockly/javascript";
import * as Blockly from "blockly";
import {format} from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import prettierPluginEstree from "prettier/plugins/estree";

export async function workspaceToCodeWithFormat(workspace: Blockly.Workspace, name: string): Promise<string> {
    return format(workspaceToCode(workspace, name), {
        parser: "babel",
        plugins: [parserBabel, prettierPluginEstree]
    }).catch((err) => err.message || err.toString());
}

export function workspaceToCode(workspace: Blockly.Workspace, name: string): string {

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
    let codeString = `skill = {
		group: [${blocks.map(block => '"' + name + "_" + block.getFieldValue("name") + '"').join(", ")}],
		subSkill: {
			${code.join('\n')}
		},
	};`;
    return javascriptGenerator.finish(codeString);
}