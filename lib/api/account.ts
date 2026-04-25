import { cookies } from 'next/headers';
import { API_BASE } from '../api-client';

export async function getAccountDetails() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userIdStr = cookieStore.get('userId')?.value;
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;

  if (token && userId) {
    try {
      // Fetch user profile
      const profileRes = await fetch(`${API_BASE}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        next: { revalidate: 0 }
      });
      const profileData = await profileRes.json();
      
      // Fetch active subscription
      const subRes = await fetch(`${API_BASE}/subscriptions/user/${userId}/active`, {
        headers: { 'Authorization': `Bearer ${token}` },
        next: { revalidate: 0 }
      });
      const subData = await subRes.json();

      // Fetch devices
      const deviceRes = await fetch(`${API_BASE}/user-devices/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        next: { revalidate: 0 }
      });
      const deviceData = await deviceRes.json();

      if (profileData?.status && profileData?.data) {
        const user = profileData.data;
        const sub = subData?.data;
        const devices = deviceData?.data || [];

        return {
          profile: {
            name: user.user_name || "User",
            email: user.email,
            avatarUrl: user.profile_picture || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
            badges: [user.plan ? `${user.plan} Member` : "Free Member"],
          },
          billing: {
            planName: sub?.planId ? `Plan ID: ${sub.planId}` : "No Active Plan",
            planDescription: "Manage your subscription plan",
            nextBillingDate: sub?.timestamp_to ? new Date(sub.timestamp_to).toLocaleDateString() : "N/A",
            amount: sub?.price_amount ? `${sub.currency} ${sub.price_amount}` : "Free",
            paymentMethod: {
              type: sub?.payment_method || "N/A",
              last4: "****",
              nameOnCard: user.user_name || "N/A",
              expiry: "N/A",
            }
          },
          devices: devices.map((d: any) => ({
            id: d.id,
            name: d.device_name || "Unknown Device",
            type: d.device_type || "unknown",
            status: d.is_active ? "Active Now" : "Inactive",
            statusColor: d.is_active ? "purple" : "gray"
          }))
        };
      }
    } catch (error) {
      console.error("Failed to fetch real account details:", error);
    }
  }

  // Fallback to mock if not logged in or fetch failed
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    profile: {
      name: "Alex Thompson",
      email: "alex.thompson@cinemamail.com",
      avatarUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
      badges: ["Premium Member", "Since 2022"],
    },
    billing: {
      planName: "Ultra 4K + HDR",
      planDescription: "Unlimited streaming on 4 screens",
      nextBillingDate: "Oct 12, 2024",
      amount: "$18.99/mo",
      paymentMethod: {
        type: "VISA",
        last4: "4242",
        nameOnCard: "Alex Thompson",
        expiry: "12/26",
      }
    },
    devices: [
      { id: 1, name: "MacBook Pro 16\"", type: "laptop", status: "Current Device", statusColor: "gray" },
      { id: 2, name: "Samsung QLED TV", type: "tv", status: "Active Now", statusColor: "purple" },
      { id: 3, name: "iPhone 15 Pro", type: "mobile", status: "3 hours ago", statusColor: "gray" },
    ]
  };
}
