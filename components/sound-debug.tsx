"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSoundEffects } from "@/hooks/use-sound-effects"

export function SoundDebug() {
  const { playKeyPress, playError, playComplete, playChallenge, isInitialized } = useSoundEffects()
  const [debugMessage, setDebugMessage] = useState("")

  const testSound = (name: string, playFunction: () => void) => {
    try {
      setDebugMessage(`Testing ${name} sound...`)
      playFunction()
      setDebugMessage(`${name} sound played successfully`)
    } catch (err) {
      setDebugMessage(`Error playing ${name} sound: ${err}`)
    }
  }

  return (
    <div className="p-4 border border-border rounded-md bg-card mt-4">
      <h3 className="font-medium mb-2">Sound Debug Panel</h3>
      <p className="text-sm text-muted-foreground mb-2">Audio initialized: {isInitialized ? "Yes" : "No"}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        <Button size="sm" onClick={() => testSound("keyPress", playKeyPress)}>
          Test Key Press
        </Button>
        <Button size="sm" onClick={() => testSound("error", playError)}>
          Test Error
        </Button>
        <Button size="sm" onClick={() => testSound("complete", playComplete)}>
          Test Complete
        </Button>
        <Button size="sm" onClick={() => testSound("challenge", playChallenge)}>
          Test Challenge
        </Button>
      </div>
      {debugMessage && <p className="text-sm">{debugMessage}</p>}
    </div>
  )
}
