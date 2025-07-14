import { FieldTextInput, FieldDropdown } from "blockly/core";
import {ToolboxItemInfo} from "blockly/core/utils/toolbox";
import { inputs } from "blockly/core";
const { Align } = inputs;
import { BlockDefinition } from "@/ui/types";


export const blocks: Record<string, BlockDefinition> = {
	trigger_container: {
		init() {
			this.appendDummyInput("name")
				.appendField("效果名")
				.appendField(new FieldTextInput("效果"), "name");
			this.appendValueInput("trigger")
				.setCheck("Trigger")
				.appendField("当")
				.setAlign(Align.RIGHT);
			this.appendValueInput("filter")
				.setCheck("Boolean")
				.appendField("若")
				.setAlign(Align.RIGHT);
			this.appendStatementInput("content")
				.setCheck("Content")
				.appendField("执行")
				.setAlign(Align.RIGHT);
			// this.setNextStatement(true, null);
			this.setTooltip("一个被动技能的起点");
			this.setHelpUrl("");
			this.setColour(0);
		},
	},
	// trigger_timing_connector:{
	// 	init(){
	//
	// 	}
	// },
	trigger_timing_before: {
		init() {
			this.appendValueInput("event").setCheck("GameEvent");
			this.appendDummyInput("dummy")
				.appendField("开始前");
			// this.setPreviousStatement(true, 'Trigger');
			// this.setNextStatement(true, 'Trigger');
			this.setOutput(true, "Trigger");
			this.setTooltip("事件开始前的时机");
			this.setHelpUrl("");
			this.setColour(45);
		},
	},
	trigger_timing_begin: {
		init() {
			this.appendValueInput("event").setCheck("GameEvent");
			this.appendDummyInput("dummy")
				.appendField("开始时");
			// this.setPreviousStatement(true, 'Trigger');
			// this.setNextStatement(true, 'Trigger');
			this.setOutput(true, "Trigger");
			this.setTooltip("事件开始的时机");
			this.setHelpUrl("");
			this.setColour(45);
		},
	},
	trigger_timing_end: {
		init() {
			this.appendValueInput("event").setCheck("GameEvent");
			this.appendDummyInput("dummy")
				.appendField("结束时");
			// this.setPreviousStatement(true, 'Trigger');
			// this.setNextStatement(true, 'Trigger');
			this.setOutput(true, "Trigger");
			this.setTooltip("事件结束的时机");
			this.setHelpUrl("");
			this.setColour(45);
		},
	},
	trigger_timing_after: {
		init() {
			this.appendValueInput("event").setCheck("GameEvent");
			this.appendDummyInput("dummy")
				.appendField("结束后");
			// this.setPreviousStatement(true, 'Trigger');
			// this.setNextStatement(true, 'Trigger');
			this.setOutput(true, "Trigger");
			this.setTooltip("事件结束后的时机");
			this.setHelpUrl("");
			this.setColour(45);
		},
	},
	trigger_timing_judge: {
		init() {
			this.appendDummyInput('dummy')
				.appendField('判定牌亮出时');
			this.setOutput(true, "Trigger");
			this.setTooltip('判定牌亮出的时机，可以用于改判');
			this.setHelpUrl('');
			this.setColour(45);
		}
	},
	event_phaseDraw: {
		init() {
			this.appendDummyInput("dummy").appendField("摸牌阶段");
			// this.setPreviousStatement(true, 'Trigger');
			// this.setNextStatement(true, 'Trigger');
			this.setOutput(true, "GameEvent");
			this.setTooltip("摸牌阶段");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	event_phaseJieshu: {
		init() {
			this.appendDummyInput("dummy").appendField("结束阶段");
			// this.setPreviousStatement(true, 'Trigger');
			// this.setNextStatement(true, 'Trigger');
			this.setOutput(true, "GameEvent");
			this.setTooltip("结束阶段");
			this.setHelpUrl("");
			this.setColour(225);
		},
	},
	trigger_eventPlayer: {
		init: function () {
			this.appendDummyInput("dummy").appendField("当前玩家");
			this.setOutput(true, "Player");
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
			this.appendValueInput('newCard').setCheck("Card")
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
			this.appendValueInput("player").setCheck("Player");
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
	selector_player_self: {
		init() {
			this.appendDummyInput("dummy").appendField("你");
			this.setOutput(true, "Player");
			this.setTooltip("当前技能的持有者或者牌的使用者");
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
			type: 'trigger_timing_before',
		},
		{
			kind: 'block',
			type: 'trigger_timing_begin',
		},
		{
			kind: 'block',
			type: 'trigger_timing_end',
		},
		{
			kind: 'block',
			type: 'trigger_timing_after',
		},
		{
			kind: 'block',
			type: 'trigger_timing_judge',
		},
		{
			kind: 'block',
			type: 'event_phaseDraw',
		},
		{
			kind: 'block',
			type: 'event_phaseJieshu',
		},
		{
			kind: 'block',
			type: 'trigger_eventPlayer',
			// inputs: {
			// 	player: {
			// 		shadow: {
			// 			type: 'selector_player_self',
			// 		},
			// 	},
			// },
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
			type: 'selector_player_self',
		},
	]
};