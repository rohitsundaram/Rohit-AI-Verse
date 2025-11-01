import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, Clock, Activity } from 'lucide-react';

const Work = () => {
  const projects = [
    {
      title: 'Agentic-RAG with OpenWebUI',
      description: 'End-to-end multi-agent RAG stack integrating Docling, CrewAI, Ollama, and OpenWebUI for intelligent document processing and retrieval.',
      tech: ['LlamaIndex', 'CrewAI', 'Ollama', 'PGVector', 'Docker', 'ECS Fargate'],
      metrics: [
        { icon: Activity, label: 'Uptime', value: '99.9%' },
        { icon: Clock, label: 'p50 Latency', value: '1.5s' },
        { icon: TrendingUp, label: 'Queries/Day', value: '10K+' },
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Health Companion (ARC)',
      description: 'Personalized AI health agent providing wellness insights via RAG reasoning, delivering context-aware health recommendations.',
      tech: ['LangChain', 'FastAPI', 'RAG', 'Embeddings', 'Vector Search'],
      metrics: [
        { icon: Activity, label: 'Users', value: '5K+' },
        { icon: Clock, label: 'Response Time', value: '<2s' },
        { icon: TrendingUp, label: 'Satisfaction', value: '95%' },
      ],
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Dental SaaS Chatbot',
      description: 'Conversational AI for dental CRM automating bookings, lead generation, and patient FAQs with 60% autonomous interaction handling.',
      tech: ['LangChain', 'FastAPI', 'Twilio', 'Llama-3', 'PGVector'],
      metrics: [
        { icon: Activity, label: 'Automation', value: '60%' },
        { icon: Clock, label: 'Avg. Handling', value: '45s' },
        { icon: TrendingUp, label: 'Lead Conv.', value: '35%' },
      ],
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <section id="work" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Work</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Production-grade AI systems delivering measurable business impact
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
                {/* Gradient Overlay */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient}`} />

                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2">
                        <metric.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                      </div>
                      <span className="font-semibold text-sm">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
