import * as Blockly from 'blockly/core';
import {Connection} from "blockly/core";

export class GenericConnectionChecker extends Blockly.ConnectionChecker {

    private static isOutputConnection(connection: Connection): boolean {
        return connection.type === Blockly.ConnectionType.OUTPUT_VALUE ||
            connection.type === Blockly.ConnectionType.NEXT_STATEMENT;
    }

    override doTypeChecks(a: Connection, b: Connection) {
        const checkArrayA = a.getCheck();
        const checkArrayB = b.getCheck();

        if (!checkArrayA || !checkArrayB) {
            return true;
        }

        if (checkArrayA.some(i => checkArrayB.includes(i))) return true;

        // If both connections are the same type, the generic should be exactly the same.
        if (GenericConnectionChecker.isOutputConnection(a) === GenericConnectionChecker.isOutputConnection(b)) return false;

        // Otherwise, the output connection can be a generic type that matches the input connection without generics.
        const checkOutput = GenericConnectionChecker.isOutputConnection(a) ? checkArrayA : checkArrayB;
        const checkInput = checkOutput === checkArrayA ? checkArrayB : checkArrayA;

        const checkOutputWithoutGeneric = checkOutput
            .map(i => i.match(/(\w+)<\w+>/)?.[1])
            .filter(i => i !== undefined);

        return checkOutputWithoutGeneric.some(i => checkInput.includes(i));
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