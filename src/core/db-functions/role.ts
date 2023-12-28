import mongoose from 'mongoose';
import type { Document } from 'mongoose';
import { roleSchema } from '../../models/noSql/role.schema';

export class NoSQLRole {
  private readonly role?: Document<unknown, {}, { role: string }> & {
    role: string;
  } & {
    _id: mongoose.Types.ObjectId;
  } = undefined;

  private readonly roleModel;

  constructor(
    private readonly args: {
      userPrimaryKey?: string;
      role: Document<unknown, {}, { role: string }> & { role: string } & {
        _id: mongoose.Types.ObjectId;
      };
    },
  ) {
    this.roleModel = mongoose.model('Role', roleSchema);
    this.role = args.role;
  }

  remove = async () => {
    if (this.role !== undefined) {
      await this.role.deleteOne();
    }
  };

  assignPermissions = async (permissions: string | string[]) => {};
  removePermissions = async (permissions: string | string[]) => {};

  assignToUser = async (user: any, primaryKey?: string) => {};
  assignToUsers = async (users: any[], primaryKey?: string) => {};
  removeFromUser = async (user: any, primaryKey?: string) => {};
  has = async (user: any, primaryKey?: string) => {};

  hasPermission = async (permission: string) => {};
  hasPermissions = async (permission: string[]) => {};
  hasAnyPermission = async (permission: string[]) => {};
}
