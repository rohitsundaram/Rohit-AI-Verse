import { motion } from 'framer-motion';
import { Search, Pencil, Code, Rocket, TrendingUp } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      icon: Search,
      title: 'Discover',
      description: 'Deep dive into your business needs, technical requirements, and success metrics.',
    },
    {
      icon: Pencil,
      title: 'Design',
      description: 'Architect scalable AI solutions with the right tools and frameworks for your use case.',
    },
    {
      icon: Code,
      title: 'Build',
      description: 'Develop production-grade systems with testing, optimization, and best practices.',
    },
    {
      icon: Rocket,
      title: 'Deploy',
      description: 'Launch with containerized deployments, CI/CD pipelines, and monitoring setup.',
    },
    {
      icon: TrendingUp,
      title: 'Improve',
      description: 'Continuous optimization through performance monitoring and iterative enhancements.',
    },
  ];

  return (
    <section id="process" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Process</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A proven methodology for delivering AI excellence
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Icon Circle */}
                <div className="relative z-10 mx-auto w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>

                {/* Step Number */}
                <div className="mt-4 text-4xl font-bold text-primary/20">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
