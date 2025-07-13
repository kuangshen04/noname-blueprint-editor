/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

type IndexMap = Map<string, Set<string>>;

/**
 * A class that provides methods for indexing and searching blocks.
 */
export class BlockSearcher {
    private index: IndexMap = new Map();

    /**
     * Initializes the block searcher by clearing the index.
     * @param name
     * @param type
     */
    add(name: string, type: string) {
        const tokens = this.tokenize(name);
        for (const word of tokens) {
            for (let i = 1; i <= word.length; i++) {
                const prefix = word.slice(0, i);
                if (!this.index.has(prefix)) {
                    this.index.set(prefix, new Set());
                }
                this.index.get(prefix)!.add(type);
            }
        }
    }

    /**
     * Filters the available blocks based on the current query string.
     *
     * @param query The text to use to match blocks against.
     * @returns A list of block types matching the query.
     */
    search(query: string): string[] {
        const queryWords = this.tokenize(query);
        if (queryWords.length === 0) return [];

        const sets: Set<string>[] = [];

        for (const word of queryWords) {
            const resultSet = this.index.get(word);
            if (!resultSet) return [];
            sets.push(resultSet);
        }

        const intersection = sets.reduce((acc, set) => {
            return new Set([...acc].filter((x) => set.has(x)));
        });

        return [...intersection];
    }

    /**
     * Tokenizes the input string into words.
     *
     * This method splits the input string by spaces and underscores, and
     * returns an array of lowercase words.
     *
     * @param input The string to tokenize.
     * @returns An array of lowercase words.
     */
    private tokenize(input: string): string[] {
        const spaced = input.replace(/_/g, ' ');
        const words: string[] = [];

        for (const part of spaced.split(/\s+/)) {
            const tokens = part.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+|\W+/g);
            if (tokens) {
              words.push(...tokens.map((w) => w.toLowerCase()));
            }
        }

        return words;
    }

    /**
     * Populates the cached map of trigrams to the blocks they correspond to.
     *
     * This method must be called before blockTypesMatching(). Behind the
     * scenes, it creates a workspace, loads the specified block types on it,
     * indexes their types and human-readable text, and cleans up after
     * itself.
     *
     * @param blockTypes A list of block types to index.
     */
    indexBlocks(blockTypes: string[]) {
        const blockCreationWorkspace = new Blockly.Workspace();
        blockTypes.forEach((blockType) => {
            const block = blockCreationWorkspace.newBlock(blockType);
            this.add(blockType, blockType);
            block.inputList.forEach((input) => {
                input.fieldRow.forEach((field) => {
                    this.addDropdownOption(field, blockType);
                    this.add(field.getText(), blockType);
                });
            });
        });
    }

    /**
     * Check if the field is a dropdown, and index every text in the option
     *
     * @param field We need to check the type of field
     * @param blockType The block type to associate the trigrams with.
     */
    private addDropdownOption(field: Blockly.Field, blockType: string) {
        if (field instanceof Blockly.FieldDropdown) {
            field.getOptions(true).forEach((option) => {
                if (typeof option[0] === 'string') {
                    this.add(option[0], blockType);
                } else if ('alt' in option[0]) {
                    this.add(option[0].alt, blockType);
                }
            });
        }
    }
}
