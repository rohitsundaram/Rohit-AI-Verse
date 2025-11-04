import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Code, Coffee, MapPin, Award, Briefcase, GraduationCap } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: Code,
      title: 'Full-Stack AI Engineering',
      description: 'Specializing in building end-to-end GenAI systems from concept to production deployment.',
    },
    {
      icon: Briefcase,
      title: 'Enterprise Solutions',
      description: 'Delivering production-grade AI systems with 99.9% uptime and scalable architecture.',
    },
    {
      icon: Award,
      title: '7 Years Experience',
      description: 'Working with cutting-edge AI technologies and delivering measurable business impact.',
    },
    {
      icon: MapPin,
      title: 'Based in Dubai',
      description: 'Serving clients globally while being strategically located in the Middle East tech hub.',
    },
  ];

  const skills = [
    'LangChain & CrewAI',
    'LlamaIndex & RAG',
    'OpenVINO Optimization',
    'PGVector & Vector DBs',
    'Docker & Containerization',
    'AWS ECS & CloudFront',
    'FastAPI & Python',
    'Multi-Agent Systems',
  ];

  return (
    <section id="about" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming complex challenges into intelligent solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 h-full">
              {/* Profile Image */}
              <div className="mb-6 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg"
                >
                  <img
                    src="/mypic.JPG"
                    alt="Rohit Sundaram"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Who I Am</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                I'm an AI Engineer passionate about building next-generation Generative AI systems that transform 
                how businesses interact with data and make decisions. With 7 years of experience, I specialize 
                in creating intelligent systems that bridge the gap between cutting-edge research and real-world applications.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                My expertise spans from designing multi-agent conversational systems to optimizing model inference 
                for production environments. I thrive on solving complex technical challenges and delivering solutions 
                that drive measurable business value.
              </p>
              <div className="flex items-center gap-2 text-primary mt-6 justify-center">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Dubai, UAE</span>
              </div>
            </Card>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <highlight.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{highlight.title}</h4>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Core Technologies & Skills</h3>
              <p className="text-muted-foreground">
                Building robust AI systems with modern tools and best practices
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <span className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium text-sm hover:bg-primary/20 transition-colors">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

