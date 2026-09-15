import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LisSection from './components/LisSection';
import Ecosystem from './components/Ecosystem';
import Segments from './components/Segments';
import Cases from './components/Cases';
import Pricing from './components/Pricing';
import Faq from './components/Faq';
import PromptSection from './components/PromptSection';
import Footer from './components/Footer';
import SignupModal from './components/SignupModal';
import FinalCta from './components/FinalCta';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openCta = () => setModalOpen(true);

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
      <SignupModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
