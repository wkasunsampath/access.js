import mongoose from 'mongoose';
import { roleSchema } from '../models/noSql/role.schema';
import type { Query } from './query-interface';

export class SqlQueries implements Query {
  role;
  constructor() {
    this.role = mongoose.model('Role', roleSchema);
  }

  addRole = async (role: string) => {
    await this.role.create({ role });
  };
}
