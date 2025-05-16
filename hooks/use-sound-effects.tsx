"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// Define all the different sound types
type SoundType =
  | "keyPress"
  | "keyPressVowel"
  | "keyPressConsonant"
  | "keySpace"
  | "keyBackspace"
  | "keyEnter"
  | "error"
  | "errorRepeated"
  | "complete"
  | "milestone"
  | "combo"
  | "challenge"
  | "perfect"

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string>("dark")

  // Use refs to store audio elements to prevent recreation on each render
  const soundsRef = useRef<Record<SoundType, HTMLAudioElement | null>>({
    keyPress: null,
    keyPressVowel: null,
    keyPressConsonant: null,
    keySpace: null,
    keyBackspace: null,
    keyEnter: null,
    error: null,
    errorRepeated: null,
    complete: null,
    milestone: null,
    combo: null,
    challenge: null,
    perfect: null,
  })

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === "undefined") return

    // Create audio elements
    soundsRef.current = {
      keyPress: new Audio("/sounds/key-press.mp3"),
      keyPressVowel: new Audio("/sounds/key-press-vowel.mp3"),
      keyPressConsonant: new Audio("/sounds/key-press-consonant.mp3"),
      keySpace: new Audio("/sounds/key-space.mp3"),
      keyBackspace: new Audio("/sounds/key-backspace.mp3"),
      keyEnter: new Audio("/sounds/key-enter.mp3"),
      error: new Audio("/sounds/error.mp3"),
      errorRepeated: new Audio("/sounds/error-repeated.mp3"),
      complete: new Audio("/sounds/complete.mp3"),
      milestone: new Audio("/sounds/milestone.mp3"),
      combo: new Audio("/sounds/combo.mp3"),
      challenge: new Audio("/sounds/challenge.mp3"),
      perfect: new Audio("/sounds/perfect.mp3"),
    }

    // Set volume for all sounds
    Object.values(soundsRef.current).forEach((sound) => {
      if (sound) {
        sound.volume = 0.4
      }
    })

    // Preload sounds
    const preloadSounds = async () => {
      try {
        // Try to load and play a silent sound to unlock audio
        const unlockSound = new Audio("/sounds/key-press.mp3")
        unlockSound.volume = 0.01
        await unlockSound.play()
        unlockSound.pause()
        unlockSound.currentTime = 0
        setIsInitialized(true)
      } catch (err) {
        console.log("Audio not yet allowed by browser, waiting for user interaction")
      }
    }

    preloadSounds()

    // Add event listener for user interaction to unlock audio
    const unlockAudio = () => {
      if (!isInitialized) {
        const unlockSound = new Audio("/sounds/key-press.mp3")
        unlockSound.volume = 0.01
        unlockSound
          .play()
          .then(() => {
            unlockSound.pause()
            unlockSound.currentTime = 0
            setIsInitialized(true)
            document.removeEventListener("click", unlockAudio)
            document.removeEventListener("keydown", unlockAudio)
          })
          .catch((err) => console.log("Failed to unlock audio:", err))
      }
    }

    document.addEventListener("click", unlockAudio)
    document.addEventListener("keydown", unlockAudio)

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const htmlElement = document.documentElement
          const theme = Array.from(htmlElement.classList).find((cls) =>
            ["dark", "neon", "forest", "ocean", "sunset"].includes(cls),
          )

          if (theme && theme !== currentTheme) {
            setCurrentTheme(theme)
          }
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      // Clean up audio elements and event listeners
      document.removeEventListener("click", unlockAudio)
      document.removeEventListener("keydown", unlockAudio)
      observer.disconnect()
    }
  }, [isInitialized, currentTheme])

  // Play sound function
  const playSound = useCallback(
    (type: SoundType) => {
      if (isMuted || !soundsRef.current[type]) return

      try {
        // Clone the audio to allow overlapping sounds
        const sound = soundsRef.current[type]!
        sound.currentTime = 0
        sound.play().catch((err) => {
          console.log(`Error playing ${type} sound:`, err)
        })
      } catch (err) {
        console.log(`Error with ${type} sound:`, err)
      }
    },
    [isMuted],
  )

  // Basic sound functions
  const playKeyPress = useCallback(() => playSound("keyPress"), [playSound])
  const playError = useCallback(() => playSound("error"), [playSound])
  const playComplete = useCallback(() => playSound("complete"), [playSound])
  const playChallenge = useCallback(() => playSound("challenge"), [playSound])

  // Advanced sound functions
  const playKeyPressVariation = useCallback(
    (char: string) => {
      const lowerChar = char.toLowerCase()

      if (lowerChar === " ") {
        playSound("keySpace")
      } else if (lowerChar === "\n" || lowerChar === "\r") {
        playSound("keyEnter")
      } else if ("aeiou".includes(lowerChar)) {
        playSound("keyPressVowel")
      } else {
        playSound("keyPressConsonant")
      }
    },
    [playSound],
  )

  const playBackspace = useCallback(() => playSound("keyBackspace"), [playSound])
  const playErrorRepeated = useCallback(() => playSound("errorRepeated"), [playSound])
  const playMilestone = useCallback(() => playSound("milestone"), [playSound])
  const playCombo = useCallback(() => playSound("combo"), [playSound])
  const playPerfect = useCallback(() => playSound("perfect"), [playSound])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  return {
    // Basic sounds
    playKeyPress,
    playError,
    playComplete,
    playChallenge,

    // Advanced sounds
    playKeyPressVariation,
    playBackspace,
    playErrorRepeated,
    playMilestone,
    playCombo,
    playPerfect,

    // State
    isMuted,
    toggleMute,
    isInitialized,
    currentTheme,
  }
}
