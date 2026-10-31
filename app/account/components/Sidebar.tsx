import React from "react";
import { User, CreditCard, Laptop, Shield, HelpCircle, LogOut } from "lucide-react";
import { removeToken, clearAuthSession } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    clearAuthSession();
    dispatch(setUser(null));
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "devices", label: "Devices", icon: Laptop },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "help", label: "Help Center", icon: HelpCircle },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
      {/* Nav Items - horizontal smooth scroll on mobile */}
      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all w-auto lg:w-full shrink-0 text-left whitespace-nowrap ${
                isActive 
                  ? "bg-gradient-to-r from-[#25183d] to-[#3a2260] text-[#cca8ff] shadow-sm border border-[#9248FF]/30" 
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[#cca8ff]" : "text-gray-400"} />
              {item.label}
            </button>
          );
        })}
        {/* Mobile-only compact logout in horizontal row */}
        <button 
          onClick={handleLogout}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      {/* Desktop Separator & Logout */}
      <div className="hidden lg:block h-px w-full bg-white/10 my-4" />

      <button 
        onClick={handleLogout}
        className="hidden lg:flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-auto"
      >
        <LogOut size={18} />
        Log Out
      </button>
    </aside>
  );
}
