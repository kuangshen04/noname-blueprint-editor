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

    if (parseInt(a) > parseInt(b)) {
        let c = a;
        a = b;
        b = c;
    }

    return [`Math.floor(Math.random() * (${b} - ${a} + 1) + ${a})`, Order.FUNCTION_CALL];
};
