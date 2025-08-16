import { createClient } from "../CreateSupabaseClient";

const supabase = createClient();

/**
 * Create an item listing for sale.
 */
export async function createItemForSale(item_id: string, price: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("item_forsale")
    .insert([{ item_id, price }])
    .select();

  if (error) {
    console.error("Error creating item for sale:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch all items for sale.
 */
export async function getItemsForSale() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("item_forsale")
    .select("id, price, item_id, created_at");

  if (error) {
    console.error("Error fetching items for sale:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch a specific item for sale by item_id.
 */
export async function getItemForSaleByItemId(item_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("item_forsale")
    .select("id, price, item_id, created_at")
    .eq("item_id", item_id)
    .single();

  if (error) {
    console.error("Error fetching item for sale:", error);
    throw error;
  }

  return data;
}
