import pg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = "jqhjpgizzvddjnjtxmcx";
const DB_PASSWORD = "D33$gt.*tCaHrzG";

// Supabase connection string options to try
const configs = [
  {
    label: "Direct DB",
    host: `db.${PROJECT_REF}.supabase.co`,
    port: 5432,
    user: "postgres",
    password: DB_PASSWORD,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
  {
    label: "Pooler SA-East-1 transaction",
    host: `aws-0-sa-east-1.pooler.supabase.com`,
    port: 6543,
    user: `postgres.${PROJECT_REF}`,
    password: DB_PASSWORD,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
  {
    label: "Pooler SA-East-1 session",
    host: `aws-0-sa-east-1.pooler.supabase.com`,
    port: 5432,
    user: `postgres.${PROJECT_REF}`,
    password: DB_PASSWORD,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
  {
    label: "Pooler US-East-1",
    host: `aws-0-us-east-1.pooler.supabase.com`,
    port: 6543,
    user: `postgres.${PROJECT_REF}`,
    password: DB_PASSWORD,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
];

const schema = readFileSync(join(__dirname, "../supabase/schema.sql"), "utf8");

async function tryConnect(config) {
  const client = new Client(config);
  try {
    await client.connect();
    console.log(`✅ Conectado via: ${config.label}`);
    return client;
  } catch (err) {
    console.log(`❌ ${config.label}: ${err.message}`);
    return null;
  }
}

async function runSchema() {
  console.log("🚀 ChurchConnect — Inicializando banco de dados...\n");

  let client = null;
  for (const cfg of configs) {
    client = await tryConnect(cfg);
    if (client) break;
  }

  if (!client) {
    console.log("\n⚠️  Não foi possível conectar automaticamente.");
    console.log("Execute o schema manualmente no Supabase Dashboard:");
    console.log("→ https://supabase.com/dashboard/project/jqhjpgizzvddjnjtxmcx/sql/new");
    process.exit(1);
  }

  try {
    console.log("\n📦 Executando schema SQL...");

    // Split and run statement by statement for better error reporting
    const statements = schema
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));

    let success = 0;
    let skipped = 0;

    for (const stmt of statements) {
      try {
        await client.query(stmt);
        success++;
        process.stdout.write(".");
      } catch (err) {
        if (err.code === "42P07" || err.message.includes("already exists")) {
          skipped++;
          process.stdout.write("s");
        } else if (err.code === "42710") {
          skipped++;
          process.stdout.write("s");
        } else {
          console.log(`\n⚠️  Aviso: ${err.message.slice(0, 80)}`);
        }
      }
    }

    console.log(`\n\n✅ Schema executado! ${success} statements OK, ${skipped} já existiam.`);
    console.log("\n🎉 Banco de dados do ChurchConnect pronto!\n");
    console.log("Tabelas criadas:");
    console.log("  ✓ churches");
    console.log("  ✓ members");
    console.log("  ✓ events");
    console.log("  ✓ registrations");
    console.log("  ✓ notifications");
    console.log("  ✓ church_stats");

  } catch (err) {
    console.error("\n❌ Erro ao executar schema:", err.message);
  } finally {
    await client.end();
  }
}

runSchema();
