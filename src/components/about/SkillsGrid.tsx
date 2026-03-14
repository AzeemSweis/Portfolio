import { motion } from 'framer-motion'
import { skillCategories } from '../../data/skills'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

export function SkillsGrid() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#f5f5f5] mb-8">Technologies</h2>
      <div className="space-y-8">
        {skillCategories.map(category => (
          <div key={category.name}>
            <h3 className="text-xs font-mono text-[#525252] uppercase tracking-widest mb-3">
              {category.name}
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="flex flex-wrap gap-2"
            >
              {category.skills.map(skill => (
                <motion.span
                  key={skill}
                  variants={pillVariants}
                  transition={{ duration: 0.25 }}
                  className="px-3 py-1.5 text-sm font-mono text-[#a3a3a3] bg-[#141414] border border-white/10 rounded hover:border-[#14ffec]/50 hover:text-[#f5f5f5] transition-all duration-200 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
