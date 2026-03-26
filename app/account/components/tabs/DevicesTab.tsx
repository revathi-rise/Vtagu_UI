import React from 'react';
import { Laptop, Monitor, Smartphone } from 'lucide-react';

export default function DevicesTab({ devices }: { devices: any[] }) {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'laptop': return <Laptop size={24} />;
      case 'tv': return <Monitor size={24} />;
      case 'mobile': return <Smartphone size={24} />;
      default: return <Smartphone size={24} />;
    }
  };

  return (
    <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h3 className="text-xl font-bold text-white tracking-wide">Active Devices</h3>
        <button className="text-[#b28cff] hover:text-white text-sm font-semibold transition-colors self-start sm:self-auto">
          Log out all devices
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device: any) => (
          <div key={device.id} className="bg-[#25183d]/50 hover:bg-[#25183d] transition-colors rounded-xl p-5 border border-white/5 flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
              device.statusColor === 'purple' 
                ? 'bg-white/5 border-white/10 text-gray-400 group-hover:text-white'
                : 'bg-[#b28cff]/10 border-[#b28cff]/20 text-[#b28cff] group-hover:bg-[#b28cff] group-hover:text-white'
            }`}>
              {renderIcon(device.type)}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm mb-1 truncate">{device.name}</p>
              <p className={`text-[10px] uppercase font-bold tracking-wider truncate ${
                device.statusColor === 'purple' ? 'text-[#9248FF]' : 'text-gray-400'
              }`}>
                {device.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
