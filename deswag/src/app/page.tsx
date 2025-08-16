"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import TabNav from "@/components/TabNav";
import GetStartedForm from "@/components/GetStartedForm";
import MarketplaceBuy from "@/components/MarketplaceBuy";
import MarketplaceSell from "@/components/MarketplaceSell";
import AdminPanel from "@/components/AdminPanel";
import Providers from "@/components/CDP/Providers";

export type TabKey = "get-started" | "buy" | "sell" | "admin";

export default function Home() {
  const [tab, setTab] = useState<TabKey>("get-started");

  return (
    <Providers>
      <Navbar />

      <main className="container-app pb-20">
        <section className="mt-8"><TabNav tab={tab} onChange={setTab} /></section>

        <section className="text-center mt-10 md:mt-12">
          <h1 className="heading text-3xl md:text-5xl font-extrabold">
            {tab === "get-started" && "Get Started"}
            {tab === "buy" && "Marketplace — Buy"}
            {tab === "sell" && "Marketplace — Sell"}
            {tab === "admin" && "Admin Dashboard"}
          </h1>
          <p className="mt-3 subtle max-w-2xl mx-auto">
            {tab === "get-started" && "Enter your NFC code to connect or create your wallet"}
            {tab === "buy" && "Discover and purchase exclusive event items"}
            {tab === "sell" && "List your swag NFTs with one click"}
            {tab === "admin" && "Create items, set caps, and track claims"}
          </p>
        </section>

        <section className="mt-10">
          {tab === "get-started" && <div className="flex justify-center"><GetStartedForm /></div>}
          {tab === "buy" && <MarketplaceBuy />}
          {tab === "sell" && <MarketplaceSell />}
          {tab === "admin" && <AdminPanel />}
        </section>
      </main>
    </Providers>
  );
}
