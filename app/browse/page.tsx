import React from 'react';
import ProfileSelector from './components/ProfileSelector';

export const metadata = {
  title: "Who's watching? - PrimeTime",
  description: "Select your PrimeTime profile to continue streaming.",
};

export default function BrowsePage() {
  return <ProfileSelector />;
}
