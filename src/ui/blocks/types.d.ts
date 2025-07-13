import { Block, Workspace, Events } from "blockly/core";

export interface BlockDefinition {
    /** An optional method called during initialization. */
    init?: (this: Block) => void;
    /** An optional method called during disposal. */
    destroy?: (this: Block) => void;
    /**
     * An optional serialization method for defining how to serialize the
     * block's extra state (eg mutation state) to something JSON compatible.
     * This must be coupled with defining `loadExtraState`.
     *
     * @param doFullSerialization Whether or not to serialize the full state of
     *     the extra state (rather than possibly saving a reference to some
     *     state). This is used during copy-paste. See the
     *     {@link https://developers.devsite.google.com/blockly/guides/create-custom-blocks/extensions#full_serialization_and_backing_data | block serialization docs}
     *     for more information.
     */
    saveExtraState?: (this: Block, doFullSerialization?: boolean) => any;
    /**
     * An optional serialization method for defining how to deserialize the
     * block's extra state (eg mutation state) from something JSON compatible.
     * This must be coupled with defining `saveExtraState`.
     */
    loadExtraState?: (this: Block, p1: any) => void;
    /**
     * An optional method that reconfigures the block based on the
     * contents of the mutator dialog.
     *
     * @param rootBlock The root block in the mutator flyout.
     */
    compose?: (this: Block, rootBlock: Block) => void;
    /**
     * An optional function that populates the mutator flyout with
     * blocks representing this block's configuration.
     *
     * @param workspace The mutator flyout's workspace.
     * @returns The root block created in the flyout's workspace.
     */
    decompose?: (this: Block, workspace: Workspace) => Block;
    /**
     * An optional method for declaring developer variables, to be used
     * by generators.  Developer variables are never shown to the user,
     * but are declared as global variables in the generated code.
     *
     * @returns a list of developer variable names.
     */
    getDeveloperVariables?: (this: Block) => string[];
    /**
     * An optional callback method to use whenever the block's parent workspace
     * changes. This is usually only called from the constructor, the block type
     * initializer function, or an extension initializer function.
     */
    onchange?: ((this: Block, p1: Events.Abstract) => void) | null;
}