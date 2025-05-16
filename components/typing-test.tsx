"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, RefreshCw, Clock, Award, BarChart3, FileText, Volume2, VolumeX, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateRandomText } from "@/lib/text-generator"
import ResultsCard from "./results-card"
import TypingInput from "./typing-input"
import { ThemeSwitcher } from "./theme-switcher"
import { useSoundEffects } from "@/hooks/use-sound-effects"

// Lazy load components that aren't needed immediately
const KeyboardHeatmap = lazy(() => import("./keyboard-heatmap"))
const CustomTextInput = lazy(() => import("./custom-text-input"))
const ChallengeSelector = lazy(() => import("./challenge-selector"))

export default function TypingTest() {
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [status, setStatus] = useState<"waiting" | "started" | "finished">("waiting")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [history, setHistory] = useState<Array<{ wpm: number; accuracy: number; date: Date }>>([])
  const [keyErrors, setKeyErrors] = useState<Record<string, number>>({})
  const [showCustomTextInput, setShowCustomTextInput] = useState(false)
  const [textSource, setTextSource] = useState<"random" | "custom">("random")
  const [lastKeyCorrect, setLastKeyCorrect] = useState<boolean | null>(null)
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null)
  const [challengeProgress, setChallengeProgress] = useState(0)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [comboCount, setComboCount] = useState(0)
  const [errorStreak, setErrorStreak] = useState(0)
  const [lastWpm, setLastWpm] = useState(0)
  const [activeTab, setActiveTab] = useState("test")

  const {
    playKeyPressVariation,
    playBackspace,
    playError,
    playErrorRepeated,
    playComplete,
    playMilestone,
    playCombo,
    playPerfect,
    isMuted,
    toggleMute,
  } = useSoundEffects()

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lastMilestoneRef = useRef<number>(0)

  // Generate random text based on difficulty
  const generateText = useCallback(() => {
    const newText = generateRandomText(difficulty)
    setText(newText)
  }, [difficulty])

  // Initialize the test
  useEffect(() => {
    generateText()
  }, [generateText])

  // Timer logic
  useEffect(() => {
    if (status === "started" && startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setTimeElapsed(elapsed)

        // Calculate current WPM
        const elapsedMinutes = elapsed / 60
        if (elapsedMinutes > 0) {
          const currentWpm = Math.round(currentIndex / 5 / elapsedMinutes)

          // Check for WPM milestones
          if (currentWpm >= 20 && lastWpm < 20) {
            playMilestone()
          } else if (currentWpm >= 40 && lastWpm < 40) {
            playMilestone()
          } else if (currentWpm >= 60 && lastWpm < 60) {
            playMilestone()
          } else if (currentWpm >= 80 && lastWpm < 80) {
            playMilestone()
          } else if (currentWpm >= 100 && lastWpm < 100) {
            playMilestone()
          }

          setLastWpm(currentWpm)
        }
      }, 1000)
    } else if (status === "finished" && timerRef.current) {
      clearInterval(timerRef.current)

      // Check for perfect accuracy
      if (errors === 0 && text.length > 10) {
        playPerfect()
      } else {
        playComplete()
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status, startTime, playComplete, playPerfect, playMilestone, currentIndex, errors, text.length, lastWpm])

  // Check for progress milestones
  useEffect(() => {
    if (status === "started" && text) {
      const progressPercent = Math.round((currentIndex / text.length) * 100)

      // Play milestone sound at 25%, 50%, 75% completion if not already played
      if (progressPercent >= 25 && lastMilestoneRef.current < 25) {
        playMilestone()
        lastMilestoneRef.current = 25
      } else if (progressPercent >= 50 && lastMilestoneRef.current < 50) {
        playMilestone()
        lastMilestoneRef.current = 50
      } else if (progressPercent >= 75 && lastMilestoneRef.current < 75) {
        playMilestone()
        lastMilestoneRef.current = 75
      }
    }
  }, [currentIndex, text, status, playMilestone])

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const prevLength = userInput.length

    // Start the test on first input
    if (status === "waiting") {
      setStatus("started")
      setStartTime(Date.now())
      lastMilestoneRef.current = 0
    }

    // Check if a character was added
    if (value.length > prevLength) {
      const lastChar = value[value.length - 1]
      const expectedChar = text[value.length - 1]
      const isCorrect = lastChar === expectedChar

      // Play sound based on correctness
      if (isCorrect) {
        playKeyPressVariation(lastChar)
        setLastKeyCorrect(true)
        setComboCount((prev) => prev + 1)
        setErrorStreak(0)

        // Play combo sound for streaks
        if (comboCount === 9) {
          // Will become 10 after increment
          playCombo()
        } else if (comboCount === 19) {
          // Will become 20 after increment
          playCombo()
        } else if (comboCount === 49) {
          // Will become 50 after increment
          playCombo()
        }
      } else {
        if (errorStreak >= 2) {
          playErrorRepeated()
        } else {
          playError()
        }
        setLastKeyCorrect(false)
        setComboCount(0)
        setErrorStreak((prev) => prev + 1)
        setErrors(errors + 1)

        // Track which key had an error
        const errorKey = lastChar.toLowerCase()
        setKeyErrors((prev) => ({
          ...prev,
          [errorKey]: (prev[errorKey] || 0) + 1,
        }))
      }
    }
    // Check if a character was removed (backspace)
    else if (value.length < prevLength) {
      playBackspace()
    }

    setUserInput(value)
    setCurrentIndex(value.length)

    // Update challenge progress if a challenge is active
    if (activeChallenge) {
      updateChallengeProgress(value.length, errors)
    }

    // Check if test is complete
    if (value === text) {
      setStatus("finished")
      setEndTime(Date.now())

      // Save result to history
      const duration = (Date.now() - (startTime || Date.now())) / 1000 / 60
      const wpm = Math.round(text.length / 5 / duration)
      const accuracy = Math.max(0, Math.round(100 - (errors / text.length) * 100))

      setHistory([...history, { wpm, accuracy, date: new Date() }])

      // Check if challenge is completed
      if (activeChallenge) {
        checkChallengeCompletion(wpm, accuracy)
      }
    }
  }

  const updateChallengeProgress = (currentLength: number, currentErrors: number) => {
    if (!activeChallenge || !text) return

    let progress = 0

    // Different progress calculations based on challenge type
    if (activeChallenge === "speed50") {
      // Calculate current WPM
      if (startTime) {
        const elapsedMinutes = (Date.now() - startTime) / 1000 / 60
        const currentWpm = Math.round(currentLength / 5 / elapsedMinutes)
        progress = Math.min(100, (currentWpm / 50) * 100)
      }
    } else if (activeChallenge === "accuracy95") {
      // Calculate current accuracy
      const accuracy = currentLength > 0 ? Math.max(0, 100 - (currentErrors / currentLength) * 100) : 0
      progress = Math.min(100, (accuracy / 95) * 100)
    } else if (activeChallenge === "endurance") {
      // Progress based on text completion
      progress = (currentLength / text.length) * 100
    }

    setChallengeProgress(progress)
  }

  const checkChallengeCompletion = (wpm: number, accuracy: number) => {
    if (!activeChallenge) return

    let completed = false

    if (activeChallenge === "speed50" && wpm >= 50) {
      completed = true
    } else if (activeChallenge === "accuracy95" && accuracy >= 95) {
      completed = true
    } else if (activeChallenge === "endurance") {
      completed = true
    }

    setChallengeCompleted(completed)
  }

  const startChallenge = (challengeId: string) => {
    setActiveChallenge(challengeId)
    setChallengeProgress(0)
    setChallengeCompleted(false)

    // Set appropriate difficulty based on challenge
    if (challengeId === "speed50") {
      setDifficulty("medium")
    } else if (challengeId === "accuracy95") {
      setDifficulty("easy")
    } else if (challengeId === "endurance") {
      setDifficulty("hard")
    }

    resetTest()
  }

  const exitChallenge = () => {
    setActiveChallenge(null)
    setChallengeProgress(0)
    setChallengeCompleted(false)
    resetTest()
  }

  const handleCustomTextSubmit = (customText: string) => {
    setText(customText)
    setTextSource("custom")
    setShowCustomTextInput(false)

    // Reset all test state
    setUserInput("")
    setCurrentIndex(0)
    setErrors(0)
    setStatus("waiting")
    setStartTime(null)
    setEndTime(null)
    setTimeElapsed(0)
    setComboCount(0)
    setErrorStreak(0)
    setLastWpm(0)

    // Focus the input field
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus()
    }, 100)
  }

  const handleCustomTextCancel = () => {
    setShowCustomTextInput(false)
  }

  const resetTest = () => {
    setUserInput("")
    setCurrentIndex(0)
    setErrors(0)
    setStatus("waiting")
    setStartTime(null)
    setEndTime(null)
    setTimeElapsed(0)
    setLastKeyCorrect(null)
    setComboCount(0)
    setErrorStreak(0)
    setLastWpm(0)
    lastMilestoneRef.current = 0

    // Only generate new text if using random text
    if (textSource === "random") {
      generateText()
    }

    // Focus the input field
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus()
    }, 100)
  }

  // Calculate results
  const calculateWPM = () => {
    if (!startTime || !endTime) return 0
    const duration = (endTime - startTime) / 1000 / 60
    return Math.round(text.length / 5 / duration)
  }

  const calculateAccuracy = () => {
    return Math.max(0, Math.round(100 - (errors / text.length) * 100))
  }

  const progress = text ? (currentIndex / text.length) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            TypeMaster
          </h1>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">by Abhra</span>
        </div>
        <div className="flex items-center gap-2 z-10 mt-2 sm:mt-0">
          <Button variant="outline" size="icon" onClick={toggleMute} className="border-border">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          <ThemeSwitcher />
        </div>
      </div>

      <Tabs defaultValue="test" className="mb-6" value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="w-full overflow-x-auto flex flex-nowrap min-w-full">
          <TabsTrigger value="test" className="flex-1 min-w-[80px] px-2">
            Typing Test
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex-1 min-w-[80px] px-2">
            Challenges
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex-1 min-w-[80px] px-2">
            Statistics
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex-1 min-w-[80px] px-2">
            Keyboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <Card className="p-4 sm:p-6 bg-card border-border shadow-lg">
            <AnimatePresence mode="wait">
              {showCustomTextInput ? (
                <Suspense fallback={<div className="p-4 text-center">Loading custom text input...</div>}>
                  <CustomTextInput onSubmit={handleCustomTextSubmit} onCancel={handleCustomTextCancel} />
                </Suspense>
              ) : (
                <>
                  {status === "waiting" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6"
                    >
                      <h2 className="text-xl font-semibold mb-2">Ready to test your typing skills?</h2>
                      <p className="text-muted-foreground">Start typing the text below to begin the test</p>
                    </motion.div>
                  )}

                  {status === "started" && (
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={18} className="text-primary/80" />
                        <span>{timeElapsed}s</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BarChart3 size={18} className="text-primary/80" />
                          <span>{Math.round(currentIndex / 5 / (timeElapsed / 60) || 0)} WPM</span>
                        </div>
                        {comboCount >= 5 && (
                          <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                            {comboCount}x Combo
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {status !== "finished" ? (
                    <motion.div
                      key="test"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-6"
                    >
                      <div className="relative font-mono text-lg p-4 rounded-md bg-background/50 border border-border mb-4 leading-relaxed">
                        {text.split("").map((char, index) => {
                          let className = "relative z-10"

                          if (index < currentIndex) {
                            className += userInput[index] === char ? " text-primary" : " text-destructive underline"
                          } else if (index === currentIndex) {
                            className += " bg-muted px-0.5 rounded"
                          }

                          return (
                            <span key={index} className={className}>
                              {char}
                            </span>
                          )
                        })}
                      </div>

                      <TypingInput
                        value={userInput}
                        onChange={handleInputChange}
                        inputRef={inputRef}
                        disabled={status === "finished"}
                      />

                      <div className="mt-4">
                        <Progress value={progress} className="h-2 bg-muted" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <ResultsCard wpm={calculateWPM()} accuracy={calculateAccuracy()} time={timeElapsed} />
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6">
                    {textSource === "random" && (
                      <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDifficulty("easy")}
                          className={`${difficulty === "easy" ? "bg-primary/20 text-primary border-primary/50" : "border-border"}`}
                        >
                          Easy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDifficulty("medium")}
                          className={`${difficulty === "medium" ? "bg-primary/20 text-primary border-primary/50" : "border-border"}`}
                        >
                          Medium
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDifficulty("hard")}
                          className={`${difficulty === "hard" ? "bg-primary/20 text-primary border-primary/50" : "border-border"}`}
                        >
                          Hard
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (textSource === "custom") {
                            setTextSource("random")
                            generateText()
                            resetTest()
                          } else {
                            setShowCustomTextInput(true)
                          }
                        }}
                        className="border-border flex-1 sm:flex-none"
                      >
                        <FileText size={16} className="mr-2" />
                        {textSource === "custom" ? "Use Random Text" : "Use Custom Text"}
                      </Button>

                      <Button
                        onClick={resetTest}
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-muted flex-1 sm:flex-none"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card className="p-4 sm:p-6 bg-card border-border shadow-lg">
            {activeChallenge ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {activeChallenge === "speed50" && "Speed Challenge: 50 WPM"}
                    {activeChallenge === "accuracy95" && "Accuracy Challenge: 95%"}
                    {activeChallenge === "endurance" && "Endurance Challenge"}
                  </h2>
                  <Button variant="outline" size="sm" onClick={exitChallenge} className="border-border">
                    Exit Challenge
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(challengeProgress)}%</span>
                  </div>
                  <Progress value={challengeProgress} className="h-2 bg-muted" />
                </div>

                {status === "waiting" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                  >
                    <h3 className="text-lg font-semibold mb-2">Challenge Ready!</h3>
                    <p className="text-muted-foreground">
                      {activeChallenge === "speed50" &&
                        "Type at a speed of at least 50 WPM to complete this challenge."}
                      {activeChallenge === "accuracy95" && "Maintain at least 95% accuracy to complete this challenge."}
                      {activeChallenge === "endurance" &&
                        "Complete this long text without giving up to finish the challenge."}
                    </p>
                  </motion.div>
                )}

                {status !== "finished" ? (
                  <motion.div
                    key="challenge-test"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6"
                  >
                    <div className="relative font-mono text-lg p-4 rounded-md bg-background/50 border border-border mb-4 leading-relaxed">
                      {text.split("").map((char, index) => {
                        let className = "relative z-10"

                        if (index < currentIndex) {
                          className += userInput[index] === char ? " text-primary" : " text-destructive underline"
                        } else if (index === currentIndex) {
                          className += " bg-muted px-0.5 rounded"
                        }

                        return (
                          <span key={index} className={className}>
                            {char}
                          </span>
                        )
                      })}
                    </div>

                    <TypingInput
                      value={userInput}
                      onChange={handleInputChange}
                      inputRef={inputRef}
                      disabled={status === "finished"}
                    />

                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={18} className="text-primary/80" />
                        <span>{timeElapsed}s</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BarChart3 size={18} className="text-primary/80" />
                          <span>{Math.round(currentIndex / 5 / (timeElapsed / 60) || 0)} WPM</span>
                        </div>
                        {comboCount >= 5 && (
                          <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                            {comboCount}x Combo
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="challenge-results"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="text-center"
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">
                        Challenge {challengeCompleted ? "Completed!" : "Finished"}
                      </h3>
                      {challengeCompleted ? (
                        <div className="flex justify-center">
                          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full">
                            <Trophy size={20} />
                            <span className="font-semibold">Challenge Successful!</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          You didn't quite meet the challenge requirements. Try again!
                        </p>
                      )}
                    </div>
                    <ResultsCard wpm={calculateWPM()} accuracy={calculateAccuracy()} time={timeElapsed} />
                    <div className="mt-6">
                      <Button onClick={resetTest} variant="outline" className="border-border hover:bg-muted">
                        <RefreshCw size={16} className="mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Suspense fallback={<div className="p-4 text-center">Loading challenges...</div>}>
                <ChallengeSelector onSelectChallenge={startChallenge} />
              </Suspense>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="p-4 sm:p-6 bg-card border-border shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Your Typing History</h2>

            {history.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Award size={40} className="mx-auto mb-3 opacity-50" />
                <p>Complete your first test to see your statistics</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-md bg-background/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 rounded-full p-2">
                          <CheckCircle size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{entry.wpm} WPM</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entry.accuracy}%</p>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card className="p-4 sm:p-6 bg-card border-border shadow-lg">
            {activeTab === "heatmap" && (
              <Suspense fallback={<div className="p-4 text-center">Loading keyboard heatmap...</div>}>
                <KeyboardHeatmap keyErrors={keyErrors} />
              </Suspense>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Practice the keys highlighted in red to improve your typing accuracy.
              </p>
              <Button variant="outline" onClick={() => setKeyErrors({})} className="border-border">
                Reset Heatmap
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
