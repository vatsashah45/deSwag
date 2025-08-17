# deSwag

Turning Freebies into Memories (and Markets)

deSwag is an NFC-powered swag marketplace built at ETHGlobal NYC 2025
It makes event freebies claimable via NFC, tradable on a marketplace, and collectible as on-chain assets.

---

## Features  
- **NFC Claiming** – Tap your badge to instantly claim swag  
- **Admin Dashboard** – Create items, set caps, track real-time claims  
- **Marketplace** –  
  - Didn’t like your swag? Sell it  
  - Missed out? Buy it  
  - Find old rare merch (even from past events)  
- **Public/Private Drops** – Control visibility of swag claims  
- **Live Analytics** – Real-time claims, unique claimers, inventory  

---

## Architecture & Tech Stack  

### Frontend  
- **Next.js 15 + React** – app UI  
- **TailwindCSS** – design system  
- **ShadCN/UI** – component styling  

### Backend   
- **Supabase** – stores swag items, claims, and marketplace listings  
- **WebSockets (Socket.io)** – real-time dashboard updates  

### Web3 & Payments  
- **Coinbase OnchainKit** – wallet onboarding and account abstraction 

### Storage & Metadata  
- **Walrus (Decentralized Blob Storage)** – all swag claim data and images are stored via Walrus testnet  
  - `NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space`  
  - `WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space`  

### Hosting & Infra  
- **Vercel**
