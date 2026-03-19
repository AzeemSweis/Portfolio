interface TerminalPromptProps {
  user?: 'root' | 'azeem'
  command: string
  showCursor?: boolean
  className?: string
}

export function TerminalPrompt({
  user = 'root',
  command,
  showCursor = false,
  className = '',
}: TerminalPromptProps) {
  const prompt = user === 'root' ? 'root@azeem:~$' : 'azeem@portfolio:~$'

  return (
    <div className={`font-mono flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-[#14ffec] font-bold">{prompt}</span>
      <span className={`text-white ${showCursor ? 'terminal-cursor' : ''}`}>{command}</span>
    </div>
  )
}
