export async function getAccountDetails() {
  // Simulate database/API delay
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
