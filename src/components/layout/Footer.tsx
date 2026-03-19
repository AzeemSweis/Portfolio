export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#141414] py-6 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] tracking-widest text-[#525252] uppercase">
        <div>© 2026 AZEEM SWEIS <span className="text-[#14ffec]/40">(SYSTEM_V.0.1)</span></div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            AUTO-SCALE: ACTIVE
          </div>
          <div>LATENCY: 14ms</div>
          <div>UPTIME: 99.99%</div>
        </div>
      </div>
    </footer>
  )
}
