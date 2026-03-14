import { useTypewriter } from '../../hooks/useTypewriter'

interface TypeWriterProps {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
}

export function TypeWriter({
  words,
  typingSpeed,
  deletingSpeed,
  pauseDuration,
  className = '',
}: TypeWriterProps) {
  const displayText = useTypewriter({ words, typingSpeed, deletingSpeed, pauseDuration })

  return (
    <span className={className}>
      {displayText}
      <span
        className="inline-block w-0.5 h-[1em] bg-[#14ffec] ml-1 align-middle animate-pulse"
        aria-hidden="true"
      />
    </span>
  )
}
