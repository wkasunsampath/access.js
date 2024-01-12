import mongoose from 'mongoose';
import { roleSchema } from '../models/noSql/role.schema';
import type { iQuery } from './query-interface';
import type { iRole } from '../core/db-functions/role-interface';
import { NoSQLRole } from '../core/db-functions/nosql-role';
import type { iPermission } from '../core/db-functions/permission-interface';
import { NoSQLPermission } from '../core/db-functions/nosql-permission';
import { permissionSchema } from '../models/noSql/permission.schema';

export class SqlQueries implements iQuery {
  role;
  permission;
  constructor() {
    this.role = mongoose.model('Role', roleSchema);
    this.permission = mongoose.model('Permission', permissionSchema);
  }

  addRole = async (role: string) => {
    const irole = await this.role.create({ role });
    return new NoSQLRole({ role: irole, userPrimaryKey: '' });
  };

  /**
   *
   * @description Get all available roles
   */
  getRoles = async (): Promise<iRole[]> => {
    return [];
  };

  /**
   *
   * @description Find a role from the roles table
   */
  getRole = async (roleName: string): Promise<iRole | null> => {
    return await new Promise((res, rej) => {
      res(null);
    });
  };

  /**
   *
   * @description Assign a role to user
   */
  assignRole = async (
    roleName: string,
    user: any,
    primaryKey?: string,
  ): Promise<void> => {
    //
  };

  /**
   *
   * @description Check whether the role has been assigned to the given user
   */
  hasRole = async (
    roleName: string,
    user: any,
    primaryKey?: string,
  ): Promise<boolean> => {
    return await new Promise((res, rej) => {
      res(true);
    });
  };

  /**
   *
   * @description Check whether at least one or more given roles have been assigned to the user
   */
  hasAnyRole = async (
    roleNames: string[],
    user: any,
    primaryKey?: string,
  ): Promise<boolean> => {
    return await new Promise((res, rej) => {
      res(true);
    });
  };

  /**
   *
   * @description Add new permission to the permissions table
   */
  addPermission = async (permissionName: string): Promise<iPermission> => {
    const permission = await this.permission.create({
      permission: permissionName,
    });
    return new NoSQLPermission({ permission });
  };

  /**
   *
   * @description Find a permission from the permissions table
   */
  getPermission = async (
    permissionName: string,
  ): Promise<iPermission | null> => {
    const permission = await this.permission.findOne({
      permission: permissionName,
    });
    if (permission !== null) {
      return new NoSQLPermission({ permission });
    }
    return null;
  };

  /**
   *
   * @description Find a permission has been added to the permissions list
   */
  isPermissionAvailable = async (permissionName: string): Promise<boolean> => {
    const permission = await this.permission.findOne({
      permission: permissionName,
    });
    return permission !== null;
  };

  /**
   *
   * @description Assign one or many permissions to a role
   */
  assignPermissionToRole = async (
    role: string,
    permissions: string[],
  ): Promise<void> => {
    const iRole = await this.role.findOne({ role });
    if (iRole !== null) {
      await new NoSQLRole({
        role: iRole,
        userPrimaryKey: '',
      }).assignPermissions(permissions);
    } else {
      throw new Error('Invalid role name');
    }
  };

  /**
   *
   * @description Get all the permissions assigned to a given user.
   */
  getUserPermissions = async (
    user: any,
    userPrimaryKey?: string,
  ): Promise<iPermission[]> => {
    return await new Promise((res, rej) => {
      res([]);
    });
  };

  /**
   *
   * @description Get all the roles assigned to a given user.
   */
  getUserRoles = async (
    user: any,
    userPrimaryKey?: string,
  ): Promise<iRole[]> => {
    return await new Promise((res, rej) => {
      res([]);
    });
  };
}
