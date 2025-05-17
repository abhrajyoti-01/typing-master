"use client"

import { useState, useCallback } from "react"

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(true)
  const [isInitialized, setIsInitialized] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<string>("dark")

  // Empty functions that do nothing (no sound effects)
  const noop = useCallback(() => {}, [])
  const noopWithParam = useCallback((_param: any) => {}, [])
  
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  return {
    // Basic sounds (noop functions)
    playKeyPress: noop,
    playError: noop,
    playComplete: noop,
    playChallenge: noop,

    // Advanced sounds (noop functions)
    playKeyPressVariation: noopWithParam,
    playBackspace: noop,
    playErrorRepeated: noop,
    playMilestone: noop,
    playCombo: noop,
    playPerfect: noop,

    // State
    isMuted,
    toggleMute,
    isInitialized,
    currentTheme,
  }
}
