import mongoose from 'mongoose';
import { roleSchema } from '../models/noSql/role.schema';
import { permissionSchema } from '../models/noSql/permission.schema';
import { NoSQLRole } from '../core/db-functions/role';

export class NoSqlQueries {
  private readonly role;
  private readonly permission;
  constructor(private readonly userPrimaryKey?: string) {
    this.role = mongoose.model('Role', roleSchema);
    this.permission = mongoose.model('Permission', permissionSchema);
  }

  /**
   *
   * @description Add new role to the roles table
   */
  addRole = async (roleName: string) => {
    const role = await this.role.create({ role: roleName });
    return new NoSQLRole({ role });
  };

  /**
   *
   * @description Find a role from the roles table
   */
  findRole = async (roleName: string) => {
    const role = await this.role.findOne({ role: roleName });
    if (role !== null) {
      return new NoSQLRole({ role });
    }
    return null;
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
