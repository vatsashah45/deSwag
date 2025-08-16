import { createClient } from "../CreateSupabaseClient";

/**
 * Add an item to a user's owned items.
 */
export async function addUserItem(user_id: string, item_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_items")
    .insert([{ user_id, item_id }])
    .select();

  if (error) {
    console.error("Error adding user item:", error);
    throw error;
  }

  return data;
}

/**
 * Upsert a user-owned item (requires UNIQUE(user_id, item_id)).
 * If the pair exists, this is a no-op; otherwise it inserts.
 */
export async function upsertUserItem(user_id: string, item_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_items")
    .upsert({ user_id, item_id }, { onConflict: "user_id,item_id" })
    .select();

  if (error) {
    console.error("Error upserting user item:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch all items owned by a user.
 */
export async function getUserItems(user_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_items")
    .select("id, user_id, item_id, created_at")
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching user items:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch a specific user-owned item by item_id.
 */
export async function getUserItemByItem(user_id: string, item_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_items")
    .select("id, user_id, item_id, created_at")
    .eq("user_id", user_id)
    .eq("item_id", item_id)
    .single();

  if (error) {
    console.error("Error fetching user item:", error);
    throw error;
  }

  return data;
}

/**
 * (Optional) Remove a user-owned item.
 */
export async function deleteUserItem(user_id: string, item_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_items")
    .delete()
    .eq("user_id", user_id)
    .eq("item_id", item_id)
    .select();

  if (error) {
    console.error("Error deleting user item:", error);
    throw error;
  }

  return data;
}

/**
 * (Optional) Fetch user-owned items with related details (if FKs are set in Supabase).
 * Adjust selected fields to match your items_swag / kvps columns.
 */
export async function getUserItemsWithDetails(user_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_items")
    .select(`
      id,
      created_at,
      item:items_swag (
        id,
        name,
        image_url
      ),
      user:kvps (
        id,
        wallet_address,
        nfc_code
      )
    `)
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching user items with details:", error);
    throw error;
  }

  return data;
}

export async function userOwnsItem(user_id: string, item_id: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_items")
    .select("id")
    .eq("user_id", user_id)
    .eq("item_id", item_id)
    .maybeSingle();

  if (error) {
    console.error("Error checking if user owns item:", error);
    throw error;
  }

  return !!data; 
}