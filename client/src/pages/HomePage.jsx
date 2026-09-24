import Hero from '../components/home/Hero';
import BentoGrid from '../components/home/BentoGrid';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
  return (
    <div className="bg-[#0A0D14]">
      <Hero />
      <BentoGrid />
      <CTASection />
    </div>
  );
}
