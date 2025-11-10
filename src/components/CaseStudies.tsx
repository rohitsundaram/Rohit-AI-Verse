import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Users, Zap, FileText, Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CaseStudies = () => {
  const { toast } = useToast();

  const caseStudies = [
    {
      title: 'Resume Screener RAG System',
      client: 'HR Tech Startup',
      challenge: 'Manual resume screening was taking 4-6 hours per batch, causing delays in hiring and high recruiter burnout.',
      solution: 'Built a custom RAG system that processes resumes, extracts key information, and matches candidates to job requirements using semantic search.',
      results: [
        { metric: 'Time Saved', value: '70%', icon: Clock },
        { metric: 'Processing Speed', value: '5 min/batch', icon: Zap },
        { metric: 'Accuracy', value: '92%', icon: TrendingUp },
      ],
      tech: ['LangChain', 'PGVector', 'FastAPI', 'OpenAI Embeddings', 'Docker'],
      features: [
        'Automated resume parsing and extraction',
        'Semantic matching to job descriptions',
        'Ranked candidate recommendations',
        'Integration with existing ATS',
      ],
      pdfUrl: '/case-studies/resume-screener-rag.pdf',
      demoUrl: '#',
    },
    {
      title: 'Customer Support Workflow Automation',
      client: 'E-commerce Platform',
      challenge: 'Support team was overwhelmed with repetitive queries, leading to 24+ hour response times and customer dissatisfaction.',
      solution: 'Implemented a multi-agent AI system that handles common queries autonomously, routes complex issues, and provides instant responses.',
      results: [
        { metric: 'Response Time', value: '<30s', icon: Clock },
        { metric: 'Automation Rate', value: '75%', icon: TrendingUp },
        { metric: 'Customer Satisfaction', value: '+40%', icon: Users },
      ],
      tech: ['CrewAI', 'LangChain', 'OpenAI GPT-4', 'Vector DB', 'Webhook Integration'],
      features: [
        'Multi-agent orchestration for complex workflows',
        'Context-aware conversation handling',
        'Automatic ticket routing and escalation',
        'Real-time analytics dashboard',
      ],
      pdfUrl: '/case-studies/workflow-automation.pdf',
      demoUrl: '#',
    },
    {
      title: 'Document Q&A RAG System',
      client: 'Legal Tech Firm',
      challenge: 'Lawyers spent hours searching through case files and legal documents to find relevant precedents and information.',
      solution: 'Developed a specialized RAG system that indexes legal documents, understands context, and provides accurate citations with source references.',
      results: [
        { metric: 'Search Time', value: '85% reduction', icon: Clock },
        { metric: 'Document Coverage', value: '10K+ docs', icon: FileText },
        { metric: 'Accuracy', value: '96%', icon: TrendingUp },
      ],
      tech: ['LlamaIndex', 'PGVector', 'Document Processing', 'Semantic Search', 'Citation Engine'],
      features: [
        'Intelligent document indexing',
        'Context-aware Q&A with citations',
        'Multi-document reasoning',
        'Secure access controls',
      ],
      pdfUrl: '/case-studies/document-qa-rag.pdf',
      demoUrl: '#',
    },
  ];

  return (
    <section id="case-studies" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Case Studies</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from real projects. See how AI transformed these businesses.
          </p>
        </motion.div>

        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 md:p-12 hover:shadow-xl transition-all duration-300">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-3xl font-bold">{study.title}</h3>
                      <Badge variant="secondary">{study.client}</Badge>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2 text-primary">Challenge</h4>
                        <p className="text-muted-foreground">{study.challenge}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-2 text-primary">Solution</h4>
                        <p className="text-muted-foreground">{study.solution}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-primary">Key Features</h4>
                        <ul className="space-y-2">
                          {study.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-primary">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {study.tech.map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Results */}
                  <div>
                    <h4 className="font-semibold text-2xl mb-6 text-primary">Results</h4>
                    <div className="space-y-4 mb-8">
                      {study.results.map((result, idx) => (
                        <div
                          key={idx}
                          className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <result.icon className="w-6 h-6 text-primary" />
                              <span className="font-medium">{result.metric}</span>
                            </div>
                            <span className="text-2xl font-bold text-primary">{result.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={async () => {
                          try {
                            // Try to fetch the PDF
                            const response = await fetch(study.pdfUrl);
                            if (response.ok) {
                              // Get the blob and create a download link
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `${study.title.replace(/\s+/g, '-')}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } else {
                              // PDF doesn't exist
                              toast({
                                title: 'PDF Coming Soon',
                                description: 'The PDF is being prepared. Schedule a call to discuss this case study and receive it directly.',
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
                              description: 'The PDF is being prepared. Schedule a call to discuss this case study and receive it directly.',
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
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        onClick={() => {
                          if (study.demoUrl && study.demoUrl !== '#') {
                            window.open(study.demoUrl, '_blank');
                          } else {
                            window.open('https://calendly.com/rohitsundaram-95/30min', '_blank');
                          }
                        }}
                        className="flex-1 gradient-primary text-primary-foreground"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {study.demoUrl && study.demoUrl !== '#' ? 'View Demo' : 'Schedule Demo'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={() => window.open('https://calendly.com/rohitsundaram-95/30min', '_blank')}
            className="gradient-primary text-primary-foreground text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
          >
            Discuss Your Project
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudies;

