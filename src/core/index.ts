import type {
  AccessJsConfiguration,
  NoSqlQueriesList,
  SqlQueriesList,
} from '../types';
import * as mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import { NoSqlQueries } from '../queries/no-sql';
import { SqlQueries } from '../queries/sql';
import type { iRole } from './db-functions/role-interface';
import type { iPermission } from './db-functions/permission-interface';

export class AccessJsCore {
  private readonly db: NoSqlQueriesList | SqlQueriesList;
  constructor(private readonly config: AccessJsConfiguration) {
    if (this.config.db.type === 'mongodb') {
      mongoose
        .connect(this.config.db.connectionUrl)
        .then((connection) => {})
        .catch((e) => {
          throw e;
        });
      this.db = {
        type: this.config.db.type,
        queries: new NoSqlQueries(config.userPrimaryKey),
      };
    } else {
      const sequelize = new Sequelize(
        this.config.db.databaseName,
        this.config.db.username,
        this.config.db.password,
        {
          host: this.config.db.host,
          dialect: this.config.db.type,
        },
      );
      sequelize
        .authenticate()
        .then((connection) => {})
        .catch((e) => {
          throw e;
        });
      this.db = { type: this.config.db.type, queries: new SqlQueries() };
    }
  }

  /**
   *
   * @description Create new role
   */
  addRole = async (role: string): Promise<iRole> => {
    return await this.db.queries.addRole(role);
  };

  /**
   *
   * @description Get all available roles
   */
  getRoles = async (): Promise<iRole[]> => {
    return await this.db.queries.getRoles();
  };

  /**
   *
   * @description Find a role from the roles table
   */
  getRole = async (roleName: string): Promise<iRole | null> => {
    return await this.db.queries.getRole(roleName);
  };

  /**
   *
   * @description Assign a role to user
   */
  assignRole = async (
    roleName: string,
    user: any,
    userPrimaryKey?: string,
  ): Promise<void> => {
    await this.db.queries.assignRole(roleName, user, userPrimaryKey);
  };

  /**
   *
   * @description Check whether the role has been assigned to the given user
   */
  hasRole = async (
    roleName: string,
    user: any,
    userPrimaryKey?: string,
  ): Promise<boolean> => {
    return await this.db.queries.hasRole(roleName, user, userPrimaryKey);
  };

  /**
   *
   * @description Check whether at least one or more given roles have been assigned to the user
   */
  hasAnyRole = async (
    roleNames: string[],
    user: any,
    userPrimaryKey?: string,
  ): Promise<boolean> => {
    return await this.db.queries.hasAnyRole(roleNames, user, userPrimaryKey);
  };

  /**
   *
   * @description Get all the roles assigned to a given user
   */
  getUserRoles = async (
    user: any,
    userPrimaryKey?: string,
  ): Promise<iRole[]> => {
    return await this.db.queries.getUserRoles(user, userPrimaryKey);
  };

  /**
   *
   * @description Add new permission to the permissions table
   */
  addPermission = async (permissionName: string): Promise<iPermission> => {
    return await this.db.queries.addPermission(permissionName);
  };

  /**
   *
   * @description Find a permission from the permissions table
   */
  getPermission = async (
    permissionName: string,
  ): Promise<iPermission | null> => {
    return await this.db.queries.getPermission(permissionName);
  };

  /**
   *
   * @description Get all the permissions assigned to a given user
   */
  getUserPermissions = async (
    user: any,
    userPrimaryKey?: string,
  ): Promise<iPermission[]> => {
    return await this.db.queries.getUserPermissions(user, userPrimaryKey);
  };

  /**
   *
   * @description Check whether the permission has been assigned to the given user
   */
  hasPermission = async (
    permission: string,
    user: any,
    userPrimaryKey?: string,
  ): Promise<boolean> => {
    const permissions = (
      await this.db.queries.getUserPermissions(user, userPrimaryKey)
    ).map((permission) => permission.name);
    return permissions.includes(permission);
  };

  /**
   *
   * @description Check whether the permission has been assigned to the given user
   */
  hasAnyPermission = async (
    permission: string[],
    user: any,
    userPrimaryKey?: string,
  ): Promise<boolean> => {
    const permissions = (
      await this.db.queries.getUserPermissions(user, userPrimaryKey)
    ).map((permission) => permission.name);
    return permission.some((item) => permissions.includes(item));
  };

  /**
   *
   * @description Find a permission has been added to the permissions list
   */
  isPermissionAvailable = async (permissionName: string): Promise<boolean> => {
    return await this.db.queries.isPermissionAvailable(permissionName);
  };

  /**
   *
   * @description Assign one or many permissions to a role
   */
  assignPermissionToRole = async (
    role: string,
    permissions: string[],
  ): Promise<void> => {
    await this.db.queries.assignPermissionToRole(role, permissions);
  };
}
