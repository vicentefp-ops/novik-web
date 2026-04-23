import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    category: "General",
    items: [
      { q: "What is Novik?", a: "Novik is an AI-powered clinical decision support tool built for dentistry. It synthesises patient data with medical literature to support safe treatment planning." },
      { q: "Who can use Novik?", a: "Licensed dentists and dental care professionals, plus dental students in supervised settings." },
      { q: "Does Novik diagnose?", a: "No. Novik provides evidence-based suggestions and dose adjustments. Diagnosis and final decisions always remain with the treating clinician." }
    ]
  },
  {
    category: "Security & Compliance",
    items: [
      { q: "Is my data secure?", a: "Data is encrypted in transit and at rest. Access is restricted to authorised users, and we follow EU GDPR requirements." },
      { q: "Is Novik HIPAA compliant?", a: "Novik complies with GDPR and is exploring HIPAA alignment for use in the United States." }
    ]
  },
  {
    category: "Plans & Pricing",
    items: [
      { q: "Is Novik free?", a: "Yes. During open beta the core features are free. Future paid tiers may add higher limits and premium capabilities." }
    ]
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <Helmet>
        <title>FAQs – Common Questions about Novik AI Dental Assistant</title>
        <meta name="description" content="Find answers to common questions about Novik AI, including security, HIPAA compliance, pricing, and how it clinical excellence can support your practice." />
      </Helmet>
      <motion.div variants={itemVariants} className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-slate-600">Everything you need to know about Novik AI.</p>
      </motion.div>

      <div className="space-y-12">
        {faqs.map((group, groupIdx) => (
          <motion.div 
            key={groupIdx}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h2 variants={itemVariants} className="text-xl font-bold mb-6 text-primary">{group.category}</motion.h2>
            <div className="space-y-4">
              {group.items.map((item, itemIdx) => {
                const id = `${groupIdx}-${itemIdx}`;
                const isOpen = openIndex === id;
                return (
                  <motion.div variants={itemVariants} key={id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-800">{item.q}</span>
                      <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
