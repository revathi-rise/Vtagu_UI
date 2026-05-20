import { redirect } from 'next/navigation';

interface RedirectProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LanguageRedirectPage({ params }: RedirectProps) {
  const { slug } = await params;
  redirect(`/languages/${slug}`);
}
