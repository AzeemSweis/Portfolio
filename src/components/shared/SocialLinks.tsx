import { Github, Linkedin, Instagram, Twitter } from 'lucide-react'
import { socials } from '../../data/socials'

const iconMap = {
  Github,
  Linkedin,
  Instagram,
  Twitter,
}

interface SocialLinksProps {
  className?: string
  iconSize?: number
}

export function SocialLinks({ className = '', iconSize = 20 }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {socials.map(social => {
        const Icon = iconMap[social.icon]
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="text-[#a3a3a3] hover:text-[#14ffec] transition-colors duration-200"
          >
            <Icon size={iconSize} strokeWidth={1.5} />
          </a>
        )
      })}
    </div>
  )
}
