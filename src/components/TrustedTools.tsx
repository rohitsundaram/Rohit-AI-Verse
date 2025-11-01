import { motion } from 'framer-motion';

const TrustedTools = () => {
  const tools = [
    'OpenVINO',
    'Watsonx',
    'AWS',
    'LangChain',
    'LlamaIndex',
    'PGVector',
    'CrewAI',
    'Arize Phoenix',
    'Docker',
    'FastAPI',
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-8">
            Trusted Tools & Technologies
          </h2>
        </motion.div>

        {/* Scrolling Marquee */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-12 items-center"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...tools, ...tools].map((tool, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-8 py-4 bg-card rounded-lg border border-border shadow-sm"
              >
                <span className="text-lg font-semibold text-foreground whitespace-nowrap">
                  {tool}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustedTools;
