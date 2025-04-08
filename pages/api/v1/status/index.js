import database from "infra/database.js";
import { InternalServerError } from "infra/errors.js";

async function status(req, res) {
  try {
    const updatedAt = new Date().toISOString();

    const versionQuery = await database.query("SHOW server_version;");
    const dbVersion = versionQuery.rows[0].server_version;

    const maxConnectionsQuery = await database.query("SHOW max_connections;");
    const maxConnections = maxConnectionsQuery.rows[0].max_connections;

    const dbName = process.env.POSTGRES_DB;
    const openedConnectionsQuery = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [dbName],
    });
    const openedConnections = openedConnectionsQuery.rows[0].count;

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersion,
          max_connections: parseInt(maxConnections),
          opened_connections: openedConnections,
        },
      },
    });
  } catch (error) {
    const publicErrorObj = new InternalServerError({
      cause: error,
    });
    console.error("Error retrieving status:", publicErrorObj);
    res.status(500).json(publicErrorObj);
  }
}

export default status;
