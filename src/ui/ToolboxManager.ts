import * as Blockly from "blockly/core";
import {BlockDefinition, BlockDefinitionMap} from "./BlockDefinition";
import {Block} from "blockly/core";

type stringTree = {[name: string]: stringTree | null;}

export class ToolboxManager {
	private static instance: ToolboxManager | null = null;

    private blocks: BlockDefinitionMap = {};
    // private toolboxTree: stringTree = {};
    // private toolboxMap: { [name: string]: ToolboxItemInfo } = {};

	// public registerToolboxCategory(name: string, contents: object[]): void {}

	public registerToolboxBlock(
		name: string,
        block: BlockDefinition<any>,
		// { inputs }: { inputs?: BlockInfo["inputs"] } = {}
	): void {
		// const node = name.split("_");
        this.blocks[name] = block;
        // node.reduce((tree, category) => {
        //     if (!tree[category]) {
        //         tree[category] = {};
        //     }
        //     return tree[category] as stringTree;
        // }, this.toolboxTree);
		// this.toolboxMap[name] = {
		// 	kind: "block",
		// 	type: name,
		// 	inputs,
		// };
	}

	public registerToolboxBlocks(blocks: Record<string, BlockDefinition>): void {
		for (const [name, block] of Object.entries(blocks)) {
			this.registerToolboxBlock(name, block);
		}
	}

    public init() {
		const modules = import.meta.glob('@/ui/blocks/**/*.ts', { eager: true });

		Object.values(modules).forEach((mod: any) => {
			if (mod.blocks) {
				this.registerToolboxBlocks(mod.blocks);
			}
		});

        Blockly.common.defineBlocks(this.blocks);
        // const ws = Blockly.inject(blocklyDiv, { toolbox: this.getToolbox() });
        // return ws;
    }

	public static getInstance(): ToolboxManager {
		if (ToolboxManager.instance === null) {
			ToolboxManager.instance = new ToolboxManager();
		}
		return ToolboxManager.instance;
	}

	// public getToolbox(): ToolboxInfo  {
    //     const toolbox: ToolboxItemInfo = {
	// 		kind: "categoryToolbox",
	// 		contents: [
	// 			{
	// 				kind: "search",
	// 				name: "Search",
	// 				contents: [],
	// 			},
	// 		],
	// 	};
    //     const addCategory = (tree: stringTree, parent: ToolboxItemInfo) => {
    //         for (const [name, children] of Object.entries(tree)) {
    //             const node: ToolboxItemInfo = this.toolboxMap[name];
    //             if (!node) throw new Error(`Block ${name} not found in toolboxMap`);
    //             (parent as StaticCategoryInfo).contents.push(node);
    //             if (node.kind === "category" && (node as StaticCategoryInfo).contents) {
    //                 addCategory(children as stringTree, node);
    //             }
    //         }
    //     };
    //     addCategory(this.toolboxTree, toolbox);
    //     return toolbox as ToolboxInfo;
	// }
}
