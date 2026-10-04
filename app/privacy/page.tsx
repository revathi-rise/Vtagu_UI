import { Metadata } from 'next';
import PrivacyPolicyClient from '../privacy-policy/PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | VtagU Prime Time',
  description: 'Official Privacy Policy for VtagU Prime Time streaming application and website (www.vtagu.in). Compliant with DPDP Act 2023 & IT Rules 2021 India.',
  alternates: {
    canonical: 'https://www.vtagu.in/privacy-policy',
  },
};

export default function PrivacyPage() {
  return <PrivacyPolicyClient />;
}
