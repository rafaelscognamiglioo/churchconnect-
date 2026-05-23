import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jqhjpgizzvddjnjtxmcx.supabase.co";
const SUPABASE_KEY = "sb_publishable_oARK1WgK8OQmnpsDwwYWPQ_0mkUN15l";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log("🔌 Testando conexão com Supabase...");

  // Tenta criar a tabela churches via RPC (se já existir, ignora)
  const { data, error } = await supabase
    .from("churches")
    .select("count")
    .limit(1);

  if (error) {
    if (error.code === "42P01") {
      console.log("⚠️  Tabelas ainda não criadas. Execute o schema.sql no Supabase Dashboard.");
      console.log("   → https://supabase.com/dashboard/project/jqhjpgizzvddjnjtxmcx/sql/new");
    } else {
      console.log("❌ Erro:", error.message);
    }
  } else {
    console.log("✅ Conexão OK! Banco de dados pronto.");
  }
}

testConnection();
