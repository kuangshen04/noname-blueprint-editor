import {TypedVariableModal} from '@blockly/plugin-typed-variable-modal';
import {WorkspaceSvg} from "blockly/core";
import * as Blockly from "blockly/core";
import {TYPES} from "@/types";

/**
 * A test input modal.
 * A singleton.
 */
export class InputModal extends TypedVariableModal {

  private typesDiv_: HTMLSelectElement = null!;
  private genericsDiv_: HTMLSelectElement = null!;

  /**
   * @deprecated
   * Since `createVariableTypeContainer_` and `resetModalInputs_` are overwritten, this will not be used.
   */
  override firstTypeInput_: HTMLInputElement = null!;

  constructor(workspace: WorkspaceSvg, btnCallbackName: string) {
    const types = [
      ['any', ''],
      ['Number', 'Number'],
      ['String', 'String'],
      ['Boolean', 'Boolean'],
      ['Array', 'Array'],
      ['Trigger', TYPES.Trigger],
      ['Event', TYPES.Event],
      ['Card', TYPES.Card],
      ['Player', TYPES.Player],
    ];
    const messages = {
      TYPED_VAR_MODAL_TITLE: '创建变量',
      TYPED_VAR_MODAL_VARIABLE_NAME_LABEL: '变量名称: ',
      TYPED_VAR_MODAL_TYPES_LABEL: '变量类型',
      TYPED_VAR_MODAL_CONFIRM_BUTTON: '确定',
      TYPED_VAR_MODAL_CANCEL_BUTTON: '取消',
      TYPED_VAR_MODAL_INVALID_NAME:
          '变量名称无效，请使用字母、数字或下划线，且不能以数字开头。',
      TYPED_VAR_MODAL_RANDOM_NAME: '随机名称',
    };
    super(workspace, btnCallbackName, types, messages);
  }

  override init() {
    super.init();
    this.workspace_.registerToolboxCategoryCallback(
        'CREATE_TYPED_VARIABLE',
        this.createFlyout,
    );
  }

  /**
   * Create the typed variable flyout.
   * @param workspace The Blockly workspace.
   * @returns Array of XML block elements.
   */
  private createFlyout(workspace: Blockly.WorkspaceSvg): Element[] {
    let xmlList: Element[] = [];
    const button = document.createElement('button');
    button.setAttribute('text', '创建变量...');
    button.setAttribute('callbackKey', 'CREATE_TYPED_VARIABLE');

    xmlList.push(button);

    const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(workspace);
    xmlList = xmlList.concat(blockList);
    return xmlList;
  };

  override createVarNameContainer_(): HTMLDivElement {
    const container = super.createVarNameContainer_();
    container.appendChild(this.createRandomNameBtn_());
    return container;
  }

  /**
   * The element holding the input type.
   */
  override createVariableTypeContainer_(types: string[][]): HTMLElement {
    const typeContainer = document.createElement('div');

    const typesDiv = document.createElement('select');
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const displayName = type[0];
      const typeName = type[1];
      const option = document.createElement('option');
      option.classList.add('input-modal-type');
      option.value = typeName;
      option.innerText = displayName;
      typesDiv.appendChild(option);
    }
    this.addEvent_(typesDiv, 'change', this, () => {
        const selectedType = typesDiv.options[typesDiv.selectedIndex].value;
        if (selectedType === 'Array') {
            this.genericsDiv_.style.display = 'block';
        } else {
            this.genericsDiv_.style.display = 'none';
        }
    });
    this.typesDiv_ = typesDiv;
    typeContainer.appendChild(typesDiv);

    const genericsDiv = document.createElement('select');
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const displayName = type[0];
        const typeName = type[1];
        const option = document.createElement('option');
        option.classList.add('input-modal-generic');
        option.value = typeName;
        option.innerText = displayName;
        genericsDiv.appendChild(option);
    }
    genericsDiv.style.display = 'none';
    this.genericsDiv_ = genericsDiv;
    typeContainer.appendChild(genericsDiv);

    return typeContainer;
  }

  /**
   * Get the selected type.
   * @returns The selected type.
   */
  override getSelectedType_(): string {
    const type = this.typesDiv_.options[this.typesDiv_.selectedIndex].value;
    if (type === 'Array') {
      const genericType = this.genericsDiv_.options[this.genericsDiv_.selectedIndex].value;
        if (genericType === 'any') {
            return 'Array';
        }
      return `Array<${genericType}>`;
    }
    return type;
  }

  override resetModalInputs_() {
    this.variableNameInput_.value = '';
    this.typesDiv_.value = this.typesDiv_.options[0].value;
    this.genericsDiv_.value = this.genericsDiv_.options[0].value;
  }

  private createRandomNameBtn_(): HTMLButtonElement {
    const randomBtn = document.createElement('button');
    randomBtn.className = 'blocklyModalBtn';
    randomBtn.innerText = Blockly.Msg['TYPED_VAR_MODAL_RANDOM_NAME'];
    this.addEvent_(randomBtn, 'click', this, () => this.randomName());
    return randomBtn;
  }

  /**
   * Create a random name for the variable.
   */
  private randomName() {
    this.variableNameInput_.value = Math.random().toString(36).substring(2, 10);
  }
}

Blockly.Css.register(``);