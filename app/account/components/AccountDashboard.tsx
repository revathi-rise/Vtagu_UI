"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileTab from "./tabs/ProfileTab";
import BillingTab from "./tabs/BillingTab";
import DevicesTab from "./tabs/DevicesTab";
import PrivacyTab from "./tabs/PrivacyTab";
import HelpCenterTab from "./tabs/HelpCenterTab";

export default function AccountDashboard({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile": return <ProfileTab profile={initialData.profile} />;
      case "billing": return <BillingTab billing={initialData.billing} />;
      case "devices": return <DevicesTab devices={initialData.devices} />;
      case "privacy": return <PrivacyTab />;
      case "help": return <HelpCenterTab />;
      default: return <ProfileTab profile={initialData.profile} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0 pb-20">
         {renderTab()}
      </div>
    </div>
  );
}
