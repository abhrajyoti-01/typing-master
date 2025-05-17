"use client"

import React from "react"
import { Card } from "@/components/ui/card"

export function SoundDebug() {
  return (
    <div className="p-4 border border-border rounded-md bg-card mt-4">
      <h3 className="font-medium mb-2">Sound Debug Panel</h3>
      <p className="text-sm text-muted-foreground mb-2">Sound effects have been removed from this application.</p>
      <Card className="p-3 bg-muted/30">
        <p className="text-sm text-center">Sound functionality has been disabled</p>
      </Card>
    </div>
  )
}
