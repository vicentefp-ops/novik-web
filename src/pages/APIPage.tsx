import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Code, Database, Lock, Terminal } from 'lucide-react';

export default function APIPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <Helmet>
        <title>Dental AI API – Integrate Clinical Intelligence into your Software</title>
        <meta name="description" content="Explore Novik AI API. Embed clinical decision support for medications and anesthetics into your EHR or dental management platform." />
      </Helmet>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 mx-auto">
        <Terminal size={16} />
        <span>Coming Soon</span>
      </div>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">API & Developers</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Integrate Novik's clinical intelligence into your own digital ecosystem.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Database />, title: "Software Integration", desc: "Embed Novik into dental management platforms and EHR systems." },
              { icon: <Code />, title: "Decision Support", desc: "Automate evidence-based suggestions for medications and anesthetics." },
              { icon: <Terminal />, title: "Workflow Automation", desc: "Enable bulk submission of patient histories for structured risk assessments." },
              { icon: <Lock />, title: "Secure Access", desc: "Token-based authentication and OAuth 2.0 workflows." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                <div className="text-primary shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <h3 className="text-lg font-mono mb-4 text-primary">Example Request</h3>
          <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
{`POST /api/v1/analyze
{
  "patient": {
    "age": 45,
    "medications": ["Warfarin", "Metformin"],
    "history": ["Type 2 Diabetes", "Atrial Fibrillation"]
  },
  "procedure": "Dental Extraction"
}`}
          </pre>
        </section>

        <div className="text-center">
          <p className="text-slate-500 mb-6">For early API access inquiries, please contact our developer relations team.</p>
          <a href="mailto:info@novik.ai" className="btn-primary">Contact DevRel</a>
        </div>
      </div>
    </motion.div>
  );
}
