import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | VtagU Prime Time',
  description: 'Official Privacy Policy for VtagU Prime Time streaming application and website (www.vtagu.in). Compliant with DPDP Act 2023 & IT Rules 2021 India.',
  keywords: [
    'VtagU Privacy Policy',
    'VtagU Prime Time',
    'DPDP Act 2023',
    'IT Rules 2021',
    'Data Protection India',
    'Interactive Movie Privacy',
    'Streaming Service Legal',
    'Maheshwaran P Grievance Officer'
  ],
  alternates: {
    canonical: 'https://www.vtagu.in/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | VtagU Prime Time',
    description: 'Official Privacy Policy for VtagU Prime Time application and website (www.vtagu.in). Compliant with Indian DPDP Act 2023.',
    url: 'https://www.vtagu.in/privacy-policy',
    siteName: 'VtagU Prime Time',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | VtagU Prime Time',
    description: 'Official Privacy Policy for VtagU Prime Time application and website (www.vtagu.in).',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
