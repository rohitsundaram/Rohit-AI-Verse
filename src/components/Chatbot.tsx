import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Calendar } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExpandedButton, setShowExpandedButton] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! How are you doing? I'm Virtual Rohit - here to help you learn about my services, projects, or schedule a meeting. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mblgnozn';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create a simple beep sound using Web Audio API
  const playPopSound = async () => {
    try {
      // Use existing audio context or create new one
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      // Try to resume if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Could not play beep sound:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Unlock audio on any user interaction
  useEffect(() => {
    const handleInteraction = async () => {
      // Create and resume audio context on first interaction
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      } catch (e) {
        // Ignore errors
      }
    };

    // Listen for any user interaction to unlock audio
    const events = ['click', 'touchstart', 'keydown', 'mousedown', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // Expand button with message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExpandedButton(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Play sound when button expands
  useEffect(() => {
    if (showExpandedButton) {
      // Small delay to sync with animation
      const soundTimer = setTimeout(() => {
        playPopSound();
      }, 100);
      return () => clearTimeout(soundTimer);
    }
  }, [showExpandedButton]);

  // Enhanced Knowledge base for projects from GitHub repositories
  const projects = [
    {
      name: 'Agentic-RAG with OpenWebUI',
      githubUrl: 'https://github.com/rohitsundaram/Agentic-RAG-with-OpenWebUI',
      description: 'End-to-end multi-agent RAG stack integrating Docling, CrewAI, Ollama, and OpenWebUI for intelligent document processing and retrieval.',
      detailedDescription: `A complete multi-agent RAG system built with:
• Docling for document processing
• CrewAI for multi-agent orchestration
• Ollama for local LLM inference
• OpenWebUI for user interface
• PGVector for vector storage and semantic search`,
      tech: 'LlamaIndex, CrewAI, Ollama, PGVector, Docker, ECS Fargate, Python',
      architecture: 'Multi-agent system with document processing pipeline, vector database for semantic search, and containerized deployment on AWS ECS Fargate',
      features: ['Document processing with Docling', 'Multi-agent orchestration with CrewAI', 'Local LLM inference with Ollama', 'Web UI with OpenWebUI', 'Vector search with PGVector', 'Docker containerization', 'AWS ECS deployment'],
      metrics: '99.9% uptime, 1.5s p50 latency, 10K+ queries/day',
      skills: ['Multi-agent systems', 'RAG architecture', 'Vector databases', 'Docker', 'AWS ECS', 'Document processing', 'Semantic search'],
    },
    {
      name: 'Dental SaaS Chatbot',
      githubUrl: 'https://github.com/rohitsundaram/Dental-SaaS-Chatbot',
      description: 'Complete full-stack dental chatbot application with Node.js/Express backend, Python/LangChain AI chatbot, and Next.js frontend.',
      detailedDescription: `A production-ready full-stack dental chatbot system featuring:
• Next.js frontend with chat interface and appointment booking
• Node.js/Express backend with JWT authentication
• Python/LangChain chatbot service with multi-provider LLM support
• Docker containerization for all services
• Comprehensive Docker Compose setup`,
      tech: 'Next.js, Node.js/Express, Python, LangChain, Docker, JWT, Multi-LLM support (OpenAI, Anthropic, Local models)',
      architecture: 'Three-tier architecture: Frontend (Next.js on port 3000) → Backend API Gateway (Node.js/Express on port 8000) → Chatbot Service (Python/LangChain on port 8001)',
      features: ['Chat interface for patient interactions', 'Appointment booking system', 'JWT-based user authentication', 'Multi-LLM provider support (OpenAI, Anthropic, Local)', 'Session management', 'Context-aware conversations', 'Rate limiting', 'Health checks', 'Full Docker deployment'],
      metrics: '60% automation, 45s avg handling, 35% lead conversion',
      skills: ['Full-stack development', 'Next.js', 'Node.js/Express', 'Python', 'LangChain', 'Docker', 'JWT authentication', 'API design', 'Multi-service architecture', 'LLM integration'],
    },
    {
      name: 'Health Companion (ARC) / Nutrilens AI',
      githubUrl: 'https://github.com/Ankit546/nutrilens-ai',
      description: 'Personalized AI health agent providing wellness insights via RAG reasoning, delivering context-aware health recommendations.',
      detailedDescription: `An AI-powered health companion that provides:
• Personalized health recommendations using RAG
• Wellness insights based on user data
• Context-aware responses using retrieval-augmented generation
• Health and nutrition guidance`,
      tech: 'LangChain, FastAPI, RAG, Embeddings, Vector Search, Python',
      architecture: 'RAG-based system with vector embeddings for semantic health data retrieval and personalized recommendations',
      features: ['RAG-powered health insights', 'Personalized recommendations', 'Context-aware responses', 'Wellness tracking', 'Nutrition guidance'],
      metrics: '5K+ users, <2s response time, 95% satisfaction',
      skills: ['RAG systems', 'FastAPI', 'Vector embeddings', 'Health AI', 'Semantic search', 'Personalization'],
    },
  ];

  // Knowledge base for services
  const services = [
    {
      name: 'Conversational AI & Agents',
      description: 'I build intelligent chatbots and multi-agent systems that can handle customer queries, automate tasks, and make decisions autonomously. Whether you need a customer support bot or a complex multi-agent workflow, I can create it using CrewAI and LangChain.',
      features: 'Multi-Agent Systems, Context-Aware Responses, Task Automation',
    },
    {
      name: 'RAG Systems & Vector DBs',
      description: 'I develop custom RAG (Retrieval-Augmented Generation) systems that let your AI access and use your own documents and data. Perfect for building knowledge bases, document Q&A systems, or AI assistants that know your business. I use PGVector, LlamaIndex, and semantic search to make it work seamlessly.',
      features: 'Semantic Search, Document Processing, Knowledge Graphs',
    },
    {
      name: 'Inference Optimization',
      description: 'I optimize your AI models to run faster and cheaper without losing accuracy. Using OpenVINO and other optimization techniques, I can reduce your inference costs and latency, making your AI applications more efficient and cost-effective.',
      features: 'Model Quantization, Hardware Acceleration, Performance Tuning',
    },
    {
      name: 'Deployments & DevOps',
      description: 'I take your AI projects from prototype to production with reliable, scalable deployments. I set up Docker containers, CI/CD pipelines, and cloud infrastructure (AWS ECS, etc.) so your AI systems run smoothly with high uptime and can grow with your business.',
      features: 'Container Orchestration, Auto-scaling, Monitoring & Observability',
    },
  ];

  const findProject = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return projects.find(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tech.toLowerCase().includes(lowerQuery) ||
        p.architecture.toLowerCase().includes(lowerQuery) ||
        p.features.some(f => f.toLowerCase().includes(lowerQuery)) ||
        p.skills.some(s => s.toLowerCase().includes(lowerQuery))
    );
  };

  const findService = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return services.find(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.features.toLowerCase().includes(lowerQuery)
    );
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Schedule meeting triggers
    if (
      lowerMessage.includes('schedule') ||
      lowerMessage.includes('meeting') ||
      lowerMessage.includes('book') ||
      lowerMessage.includes('calendar') ||
      lowerMessage.includes('appointment')
    ) {
      setShowScheduleForm(true);
      return "I'd be happy to help you schedule a meeting! Please fill out the form below with your details, and I'll connect you with Rohit.";
    }

    // Skills-related queries
    if (
      lowerMessage.includes('skill') ||
      lowerMessage.includes('what can rohit do') ||
      lowerMessage.includes('expertise') ||
      lowerMessage.includes('technologies') ||
      lowerMessage.includes('tech stack')
    ) {
      const allSkills = new Set<string>();
      projects.forEach(p => p.skills.forEach(s => allSkills.add(s)));
      const skillsList = Array.from(allSkills).map(s => `• ${s}`).join('\n');
      return `Based on Rohit's projects, here are his key skills and expertise:\n\n${skillsList}\n\nWould you like to know more about a specific technology or see examples from his projects?`;
    }

    // Architecture or technical deep dive
    if (
      lowerMessage.includes('architecture') ||
      lowerMessage.includes('how does it work') ||
      lowerMessage.includes('technical') ||
      lowerMessage.includes('implementation')
    ) {
      const project = findProject(userMessage);
      if (project) {
        return `Here's the technical architecture of ${project.name}:\n\n${project.architecture}\n\nKey Features:\n${project.features.map(f => `• ${f}`).join('\n')}\n\nGitHub: ${project.githubUrl}\n\nWould you like more details about any specific aspect?`;
      }
    }

    // GitHub or repository queries
    if (lowerMessage.includes('github') || lowerMessage.includes('repository') || lowerMessage.includes('repo') || lowerMessage.includes('code')) {
      if (lowerMessage.includes('dental')) {
        return `Dental SaaS Chatbot GitHub: https://github.com/rohitsundaram/Dental-SaaS-Chatbot\n\nThis repository contains the full-stack dental chatbot with Docker setup, Next.js frontend, Node.js backend, and Python LangChain service.`;
      }
      if (lowerMessage.includes('rag') || lowerMessage.includes('openwebui') || lowerMessage.includes('agentic')) {
        return `Agentic-RAG with OpenWebUI GitHub: https://github.com/rohitsundaram/Agentic-RAG-with-OpenWebUI\n\nThis repository contains the multi-agent RAG system with CrewAI, Ollama, and OpenWebUI.`;
      }
      if (lowerMessage.includes('health') || lowerMessage.includes('arc') || lowerMessage.includes('nutrilens')) {
        return `Health Companion (ARC) GitHub: https://github.com/Ankit546/nutrilens-ai\n\nThis repository contains the AI health companion with RAG-based recommendations.`;
      }
      const githubList = projects.map(p => `• ${p.name}: ${p.githubUrl}`).join('\n');
      return `Here are the GitHub repositories for Rohit's projects:\n\n${githubList}\n\nWhich repository would you like to explore?`;
    }

    // Project-related queries
    if (
      lowerMessage.includes('project') ||
      lowerMessage.includes('work') ||
      lowerMessage.includes('portfolio') ||
      lowerMessage.includes('dental') ||
      lowerMessage.includes('rag') ||
      lowerMessage.includes('health') ||
      lowerMessage.includes('chatbot')
    ) {
      const project = findProject(userMessage);
      if (project) {
        return `Here's detailed information about ${project.name}:\n\n${project.description}\n\n${project.detailedDescription}\n\nTechnologies Used:\n${project.tech}\n\nKey Features:\n${project.features.map(f => `• ${f}`).join('\n')}\n\nPerformance Metrics:\n${project.metrics}\n\nGitHub Repository: ${project.githubUrl}\n\nWould you like to know about the architecture, specific features, or other projects?`;
      }
      
      // List all projects
      if (lowerMessage.includes('all') || lowerMessage.includes('list')) {
        const projectList = projects.map((p) => `• ${p.name} - ${p.description}`).join('\n\n');
        return `Rohit has worked on these featured projects:\n\n${projectList}\n\nWhich project would you like to know more about? I can provide detailed technical information, architecture, or links to the GitHub repositories!`;
      }

      return `Rohit has worked on several AI projects:\n\n• Agentic-RAG with OpenWebUI - Multi-agent RAG system\n• Dental SaaS Chatbot - Full-stack conversational AI\n• Health Companion (ARC) - Personalized health AI\n\nWhich project interests you? I can provide detailed information including architecture, tech stack, features, and GitHub links!`;
    }

    // Service-related queries
    if (lowerMessage.includes('service') || lowerMessage.includes('what can') || lowerMessage.includes('what do you offer') || lowerMessage.includes('what all services')) {
      const service = findService(userMessage);
      if (service) {
        return `Here's what I offer for ${service.name}:\n\n${service.description}\n\nKey capabilities: ${service.features}\n\nInterested in this? Let's discuss how I can help with your specific project or schedule a meeting to go over the details!`;
      }

      // List all services with freelancer tone
      const serviceList = services.map((s) => `• ${s.name} - ${s.description}`).join('\n\n');
      return `I offer these services:\n\n${serviceList}\n\nI'd love to discuss which service fits your needs or how I can help with your project. Want to schedule a quick call to explore how we can work together?`;
    }

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('how are you')) {
      return "Hi! How are you doing? I'm Virtual Rohit - here to help you learn about my services, projects, or schedule a meeting. What would you like to know?";
    }

    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return "I can help you with:\n\n• Learn about Rohit's services and expertise\n• Get detailed information about projects (architecture, tech stack, features)\n• View GitHub repository links\n• Understand Rohit's skills and technologies\n• Schedule a meeting\n• Answer technical questions about AI engineering\n\nTry asking:\n• 'Tell me about the Dental SaaS Chatbot'\n• 'What skills does Rohit have?'\n• 'Show me the GitHub repos'\n• 'What's the architecture of the RAG project?'\n\nWhat would you like to know?";
    }

    // Docker, LangChain, Next.js specific tech questions
    if (
      lowerMessage.includes('docker') ||
      lowerMessage.includes('langchain') ||
      lowerMessage.includes('next.js') ||
      lowerMessage.includes('fastapi') ||
      lowerMessage.includes('crewai') ||
      lowerMessage.includes('ollama') ||
      lowerMessage.includes('pgvector') ||
      lowerMessage.includes('jwt') ||
      lowerMessage.includes('express')
    ) {
      const techQuery = lowerMessage.includes('docker') ? 'docker' :
                       lowerMessage.includes('langchain') ? 'langchain' :
                       lowerMessage.includes('next.js') ? 'next.js' :
                       lowerMessage.includes('fastapi') ? 'fastapi' :
                       lowerMessage.includes('crewai') ? 'crewai' :
                       lowerMessage.includes('ollama') ? 'ollama' :
                       lowerMessage.includes('pgvector') ? 'pgvector' :
                       lowerMessage.includes('jwt') ? 'jwt' :
                       lowerMessage.includes('express') ? 'express' : '';
      
      const relevantProjects = projects.filter(p => 
        p.tech.toLowerCase().includes(techQuery) ||
        p.skills.some(s => s.toLowerCase().includes(techQuery))
      );
      
      if (relevantProjects.length > 0) {
        const projectList = relevantProjects.map(p => 
          `• ${p.name} - Uses ${techQuery}\n  GitHub: ${p.githubUrl}`
        ).join('\n\n');
        return `Rohit has used ${techQuery} in these projects:\n\n${projectList}\n\nWould you like detailed information about any of these projects?`;
      } else {
        // No projects found with this tech, suggest meeting
        setShowScheduleForm(true);
        return `I'm not sure about ${techQuery} specifically. Why don't you schedule a meeting with Rohit? He can provide detailed answers about his technical expertise and discuss how ${techQuery} might fit your project. Please fill out the form below!`;
      }
    }

    // Default response - when bot can't answer, suggest meeting
    setShowScheduleForm(true);
    return "I'm not sure how to answer that specific question. Why don't you schedule a meeting with Rohit? He can provide detailed answers and discuss your specific needs. Please fill out the form below!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    // Check if it's a meeting request first
    const lowerMessage = currentInput.toLowerCase();
    if (
      lowerMessage.includes('schedule') ||
      lowerMessage.includes('meeting') ||
      lowerMessage.includes('book') ||
      lowerMessage.includes('calendar') ||
      lowerMessage.includes('appointment')
    ) {
      setShowScheduleForm(true);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'd be happy to help you schedule a meeting! Please fill out the form below with your details, and I'll connect you with Rohit.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      return;
    }

    // Use rule-based response
    setTimeout(() => {
      const response = getBotResponse(currentInput);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingMeeting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const purpose = formData.get('message') as string;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject: 'Meeting Request from Portfolio Chatbot',
          message: purpose || 'Meeting request - No specific purpose provided',
          type: 'meeting_request',
        }),
      });

      if (response.ok) {
        const confirmationMessage: Message = {
          id: Date.now().toString(),
          text: `Thank you, ${name}! Your meeting request has been received and sent to Rohit's email. He will contact you at ${email} shortly to confirm the meeting time.\n\nYou can also reach out directly at rohitsundaram.95@gmail.com`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmationMessage]);
        setShowScheduleForm(false);
        
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error('Failed to send meeting request');
      }
    } catch (error) {
      console.error('Meeting request error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `Sorry, there was an error sending your meeting request. Please try again or contact Rohit directly at rohitsundaram.95@gmail.com`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmittingMeeting(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 rounded-full gradient-primary text-white shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden ${
            showExpandedButton ? 'px-6 py-4' : 'w-14 h-14 justify-center'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {showExpandedButton && (
              <motion.span
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Hi! how are you doing!!! want to talk to virtual Rohit?
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] max-h-[80vh] flex flex-col shadow-2xl rounded-lg overflow-hidden border border-border bg-card"
          >
            {/* Header */}
            <div className="gradient-primary text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Virtual Rohit</h3>
                  <p className="text-sm text-white/80">Ask about services & projects</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'gradient-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}

              {/* Schedule Form */}
              {showScheduleForm && (
                <Card className="p-4 bg-secondary/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h4 className="font-bold">Schedule a Meeting</h4>
                  </div>
                  <form onSubmit={handleScheduleSubmit} className="space-y-3">
                    <Input
                      name="name"
                      placeholder="Your Name"
                      required
                      className="bg-background"
                      disabled={isSubmittingMeeting}
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      required
                      className="bg-background"
                      disabled={isSubmittingMeeting}
                    />
                    <Input
                      name="message"
                      placeholder="Meeting purpose (optional)"
                      className="bg-background"
                      disabled={isSubmittingMeeting}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 gradient-primary text-primary-foreground"
                        disabled={isSubmittingMeeting}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {isSubmittingMeeting ? 'Sending...' : 'Request Meeting'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmittingMeeting}
                        onClick={() => setShowScheduleForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                  <p className="text-xs text-muted-foreground mt-2">
                    Or email directly: rohitsundaram.95@gmail.com
                  </p>
                </Card>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  className="gradient-primary text-primary-foreground"
                  size="icon"
                  disabled={!input.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Try: "Tell me about Dental SaaS Chatbot" | "What are Rohit's skills?" | "Show GitHub repos"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

