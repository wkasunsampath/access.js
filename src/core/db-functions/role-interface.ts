import type { iPermission } from './permission-interface';

export interface iRole {
  id: string | number;
  name: string;

  /**
   *
   * @description Remove role from the roles table
   */
  remove: () => {};

  /**
   *
   * @description Assign a permission or a set of permissions to a role
   */
  assignPermissions: (permissions: string | string[]) => Promise<void>;

  /**
   *
   * @description Remove a permission or a set of permissions from a role
   */
  removePermissions: (permissions: string | string[]) => Promise<void>;

  /**
   *
   * @description Remove all permissions assigned to a role
   */
  removeAllPermissions: () => Promise<void>;

  /**
   *
   * @description Assign role to a user
   */
  assignToUser: (user: any, primaryKey?: string) => Promise<void>;

  /**
   *
   * @description Aissgn a role to multiple users
   */
  assignToUsers: (users: any[], primaryKey?: string) => Promise<void>;

  /**
   *
   * @description Remove a role from a user
   */
  removeFromUser: (user: any, primaryKey?: string) => Promise<void>;

  /**
   *
   * @description Check whether the role has been assigned to the given user
   */
  has: (user: any, primaryKey?: string) => Promise<boolean>;

  /**
   *
   * @description Check whether a given permission has been assigned to the role
   */
  hasPermission: (permission: string) => Promise<boolean>;

  /**
   *
   * @description Check whether all given permissions have been assigned to the role
   */
  hasPermissions: (permissions: string[]) => Promise<boolean>;

  /**
   *
   * @description Check whether at least one or more given permissions have been assigned to the role
   */
  hasAnyPermission: (permissions: string[]) => Promise<boolean>;

  /**
   *
   * @description Get all the permissions assigned to the role.
   */
  getPermissions: () => Promise<iPermission[]>;
}
