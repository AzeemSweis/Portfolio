import { motion } from 'framer-motion'

export function BioSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
      {/* Profile image */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center md:justify-end"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#14ffec]/10 blur-2xl scale-110" />
          <img
            src="/images/pfp.png"
            alt="Azeem Sweis"
            className="relative w-56 h-56 md:w-72 md:h-72 rounded-full object-cover border-2 border-[#14ffec]/20"
          />
        </div>
      </motion.div>

      {/* Bio text */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <p className="text-[#a3a3a3] text-base leading-relaxed">
          Born in Los Angeles and raised in Las Vegas, I studied Computer Science and Engineering
          at the University of Nevada, Reno. Today I work as a DevOps Engineer at Houzz, where I
          manage Kubernetes clusters, CI/CD pipelines, and cloud infrastructure on AWS.
        </p>
        <p className="text-[#a3a3a3] text-base leading-relaxed">
          I'm passionate about building reliable systems and automating everything I can. When I'm
          not working, I'm usually exploring the outdoors — whether it's camping in southern Utah
          or road-tripping up the California coast.
        </p>
      </motion.div>
    </div>
  )
}
