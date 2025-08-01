import * as Blockly from "blockly";
import * as Zh from "blockly/msg/zh-hans";
import {ToolboxManager} from "@/ui/ToolboxManager";
import {JavascriptGeneratorManager} from "@/generators/GeneratorManager";
import {toolbox} from "@/ui/blocks/toolbox";
import {pluginInfo as genericConnectionCheckerInfo} from "@/ui/GenericConnectionChecker";
import "@/ui/plugins/toolbox-search";
import {WorkspaceSearch} from "@blockly/plugin-workspace-search";
import * as SuggestedBlocks from "@/ui/plugins/suggested-blocks";
import {DisableTopBlocks} from "@/ui/DisableTopBlocks";
import {InputModal} from "@/ui/plugins/typed-variable-modal/InputModal";

export function createWorkspace(blocklyDiv: HTMLElement): Blockly.WorkspaceSvg {
    if (!blocklyDiv) {
        throw new Error(`blocklyDiv not found`);
    }

    Blockly.setLocale(Zh as unknown as Record<string, string>);

    ToolboxManager.getInstance().init();
    JavascriptGeneratorManager.getInstance().init();

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

    new InputModal(workspace, 'CREATE_TYPED_VARIABLE').init();

    return workspace;
}