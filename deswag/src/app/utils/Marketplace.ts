import { createClient } from "././CreateSupabaseClient";

/** Active listings for Buy page */
export async function getActiveListings() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("item_forsale")
    .select(`
      id,
      created_at,
      eth_price,
      seller,
      foreign_id,
      user_items!inner (
        id,
        item_id,
        items_swag!inner (
          id, name, image_url, company_id
        )
      )
    `)
    .is("buyer", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Flatten for frontend
  return (data ?? []).map((row: any) => ({
    id: row.id,
    created_at: row.created_at,
    priceEth: row.eth_price as number,
    seller: row.seller as string,
    userItemId: row.user_items?.id as number,
    swagId: row.user_items?.items_swag?.id as number,
    name: row.user_items?.items_swag?.name as string,
    image: row.user_items?.items_swag?.image_url as string,
    companyId: row.user_items?.items_swag?.company_id as string | number | null,
  }));
}

/** Items the current user owns (for Sell page). 
 *  If an owned item is already listed, `listed=true`.
 */
export async function getOwnedItems(walletOrUserId: string) {
  const supabase = createClient();

  // All owned instances
  const { data: owned, error: e1 } = await supabase
    .from("user_items")
    .select(`
      id,
      item_id,
      created_at,
      items_swag (
        id, name, image_url, company_id
      )
    `)
    .eq("user_id", walletOrUserId);
  if (e1) throw e1;

  const userItemIds = (owned ?? []).map((o) => o.id);
  if (userItemIds.length === 0) {
    return [];
  }

  // Which of those are already listed & unsold
  const { data: active, error: e2 } = await supabase
    .from("item_forsale")
    .select("foreign_id")
    .in("foreign_id", userItemIds)
    .is("buyer", null);
  if (e2) throw e2;

  const listedSet = new Set((active ?? []).map((r: any) => r.foreign_id));

  return (owned ?? []).map((o: any) => ({
    userItemId: o.id as number,
    swagId: o.items_swag?.id as number,
    name: o.items_swag?.name as string,
    image: o.items_swag?.image_url as string,
    companyId: o.items_swag?.company_id as string | number | null,
    listed: listedSet.has(o.id),
  }));
}

/** Create a new listing for a specific owned item instance */
export async function createListing(opts: {
  userItemId: number;
  priceEth: number;
  seller: string; // wallet
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("item_forsale")
    .insert({
      foreign_id: opts.userItemId,
      eth_price: opts.priceEth,
      seller: opts.seller.toLowerCase(),
      buyer: null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data?.id as number;
}

/** Cancel a listing you own (optional) */
export async function cancelListing(listingId: number, seller: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("item_forsale")
    .delete()
    .eq("id", listingId)
    .eq("seller", seller.toLowerCase())
    .is("buyer", null);

  if (error) throw error;
}

/** Purchase flow (DB only; on-chain can come later) */
export async function purchaseListing(opts: {
  listingId: number;
  buyer: string; // wallet
}) {
  const supabase = createClient();

  // Fetch listing
  const { data: listing, error: e1 } = await supabase
    .from("item_forsale")
    .select("id, eth_price, seller, buyer")
    .eq("id", opts.listingId)
    .maybeSingle();
  if (e1) throw e1;
  if (!listing) throw new Error("Listing not found");
  if (listing.buyer) throw new Error("Already sold");

  // Mark as sold
  const { error: e2 } = await supabase
    .from("item_forsale")
    .update({ buyer: opts.buyer.toLowerCase() })
    .eq("id", opts.listingId);
  if (e2) throw e2;

  // Record order (optional)
  await supabase.from("marketplace_orders").insert({
    buyer: opts.buyer.toLowerCase(),
    seller: listing.seller,
    price: listing.eth_price,
    listing_id: listing.id, // if you add this column
  });

  return { priceEth: listing.eth_price as number, seller: listing.seller as string };
}
