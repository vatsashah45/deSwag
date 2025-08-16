import { createClient } from "../CreateSupabaseClient";

/**
 * Create or update a swag item for a company.
 * If you want to UPDATE price on duplicate pair, use the upsert version below.
 */
export async function addCompanySwag(company_id: string, item_id: string, price: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_swag")
    .insert([{ company_id, item_id, price }])
    .select();

  if (error) {
    console.error("Error adding company swag:", error);
    throw error;
  }

  return data;
}

/**
 * Upsert version (updates price if the (company_id, item_id) pair already exists)
 */
export async function upsertCompanySwag(company_id: string, item_id: string, price: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_swag")
    .upsert({ company_id, item_id, price }, { onConflict: "company_id,item_id" })
    .select();

  if (error) {
    console.error("Error upserting company swag:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch all swag entries for a company.
 */
export async function getCompanySwag(company_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_swag")
    .select("id, company_id, item_id, price, created_at")
    .eq("company_id", company_id);

  if (error) {
    console.error("Error fetching company swag:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch one swag entry for a company by item_id.
 */
export async function getCompanySwagByItem(company_id: string, item_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_swag")
    .select("id, company_id, item_id, price, created_at")
    .eq("company_id", company_id)
    .eq("item_id", item_id)
    .single();

  if (error) {
    console.error("Error fetching company swag by item:", error);
    throw error;
  }

  return data;
}

/**
 * (Optional) Remove a swag entry for a company.
 */
export async function deleteCompanySwag(company_id: string, item_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_swag")
    .delete()
    .eq("company_id", company_id)
    .eq("item_id", item_id)
    .select();

  if (error) {
    console.error("Error deleting company swag:", error);
    throw error;
  }

  return data;
}
