import {Block, Workspace, Events, BlockSvg} from "blockly/core";

export interface BlockDefinition<T extends Block = Block> {
    /** An optional method called during initialization. */
    init?: (this: T) => void;
    /** An optional method called during disposal. */
    destroy?: (this: T) => void;
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
    saveExtraState?: (this: T, doFullSerialization?: boolean) => any;
    /**
     * An optional serialization method for defining how to deserialize the
     * block's extra state (eg mutation state) from something JSON compatible.
     * This must be coupled with defining `saveExtraState`.
     */
    loadExtraState?: (this: T, p1: any) => void;
    /**
     * An optional method that reconfigures the block based on the
     * contents of the mutator dialog.
     *
     * @param rootBlock The root block in the mutator flyout.
     */
    compose?: (this: T, rootBlock: Block) => void;
    /**
     * An optional function that populates the mutator flyout with
     * blocks representing this block's configuration.
     *
     * @param workspace The mutator flyout's workspace.
     * @returns The root block created in the flyout's workspace.
     */
    decompose?: (this: T, workspace: Workspace) => Block;
    /**
     * An optional method for declaring developer variables, to be used
     * by generators.  Developer variables are never shown to the user,
     * but are declared as global variables in the generated code.
     *
     * @returns a list of developer variable names.
     */
    getDeveloperVariables?: (this: T) => string[];
    /**
     * An optional callback method to use whenever the block's parent workspace
     * changes. This is usually only called from the constructor, the block type
     * initializer function, or an extension initializer function.
     */
    onchange?: (this: T, p1: Events.Abstract) => void;
    /**
     * An optional method which saves a record of blocks connected to
     * this block so they can be later restored after this block is
     * recomposed (reconfigured).  Typically records the connected
     * blocks on properties on blocks in the mutator flyout, so that
     * rearranging those component blocks will automatically rearrange
     * the corresponding connected blocks on this block after this block
     * is recomposed.
     *
     * To keep the saved connection information up-to-date, MutatorIcon
     * arranges for an event listener to call this method any time the
     * mutator flyout is open and a change occurs on this block's
     * workspace.
     *
     * @param rootBlock The root block in the mutator flyout.
     */
    saveConnections?: (this: T, rootBlock: BlockSvg) => void;

    [key: string]: any; // Allow additional properties
}

export type BlockDefinitionMap = Record<string, BlockDefinition<any>>;