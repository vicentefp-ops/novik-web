import { motion } from 'motion/react';

export default function LegalNotice() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <h1 className="text-4xl font-bold mb-8">Legal Notice / Aviso Legal</h1>
      <p className="text-sm text-slate-500 mb-8">17 August 2025 / 17 de agosto de 2025</p>
      
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl font-bold mt-8 mb-4">ENGLISH</h2>
        <h3 className="text-xl font-bold mt-6 mb-2">Legal Notice</h3>
        <p>In accordance with the duty of information set forth in Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), the following details are provided:</p>
        <ul className="list-none pl-0">
          <li><strong>VAT / Tax ID:</strong> B24836553</li>
          <li><strong>Registered Address:</strong> C/ La Cruz 2, Entresuelo, 30820 Alcantarilla, Murcia, Spain</li>
          <li><strong>Contact Email:</strong> info@novik.ai</li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Purpose of the Website</h3>
        <p>This website provides access to Novik, an AI-powered clinical decision support tool for dental professionals.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Intellectual and Industrial Property</h3>
        <p>All content, trademarks, logos, designs, text, and software on this site are the property of Novik Nexus S.L. or third parties licensed for use. Any reproduction, distribution, or modification without express consent is prohibited.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Disclaimer of Liability</h3>
        <p>The information and recommendations provided by Novik are intended as clinical support and do not replace the professional judgment of dentists. Novik Nexus S.L. is not liable for damages arising from misuse of the platform.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Jurisdiction and Applicable Law</h3>
        <p>Any disputes or claims related to this website shall be governed by Spanish law and submitted to the courts of Murcia, Spain.</p>

        <hr className="my-12" />

        <h2 className="text-2xl font-bold mt-8 mb-4">SPANISH / ESPAÑOL</h2>
        <h3 className="text-xl font-bold mt-6 mb-2">Aviso Legal</h3>
        <p>En cumplimiento con el deber de información establecido en la Ley 34/2002 de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos identificativos:</p>
        <ul className="list-none pl-0">
          <li><strong>Titular del sitio web:</strong> Novik Nexus S.L.</li>
          <li><strong>NIF/CIF:</strong> B24836553</li>
          <li><strong>Domicilio social:</strong> C/ La Cruz 2, Entresuelo, 30820 Alcantarilla, Murcia, España</li>
          <li><strong>Correo electrónico de contacto:</strong> info@novik.ai</li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Objeto del sitio web</h3>
        <p>El presente sitio web tiene por finalidad dar a conocer la plataforma Novik, un asistente clínico con inteligencia artificial para profesionales de la odontología.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Propiedad intelectual e industrial</h3>
        <p>Todos los contenidos, marcas, logotipos, diseños, textos y software presentes en este sitio web son propiedad de Novik Nexus S.L. o de terceros con autorización. Queda prohibida su reproducción, distribución o modificación sin consentimiento expreso.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Exclusión de responsabilidad</h3>
        <p>La información y recomendaciones ofrecidas por Novik tienen carácter de apoyo clínico y no sustituyen el juicio profesional del odontólogo. Novik Nexus S.L. no se hace responsable de los daños derivados del uso indebido de la plataforma.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">Jurisdicción y legislación aplicable</h3>
        <p>Para la resolución de cualquier conflicto o cuestión relacionada con este sitio web, será de aplicación la legislación española y se someterán a los juzgados y tribunales de Murcia (España).</p>
      </div>
    </motion.div>
  );
}
