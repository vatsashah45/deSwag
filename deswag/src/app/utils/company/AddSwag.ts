import { createClient } from "../CreateSupabaseClient";

/**
 * Create or update a swag item for a company.
 * If you want to UPDATE price on duplicate pair, use the upsert version below.
 */
export async function addCompanySwag(
  company: string,
  name: string,
  quantity: number,
  image?: string
) {
  const supabase = createClient();
  const row = { company, name, quantity, ...(image ? { image } : {}) };

  const { data, error } = await supabase
    .from("items_swag")
    .insert([row])
    .select("id, company, name, quantity, image, created_at")
    .single();

  if (error) {
    console.error("Error adding company swag:", error);
    throw error;
  }
  return data;
}

/** Fetch all items for a company */
export async function getCompanySwag(company: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("items_swag")
    .select("id, company, name, quantity, image, created_at")
    .eq("company", company)
    .order("created_at", { ascending: false });

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
    .from("items_swag")
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
    .from("items_swag")
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
