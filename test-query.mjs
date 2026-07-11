import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

async function test() {
  let query = supabase.from("teachers").select("*");
  query = query.contains("districts", ["Batticaloa"]);
  query = query.contains("mediums", ["English"]);
  
  const { data, error } = await query;
  console.log("Error:", error);
}

test();
