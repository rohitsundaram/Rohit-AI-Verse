import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Rohit's RAG system reduced our audit accuracy issues by 40%. His expertise in Watsonx and LangChain was instrumental in delivering a production-ready solution.",
      author: 'Sarah Chen',
      role: 'Head of Engineering',
      company: 'Enterprise Tech Corp',
      rating: 5,
    },
    {
      quote: "The multi-agent chatbot Rohit built handles 60% of our patient interactions autonomously. The ROI has been incredible, and implementation was seamless.",
      author: 'Dr. Michael Rodriguez',
      role: 'CTO',
      company: 'Dental SaaS Platform',
      rating: 5,
    },
    {
      quote: "Working with Rohit on OpenVINO optimization was a game-changer. We achieved p50 latency under 1.5s with 99.9% uptime. Highly recommend his expertise.",
      author: 'Alex Thompson',
      role: 'Product Lead',
      company: 'AI Startup Accelerator',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Testimonials</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            What clients say about working together
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full hover:shadow-lg transition-all duration-300 relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
