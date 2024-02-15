import mongoose from 'mongoose';
import type { Document } from 'mongoose';
import rolePermissionsSchema from '../../models/noSql/role-permissions.schema';
import { permissionSchema } from '../../models/noSql/permission.schema';
import roleUserSchema from '../../models/noSql/role-users.schema';
import type { iRole } from './role-interface';
import type { iPermission } from './permission-interface';
import { NoSQLPermission } from './nosql-permission';

export class NoSQLRole implements iRole {
  id: string;
  name: string;

  private readonly role: Document<unknown, {}, { role: string }> & {
    role: string;
  } & {
    _id: mongoose.Types.ObjectId;
  };

  private readonly userPrimaryKey;
  private readonly rolePermissionsModel;
  private readonly permissionModel;
  private readonly roleUserModel;

  constructor(
    private readonly args: {
      userPrimaryKey?: string;
      role: Document<unknown, {}, { role: string }> & { role: string } & {
        _id: mongoose.Types.ObjectId;
      };
    },
  ) {
    this.rolePermissionsModel = mongoose.model(
      'RolePermissions',
      rolePermissionsSchema,
    );
    this.permissionModel = mongoose.model('Permission', permissionSchema);
    this.roleUserModel = mongoose.model('RoleUser', roleUserSchema);
    this.role = args.role;
    this.id = String(args.role._id);
    this.name = args.role.role;
    this.userPrimaryKey = args.userPrimaryKey;
  }

  remove = async () => {
    // Delete all user roles records
    await this.roleUserModel.deleteMany({ role: this.role.role });
    // Delete all role permissions records
    await this.rolePermissionsModel.deleteMany({ role: this.role.role });

    await this.role.deleteOne();
  };

  assignPermissions = async (permissions: string | string[]) => {
    if (Array.isArray(permissions)) {
      const formattedPermissions = [];
      for (const permission of permissions) {
        const storedPermission = await this.permissionModel.findOne({
          permission,
        });
        if (storedPermission === null) {
          throw new Error(`Permission - "${permission}" is not found`);
        }
        formattedPermissions.push({ permission, role: this.role.role });
      }
      await this.rolePermissionsModel.insertMany(formattedPermissions);
    } else {
      const storedPermission = await this.permissionModel.findOne({
        permission: permissions,
      });
      if (storedPermission === null) {
        throw new Error(`Permission - "${permissions}" is not found`);
      }
      await this.rolePermissionsModel.create({
        permission: permissions,
        role: this.role.role,
      });
    }
  };

  removePermissions = async (permissions: string | string[]) => {
    if (Array.isArray(permissions)) {
      for (const permissionName of permissions) {
        await this.removePermission(permissionName);
      }
    } else {
      await this.removePermission(permissions);
    }
  };

  removeAllPermissions = async () => {
    await this.rolePermissionsModel.deleteMany({ role: this.role.role });
  };

  assignToUser = async (user: any, primaryKey?: string) => {
    const userKey = this.getUserKey(user, primaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }
    await this.roleUserModel.create({
      role: this.role.role,
      user: userKey,
    });
  };

  assignToUsers = async (users: any[], primaryKey?: string) => {
    for (const user of users) {
      await this.assignToUser(user, primaryKey);
    }
  };

  removeFromUser = async (user: any, primaryKey?: string) => {
    const userKey = this.getUserKey(user, primaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }
    await this.roleUserModel.deleteOne({ role: this.role.role, user: userKey });
  };

  has = async (user: any, primaryKey?: string) => {
    const userKey = this.getUserKey(user, primaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }
    const roleUser = await this.roleUserModel.findOne({
      role: this.role.role,
      user: userKey,
    });

    return roleUser !== null;
  };

  hasPermission = async (permission: string) => {
    const rolePermission = await this.rolePermissionsModel.findOne({
      role: this.role.role,
      permission,
    });

    return rolePermission !== null;
  };

  hasPermissions = async (permissions: string[]) => {
    let hasAllPermissions = true;
    for (const permission of permissions) {
      if (!(await this.hasPermission(permission))) {
        hasAllPermissions = false;
        break;
      }
    }
    return hasAllPermissions;
  };

  hasAnyPermission = async (permissions: string[]) => {
    let hasAnyPermission = false;
    for (const permission of permissions) {
      if (await this.hasPermission(permission)) {
        hasAnyPermission = true;
        break;
      }
    }
    return hasAnyPermission;
  };

  /**
   *
   * @description Get all the permissions assigned to the role.
   */
  getPermissions = async (): Promise<iPermission[]> => {
    const rolePermissions = await this.rolePermissionsModel.find({
      role: this.role.role,
    });
    return rolePermissions.map((permission) => {
      return new NoSQLPermission({ permission });
    });
  };

  private readonly removePermission = async (permissionName: string) => {
    const rolePermission = await this.rolePermissionsModel.findOne({
      permission: permissionName,
      role: this.role.role,
    });

    await rolePermission?.deleteOne();
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
