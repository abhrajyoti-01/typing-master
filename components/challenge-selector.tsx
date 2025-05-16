"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Zap, Target, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChallengeSelectorProps {
  onSelectChallenge: (challengeId: string) => void
}

const ChallengeSelector = memo(function ChallengeSelector({ onSelectChallenge }: ChallengeSelectorProps) {
  const challenges = [
    {
      id: "speed50",
      title: "Speed Challenge",
      description: "Type at a speed of at least 50 WPM",
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      difficulty: "Medium",
      color: "bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "accuracy95",
      title: "Accuracy Challenge",
      description: "Maintain at least 95% accuracy",
      icon: <Target className="w-8 h-8 text-emerald-500" />,
      difficulty: "Easy",
      color: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "endurance",
      title: "Endurance Challenge",
      description: "Complete a long text without giving up",
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      difficulty: "Hard",
      color: "bg-purple-500/10 border-purple-500/30",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Typing Challenges</h2>
        <p className="text-muted-foreground">Test your typing skills with these special challenges</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg border p-4 ${challenge.color} hover:bg-background/50 transition-colors cursor-pointer`}
            onClick={() => onSelectChallenge(challenge.id)}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">{challenge.icon}</div>
              <h3 className="text-lg font-semibold mb-1">{challenge.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{challenge.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium bg-background/50 px-2 py-1 rounded">{challenge.difficulty}</span>
                <Button size="sm" onClick={() => onSelectChallenge(challenge.id)}>
                  Start
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-xs text-muted-foreground mt-8">Challenges designed by Abhra</div>
    </div>
  )
})

export default ChallengeSelector
