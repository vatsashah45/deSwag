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

      <main className="mx-auto max-w-7xl px-4 pb-20">
        {/* tabs */}
        <section className="mt-6 md:mt-8">
          <TabNav tab={tab} onChange={setTab} />
        </section>

        {/* headings */}
        <section className="text-center mt-8">
          {tab === "get-started" && (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Get Started</h1>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                Enter your NFC code to connect or create your wallet
              </p>
            </>
          )}
          {tab === "buy" && (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Marketplace — Buy</h1>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                Discover and purchase exclusive items from event participants
              </p>
            </>
          )}
          {tab === "sell" && (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Marketplace — Sell</h1>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                List your swag NFTs for sale with one click
              </p>
            </>
          )}
          {tab === "admin" && (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Admin Dashboard</h1>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                Create items, set supply caps, and track claims
              </p>
            </>
          )}
        </section>

        {/* content sections */}
        <section className="mt-8">
          {tab === "get-started" && (
            <div className="flex justify-center">
              <GetStartedForm />
            </div>
          )}

          {tab === "buy" && <MarketplaceBuy />}

          {tab === "sell" && <MarketplaceSell />}

          {tab === "admin" && <AdminPanel />}
        </section>
      </main>
    </Providers>
  );
}
