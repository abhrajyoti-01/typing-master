"use client"

import { useEffect, memo } from "react"
import { motion } from "framer-motion"
import { Clock, Target, Zap } from "lucide-react"
import confetti from "canvas-confetti"
import { useSoundEffects } from "@/hooks/use-sound-effects"

interface ResultsCardProps {
  wpm: number
  accuracy: number
  time: number
}

const ResultsCard = memo(function ResultsCard({ wpm, accuracy, time }: ResultsCardProps) {
  const { playPerfect } = useSoundEffects()

  // Trigger confetti on component mount
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"],
    })
  }

  useEffect(() => {
    triggerConfetti()

    // Play perfect sound if accuracy is 100%
    if (accuracy === 100) {
      playPerfect()
    }
  }, [accuracy, playPerfect])

  // Determine performance level
  const getPerformanceLevel = () => {
    if (wpm > 80) return "Expert"
    if (wpm > 60) return "Advanced"
    if (wpm > 40) return "Intermediate"
    if (wpm > 20) return "Beginner"
    return "Novice"
  }

  return (
    <motion.div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Test Complete!</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background/50 rounded-lg p-4 border border-border"
        >
          <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{wpm}</div>
          <div className="text-xs text-muted-foreground">Words per minute</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background/50 rounded-lg p-4 border border-border"
        >
          <Target className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background/50 rounded-lg p-4 border border-border"
        >
          <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{time}s</div>
          <div className="text-xs text-muted-foreground">Time elapsed</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-background/50 rounded-lg p-6 border border-border mb-6"
      >
        <h3 className="text-lg font-semibold mb-2">Your typing level</h3>
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-foreground">
          {getPerformanceLevel()}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {wpm > 60
            ? "Impressive! You're typing faster than most people."
            : "Keep practicing to improve your typing speed."}
        </p>
        <p className="text-xs text-muted-foreground mt-4">TypeMaster by Abhra</p>
      </motion.div>
    </motion.div>
  )
})

export default ResultsCard
