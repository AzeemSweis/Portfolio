import { motion } from 'framer-motion'
import { skillCategories as staticSkillCategories } from '../../data/skills'
import { useContent } from '../../hooks/useContent'
import { adaptSkillCategories } from '../../lib/adapters'
import type { ApiSkillCategory } from '../../lib/adapters'
import type { SkillCategory } from '../../data/skills'
import { TerminalModule } from '../terminal/TerminalModule'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const pillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
}

export function SkillsGrid() {
  const { data: skillCategories } = useContent<SkillCategory[], ApiSkillCategory[]>(
    'skills',
    staticSkillCategories,
    adaptSkillCategories,
  )

  const allSkills = skillCategories.flatMap(c => c.skills)

  return (
    <div className="space-y-8">
      {/* Flat skills grid */}
      <TerminalModule label="TECH_STACK.SYS" headerRight="Uptime: 99.99%">
        <div className="p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="flex flex-wrap justify-center gap-3"
          >
            {allSkills.map(skill => (
              <motion.div
                key={skill}
                variants={pillVariants}
                className="group cursor-default border border-white/5 bg-white/5 hover:border-[#14ffec]/50 px-5 py-3 rounded-lg transition-all text-center"
              >
                <span className="font-mono text-sm text-[#a3a3a3] group-hover:text-[#14ffec] transition-colors whitespace-nowrap">
                  {skill}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </TerminalModule>

      {/* Interests module */}
      <TerminalModule label="INTERESTS.LOG">
        <div className="p-8">
          <div className="font-mono text-sm text-[#a3a3a3] leading-loose space-y-1">
            <p>
              <span className="text-[#14ffec]">[LOG_INFO]</span> Outside the terminal, Azeem is
              an avid explorer of physical spaces.
            </p>
            <p>
              <span className="text-[#14ffec]">[LOG_INFO]</span> Current activity: World Travel,
              pushing the boundaries of AI tooling, heavily invested in MLB.
            </p>
            <p>
              <span className="text-[#14ffec]">[LOG_INFO]</span> Status: Always experimenting
              with new cloud-native technologies and edge computing paradigms.
            </p>
          </div>
        </div>
      </TerminalModule>
    </div>
  )
}
