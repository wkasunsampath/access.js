import mongoose from 'mongoose';
import { roleSchema } from '../models/noSql/role.schema';
import type { Query } from './query-interface';
import { permissionSchema } from '../models/noSql/permission.schema';

export class NoSqlQueries implements Query {
  private readonly role;
  private readonly permission;
  constructor() {
    this.role = mongoose.model('Role', roleSchema);
    this.permission = mongoose.model('Permission', permissionSchema);
  }

  /**
   *
   * @description Add new role to the roles table
   */
  addRole = async (role: string) => {
    await this.role.create({ role });
  };

  /**
   *
   * @description Add new permission to the permissions table
   */
  addPermission = async (permission: string) => {
    await this.permission.create({ permission });
  };

  /**
   *
   * @description Assign one or many permissions to a role
   */
  assignPermissionToRole = () => {};
}
