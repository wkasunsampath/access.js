import mongoose from 'mongoose';
import { roleSchema } from '../models/noSql/role.schema';
import { permissionSchema } from '../models/noSql/permission.schema';
import { NoSQLRole } from '../core/db-functions/nosql-role';
import { NoSQLPermission } from '../core/db-functions/nosql-permission';
import type { iRole } from '../core/db-functions/role-interface';
import rolePermissionsSchema from '../models/noSql/role-permissions.schema';
import roleUserSchema from '../models/noSql/role-users.schema';
import type { iPermission } from '../core/db-functions/permission-interface';
import type { iQuery } from './query-interface';
import permissionUserSchema from '../models/noSql/permission-user.schema';

export class NoSqlQueries implements iQuery {
  private readonly role;
  private readonly permission;
  private readonly rolePermissionsModel;
  private readonly permissionModel;
  private readonly roleUserModel;
  private readonly permissionUserModel;
  constructor(private readonly userPrimaryKey?: string) {
    this.role = mongoose.model('Role', roleSchema);
    this.permission = mongoose.model('Permission', permissionSchema);
    this.rolePermissionsModel = mongoose.model(
      'RolePermissions',
      rolePermissionsSchema,
    );
    this.permissionModel = mongoose.model('Permission', permissionSchema);
    this.roleUserModel = mongoose.model('RoleUser', roleUserSchema);
    this.permissionUserModel = mongoose.model(
      'PermissionUser',
      permissionUserSchema,
    );
  }

  /**
   *
   * @description Add new role to the roles table
   */
  addRole = async (roleName: string): Promise<iRole> => {
    const role = await this.role.create({ role: roleName });
    return new NoSQLRole({ role, userPrimaryKey: this.userPrimaryKey });
  };

  /**
   *
   * @description Get all available roles
   */
  getRoles = async (): Promise<iRole[]> => {
    const roles = await this.role.find({});
    return roles.map(
      (role) => new NoSQLRole({ role, userPrimaryKey: this.userPrimaryKey }),
    );
  };

  /**
   *
   * @description Find a role from the roles table
   */
  getRole = async (roleName: string): Promise<iRole | null> => {
    const role = await this.role.findOne({ role: roleName });
    if (role !== null) {
      return new NoSQLRole({ role, userPrimaryKey: this.userPrimaryKey });
    }
    return null;
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
    const role = await this.role.findOne({ role: roleName });
    if (role !== null) {
      await new NoSQLRole({
        role,
        userPrimaryKey: this.userPrimaryKey,
      }).assignToUser(user, primaryKey);
    } else {
      throw new Error('Invalid role name');
    }
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
    const userKey = this.getUserKey(user, primaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }
    const roleUser = await this.roleUserModel.findOne({
      role: roleName,
      user: userKey,
    });

    return roleUser !== null;
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
    const userKey = this.getUserKey(user, primaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }
    let hasAnyRole = false;
    for (const roleName of roleNames) {
      const roleUser = await this.roleUserModel.findOne({
        role: roleName,
        user: userKey,
      });
      if (roleUser !== null) {
        hasAnyRole = true;
        break;
      }
    }
    return hasAnyRole;
  };

  /**
   *
   * @description Get all the roles assigned to a given user.
   */
  getUserRoles = async (
    user: any,
    userPrimaryKey?: string,
  ): Promise<iRole[]> => {
    const userKey = this.getUserKey(user, userPrimaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }
    const roles: iRole[] = [];
    const roleUserModels = await this.roleUserModel.find({ user: userKey });
    roleUserModels.forEach((role) => {
      roles.push(
        new NoSQLRole({
          role,
          userPrimaryKey: userKey,
        }),
      );
    });
    return roles;
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
   * @description Get all the permissions assigned to a given user.
   */
  getUserPermissions = async (
    user: any,
    userPrimaryKey?: string,
  ): Promise<iPermission[]> => {
    const userKey = this.getUserKey(user, userPrimaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }
    const permissions: iPermission[] = [];
    const userRoles = await this.getUserRoles(user, userPrimaryKey);
    for (const userRole of userRoles) {
      permissions.push(...(await userRole.getPermissions()));
    }
    const userPermissions = await this.permissionUserModel.find({
      user: userKey,
    });
    for (const userPermission of userPermissions) {
      permissions.push(new NoSQLPermission({ permission: userPermission }));
    }
    return permissions.filter((item, pos, self) => {
      return self.indexOf(item) === pos;
    });
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
        userPrimaryKey: this.userPrimaryKey,
      }).assignPermissions(permissions);
    } else {
      throw new Error('Invalid role name');
    }
  };

  private readonly getUserKey = (
    user: any,
    overwritingKey: string | undefined,
  ) => {
    let userKey = '_id';
    if (overwritingKey !== undefined) {
      userKey = overwritingKey;
    } else if (this.userPrimaryKey !== undefined) {
      userKey = this.userPrimaryKey;
    }
    return user[`${userKey}`];
  };
}
