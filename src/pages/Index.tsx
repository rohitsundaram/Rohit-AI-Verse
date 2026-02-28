import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustedTools from '@/components/TrustedTools';
import About from '@/components/About';
import Demos from '@/components/Demos';
import Work from '@/components/Work';
import CaseStudies from '@/components/CaseStudies';
import Process from '@/components/Process';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustedTools />
        <About />
        <Demos />
        <Work />
        <CaseStudies />
        <Process />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
