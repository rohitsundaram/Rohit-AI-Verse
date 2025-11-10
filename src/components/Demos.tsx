import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Workflow, ExternalLink, Play } from 'lucide-react';

const Demos = () => {
  const demos = [
    {
      title: 'RAG Chatbot Demo',
      type: 'RAG System',
      description: 'Interactive demo of a RAG-powered chatbot that answers questions from your documents. See how semantic search and retrieval-augmented generation work in practice.',
      features: [
        'Upload and process documents',
        'Ask questions in natural language',
        'Get answers with source citations',
        'See how vector search works',
      ],
      tech: ['LangChain', 'PGVector', 'OpenAI', 'FastAPI'],
      demoUrl: 'https://github.com/rohitsundaram/Agentic-RAG-with-OpenWebUI',
      videoUrl: '#',
      status: null,
      icon: MessageSquare,
      gradient: 'from-blue-500 to-cyan-500',
      projectName: 'Agentic-RAG with OpenWebUI',
    },
    {
      title: 'Workflow Automation Demo',
      type: 'Multi-Agent System',
      description: 'Watch how a multi-agent AI system automates complex workflows, handles tasks autonomously, and coordinates between different agents.',
      features: [
        'Multi-agent orchestration',
        'Task automation and routing',
        'Context-aware decision making',
        'Real-time workflow visualization',
      ],
      tech: ['CrewAI', 'LangChain', 'OpenAI', 'Task Queue'],
      demoUrl: 'https://github.com/rohitsundaram/Dental-SaaS-Chatbot',
      videoUrl: '#',
      status: null,
      icon: Workflow,
      gradient: 'from-purple-500 to-pink-500',
      projectName: 'Dental SaaS Chatbot',
    },
  ];

  return (
    <section id="demos" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Live Demos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See AI systems in action. Try interactive demos or watch video walkthroughs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {demos.map((demo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <demo.icon className="w-8 h-8 text-white" />
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold">{demo.title}</h3>
                  <Badge variant="secondary">{demo.type}</Badge>
                </div>

                <p className="text-muted-foreground mb-6">{demo.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-primary">Features:</h4>
                  <ul className="space-y-2">
                    {demo.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-primary">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-2">
                    {demo.tech.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Project:</span> {demo.projectName}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      if (demo.demoUrl && demo.demoUrl !== '#') {
                        window.open(demo.demoUrl, '_blank');
                      } else {
                        window.open('https://calendly.com/rohitsundaram-95/30min', '_blank');
                      }
                    }}
                    className="flex-1 gradient-primary text-primary-foreground"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (demo.videoUrl && demo.videoUrl !== '#') {
                        window.open(demo.videoUrl, '_blank');
                      }
                    }}
                    disabled={demo.videoUrl === '#'}
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                {demo.status && (
                  <p className="text-xs text-muted-foreground mt-4 text-center italic">
                    {demo.status}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 inline-block">
            <p className="text-muted-foreground mb-4">
              Want to see a custom demo for your use case?
            </p>
            <Button
              size="lg"
              onClick={() => window.open('https://calendly.com/rohitsundaram-95/30min', '_blank')}
              className="gradient-primary text-primary-foreground"
            >
              Schedule a Demo Call
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Demos;

