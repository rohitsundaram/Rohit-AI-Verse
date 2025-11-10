import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Download, Zap, Database, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const { toast } = useToast();

  const tiers = [
    {
      name: 'Chatbot',
      icon: Zap,
      description: 'Perfect for customer support and basic automation',
      price: 'Starting at $2,500',
      features: [
        'Custom conversational AI chatbot',
        'Integration with your platform (web, WhatsApp, etc.)',
        'Basic knowledge base setup',
        'Multi-language support',
        'Analytics dashboard',
        '2 weeks implementation',
        '1 month support included',
      ],
      bestFor: 'Small businesses, startups, customer support teams',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'RAG System',
      icon: Database,
      description: 'Advanced document Q&A and knowledge retrieval',
      price: 'Starting at $5,000',
      features: [
        'Everything in Chatbot tier',
        'Custom RAG architecture',
        'Vector database setup (PGVector)',
        'Document processing pipeline',
        'Semantic search capabilities',
        'Source citation and references',
        'Custom embeddings optimization',
        '4-6 weeks implementation',
        '2 months support included',
      ],
      bestFor: 'Companies with large document repositories, legal/healthcare',
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      name: 'Full Optimization',
      icon: Rocket,
      description: 'Complete AI system with optimization and scaling',
      price: 'Starting at $10,000',
      features: [
        'Everything in RAG System tier',
        'Model optimization (OpenVINO, quantization)',
        'Multi-agent orchestration (CrewAI)',
        'Workflow automation',
        'Performance tuning (latency, cost)',
        'Scalable cloud deployment (AWS ECS)',
        'CI/CD pipeline setup',
        'Monitoring and observability',
        '6-8 weeks implementation',
        '3 months support included',
      ],
      bestFor: 'Enterprise clients, high-traffic applications, production systems',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const addOns = [
    {
      name: 'Additional Support',
      price: '$500/month',
      description: 'Extended support and maintenance',
    },
    {
      name: 'Custom Integrations',
      price: 'Custom',
      description: 'Integrate with your existing tools and systems',
    },
    {
      name: 'Training & Documentation',
      price: '$1,000',
      description: 'Team training and comprehensive documentation',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Pricing & Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing for every stage of your AI journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {tier.popular && (
                <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 gradient-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <Card
                className={`p-8 h-full hover:shadow-xl transition-all duration-300 ${
                  tier.popular ? 'border-2 border-primary shadow-lg' : ''
                }`}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center mb-6`}>
                  <tier.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{tier.description}</p>
                <div className="text-3xl font-bold mb-6 text-primary">{tier.price}</div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-muted-foreground mb-6 italic">
                  Best for: {tier.bestFor}
                </p>

                <Button
                  onClick={() => window.open('https://calendly.com/rohitsundaram-95/30min', '_blank')}
                  className={`w-full ${
                    tier.popular
                      ? 'gradient-primary text-primary-foreground'
                      : 'variant-outline'
                  }`}
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Add-Ons</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="p-6 text-center">
                <h4 className="font-semibold mb-2">{addon.name}</h4>
                <p className="text-primary font-bold mb-2">{addon.price}</p>
                <p className="text-sm text-muted-foreground">{addon.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Download PDF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 inline-block">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-left">
                <h3 className="font-bold text-lg mb-2">Download Full Pricing Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed pricing, service descriptions, and implementation timelines
                </p>
              </div>
              <Button
                onClick={async () => {
                  try {
                    // Try to fetch the PDF
                    const response = await fetch('/pricing-guide.pdf');
                    if (response.ok) {
                      // Get the blob and create a download link
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'pricing-guide.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } else {
                      // PDF doesn't exist
                      toast({
                        title: 'PDF Coming Soon',
                        description: 'The pricing guide PDF is being prepared. Schedule a call to discuss pricing and receive it directly.',
                        action: (
                          <Button
                            size="sm"
                            onClick={() => window.open('https://calendly.com/rohitsundaram-95/30min', '_blank')}
                            className="gradient-primary text-primary-foreground"
                          >
                            Schedule Call
                          </Button>
                        ),
                      });
                    }
                  } catch (error) {
                    // PDF doesn't exist
                    toast({
                      title: 'PDF Coming Soon',
                      description: 'The pricing guide PDF is being prepared. Schedule a call to discuss pricing and receive it directly.',
                      action: (
                        <Button
                          size="sm"
                          onClick={() => window.open('https://calendly.com/rohitsundaram-95/30min', '_blank')}
                          className="gradient-primary text-primary-foreground"
                        >
                          Schedule Call
                        </Button>
                      ),
                    });
                  }
                }}
                className="gradient-primary text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            All projects include a free 15-minute strategy call to discuss your needs
          </p>
          <Button
            size="lg"
            onClick={() => window.open('https://calendly.com/rohitsundaram-95/30min', '_blank')}
            className="gradient-primary text-primary-foreground text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
          >
            Book Your Free Strategy Call
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

