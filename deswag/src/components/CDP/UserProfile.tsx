import { useCurrentUser, useEvmAddress } from "@coinbase/cdp-hooks";

export default function UserProfile() {
  const { currentUser  } = useCurrentUser();
  const { evmAddress: primaryAddress } = useEvmAddress();

  if (!currentUser ) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {currentUser .userId}</p>
      <p>Primary Address: {primaryAddress}</p>
      <p>All Accounts: {currentUser?.evmAccounts?.join(", ")}</p>
    </div>
  );
}