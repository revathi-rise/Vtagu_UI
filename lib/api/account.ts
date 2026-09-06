import { cookies } from 'next/headers';
import { API_BASE } from '../api-client';

export async function getAccountDetails() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userIdStr = cookieStore.get('userId')?.value;
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;

  if (userId) {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch user profile
      const profileRes = await fetch(`${API_BASE}/users/get-profile/${userId}`, {
        headers,
        next: { revalidate: 0 }
      });
      const profileData = await profileRes.json();
      
      // Fetch active subscription
      const subRes = await fetch(`${API_BASE}/subscriptions/user/${userId}/active`, {
        headers,
        next: { revalidate: 0 }
      });
      const subData = await subRes.json();

      // Fetch devices
      const deviceRes = await fetch(`${API_BASE}/user-devices/user/${userId}`, {
        headers,
        next: { revalidate: 0 }
      });
      const deviceData = await deviceRes.json();

      if (profileData?.status && profileData?.data) {
        const user = profileData.data;
        const sub = subData?.data;
        const activeSub = user.active_subscription || sub;
        const devices = deviceData?.data || [];

        const planName = activeSub?.planName || activeSub?.plan?.name || user.plan || (user.is_subscribed ? "Active Member" : "Free Member");
        const expiryTimestamp = activeSub?.timestamp_to;
        const nextBilling = expiryTimestamp ? new Date(expiryTimestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A";
        const amount = activeSub?.paid_amount !== undefined ? `INR ${activeSub.paid_amount}` : (user.plan_price ? `INR ${user.plan_price}` : "Free");

        return {
          profile: {
            id: user.userId,
            name: user.user_name || "User",
            email: user.email,
            avatarUrl: user.profile_picture || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
            badges: [planName],
            age: user.age,
            gender: user.gender,
            mobile: user.mobile,
            is_subscribed: user.is_subscribed,
            isGuest: false
          },
          billing: {
            planName: planName,
            planDescription: user.plan || (user.is_subscribed ? "Active Subscription Plan" : "Manage your subscription plan"),
            nextBillingDate: nextBilling,
            amount: amount,
            is_subscribed: user.is_subscribed,
            paymentMethod: {
              type: activeSub?.payment_method || "Online",
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
      planName: "No Active Plan",
      planDescription: "Sign in to see your subscription",
      nextBillingDate: "N/A",
      amount: "N/A",
      is_subscribed: false,
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
