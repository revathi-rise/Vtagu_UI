'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Moving the ssr: false logic into a Client Component to satisfy Next.js rules
const BackgroundVideo = dynamic(() => import('./BackgroundVideo'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#0B0A10]" />
});

interface DynamicBackgroundVideoProps {
  videoUrl: string;
  posterImage: string;
  posterAlt: string;
}

export default function DynamicBackgroundVideo(props: DynamicBackgroundVideoProps) {
  return <BackgroundVideo {...props} />;
}
