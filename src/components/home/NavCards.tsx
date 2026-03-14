import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, User, Map } from 'lucide-react'

const cards = [
  {
    to: '/work',
    label: 'Work',
    icon: Briefcase,
    description: 'Projects & resume',
  },
  {
    to: '/about',
    label: 'About',
    icon: User,
    description: 'Background & skills',
  },
  {
    to: '/travel',
    label: 'Travel',
    icon: Map,
    description: 'Places I have been',
  },
]

export function NavCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              to={card.to}
              className="group flex flex-col items-center gap-2 p-6 rounded-lg border border-white/10 bg-[#141414] hover:border-[#14ffec]/50 hover:bg-[#141414]/80 transition-all duration-300"
            >
              <Icon
                size={24}
                className="text-[#525252] group-hover:text-[#14ffec] transition-colors duration-300"
                strokeWidth={1.5}
              />
              <span className="text-base font-semibold text-[#f5f5f5] font-mono">
                &lt;{card.label}/&gt;
              </span>
              <span className="text-xs text-[#525252] group-hover:text-[#a3a3a3] transition-colors duration-300">
                {card.description}
              </span>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
