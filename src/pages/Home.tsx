import { Hero } from "@/components/home/Hero";
import { TrustBand } from "@/components/home/TrustBand";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestSellers";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBand />
      <CategoryGrid />
      <FeaturedProducts />
      <BestSellers />
    </>
  );
}
