/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from "blockly/javascript";
import {JavascriptBlockGenerator} from "@/generators/GeneratorManager";

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock: Record<string, JavascriptBlockGenerator> = Object.create(null);

forBlock["math_random_int"] = function (block, generator) {
    let b = generator.valueToCode(block, 'FROM', Order.NONE) || '0';
    let a = generator.valueToCode(block, 'TO', Order.NONE) || '0';
    return [`Math.floor(Math.random() * (Math.abs(${b} - ${a}) + 1) + Math.min(${a}, ${b}))`, Order.FUNCTION_CALL];
};
