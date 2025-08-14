import {Block, Blocks, Events, FieldVariable} from "blockly/core";

// ensure the file imported by ToolboxManager.ts
export const blocks = {};

type ListBlock = Block & {
	itemCount_: number;
	prev_: {
		[p: string]: string | undefined;
	};
};

const checkOutputConnection = (block: Block) => {
	if (!block.outputConnection) return;
	const targetConnection = block.outputConnection.targetConnection;
	if (
		targetConnection &&
		!block.workspace.connectionChecker.doTypeChecks(
			block.outputConnection!,
			targetConnection
		)
	) {
		block.unplug();
	}
};

Blocks["lists_create_with"].onchange = function (
	this: ListBlock,
	e: Events.Abstract
) {
	if (!this.prev_) {
		this.prev_ = {
			outputType: "Array",
			arrayType: undefined,
		};
	}
	let outputType = this.outputConnection!.getCheck()![0];
	const inputConnections = this.inputList.map((i) => i.connection);
	const arrayType = inputConnections
		.find((i) => (i?.targetConnection?.getCheck()?.length || 0) > 0)
		?.targetConnection!.getCheck()![0];
	if (
		outputType === this.prev_.outputType &&
		arrayType === this.prev_.arrayType
	) {
		return;
	}

	Events.setGroup(e.group);
	if (!arrayType) {
		inputConnections.forEach((i) => i?.setCheck(null));
		outputType = "Array";
		this.setOutput(true, outputType);
		checkOutputConnection(this);
	} else {
		inputConnections.forEach((i) => i?.setCheck(arrayType));
		outputType = `Array<${arrayType}>`;
		this.setOutput(true, outputType);
		checkOutputConnection(this);
	}
	this.prev_.outputType = outputType;
	this.prev_.arrayType = arrayType;
	Events.setGroup(false);
};

Blocks["lists_repeat"].onchange = function (
	this: ListBlock,
	e: Events.Abstract
) {
	if (!this.prev_) {
		this.prev_ = {
			outputType: "Array",
			itemType: undefined,
		};
	}
	const itemType =
		this.getInput("ITEM")!.connection?.targetConnection?.getCheck()?.[0];
	if (itemType === this.prev_.itemType) return;

	Events.setGroup(e.group);
	if (!itemType) {
		this.setOutput(true, "Array");
		checkOutputConnection(this);
	} else {
		this.setOutput(true, `Array<${itemType}>`);
		checkOutputConnection(this);
	}
	this.prev_.itemType = itemType;
	Events.setGroup(false);
};

Blocks["lists_indexOf"].onchange = function (
	this: ListBlock,
	e: Events.Abstract
) {
	if (!this.prev_) {
		this.prev_ = {
			findType: undefined,
			arrayType: "Array",
		};
	}

	const list = this.getInput('VALUE');
	const find = this.getInput('FIND');
	const arrayType = list?.connection?.targetConnection?.getCheck()?.[0];
	const findType = find?.connection?.targetConnection?.getCheck()?.[0];
	if (
		this.prev_.findType === findType &&
		this.prev_.arrayType === arrayType
	) {
		return;
	}

	Events.setGroup(e.group);
	if (arrayType){
		const itemType = arrayType.match(/\w+<(\w+)>/)?.[1] || null;
		find?.setCheck(itemType);
		if (find!.connection?.targetConnection &&
			!this.workspace.connectionChecker.doTypeChecks(
				find!.connection.targetConnection,
				find!.connection
			)) {
			find!.connection.targetBlock()?.unplug();
		}
		this.bumpNeighbours();
	}
	this.prev_.arrayType = arrayType;
	this.prev_.findType = findType;
	Events.setGroup(false);
};

Blocks["lists_getIndex"].onchange = function (
	this: ListBlock,
	e: Events.Abstract
) {
	if (!this.prev_) {
		this.prev_ = {
			outputType: undefined,
			arrayType: "Array",
		};
	}
	let outputType = this.outputConnection!.getCheck()?.[0];
	const arrayType =
		this.getInput("VALUE")!.connection?.targetConnection?.getCheck()?.[0] || "Array";
	if (
		outputType === this.prev_.outputType &&
		arrayType === this.prev_.arrayType
	) {
		return;
	}

	const itemType = arrayType.match(/\w+<(\w+)>/)?.[1] || null;

	Events.setGroup(e.group);
	if (!itemType) {
		outputType = undefined;
		this.setOutput(true);
		checkOutputConnection(this);
	} else {
		outputType = itemType;
		this.setOutput(true, outputType);
		checkOutputConnection(this);
	}
	this.prev_.outputType = outputType;
	this.prev_.arrayType = arrayType;
	Events.setGroup(false);
};

Blocks["lists_setIndex"].onchange = function (
	this: ListBlock,
	e: Events.Abstract
) {

	if (!this.prev_) {
		this.prev_ = {
			setType: undefined,
			arrayType: "Array",
		};
	}

	const list = this.getInput('LIST');
	const set = this.getInput('TO');
	const arrayType = list?.connection?.targetConnection?.getCheck()?.[0] || "Array";
	const setType = set?.connection?.targetConnection?.getCheck()?.[0];
	if (
		this.prev_.setType === setType &&
		this.prev_.arrayType === arrayType
	) {
		return;
	}

	Events.setGroup(e.group);
	const itemType = arrayType.match(/\w+<(\w+)>/)?.[1] || null;
	set?.setCheck(itemType);
	if (set!.connection?.targetConnection &&
		!this.workspace.connectionChecker.doTypeChecks(
			set!.connection.targetConnection,
			set!.connection
		)) {
		set!.connection.targetBlock()?.unplug();
	}
	this.bumpNeighbours();
	this.prev_.arrayType = arrayType;
	this.prev_.setType = setType;
	Events.setGroup(false);
};

Blocks["lists_getSublist"].onchange = function (this: ListBlock, e: Events.Abstract) {
	if (!this.prev_) {
		this.prev_ = {
			arrayType: "Array",
		};
	}
	const arrayType =
		this.getInput("LIST")!.connection?.targetConnection?.getCheck()?.[0] ||
		"Array";
	if (arrayType === this.prev_.arrayType) return;

	Events.setGroup(e.group);
	this.setOutput(true, arrayType);
	checkOutputConnection(this);
	this.prev_.arrayType = arrayType;
	Events.setGroup(false);
};

/**
 * @override
 * Modify this block to have the correct input and output types.
 *
 * @param newMode Either 'SPLIT' or 'JOIN'.
 */
Blocks["lists_split"].updateType_ = function (this: ListBlock, newMode: string) {
	const mode = this.getFieldValue('MODE');
	if (mode !== newMode) {
		const inputConnection = this.getInput('INPUT')!.connection;
		inputConnection!.setShadowDom(null);
		const inputBlock = inputConnection!.targetBlock();
		if (inputBlock) {
			inputConnection!.disconnect();
			if (inputBlock.isShadow()) {
				inputBlock.dispose(false);
			} else {
				this.bumpNeighbours();
			}
		}
	}
	if (newMode === 'SPLIT') {
		this.outputConnection!.setCheck('Array<String>');
		this.getInput('INPUT')!.setCheck('String');
	} else {
		this.outputConnection!.setCheck('String');
		this.getInput('INPUT')!.setCheck('Array<String>');
	}
};

Blocks["lists_sort"].onchange = function (this: ListBlock, e: Events.Abstract) {
	if (!this.prev_) {
		this.prev_ = {
			arrayType: "Array",
		};
	}
	const arrayType =
		this.getInput("LIST")!.connection?.targetConnection?.getCheck()?.[0] ||
		"Array";
	if (arrayType === this.prev_.arrayType) return;

	Events.setGroup(e.group);
	this.setOutput(true, arrayType);
	checkOutputConnection(this);
	this.prev_.arrayType = arrayType;
	Events.setGroup(false);
};

Blocks["lists_reverse"].onchange = function (this: ListBlock, e: Events.Abstract) {
	if (!this.prev_) {
		this.prev_ = {
			arrayType: "Array",
		};
	}
	const arrayType =
		this.getInput("LIST")!.connection?.targetConnection?.getCheck()?.[0] ||
		"Array";
	if (arrayType === this.prev_.arrayType) return;

	Events.setGroup(e.group);
	this.setOutput(true, arrayType);
	checkOutputConnection(this);
	this.prev_.arrayType = arrayType;
	Events.setGroup(false);
};

// Blocks["controls_forEach"].onchange = function (this: ListBlock, e: Events.Abstract) {
// 	if (!this.prev_) {
// 		this.prev_ = {
// 			arrayType: "Array",
// 		};
// 	}
// 	const arrayType =
// 		this.getInput("LIST")!.connection?.targetConnection?.getCheck()?.[0] ||
// 		"Array";
// 	if (arrayType === this.prev_.arrayType) return;
//
// 	Events.setGroup(e.group);
// 	const itemType = arrayType.match(/\w+<(\w+)>/)?.[1];
// 	const item = this.getField("VAR") as FieldVariable;
// 	// configure_ is protected, so we use getField to access it.
// 	item["configure_"]({
// 		variableTypes: itemType ? [itemType] : undefined,
// 		defaultType: itemType,
// 	});
// 	this.prev_.arrayType = arrayType;
// 	Events.setGroup(false);
// }
