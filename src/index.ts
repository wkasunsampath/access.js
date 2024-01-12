import { AccessJsCore } from './core';
import type { AccessJsConfiguration } from './types';
import type { iRole } from './core/db-functions/role-interface';
import type { iPermission } from './core/db-functions/permission-interface';

let accessJsCoreInstance: AccessJsCore;

const InitAccessJs = (config: AccessJsConfiguration): AccessJsCore => {
  if (accessJsCoreInstance === undefined) {
    accessJsCoreInstance = new AccessJsCore(config);
  }
  return new AccessJsCore(config);
};

export { InitAccessJs, AccessJsCore };
export type { AccessJsConfiguration, iRole, iPermission };
