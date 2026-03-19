import type { ReactNode } from 'react'

interface TerminalModuleProps {
  label: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  headerRight?: ReactNode
  fullWidth?: boolean
}

export function TerminalModule({
  label,
  icon,
  children,
  className = '',
  headerRight,
}: TerminalModuleProps) {
  return (
    <div className={`bg-[#141414] border border-white/10 rounded-xl overflow-hidden ${className}`}>
      {/* Header bar */}
      <div className="bg-[#1a1a1a] border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            {icon && <span className="text-[#a3a3a3]">{icon}</span>}
            <span className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest">
              MODULE: {label}
            </span>
          </div>
        </div>
        {headerRight && (
          <div className="font-mono text-[10px] text-[#525252]">{headerRight}</div>
        )}
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
