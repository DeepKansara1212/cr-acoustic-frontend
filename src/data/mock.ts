export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  badge?: "New" | "Sale" | "Best Seller";
  stock: number;
};

export const categories: Category[] = [
  { id: "c1", name: "Amplifier", slug: "amplifier", icon: "AudioWaveform" },
  { id: "c2", name: "Microphone", slug: "microphone", icon: "Mic2" },
  { id: "c3", name: "Speaker", slug: "speaker", icon: "Speaker" },
  { id: "c4", name: "Mixer", slug: "mixer", icon: "SlidersHorizontal" },
  { id: "c5", name: "Horn", slug: "horn", icon: "Radio" },
  { id: "c6", name: "Crossover", slug: "crossover", icon: "GitBranch" },
  { id: "c7", name: "Megaphone", slug: "megaphone", icon: "Megaphone" },
  { id: "c8", name: "Conference System", slug: "conference-system", icon: "Users" },
  { id: "c9", name: "Line Array Loudspeaker", slug: "line-array", icon: "AlignVerticalJustifyCenter" },
  { id: "c10", name: "Stands", slug: "stands", icon: "MoveVertical" },
];

const brands = ["Ahuja", "StudioMaster", "DynaTech", "Yamaha", "Pioneer", "Sound Craft", "NX Audio"];

export const products: Product[] = [
  { id: "p1", name: "Ahuja SPA-1000 Power Amplifier", slug: "ahuja-spa-1000", shortDescription: "1000W RMS professional PA amplifier with DSP", price: 42999, comparePrice: 48999, category: "Amplifier", brand: "Ahuja", rating: 4.6, reviewCount: 128, badge: "Best Seller", stock: 14 },
  { id: "p2", name: "StudioMaster CX16 Condenser Mic", slug: "studiomaster-cx16", shortDescription: "Large-diaphragm studio condenser microphone", price: 8499, category: "Microphone", brand: "StudioMaster", rating: 4.8, reviewCount: 96, badge: "New", stock: 32 },
  { id: "p3", name: "DynaTech LA-212 Line Array", slug: "dynatech-la-212", shortDescription: "Dual 12-inch passive line array loudspeaker", price: 64999, category: "Line Array Loudspeaker", brand: "DynaTech", rating: 4.7, reviewCount: 54, stock: 8 },
  { id: "p4", name: "Yamaha MG16XU Mixing Console", slug: "yamaha-mg16xu", shortDescription: "16-channel analog mixer with SPX effects & USB", price: 38999, comparePrice: 43999, category: "Mixer", brand: "Yamaha", rating: 4.9, reviewCount: 210, badge: "Sale", stock: 6 },
  { id: "p5", name: "Pioneer HS-500 Studio Monitor", slug: "pioneer-hs-500", shortDescription: "Active nearfield studio reference speaker", price: 15999, category: "Speaker", brand: "Pioneer", rating: 4.5, reviewCount: 71, stock: 22 },
  { id: "p6", name: "Sound Craft QX-8 Crossover", slug: "soundcraft-qx-8", shortDescription: "3-way active crossover network processor", price: 11499, category: "Crossover", brand: "Sound Craft", rating: 4.3, reviewCount: 29, stock: 17 },
  { id: "p7", name: "NX Audio Horn HT-30", slug: "nx-audio-ht-30", shortDescription: "High-frequency compression horn driver", price: 6299, category: "Horn", brand: "NX Audio", rating: 4.4, reviewCount: 40, stock: 45 },
  { id: "p8", name: "Ahuja CS-980 Conference System", slug: "ahuja-cs-980", shortDescription: "8-delegate wired conference microphone system", price: 52999, category: "Conference System", brand: "Ahuja", rating: 4.7, reviewCount: 18, badge: "New", stock: 5 },
];

export const brandList = brands;
