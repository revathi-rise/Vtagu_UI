import React from "react";
import AccountDashboard from "./components/AccountDashboard";
import { getAccountDetails } from "../../lib/api/account";

export const metadata = {
  title: "Account Settings - PrimeTime",
};

export default async function AccountPage() {
  // Server-side fetching before passing to client UI
  const initialData = await getAccountDetails();

  return (
    <main className="min-h-screen bg-[#0f0a19] text-white pt-28 pb-20">
      <div className="tv-container mx-auto px-5 tablet:px-10 max-w-[1400px]">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <span className="text-[#9248FF] text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-2 block">
            Account Settings
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
            Manage Profile
          </h1>
        </div>

        {/* Pass fetched data to the client dashboard router */}
        <AccountDashboard initialData={initialData} />
      </div>
    </main>
  );
}
