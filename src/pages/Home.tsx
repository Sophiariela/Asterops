import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LisSection from '../components/LisSection';
import Ecosystem from '../components/Ecosystem';
import Segments from '../components/Segments';
import Cases from '../components/Cases';
import Pricing from '../components/Pricing';
import Faq from '../components/Faq';
import PromptSection from '../components/PromptSection';
import Footer from '../components/Footer';
import FinalCta from '../components/FinalCta';

export default function Home() {
  const navigate = useNavigate();
  const openCta = () => navigate('/plans');

  return (
    <div className="min-h-screen bg-white">
      <Navbar onCta={openCta} />
      <main>
        <Hero onCta={openCta} />
        <LisSection onCta={openCta} />
        <Ecosystem onCta={openCta} />
        <Segments onCta={openCta} />
        <Cases onCta={openCta} />
        <Pricing onCta={openCta} />
        <Faq />
        <PromptSection />
        <FinalCta onCta={openCta} />
      </main>
      <Footer />
    </div>
  );
}
