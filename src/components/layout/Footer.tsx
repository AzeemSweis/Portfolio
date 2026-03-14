import { SocialLinks } from '../shared/SocialLinks'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-8 mt-24">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-4">
        <SocialLinks iconSize={18} />
        <p className="text-[#525252] text-sm font-mono">
          &copy; {year} Azeem Sweis
        </p>
      </div>
    </footer>
  )
}
