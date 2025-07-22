/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { ToolboxInfo } from "blockly/core/utils/toolbox";
import {listsToolbox, logicToolbox, loopToolbox, mathToolbox, textToolbox} from "./basic";
import {nonameToolbox} from "./noname";

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

export const toolbox: ToolboxInfo = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'search',
      name: '搜索',
      contents: [],
    },
    {
      kind: 'favourite',
      name: '收藏夹',
      contents: [],
      categorystyle: 'logic_category',
    },
    {
      kind: 'category',
      name: '最近使用',
      custom: 'RECENTLY_USED',
      categorystyle: 'logic_category',
    },
    {
      kind: 'sep',
    },
    logicToolbox,
    loopToolbox,
    mathToolbox,
    textToolbox,
    listsToolbox,
    {
      kind: 'sep',
    },
    {
      kind: 'category',
      name: '变量',
      categorystyle: 'variable_category',
      custom: 'CREATE_TYPED_VARIABLE',
    },
    {
      kind: 'category',
      name: '函数',
      categorystyle: 'procedure_category',
      custom: 'PROCEDURE',
    },
    {
      kind: 'sep',
    },
    nonameToolbox,
  ],
};
