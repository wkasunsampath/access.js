import type {
  AccessJsConfiguration,
  NoSqlQueriesList,
  SqlQueriesList,
} from '../types';
import * as mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import { NoSqlQueries } from '../queries/no-sql';
import { SqlQueries } from '../queries/sql';

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

  addRole = async (role: string) => {
    return await this.db.queries.addRole(role);
  };
}
