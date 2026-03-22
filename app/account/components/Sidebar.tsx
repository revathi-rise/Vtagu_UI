import React from "react";
import { User, CreditCard, Laptop, Shield, HelpCircle } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "devices", label: "Devices", icon: Laptop },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
      {/* Nav Items */}
      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all w-full text-left whitespace-nowrap ${
                isActive 
                  ? "bg-[#25183d] text-[#b28cff] shadow-sm" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={20} className={isActive ? "text-[#b28cff]" : "text-gray-400"} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="hidden lg:block h-px w-full bg-white/10 my-4" />

      <button 
        onClick={() => setActiveTab("help")}
        className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all w-full text-left mt-2 lg:mt-0 ${
          activeTab === "help"
            ? "bg-[#25183d] text-[#b28cff] shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-[#25183d]"
        }`}
      >
        <HelpCircle size={20} className={activeTab === "help" ? "text-[#b28cff]" : "text-[#b28cff]"} />
        Help Center
      </button>
    </aside>
  );
}
