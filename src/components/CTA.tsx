import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative gradient-primary rounded-3xl p-12 md:p-16 overflow-hidden shadow-glow">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Let's Build Your Next AI Capability
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Ready to transform your business with cutting-edge GenAI solutions? Let's discuss how we can work together.
              </p>
              <Button
                size="lg"
                onClick={() => window.open('https://calendly.com/rohitsundaram-95/30min', '_blank')}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl"
              >
                Book a Free 15-min AI Strategy Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
