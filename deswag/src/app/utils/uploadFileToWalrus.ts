// utils/walrus.ts
const PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space/v1/blobs";
const AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space/v1/blobs";

/**
 * Uploads arbitrary data to Walrus Publisher.
 * Accepts: string | Blob/File | ArrayBuffer | Uint8Array
 * Works in both browser and Node runtimes.
 */
export async function uploadBlob(
  data: string | Blob | ArrayBuffer | Uint8Array
) {
  let body: BodyInit;

  if (typeof data === "string") {
    body = data;
  } else if (data instanceof Blob) {
    // File extends Blob, so this covers both
    body = data; // fetch accepts Blob directly
  } else if (data instanceof Uint8Array) {
    body = data; // fetch accepts TypedArrays directly
  } else if (data instanceof ArrayBuffer) {
    body = data; // also valid
  } else {
    throw new Error("Unsupported data type for uploadBlob()");
  }

  const res = await fetch(PUBLISHER_URL, {
    method: "PUT",
    body,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
  }

  // publisher returns { blobId, ... }
  const blobInfo = await res.json();
  return blobInfo; // e.g. { blobId, ... }
}

/**
 * Fetches a blob by its ID from Walrus Aggregator.
 * Returns text by default; switch to arrayBuffer() for binary.
 */
export async function fetchBlob(blobId: string): Promise<Blob> {
  const res = await fetch(`${AGGREGATOR_URL}/${blobId}`);
  console.log(res)
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }
  return await res.blob(); // <-- binary Blob, works as image source
}