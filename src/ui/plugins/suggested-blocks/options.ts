/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Typedefs and utility methods for parsing options for the
 * backpack plugin.
 * @author kozbial@google.com (Monica Kozbial)
 */

export interface Options {
  emptyFavourites?: boolean;
  removeFromFavourites?: boolean;
  copyToFavourites?: boolean;
}

/**
 * Returns a new options object with all properties set, using default values
 * if not specified in the optional options that were passed in.
 *
 * @param options The options to use.
 * @returns The created options object.
 */
export function parseOptions(options?: Options): Options {
  const defaults = {
      emptyFavourites: true,
      removeFromFavourites: true,
      copyToFavourites: true
  };

  if (!options) {
    return defaults;
  }

  return {
      ...defaults,
      ...options,
  };
}
