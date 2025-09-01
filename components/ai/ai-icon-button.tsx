"use client"

import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

type AiIconButtonProps = {
  onClick?: () => void
}

export function AiIconButton({ onClick }: AiIconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="AI suggestions"
      title="AI suggestions"
      onClick={onClick}
      className="text-foreground hover:text-foreground/80"
    >
      <Bot className="h-5 w-5" />
      <span className="sr-only">AI suggestions</span>
    </Button>
  )
}

export default AiIconButton
