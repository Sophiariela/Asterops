import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LunaSection from '../components/LunaSection';
import Ecosystem from '../components/Ecosystem';
import Segments from '../components/Segments';
import Pricing from '../components/Pricing';
import Faq from '../components/Faq';
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
        <LunaSection onCta={openCta} />
        <Ecosystem onCta={openCta} />
        <Segments onCta={openCta} />
        <Pricing onCta={openCta} />
        <Faq />
        <FinalCta onCta={openCta} />
      </main>
      <Footer />
    </div>
  );
}
