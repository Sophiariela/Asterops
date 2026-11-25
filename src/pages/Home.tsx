import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import LunaSection from '../components/LunaSection';
import Ecosystem from '../components/Ecosystem';
import Segments from '../components/Segments';
import Pricing from '../components/Pricing';
import Faq from '../components/Faq';
import Footer from '../components/Footer';
import { OrganizationJsonLd, WebSiteJsonLd } from '../components/JsonLd';
import { usePageMeta } from '../lib/meta';
import { ROUTE_META } from '../config/route-meta';
import FinalCta from '../components/FinalCta';

export default function Home() {
  const navigate = useNavigate();
  const openCta = () => navigate('/plans');

  usePageMeta(ROUTE_META.home);

  return (
    <div className="min-h-screen bg-white">
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <Navbar onCta={openCta} />
      <main>
        <Hero onCta={openCta} />
        <Portfolio />
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
