import { motion } from 'motion/react';

export default function CookiePolicy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <h1 className="text-4xl font-bold mb-8">Novik Cookie Policy / Política de Cookies de Novik</h1>
      <p className="text-sm text-slate-500 mb-8">Effective Date / Fecha de entrada en vigor: 17 August 2025</p>
      
      <div className="prose prose-slate max-w-none">
        <p>This Cookie Policy explains how Novik (operated by Novik Nexus S.L.) uses cookies and similar technologies on our website and application. We comply with global data-protection laws, including the EU ePrivacy Directive and GDPR, the UK GDPR, the California Consumer Privacy Act/CPRA, Brazil’s LGPD, Canada’s PIPEDA and Australia’s Privacy Act 1988.</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">1. What Are Cookies?</h2>
        <p>Cookies are small text files placed on your computer or device when you visit a website. They allow the site to recognize your device and remember information such as your login status, language preference or pages visited. We also use similar technologies like local storage, SDKs and web beacons; for simplicity, we refer to all of them as “cookies.”</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Why We Use Cookies</h2>
        <p>Novik uses cookies for several purposes:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Strictly necessary functions</strong> – These cookies are essential to operate the platform and enable core features such as authenticating users, keeping you logged in, enabling secure payment transactions or remembering your cookie preferences. Without these cookies, certain services cannot be provided.</li>
          <li><strong>Functionality cookies</strong> – With your consent, we use cookies to remember choices you make (e.g. language selection or interface customizations) and provide enhanced functionality.</li>
          <li><strong>Analytics cookies</strong> – With your consent, we use analytics cookies to understand how you use our site (pages visited, time spent, errors encountered). This helps us improve the performance and content of Novik. For example, we use Google Analytics cookies such as _ga to collect anonymized statistics. All analytics data is aggregated and not used to identify you.</li>
          <li><strong>Advertising/targeting cookies</strong> – We do not use advertising or targeting cookies.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Cookie Consent and Control</h2>
        <p>Under the GDPR and the ePrivacy Directive, organisations must obtain users’ consent before setting any cookies other than strictly necessary cookies. We honour these requirements by using a cookie consent banner.</p>
        <p>You can change your preferences at any time by reopening the cookie settings (look for a cookie icon or link on the site) or by deleting cookies in your browser.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us</h2>
        <p>If you have questions or comments about this Cookie Policy, please email us at info@novik.ai or write to Novik Nexus S.L., C/ La Cruz 2, Entresuelo, 30820 Alcantarilla, Murcia, Spain.</p>
      </div>
    </motion.div>
  );
}
