export interface SocialLink {
  name: string
  url: string
  icon: 'Github' | 'Linkedin' | 'Instagram' | 'Twitter'
}

export const socials: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/AzeemSweis',
    icon: 'Github',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/azeem-sweis/',
    icon: 'Linkedin',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/a_sweis/',
    icon: 'Instagram',
  },
  {
    name: 'X / Twitter',
    url: 'https://twitter.com/azeem_sweis',
    icon: 'Twitter',
  },
]
