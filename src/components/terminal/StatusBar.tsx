interface StatusBarProps {
  text?: string
  className?: string
}

export function StatusBar({ text = 'STATUS: READY_TO_DEPLOY', className = '' }: StatusBarProps) {
  return (
    <div
      className={`flex items-center gap-2 font-mono text-xs tracking-widest text-[#14ffec] border-y border-white/10 py-2 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-[#14ffec] opacity-75"
          style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14ffec]" />
      </span>
      {text}
    </div>
  )
}
