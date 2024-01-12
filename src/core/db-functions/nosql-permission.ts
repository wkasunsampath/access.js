import mongoose from 'mongoose';
import type { Document } from 'mongoose';
import { roleSchema } from '../../models/noSql/role.schema';
import rolePermissionsSchema from '../../models/noSql/role-permissions.schema';
import roleUserSchema from '../../models/noSql/role-users.schema';
import permissionUserSchema from '../../models/noSql/permission-user.schema';
import type { iPermission } from './permission-interface';

export class NoSQLPermission implements iPermission {
  id: string;
  name: string;

  private readonly permission: Document<unknown, {}, { permission: string }> & {
    permission: string;
  } & {
    _id: mongoose.Types.ObjectId;
  };

  private readonly userPrimaryKey;
  private readonly roleModel;
  private readonly rolePermissionsModel;
  private readonly roleUserModel;
  private readonly permissionUserModel;

  constructor(
    private readonly args: {
      userPrimaryKey?: string;
      permission: Document<unknown, {}, { permission: string }> & {
        permission: string;
      } & {
        _id: mongoose.Types.ObjectId;
      };
    },
  ) {
    this.roleModel = mongoose.model('Role', roleSchema);
    this.rolePermissionsModel = mongoose.model(
      'RolePermissions',
      rolePermissionsSchema,
    );
    this.roleUserModel = mongoose.model('RoleUser', roleUserSchema);
    this.permissionUserModel = mongoose.model(
      'PermissionUser',
      permissionUserSchema,
    );
    this.permission = args.permission;
    this.id = String(args.permission._id);
    this.name = args.permission.permission;
    this.userPrimaryKey = args.userPrimaryKey;
  }

  remove = async () => {
    // Remove all role permissions
    await this.rolePermissionsModel.deleteMany({
      permission: this.permission.permission,
    });
    // Remove all user permissions
    await this.permissionUserModel.deleteMany({
      permission: this.permission.permission,
    });

    await this.permission.deleteOne();
  };

  assignToRoles = async (roles: string | string[]) => {
    if (Array.isArray(roles)) {
      await this.rolePermissionsModel.insertMany(
        roles.map(async (role) => {
          const storedRole = await this.roleModel.findOne({
            role,
          });
          if (storedRole === null) {
            throw new Error(`Role - "${role}" is not found`);
          }
          return { permission: this.permission.permission, role };
        }),
      );
    } else {
      const storedRole = await this.roleModel.findOne({
        role: roles,
      });
      if (storedRole === null) {
        throw new Error(`Role - "${roles}" is not found`);
      }
      await this.rolePermissionsModel.create({
        permission: this.permission.permission,
        role: roles,
      });
    }
  };

  removeFromRole = async (role: string) => {
    await this.rolePermissionsModel.deleteOne({
      role,
      permission: this.permission.permission,
    });
  };

  isAssignedToRole = async (role: string) => {
    const rolePermission = await this.rolePermissionsModel.findOne({
      role,
      permission: this.permission.permission,
    });
    return rolePermission !== null;
  };

  assignToUser = async (user: any, primaryKey?: string) => {
    const userKey = this.getUserKey(user, primaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }

    await this.permissionUserModel.create({
      permission: this.permission.permission,
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

    await this.permissionUserModel.deleteOne({
      permission: this.permission.permission,
      user: userKey,
    });
  };

  has = async (user: any, primaryKey?: string) => {
    const userKey = this.getUserKey(user, primaryKey);
    if (userKey === undefined) {
      throw new Error('User primary key is invalid.');
    }
    const permissionUser = await this.permissionUserModel.findOne({
      permission: this.permission.permission,
      user: userKey,
    });

    if (permissionUser !== null) {
      return true;
    }

    const allRolesIncludedPermission = await this.rolePermissionsModel.find({
      permission: this.permission.permission,
    });

    if (allRolesIncludedPermission.length >= 1) {
      const userRoles = await this.roleUserModel.find({ user: userKey });
      if (userRoles.length >= 1) {
        const permissionRolesArray = allRolesIncludedPermission.map(
          (p) => p.role,
        );
        const userRolesArray = userRoles.map((r) => r.role);
        return userRolesArray.some((item) =>
          permissionRolesArray.includes(item),
        );
      }
    }
    return false;
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
