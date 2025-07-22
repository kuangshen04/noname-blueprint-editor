import {FieldDropdown} from "blockly/core";
import {ToolboxItemInfo} from "blockly/core/utils/toolbox";
import type {BlockDefinitionMap} from "@/ui/BlockDefinition";
import {TYPES} from "@/types";
import {triggerToolbox} from "@/ui/blocks/trigger";
import {actionToolbox} from "@/ui/blocks/action";
import {activeToolbox} from "@/ui/blocks/active";

export const blocks: BlockDefinitionMap = {
	event_phaseZhunbei: {
		init() {
			this.appendDummyInput("dummy").appendField("准备阶段");
			this.setOutput(true, TYPES.Event);
			this.setTooltip("准备阶段");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	event_phaseJudge: {
		init() {
			this.appendDummyInput("dummy").appendField("判定阶段");
			this.setOutput(true, TYPES.Event);
			this.setTooltip("判定阶段");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	event_phaseDraw: {
		init() {
			this.appendDummyInput("dummy").appendField("摸牌阶段");
			this.setOutput(true, TYPES.Event);
			this.setTooltip("摸牌阶段");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	event_phaseUse: {
		init() {
			this.appendDummyInput("dummy").appendField("出牌阶段");
			this.setOutput(true, [TYPES.Event, TYPES.Active]);
			this.setTooltip("出牌阶段");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	event_phaseDiscard: {
		init() {
			this.appendDummyInput("dummy").appendField("弃牌阶段");
			this.setOutput(true, TYPES.Event);
			this.setTooltip("弃牌阶段");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	event_phaseJieshu: {
		init() {
			this.appendDummyInput("dummy").appendField("结束阶段");
			this.setOutput(true, TYPES.Event);
			this.setTooltip("结束阶段");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	event_phaseDraw_changeNum: {
		init() {
			this.appendValueInput("count").setCheck("Number")
				.appendField("额定摸牌数")
				.appendField(
					new FieldDropdown([
						["增加", "increase"],
						["减少", "decrease"],
						["改为", "set"],
					]),
					"action"
				);
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setTooltip("在摸牌阶段使用，更改额定的摸牌数");
			this.setHelpUrl("");
			this.setColour(105);
		},
	},
	// event_judge_replaceJudgeCard: {
	// 	init() {
	// 		this.appendValueInput('newCard').setCheck(TYPES.Card)
	// 			.appendField('用');
	// 		this.appendDummyInput('dummy')
	// 			.appendField('替换亮出的判定牌');
	// 		this.setPreviousStatement(true, null);
	// 		this.setNextStatement(true, null);
	// 		this.setTooltip('更换亮出的判定牌');
	// 		this.setHelpUrl('');
	// 		this.setColour(105);
	// 	}
	// },
	selector_player_self: {
		init() {
			this.appendDummyInput("dummy").appendField("你");
			this.setOutput(true, TYPES.Player);
			this.setTooltip("当前技能的持有者或者牌的使用者");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	selector_player_all: {
		init() {
			this.appendDummyInput("dummy").appendField("所有玩家");
			this.setOutput(true, TYPES.PlayerList);
			this.setTooltip("所有存活的玩家");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
};

export const nonameToolbox: ToolboxItemInfo = {
	kind: 'category',
	name: 'Noname',
	categorystyle: 'procedure_category',
	contents: [
		...triggerToolbox,
		...activeToolbox,
		{
			kind: 'block',
			type: 'event_phaseZhunbei',
		},
		{
			kind: 'block',
			type: 'event_phaseJudge',
		},
		{
			kind: 'block',
			type: 'event_phaseDraw',
		},
		{
			kind: 'block',
			type: 'event_phaseUse',
		},
		{
			kind: 'block',
			type: 'event_phaseDiscard',
		},
		{
			kind: 'block',
			type: 'event_phaseJieshu',
		},
		{
			kind: 'block',
			type: 'event_phaseDraw_changeNum',
			inputs: {
				count: {
					shadow: {
						type: 'math_number',
						fields: {
							NUM: 1,
						},
					},
				},
			}
		},
		// {
		// 	kind: 'block',
		// 	type: 'event_judge_replaceJudgeCard',
		// 	// inputs: {
		// 	// 	newCard: {
		// 	// 		shadow: {
		// 	// 			type: 'card',
		// 	// 		},
		// 	// 	},
		// 	// },
		// },
		...actionToolbox,
		{
			kind: 'block',
			type: 'selector_player_self',
		},
		{
			kind: 'block',
			type: 'selector_player_all',
		},
	]
};