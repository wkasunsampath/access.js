import { AccessJsCore } from './core';
import type { AccessJsConfiguration } from './types';

let accessJsCoreInstance: AccessJsCore;

const InitAccessJs = (config: AccessJsConfiguration): AccessJsCore => {
  if (accessJsCoreInstance === undefined) {
    accessJsCoreInstance = new AccessJsCore(config);
  }
  return new AccessJsCore(config);
};

export { InitAccessJs };
export type { AccessJsConfiguration };
