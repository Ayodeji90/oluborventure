#!/usr/bin/env node
/**
 * Provisions the Olubor applications database on Appwrite.
 *
 *   npm run provision
 *
 * Idempotent: every step checks for existence first, so it is safe to re-run
 * after a partial failure or when the schema grows.
 *
 * Needs these in `.env.local` (or the ambient environment):
 *   APPWRITE_ENDPOINT      e.g. https://cloud.appwrite.io/v1
 *   APPWRITE_PROJECT_ID
 *   APPWRITE_API_KEY       server key with databases.* and storage.* scopes
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Client, TablesDB, Storage, AppwriteException, Query } from "node-appwrite";

import {
  DATABASE_ID,
  DATABASE_NAME,
  BUCKET_ID,
  BUCKET_NAME,
  BUCKET_MAX_FILE_SIZE,
  BUCKET_EXTENSIONS,
  TABLES,
  RELATIONSHIPS,
  DOCUMENT_TYPE_SEED,
} from "./appwrite-schema.mjs";

// ---------------------------------------------------------------- env loading

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, "..");

/** Minimal .env reader so we don't depend on node flags or dotenv. */
function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(join(projectRoot, ".env.local"));
loadEnvFile(join(projectRoot, ".env"));

const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = process.env;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error(
    [
      "",
      "  Missing Appwrite credentials.",
      "",
      "  Copy `.env.example` to `.env.local` and fill in:",
      "    APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY",
      "",
      "  Create a project at https://cloud.appwrite.io, then add an API key",
      '  with the "databases" and "storage" scopes.',
      "",
    ].join("\n"),
  );
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);
const storage = new Storage(client);

// ---------------------------------------------------------------- log helpers

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

const created = [];
const skipped = [];

const logCreated = (what) => {
  created.push(what);
  console.log(`  ${green("+")} ${what}`);
};
const logSkipped = (what) => {
  skipped.push(what);
  console.log(`  ${dim(`- ${what} (exists)`)}`);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run `fn`; return true if it succeeded, false on a 404, rethrow otherwise. */
async function probe(fn) {
  try {
    await fn();
    return true;
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) return false;
    throw err;
  }
}

// ------------------------------------------------------------------- database

async function ensureDatabase() {
  console.log(`\n${yellow("Database")} ${DATABASE_ID}`);
  const found = await probe(() => tablesDB.get({ databaseId: DATABASE_ID }));
  if (found) {
    logSkipped(`database ${DATABASE_ID}`);
    return;
  }
  await tablesDB.create({ databaseId: DATABASE_ID, name: DATABASE_NAME });
  logCreated(`database ${DATABASE_ID}`);
}

// --------------------------------------------------------------------- tables

async function ensureTable(table) {
  const found = await probe(() =>
    tablesDB.getTable({ databaseId: DATABASE_ID, tableId: table.id }),
  );
  if (found) {
    logSkipped(`table ${table.id}`);
    return;
  }
  await tablesDB.createTable({
    databaseId: DATABASE_ID,
    tableId: table.id,
    name: table.name,
    permissions: table.permissions ?? [],
    rowSecurity: table.rowSecurity ?? true,
  });
  logCreated(`table ${table.id}`);
}

// -------------------------------------------------------------------- columns

function createColumn(tableId, col) {
  const base = {
    databaseId: DATABASE_ID,
    tableId,
    key: col.key,
    required: col.required ?? false,
  };
  const optional = (value, key) =>
    value === undefined || value === null ? {} : { [key]: value };

  switch (col.type) {
    case "varchar":
      return tablesDB.createVarcharColumn({
        ...base,
        size: col.size ?? 255,
        ...(col.array ? { array: true } : {}),
        ...(col.encrypt ? { encrypt: true } : {}),
      });
    case "email":
      return tablesDB.createEmailColumn({ ...base, ...(col.array ? { array: true } : {}) });
    case "url":
      return tablesDB.createUrlColumn({ ...base, ...(col.array ? { array: true } : {}) });
    case "integer":
      return tablesDB.createIntegerColumn({
        ...base,
        ...optional(col.min, "min"),
        ...optional(col.max, "max"),
        ...optional(col.xdefault, "xdefault"),
      });
    case "boolean":
      return tablesDB.createBooleanColumn({
        ...base,
        ...optional(col.xdefault, "xdefault"),
      });
    case "datetime":
      return tablesDB.createDatetimeColumn({
        ...base,
        ...optional(col.xdefault, "xdefault"),
      });
    case "enum":
      return tablesDB.createEnumColumn({
        ...base,
        elements: col.elements,
        ...optional(col.xdefault, "xdefault"),
      });
    case "text":
      return tablesDB.createTextColumn({ ...base, ...(col.encrypt ? { encrypt: true } : {}) });
    case "longtext":
      return tablesDB.createLongtextColumn({ ...base, ...(col.encrypt ? { encrypt: true } : {}) });
    default:
      throw new Error(`Unknown column type "${col.type}" for ${tableId}.${col.key}`);
  }
}

async function ensureColumns(table) {
  const pending = [];

  for (const col of table.columns) {
    const found = await probe(() =>
      tablesDB.getColumn({
        databaseId: DATABASE_ID,
        tableId: table.id,
        key: col.key,
      }),
    );
    if (found) {
      logSkipped(`  ${table.id}.${col.key}`);
      continue;
    }
    await createColumn(table.id, col);
    pending.push(col.key);
    logCreated(`  ${table.id}.${col.key} ${dim(`(${col.type})`)}`);
  }

  if (pending.length > 0) {
    await waitForColumns(table.id, pending);
  }
}

/**
 * Appwrite builds columns asynchronously; an index cannot be created until its
 * columns report `available`.
 */
async function waitForColumns(tableId, keys, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  let announced = false;

  while (Date.now() < deadline) {
    const list = await tablesDB.listColumns({
      databaseId: DATABASE_ID,
      tableId,
    });
    const columns = list.columns ?? [];
    const waiting = keys.filter((key) => {
      const col = columns.find((c) => c.key === key);
      return !col || col.status !== "available";
    });

    if (waiting.length === 0) {
      if (announced) console.log(`  ${green("+")} ${tableId}: columns available`);
      return;
    }

    if (!announced) {
      console.log(dim(`    waiting on ${waiting.length} column(s) in ${tableId}…`));
      announced = true;
    }
    await sleep(1500);
  }

  throw new Error(`Timed out waiting for columns on ${tableId}: ${keys.join(", ")}`);
}

// -------------------------------------------------------------------- indexes

async function ensureIndexes(table) {
  for (const index of table.indexes ?? []) {
    const found = await probe(() =>
      tablesDB.getIndex({
        databaseId: DATABASE_ID,
        tableId: table.id,
        key: index.key,
      }),
    );
    if (found) {
      logSkipped(`  index ${table.id}.${index.key}`);
      continue;
    }
    await tablesDB.createIndex({
      databaseId: DATABASE_ID,
      tableId: table.id,
      key: index.key,
      type: index.type,
      columns: index.columns,
      ...(index.orders ? { orders: index.orders } : {}),
    });
    logCreated(`  index ${table.id}.${index.key} ${dim(`(${index.type}: ${index.columns.join(", ")})`)}`);
  }
}

// -------------------------------------------------------------- relationships

async function ensureRelationships() {
  console.log(`\n${yellow("Relationships")}`);
  for (const rel of RELATIONSHIPS) {
    const found = await probe(() =>
      tablesDB.getColumn({
        databaseId: DATABASE_ID,
        tableId: rel.table,
        key: rel.key,
      }),
    );
    if (found) {
      logSkipped(`  ${rel.table}.${rel.key}`);
      continue;
    }
    await tablesDB.createRelationshipColumn({
      databaseId: DATABASE_ID,
      tableId: rel.table,
      relatedTableId: rel.relatedTable,
      type: rel.type,
      twoWay: rel.twoWay ?? true,
      key: rel.key,
      twoWayKey: rel.twoWayKey,
      onDelete: rel.onDelete ?? "cascade",
    });
    logCreated(
      `  ${rel.table}.${rel.key} -> ${rel.relatedTable} ${dim(`(${rel.type}${rel.twoWayKey ? `, two-way "${rel.twoWayKey}"` : ""})`)}`,
    );
  }
}

// ---------------------------------------------------------------- object store

async function ensureBucket() {
  console.log(`\n${yellow("Storage")}`);
  const found = await probe(() => storage.getBucket({ bucketId: BUCKET_ID }));
  if (found) {
    logSkipped(`bucket ${BUCKET_ID}`);
    return;
  }
  await storage.createBucket({
    bucketId: BUCKET_ID,
    name: BUCKET_NAME,
    // Server-side (API key) uploads only; individual files grant per-user reads.
    permissions: [],
    fileSecurity: true,
    enabled: true,
    maximumFileSize: BUCKET_MAX_FILE_SIZE,
    allowedFileExtensions: BUCKET_EXTENSIONS,
    encryption: true,
    antivirus: true,
    transformations: false,
  });
  logCreated(`bucket ${BUCKET_ID}`);
}

// ------------------------------------------------------------------ seed data

async function seedDocumentTypes() {
  console.log(`\n${yellow("Document type checklist")}`);
  for (const entry of DOCUMENT_TYPE_SEED) {
    // Row id === checklist key, so re-running updates in place.
    const existing = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: "document_types",
      queries: [Query.equal("key", entry.key), Query.limit(1)],
    });

    await tablesDB.upsertRow({
      databaseId: DATABASE_ID,
      tableId: "document_types",
      rowId: entry.key,
      data: entry,
      permissions: ['read("any")'],
    });

    if ((existing.rows ?? []).length > 0) logSkipped(`  ${entry.key}`);
    else logCreated(`  ${entry.key} ${dim(entry.label)}`);
  }
}

// ----------------------------------------------------------------------- main

async function main() {
  console.log(`\nProvisioning Appwrite project ${APPWRITE_PROJECT_ID}`);
  console.log(dim(`endpoint ${APPWRITE_ENDPOINT}`));

  await ensureDatabase();

  console.log(`\n${yellow("Tables & columns")}`);
  for (const table of TABLES) {
    await ensureTable(table);
    await ensureColumns(table);
    await ensureIndexes(table);
  }

  await ensureRelationships();
  await ensureBucket();
  await seedDocumentTypes();

  console.log(
    `\n${green("Done.")} ${created.length} created, ${skipped.length} already present.\n`,
  );
  console.log("Add these to `.env.local` so the app can use them:");
  console.log(dim(`  NEXT_PUBLIC_APPWRITE_DATABASE_ID=${DATABASE_ID}`));
  console.log(dim(`  NEXT_PUBLIC_APPWRITE_BUCKET_ID=${BUCKET_ID}`));
  console.log(
    dim(
      '\nThen create a team "counselors" in the console for staff access to applications.\n',
    ),
  );
}

main().catch((err) => {
  console.error(`\n\x1b[31mProvisioning failed:\x1b[0m ${err.message}`);
  if (err instanceof AppwriteException) {
    console.error(dim(`  type: ${err.type}  code: ${err.code}`));
  }
  process.exit(1);
});
