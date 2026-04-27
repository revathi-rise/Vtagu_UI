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
      const profileRes = await fetch(`${API_BASE}/users/get-profile/${userId}`, {
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
            id: user.userId,
            name: user.user_name || "User",
            email: user.email,
            avatarUrl: user.profile_picture || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
            badges: [user.plan || "Free Member"],
            age: user.age,
            gender: user.gender,
            mobile: user.mobile,
          },
          billing: {
            planName: sub?.planId ? `Plan ID: ${sub.planId}` : "No Active Plan",
            planDescription: user.plan || "Manage your subscription plan",
            nextBillingDate: sub?.timestamp_to ? new Date(sub.timestamp_to * 1000).toLocaleDateString() : "N/A",
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

  // Guest data if not logged in or fetch failed
  return {
    profile: {
      name: "Guest",
      email: "Sign in to access your profile",
      avatarUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
      badges: ["Guest Account"],
      isGuest: true
    },
    billing: {
      planName: "No Plan",
      planDescription: "Sign in to see your subscription",
      nextBillingDate: "N/A",
      amount: "N/A",
      paymentMethod: {
        type: "N/A",
        last4: "N/A",
        nameOnCard: "N/A",
        expiry: "N/A",
      }
    },
    devices: []
  };
}
