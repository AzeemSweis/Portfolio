import { useState, useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function useTypewriter({
  words,
  typingSpeed = 120,
  deletingSpeed = 60,
  pauseDuration = 2000,
}: UseTypewriterOptions): string {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const currentWord = words[wordIndex % words.length]

    const tick = () => {
      if (isDeleting) {
        setDisplayText(prev => prev.slice(0, -1))
        if (displayText.length <= 1) {
          setIsDeleting(false)
          setWordIndex(prev => (prev + 1) % words.length)
        }
      } else {
        setDisplayText(currentWord.slice(0, displayText.length + 1))
        if (displayText.length === currentWord.length) {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration)
          return
        }
      }
    }

    const delay = isDeleting ? deletingSpeed : typingSpeed
    timeoutRef.current = setTimeout(tick, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration])

  return displayText
}
