

import Header from "@/components/Header";
import HBanner from "@/components/HBanner";
import CategoryCounter from "@/components/CategoryCounter";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import BusinessLogoSlider from "@/components/BusinessLogoSlider";

export default function Home() {


  return (
    <div>
      <Header />
      <HBanner />
      <BusinessLogoSlider />
      <CategoryCounter />
      <Features />
      <Footer />
    </div>
  );
}

