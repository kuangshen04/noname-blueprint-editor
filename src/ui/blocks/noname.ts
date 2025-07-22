import { FieldTextInput, FieldDropdown } from "blockly/core";
import {ToolboxItemInfo} from "blockly/core/utils/toolbox";
import type {BlockDefinition, BlockDefinitionMap} from "@/ui/BlockDefinition";
import {TYPES} from "@/types";

const timingTooltip: Record<string, string> = {
	before: "事件开始前的时机",
	begin: "事件开始的时机",
	end: "事件结束的时机",
	after: "事件结束后的时机"
}

export const blocks: BlockDefinitionMap = {
	// trigger_timing_connector:{
	// 	init(){
	//
	// 	}
	// },
	trigger_timing: {
		init() {
			this.appendValueInput("event").setCheck(TYPES.Event);
			this.appendDummyInput("dummy")
				.appendField(
					new FieldDropdown([
						["开始前", "before"],
						["开始时", "begin"],
						["结束时", "end"],
						["结束后", "after"],
					]),
					"timing"
				);
			this.setOutput(true, TYPES.Trigger);
			this.setTooltip((): string => {
				const value = this.getFieldValue('timing');
				return timingTooltip[value];
			});
			this.setHelpUrl("");
			this.setColour(45);
		},
	},
	trigger_timing_judge: {
		init() {
			this.appendDummyInput('dummy')
				.appendField('判定牌亮出时');
			this.setOutput(true, TYPES.Trigger);
			this.setTooltip('判定牌亮出的时机，可以用于改判');
			this.setHelpUrl('');
			this.setColour(45);
		}
	},
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
			this.setOutput(true, TYPES.Event);
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
	trigger_eventPlayer: {
		init: function () {
			this.appendDummyInput("dummy").appendField("当前玩家");
			this.setOutput(true, TYPES.Player);
			this.setTooltip("当前时机的玩家");
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
	event_judge_replaceJudgeCard: {
		init() {
			this.appendValueInput('newCard').setCheck(TYPES.Card)
				.appendField('用');
			this.appendDummyInput('dummy')
				.appendField('替换亮出的判定牌');
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setTooltip('更换亮出的判定牌');
			this.setHelpUrl('');
			this.setColour(105);
		}
	},
	player_draw: {
		init() {
			this.appendValueInput("player").setCheck(TYPES.Player);
			this.appendValueInput("count").setCheck("Number")
				.appendField("摸")
			this.appendDummyInput("text")
				.appendField("张牌");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setTooltip("摸牌");
			this.setHelpUrl("");
			this.setColour(180);
		},
	},
	player_recover: {
		init() {
			this.appendValueInput("player").setCheck(TYPES.Player);
			this.appendValueInput("count").setCheck("Number")
				.appendField("回复")
			this.appendDummyInput("text")
				.appendField("点体力");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setTooltip("回复体力");
			this.setHelpUrl("");
			this.setColour(180);
		}
	},
	player_damage: {
		init() {
			this.appendValueInput("player").setCheck(TYPES.Player);
			this.appendValueInput("count").setCheck("Number")
				.appendField("受到")
			this.appendDummyInput("text")
				.appendField("点伤害");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setTooltip("受到伤害");
			this.setHelpUrl("");
			this.setColour(180);
		},
	},
	player_loseHp: {
		init() {
			this.appendValueInput("player").setCheck(TYPES.Player);
			this.appendValueInput("count").setCheck("Number")
				.appendField("失去")
			this.appendDummyInput("text")
				.appendField("点体力");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setTooltip("失去体力");
			this.setHelpUrl("");
			this.setColour(180);
		},
	},
	player_changeMaxHp: {
		init() {
			this.appendValueInput("player").setCheck(TYPES.Player);
			this.appendValueInput("count").setCheck("Number")
				.appendField("的体力上限")
				.appendField(
					new FieldDropdown([
						["增加", "increase"],
						["减少", "decrease"],
						["改为", "set"],
					]),
					"action"
				);
			this.appendDummyInput('dummy')
				.appendField('点');
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setTooltip("更改体力上限");
			this.setHelpUrl("");
			this.setColour(180);
		},
	},
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
		{
			kind: 'block',
			type: 'trigger_container',
		},
		{
			kind: 'block',
			type: 'trigger_timing',
			fields: {
				timing: 'before',
			},
		},
		{
			kind: 'block',
			type: 'trigger_timing',
			fields: {
				timing: 'begin',
			},
		},
		{
			kind: 'block',
			type: 'trigger_timing',
			fields: {
				timing: 'end',
			},
		},
		{
			kind: 'block',
			type: 'trigger_timing',
			fields: {
				timing: 'after',
			},
		},
		{
			kind: 'block',
			type: 'trigger_timing_judge',
		},
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
		{
			kind: 'block',
			type: 'event_judge_replaceJudgeCard',
			// inputs: {
			// 	newCard: {
			// 		shadow: {
			// 			type: 'card',
			// 		},
			// 	},
			// },
		},
		{
			kind: 'block',
			type: 'player_draw',
			inputs: {
				player: {
					shadow: {
						type: 'selector_player_self',
					},
				},
				count: {
					shadow: {
						type: 'math_number',
						fields: {
							NUM: 1,
						},
					},
				},
			},
		},
		{
			kind: 'block',
			type: 'player_recover',
			inputs: {
				player: {
					shadow: {
						type: 'selector_player_self',
					},
				},
				count: {
					shadow: {
						type: 'math_number',
						fields: {
							NUM: 1,
						},
					},
				},
			},
		},
		{
			kind: 'block',
			type: 'player_damage',
			inputs: {
				player: {
					shadow: {
						type: 'selector_player_self',
					},
				},
				count: {
					shadow: {
						type: 'math_number',
						fields: {
							NUM: 1,
						},
					},
				},
			},
		},
		{
			kind: 'block',
			type: 'player_loseHp',
			inputs: {
				player: {
					shadow: {
						type: 'selector_player_self',
					},
				},
				count: {
					shadow: {
						type: 'math_number',
						fields: {
							NUM: 1,
						},
					},
				},
			},
		},
		{
			kind: 'block',
			type: 'player_changeMaxHp',
			inputs: {
				player: {
					shadow: {
						type: 'selector_player_self',
					},
				},
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
		{
			kind: 'block',
			type: 'selector_player_self',
		},
		{
			kind: 'block',
			type: 'trigger_eventPlayer',
		},
		{
			kind: 'block',
			type: 'selector_player_all',
		},
	]
};