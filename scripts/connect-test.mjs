import pg from "pg";
const { Client } = pg;

const PROJECT = "jqhjpgizzvddjnjtxmcx";
const PASS    = "D33$gt.*tCaHrzG";

const configs = [
  // Direct connection - various SSL modes
  { label: "Direct / SSL rejectUnauth:false",  host: `db.${PROJECT}.supabase.co`,                      port: 5432, user: "postgres",            password: PASS, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 20000 },
  { label: "Direct / SSL true",                host: `db.${PROJECT}.supabase.co`,                      port: 5432, user: "postgres",            password: PASS, database: "postgres", ssl: true, connectionTimeoutMillis: 20000 },
  { label: "Direct / no SSL",                  host: `db.${PROJECT}.supabase.co`,                      port: 5432, user: "postgres",            password: PASS, database: "postgres", connectionTimeoutMillis: 20000 },
  // Pooler SA-East-1 session mode (port 5432) — corrected format
  { label: "Pooler SA 5432 / postgres.ref",    host: `aws-0-sa-east-1.pooler.supabase.com`,            port: 5432, user: `postgres.${PROJECT}`, password: PASS, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 20000 },
  { label: "Pooler SA 6543 / postgres.ref",    host: `aws-0-sa-east-1.pooler.supabase.com`,            port: 6543, user: `postgres.${PROJECT}`, password: PASS, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 20000 },
  // IPv6 direct
  { label: "Direct IPv6 / no SSL",             host: `db.${PROJECT}.supabase.co`,                      port: 5432, user: "postgres",            password: PASS, database: "postgres", ssl: false, connectionTimeoutMillis: 20000 },
];

console.log("🔌 Testando conexões com Supabase...\n");

for (const cfg of configs) {
  const client = new Client(cfg);
  try {
    await client.connect();
    const r = await client.query("SELECT current_user, pg_postmaster_start_time()");
    console.log(`✅ SUCESSO: ${cfg.label}`);
    console.log(`   User: ${r.rows[0].current_user}`);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.log(`❌ ${cfg.label}`);
    console.log(`   ${err.message}`);
    try { await client.end(); } catch(_) {}
  }
}

console.log("\n❌ Todas as tentativas falharam.");
