import SeriesHero from "./components/SeriesHero";
import ContinueWatchingRow from "./components/ContinueWatchingRow";
import Top10Series from "./components/Top10Series";
import CategoryRow from "../movies/components/CategoryRow";

const bingeWorthy = [
  { title: "The Last Dawn", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", image: "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=600&auto=format&fit=crop", description: "S2:E4 Just Added" },
  { title: "Horizon", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop", description: "Season 1 Streaming" },
  { title: "Cyber Rift", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", image: "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=600&auto=format&fit=crop", description: "New Episodes Weekly" },
  { title: "Nightfall Stream", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", image: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=600&auto=format&fit=crop", description: "Completed Series" },
  { title: "Solar Flares", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop", description: "Season Finales" },
  { title: "Neon Pulse", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop", description: "Binge Now" },
];

const animatedMasterpieces = [
  { title: "Stellar Void", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", image: "https://images.unsplash.com/photo-1535016120720-40c746a6580c?q=80&w=600&auto=format&fit=crop", description: "Adult Animation" },
  { title: "Cyber Rift - Origins", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop", description: "Anime Classic" },
  { title: "Quantum", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop", description: "New Miniseries" },
  { title: "Dark Matter", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", image: "https://images.unsplash.com/photo-1485282271306-3bc5562d98ef?q=80&w=600&auto=format&fit=crop", description: "S3 Returns" },
  { title: "Echoes of Time", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop", description: "Series Premiere" },
  { title: "The Silent Echo", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", image: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=600&auto=format&fit=crop", description: "Action Anime" },
];

export const metadata = {
  title: 'TV Shows - PrimeTime',
  description: 'Binge-watch the most gripping TV series, dramas, and comedies exclusively on PrimeTime.',
};

export default function ShowsPage() {
  return (
    <main className="min-h-screen bg-[#0f0a19] text-white overflow-x-hidden pb-12">
      <SeriesHero />
      <div className="-mt-32 relative z-20 space-y-4">
        <ContinueWatchingRow />
        <Top10Series />
        <CategoryRow title="Binge-Worthy TV Dramas" items={bingeWorthy} />
        <CategoryRow title="Animated Masterpieces" items={animatedMasterpieces} />
      </div>
    </main>
  );
}
