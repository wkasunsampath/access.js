export interface iPermission {
  id: string | number;
  name: string;

  /**
   *
   * @description Remove permission from the permissions table
   */
  remove: () => {};

  /**
   *
   * @description Assign permission to one or many user roles
   */
  assignToRoles: (roles: string | string[]) => Promise<void>;

  /**
   *
   * @description Remove permission from a given role
   */
  removeFromRole: (role: string) => Promise<void>;

  /**
   *
   * @description Check whether the permission is assigned to a given role
   */
  isAssignedToRole: (role: string) => Promise<boolean>;

  /**
   *
   * @description Assign permission to a user
   */
  assignToUser: (user: any, primaryKey?: string) => Promise<void>;

  /**
   *
   * @description Assign permission to multiple users
   */
  assignToUsers: (users: any[], primaryKey?: string) => Promise<void>;

  /**
   *
   * @description Remove permission from the user
   */
  removeFromUser: (user: any, primaryKey?: string) => Promise<void>;

  /**
   *
   * @description Check whether a given user has the permission
   */
  has: (user: any, primaryKey?: string) => Promise<boolean>;
}
