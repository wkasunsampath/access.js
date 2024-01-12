import type { iPermission } from '../core/db-functions/permission-interface';
import type { iRole } from '../core/db-functions/role-interface';

export interface iQuery {
  /**
   *
   * @description Add new role to the roles table
   */
  addRole: (role: string) => Promise<iRole>;
  /**
   *
   * @description Get all available roles
   */
  getRoles: () => Promise<iRole[]>;
  /**
   *
   * @description Find a role from the roles table
   */
  getRole: (roleName: string) => Promise<iRole | null>;
  /**
   *
   * @description Assign a role to user
   */
  assignRole: (
    roleName: string,
    user: any,
    userPrimaryKey?: string,
  ) => Promise<void>;
  /**
   *
   * @description Check whether the role has been assigned to the given user
   */
  hasRole: (
    roleName: string,
    user: any,
    userPrimaryKey?: string,
  ) => Promise<boolean>;
  /**
   *
   * @description Check whether at least one or more given roles have been assigned to the user
   */
  hasAnyRole: (
    roleNames: string[],
    user: any,
    userPrimaryKey?: string,
  ) => Promise<boolean>;
  /**
   *
   * @description Get all the roles assigned to a given user.
   */
  getUserRoles: (user: any, userPrimaryKey?: string) => Promise<iRole[]>;
  /**
   *
   * @description Add new permission to the permissions table
   */
  addPermission: (permissionName: string) => Promise<iPermission>;
  /**
   *
   * @description Find a permission from the permissions table
   */
  getPermission: (permissionName: string) => Promise<iPermission | null>;
  /**
   *
   * @description Get all the permissions assigned to a given user.
   */
  getUserPermissions: (
    user: any,
    userPrimaryKey?: string,
  ) => Promise<iPermission[]>;
  /**
   *
   * @description Find a permission has been added to the permissions list
   */
  isPermissionAvailable: (permissionName: string) => Promise<boolean>;
  /**
   *
   * @description Assign one or many permissions to a role
   */
  assignPermissionToRole: (
    role: string,
    permissions: string[],
  ) => Promise<void>;
}
