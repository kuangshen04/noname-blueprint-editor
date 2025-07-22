declare module "@blockly/plugin-typed-variable-modal" {
  import {Modal} from "@blockly/plugin-modal";
  /**
   * The messages for a typed variable modal.
   */
  type TypedVarModalMessages = {
    TYPED_VAR_MODAL_CONFIRM_BUTTON: string,
    TYPED_VAR_MODAL_VARIABLE_NAME_LABEL: string,
    TYPED_VAR_MODAL_TYPES_LABEL: string,
    TYPED_VAR_MODAL_TITLE: string,
    TYPED_VAR_MODAL_INVALID_NAME: string,
    TYPED_VAR_MODAL_CANCEL_BUTTON: string
  }
  /**
   * Class for displaying a modal used for creating typed variables.
   * A singleton.
   */
  export class TypedVariableModal extends Modal {

    /**
     * The input div holding the name of the variable.
     */
    protected variableNameInput_: HTMLInputElement;

    /**
     * The div holding the list of variable types.
     */
    protected variableTypesDiv_: HTMLElement;

    /**
     * The first type input.
     * Just used in `createVariableTypeContainer_` and `resetModalInputs_`.
     * Not necessary.
     */
    protected firstTypeInput_: HTMLInputElement;

    /**
     * An array holding arrays with the name of the type and the display name for the type.
     *     Ex: [['Penguin', 'PENGUIN'], ['Giraffe', 'GIRAFFE']].
     */
    protected types_: string[][];

    /**
     * Constructor for creating a typed variable modal.
     * @param workspace The workspace that the modal will be registered on.
     * @param btnCallbackName The name used to register the button callback.
     * @param types An array holding arrays with the display name as the first value and the type as the second.
     *     Ex: [['Penguin', 'PENGUIN'], ['Giraffe', 'GIRAFFE']].
     * @param optMessages The messages for a typed variable modal.
     */
    constructor(workspace: Blockly.WorkspaceSvg, btnCallbackName: string, types: string[][], optMessages?: TypedVarModalMessages);

    /**
     * Create a typed variable modal and display it on the given button name.
     */
    init(): void;

    /**
     * Set the messages for the typed variable modal.
     * Used to change the location.
     * @param messages The messages needed to create a typed modal.
     */
    setLocale(messages: TypedVarModalMessages): void;

    /**
     * Dispose of the typed variable modal.
     */
    override dispose(): void;

    /**
     * Get the selected type.
     * @returns The selected type.
     */
    protected getSelectedType_(): string | null;

    /**
     * Disposes of any events or dom-references belonging to the editor and resets
     * the inputs.
     */
    override widgetDispose_(): void;

    /**
     * Get the function to be called when the user tries to create a variable.
     */
    protected onConfirm_(): void;

    /**
     * Render content for the modal content div.
     * @param contentContainer The modal's content div.
     */
    override renderContent_(contentContainer: HTMLDivElement): void;

    /**
     * Render content for the modal footer.
     * @param footerContainer The modal's footer div.
     */
    override renderFooter_(footerContainer: HTMLElement): void;

    /**
     * Create button in charge of creating the variable.
     * @returns The button in charge of creating a variable.
     */
    protected createConfirmBtn_(): HTMLButtonElement;

    /**
     * Create button in charge of cancelling.
     * @returns The button in charge of cancelling.
     */
    protected createCancelBtn_(): HTMLButtonElement;

    /**
     * Check the first type in the list.
     */
    protected resetModalInputs_(): void;

    /**
     * Creates an unordered list containing all the types.
     * @param types An array holding arrays with the
     *     display name as the first value and the type as the second.
     *     Ex: [['Penguin', 'PENGUIN'], ['Giraffe', 'GIRAFFE']].
     * @returns The list of types.
     */
    protected createVariableTypeContainer_(types: string[][]): HTMLElement;

    /**
     * Create the div that holds the text input and label for the variable name
     * input.
     * @returns The div holding the text input and label for text input.
     */
    protected createVarNameContainer_(): HTMLDivElement;
  }
}
