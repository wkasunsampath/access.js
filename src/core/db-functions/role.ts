import mongoose from 'mongoose';
import type { Document, ObjectId } from 'mongoose';
import { roleSchema } from '../../models/noSql/role.schema';

export class Role {
  private role: Document<unknown, {}, { role: string }> & { role: string } & {
    _id: ObjectId;
  } = undefined;

  private readonly roleModel;

  constructor(private readonly args: { roleName?: string }) {
    this.roleModel = mongoose.model('Role', roleSchema);
  }

  save = async () => {
    this.role = await this.roleModel.create({ role: this.args.roleName });
  };
}
