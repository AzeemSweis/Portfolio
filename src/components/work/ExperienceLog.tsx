import { motion } from 'framer-motion'
import { useContent } from '../../hooks/useContent'
import { adaptExperience } from '../../lib/adapters'
import type { ApiExperience, ExperienceEntry } from '../../lib/adapters'
import { TerminalModule } from '../terminal/TerminalModule'

// Static fallback — mirrors the database seed data
const staticExperience: ExperienceEntry[] = [
  {
    role: 'DevOps Engineer',
    company: 'Houzz',
    period: '2021 - PRESENT',
    current: true,
    bullets: [
      'Managing EKS and kops Kubernetes clusters across production environments',
      'CI/CD pipelines via Jenkins, GitHub Actions, CircleCI, and ArgoCD',
      'Infrastructure-as-code with Terraform and Helm on AWS',
      'Observability stack: Prometheus, VictoriaMetrics, Grafana, Istio service mesh',
    ],
  },
  {
    role: 'Systems / IT Administrator',
    company: 'Earlier Roles',
    period: '2018 - 2021',
    current: false,
    bullets: [
      'Linux server administration and network operations',
      'Scripting and automation with Python and Bash',
      'Transitioned from traditional sysadmin into cloud-native DevOps work',
    ],
  },
]

export function ExperienceLog() {
  const { data: experience } = useContent<ExperienceEntry[], ApiExperience[]>(
    'experience',
    staticExperience,
    adaptExperience,
  )

  return (
    <TerminalModule label="EXPERIENCE.LOG">
      <div className="p-6 space-y-6 font-mono text-sm">
        {experience.map((job, i) => (
          <motion.div
            key={job.company + job.period}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`border-l-2 pl-5 py-1 ${
              job.current ? 'border-[#14ffec]/60' : 'border-white/10'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span
                className={`font-bold ${job.current ? 'text-[#14ffec]' : 'text-white opacity-80'}`}
              >
                {job.role}
              </span>
              <span className="text-[#525252]">@</span>
              <span className="text-white">{job.company}</span>
              {job.current && (
                <span className="text-[10px] px-2 py-0.5 bg-[#14ffec]/10 border border-[#14ffec]/30 text-[#14ffec] rounded uppercase tracking-widest">
                  Active
                </span>
              )}
            </div>
            <div className="text-[#525252] text-xs mb-3">{job.period}</div>
            <ul className="space-y-1.5">
              {job.bullets.map(bullet => (
                <li key={bullet} className="text-[#a3a3a3] flex gap-2">
                  <span className="text-[#14ffec]/40 flex-shrink-0">&gt;</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </TerminalModule>
  )
}
