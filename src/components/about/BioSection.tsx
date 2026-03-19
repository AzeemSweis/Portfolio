import { motion } from 'framer-motion'
import { useContent } from '../../hooks/useContent'

const DEFAULT_CONFIG: Record<string, string> = {
  profile_photo_url: '/images/pfp.png',
  bio_paragraph_1:
    'Azeem is a <DevOps Engineer at Houzz> based in Las Vegas. He manages Kubernetes clusters (EKS, kops), CI/CD systems (Jenkins, GitHub Actions, ArgoCD), and cloud infrastructure on AWS. Background in systems administration evolving into modern Site Reliability Engineering.',
  bio_paragraph_2:
    'Passionate about automating everything and building resilient, scalable systems that can withstand the pressures of high-traffic production environments.',
}

export function BioSection() {
  const { data: config } = useContent<Record<string, string>>(
    'site-config',
    DEFAULT_CONFIG,
  )

  const photoUrl = config.profile_photo_url ?? DEFAULT_CONFIG.profile_photo_url
  const para1 = config.bio_paragraph_1 ?? DEFAULT_CONFIG.bio_paragraph_1
  const para2 = config.bio_paragraph_2 ?? DEFAULT_CONFIG.bio_paragraph_2

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
      {/* Profile image */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:col-span-4 lg:col-span-3"
      >
        <div className="aspect-square w-full rounded-xl bg-[#141414] border border-white/10 p-2 group">
          <div className="w-full h-full rounded-lg overflow-hidden relative">
            <img
              src={photoUrl}
              alt="Azeem Sweis"
              className="w-full h-full object-cover grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-[#14ffec]/10 mix-blend-overlay pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Bio text */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="md:col-span-8 lg:col-span-9 space-y-5"
      >
        <p className="text-[#a3a3a3] text-lg leading-relaxed">
          {para1}
        </p>
        <p className="text-[#a3a3a3] text-base leading-relaxed">
          {para2}
        </p>
        <div className="pt-2 flex items-center gap-2 font-mono">
          <span className="text-[#14ffec] font-bold">azeem@portfolio:~$</span>
          <span className="text-white text-lg">cat skills.json</span>
        </div>
      </motion.div>
    </div>
  )
}
