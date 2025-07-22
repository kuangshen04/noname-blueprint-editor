declare module '@blockly/plugin-modal' {
    /**
     * Class responsible for creating a Blockly modal.
     * A singleton.
     */
    export class Modal {

        /**
         * The workspace to display the modal over.
         */
        protected workspace_: Blockly.WorkspaceSvg;

        /**
         * If true close the modal when the user clicks outside the modal.
         * Otherwise, only close when user hits the 'X' button or escape.
         */
        shouldCloseOnOverlayClick: boolean;


        /**
         * If true close the modal when the user hits escape. Otherwise, do not
         * close on escape.
         */
        shouldCloseOnEsc: boolean;

        /**
         * Constructor for creating a Blockly modal.
         * @param title The title for the modal.
         * @param workspace The workspace to display the modal over.
         */
        constructor(title: string, workspace: Blockly.WorkspaceSvg)

        /**
         * Initialize a Blockly modal.
         */
        init(): void

        /**
         * Disposes of this modal.
         * Unlink from all DOM elements and remove all event listeners
         * to prevent memory leaks.
         */
        dispose(): void

        /**
         * Shows the Blockly modal and focus on the first focusable element.
         */
        show(): void

        /**
         * Hide the Blockly modal.
         */
        hide(): void

        /**
         * The function to be called when the user hits the 'x' button.
         */
        protected onCancel_(): void

        /**
         * Add the Blockly modal to the widget div and position it properly.
         */
        protected widgetCreate_(): void

        /**
         * Disposes of any events or dom-references belonging to the editor.
         */
        protected widgetDispose_(): void

        /**
         * Helper method for adding an event.
         * @param node Node upon which to listen.
         * @param name Event name to listen to (e.g. 'mousedown').
         * @param thisObject The value of 'this' in the function.
         * @param func Function to call when event is triggered.
         */
        protected addEvent_(node: Element, name: string, thisObject: Object, func: Function): void

        /**
         * Create all the dom elements for the modal.
         */
        render(): void

        /**
         * Render content for the modal header.
         * @param headerContainer The modal's header div.
         */
        protected renderHeader_(headerContainer: HTMLElement): void

        /**
         * Render content for the modal content div.
         * @param _contentContainer The modal's content div.
         */
        protected renderContent_(_contentContainer: HTMLElement): void

        /**
         * Render content for the modal footer.
         * @param _footerContainer The modal's footer div.
         */
        protected renderFooter_(_footerContainer: HTMLElement): void
    }
}