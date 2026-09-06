import React, { useState, useEffect } from 'react';
import { Laptop, Monitor, Smartphone, LogOut, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { devicesApi, getOrCreateDeviceId } from '@/lib/api/devices.api';
import { getUserId } from '@/lib/api-client';
import { useAlert } from '@/components/shared/CustomAlertModal';

export default function DevicesTab({ devices: initialDevices }: { devices: any[] }) {
  const [deviceList, setDeviceList] = useState<any[]>(initialDevices || []);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isLoggingOutOthers, setIsLoggingOutOthers] = useState(false);
  const { showAlert } = useAlert();

  const fetchAndRegisterDevices = async () => {
    const userIdStr = getUserId();
    if (!userIdStr) return;
    const userId = parseInt(userIdStr, 10);
    const currentDeviceId = getOrCreateDeviceId();

    setIsLoadingDevices(true);
    try {
      // 1. Auto-register / update current browser device
      await devicesApi.registerCurrentDevice(userId);

      // 2. Fetch active devices for user
      const res = await devicesApi.getActive(userId);
      const devices = res?.data || [];

      // 3. Map devices and flag current browser session
      const mapped = devices.map((d: any) => {
        const isCurrent = d.device_id === currentDeviceId;
        return {
          id: d.id,
          device_id: d.device_id,
          name: d.device_name || `${d.os || 'Browser'} Device`,
          type: d.device_type || 'desktop',
          os: d.os,
          ip_address: d.ip_address,
          status: isCurrent ? 'Current Device' : (d.is_active ? 'Active' : 'Inactive'),
          isCurrent,
        };
      });

      setDeviceList(mapped);
    } catch (err) {
      console.error('Error fetching or registering devices:', err);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    fetchAndRegisterDevices();
  }, []);

  const renderIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'laptop':
      case 'desktop': return <Laptop size={24} />;
      case 'tv': return <Monitor size={24} />;
      case 'mobile':
      case 'tablet': return <Smartphone size={24} />;
      default: return <Smartphone size={24} />;
    }
  };

  const handleDeactivate = async (id: number) => {
    setLoadingId(id);
    try {
      const res = await devicesApi.deactivate(id);
      if (res.status) {
        setDeviceList(prev => prev.filter(d => d.id !== id));
        showAlert({ title: "Device Logged Out", message: "Device session deactivated successfully.", type: "success" });
      } else {
        showAlert({ title: "Action Failed", message: res.message || "Failed to log out device.", type: "error" });
      }
    } catch (err) {
      showAlert({ title: "Error", message: "An error occurred while logging out device.", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogoutOthers = async () => {
    const userIdStr = getUserId();
    if (!userIdStr) return;
    const userId = parseInt(userIdStr, 10);
    const currentDeviceId = getOrCreateDeviceId();

    setIsLoggingOutOthers(true);
    try {
      const res = await devicesApi.logoutOthers(userId, currentDeviceId);
      if (res.status) {
        setDeviceList(prev => prev.filter(d => d.isCurrent));
        showAlert({ title: "Devices Logged Out", message: "Logged out of all other device sessions.", type: "success" });
      } else {
        showAlert({ title: "Action Failed", message: res.message || "Failed to log out other devices.", type: "error" });
      }
    } catch (err) {
      showAlert({ title: "Error", message: "An error occurred while logging out other devices.", type: "error" });
    } finally {
      setIsLoggingOutOthers(false);
    }
  };

  return (
    <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">Active Devices</h3>
          <p className="text-xs text-white/50 mt-1">Manage active device sessions linked to your subscription account.</p>
        </div>
        {deviceList.length > 1 && (
          <button 
            onClick={handleLogoutOthers}
            disabled={isLoggingOutOthers}
            className="text-[#b28cff] hover:text-white text-sm font-semibold transition-colors self-start sm:self-auto flex items-center gap-2 bg-[#b28cff]/10 hover:bg-[#b28cff]/20 px-4 py-2 rounded-xl border border-[#b28cff]/30 disabled:opacity-50"
          >
            {isLoggingOutOthers ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            <span>Log out all other devices</span>
          </button>
        )}
      </div>

      {deviceList.length === 0 ? (
        <div className="text-center py-12 text-white/40 font-medium text-sm">
          No active device sessions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {deviceList.map((device: any) => {
            const isCurrent = device.isCurrent || device.status?.toLowerCase().includes('current');
            return (
              <div key={device.id} className="bg-[#25183d]/50 hover:bg-[#25183d] transition-colors rounded-xl p-5 border border-white/5 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                    isCurrent 
                      ? 'bg-[#b28cff]/10 border-[#b28cff]/20 text-[#b28cff]'
                      : 'bg-white/5 border-white/10 text-gray-400 group-hover:text-white'
                  }`}>
                    {renderIcon(device.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm mb-1 truncate">{device.name}</p>
                    <p className={`text-[10px] uppercase font-bold tracking-wider truncate flex items-center gap-1 ${
                      isCurrent ? 'text-[#9248FF]' : 'text-gray-400'
                    }`}>
                      {isCurrent && <ShieldCheck size={12} />}
                      {device.status || (isCurrent ? 'Current Device' : 'Active')}
                    </p>
                  </div>
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => handleDeactivate(device.id)}
                    disabled={loadingId === device.id}
                    title="Log out device"
                    className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all border border-rose-500/20 hover:border-rose-500/40 shrink-0"
                  >
                    {loadingId === device.id ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
