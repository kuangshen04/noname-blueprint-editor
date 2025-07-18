import * as Blockly from 'blockly/core';
import {Connection} from "blockly/core";

export class GenericConnectionChecker extends Blockly.ConnectionChecker {
    override doTypeChecks(a: Connection, b: Connection) {
        const checkArrayOne = a.getCheck();
        const checkArrayTwo = b.getCheck();

        if (!checkArrayOne || !checkArrayTwo) {
            return true;
        }

        const checkArrayOneWithoutGeneric = checkArrayOne
            .map(i => i.match(/(\w+)<\w+>/)?.[1])
            .filter(i => i !== undefined);
        const checkArrayTwoWithoutGeneric = checkArrayTwo
            .map(i => i.match(/(\w+)<\w+>/)?.[1])
            .filter(i => i !== undefined);

        return checkArrayOne.some(i => checkArrayTwo.includes(i) || checkArrayTwoWithoutGeneric.includes(i))
            || checkArrayOneWithoutGeneric.some(i => checkArrayTwo.includes(i));
    }
}

export const registrationType = Blockly.registry.Type.CONNECTION_CHECKER;
export const registrationName = 'GenericConnectionChecker';

// Register the checker so that it can be used by name.
Blockly.registry.register(
    registrationType,
    registrationName,
    GenericConnectionChecker,
);

export const pluginInfo = {
    [registrationType.toString()]: registrationName,
};