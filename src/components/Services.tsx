import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MessageSquare, Database, Zap, Cloud } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: MessageSquare,
      title: 'Conversational AI & Agents',
      description: 'I build intelligent chatbots and multi-agent systems that can handle customer queries, automate tasks, and make decisions autonomously. Whether you need a customer support bot or a complex multi-agent workflow, I can create it using CrewAI and LangChain.',
      features: ['Multi-Agent Systems', 'Context-Aware Responses', 'Task Automation'],
    },
    {
      icon: Database,
      title: 'RAG Systems & Vector DBs',
      description: 'I develop custom RAG (Retrieval-Augmented Generation) systems that let your AI access and use your own documents and data. Perfect for building knowledge bases, document Q&A systems, or AI assistants that know your business. I use PGVector, LlamaIndex, and semantic search to make it work seamlessly.',
      features: ['Semantic Search', 'Document Processing', 'Knowledge Graphs'],
    },
    {
      icon: Zap,
      title: 'Inference Optimization',
      description: 'I optimize your AI models to run faster and cheaper without losing accuracy. Using OpenVINO and other optimization techniques, I can reduce your inference costs and latency, making your AI applications more efficient and cost-effective.',
      features: ['Model Quantization', 'Hardware Acceleration', 'Performance Tuning'],
    },
    {
      icon: Cloud,
      title: 'Deployments & DevOps',
      description: 'I take your AI projects from prototype to production with reliable, scalable deployments. I set up Docker containers, CI/CD pipelines, and cloud infrastructure (AWS ECS, etc.) so your AI systems run smoothly with high uptime and can grow with your business.',
      features: ['Container Orchestration', 'Auto-scaling', 'Monitoring & Observability'],
    },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's build your AI solution together - from concept to production
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group">
                <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
