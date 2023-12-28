import type { NoSqlQueries } from '../queries/no-sql';
import type { SqlQueries } from '../queries/sql';

export type NoSqlConnection = {
  type: 'mongodb';
  connectionUrl: string;
};

export type SqlConnection = {
  type:
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mariadb'
    | 'mssql'
    | 'db2'
    | 'snowflake'
    | 'oracle';
  username: string;
  password: string;
  host: string;
  databaseName: string;
};

export type AccessJsConfiguration = {
  db: NoSqlConnection | SqlConnection;
};

export type NoSqlQueriesList = {
  type: 'mongodb';
  queries: NoSqlQueries;
};

export type SqlQueriesList = {
  type:
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mariadb'
    | 'mssql'
    | 'db2'
    | 'snowflake'
    | 'oracle';
  queries: SqlQueries;
};
