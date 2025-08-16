import { createClient } from "./CreateSupabaseClient";

const supabase = createClient();


//once <connect nfc to wallet address> is clicked, it saves to db
export async function saveWalletNfc(wallet_address: string, nfc_hash: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("kvps")
    .insert([{ wallet_address, nfc_hash }])
    .select();

  if (error) {
    console.error("Error inserting wallet/NFC:", error);
    throw error;
  }

  return data;
}

export async function getWalletByNfc(nfc_hash: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("kvps")
    .select("wallet_address")
    .eq("nfc_hash", nfc_hash)
    .single();

  if (error) {
    console.error("Error fetching wallet:", error);
    throw error;
  }

  return data?.wallet_address;
}

export async function getNfcByWallet(wallet_address: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("kvps")
    .select("nfc_hash")
    .eq("wallet_address", wallet_address)
    .single();

  if (error) {
    console.error("Error fetching NFC:", error);
    throw error;
  }

  return data?.nfc_hash;
}

