import {Block, Blocks, Events, FieldVariable, Msg} from "blockly/core";

// ensure the file imported by ToolboxManager.ts
export const blocks = {};

const oldGetInit = Blocks["variables_get_dynamic"].init;
Blocks["variables_get_dynamic"].init = function (this: Block) {
  oldGetInit.call(this);
  this.setTooltip(() => {
    return `${Msg["VARIABLES_GET_TOOLTIP"]} (${this.outputConnection?.getCheck()?.[0] || "any"})`;
  });
};

const oldSetInit = Blocks["variables_set_dynamic"].init;
Blocks["variables_set_dynamic"].init = function (this: Block) {
  oldSetInit.call(this);
  this.setTooltip(() => {
    return `${Msg["VARIABLES_SET_TOOLTIP"]} (${this.getInput('VALUE')!.connection?.getCheck()?.[0] || "any"})`;
  });
};