'use client'

import * as React from "react"
import { Bot, Sparkles } from 'lucide-react'
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

const workspaces = [
  "Founders Space",
  "Tech Hub",
  "Startup Central",
  "Innovation Lab"
]

interface Task {
  id: string
  text: string
  status: 'working' | 'completed' | 'failed'
  indent?: boolean
  url?: string
}

const tasks: Task[] = [
  { id: '1', text: 'Data-entry into gsheet', status: 'working' },
  { id: '2', text: 'Plan spreadsheet data-entry', status: 'completed' },
  { id: '3', text: 'Search websites for input:', status: 'completed' },
  { id: '4', text: 'https://a16z.com/', status: 'completed', indent: true },
  { id: '5', text: 'https://www.openocean.vc/', status: 'completed', indent: true },
  { id: '6', text: 'https://lakestar.com/', status: 'completed', indent: true },
  { id: '7', text: 'https://atlanticlabs.de/', status: 'completed', indent: true },
  { id: '8', text: 'https://www.balderton.com/', status: 'completed', indent: true },
  { id: '9', text: 'https://www.imaginary.vc', status: 'failed', indent: true },
  { id: '10', text: 'Plan which input is needed per investor', status: 'completed' },
  { id: '11', text: 'Analyse task', status: 'completed' },
  { id: '12', text: 'Qualify instruction', status: 'completed' }
]

export default function Popup() {
  const [workspace, setWorkspace] = React.useState(workspaces[0])
  const [command, setCommand] = React.useState("Complete the form by finding the missing information")

  return (
    <Card className="w-full h-screen max-h-[600px] flex flex-col">
      {/* Workspace Selector */}
      <header className="h-16 shrink-0 px-4 py-3 border-b">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Workspace</span>
          <Select value={workspace} onValueChange={setWorkspace}>
            <SelectTrigger className="flex-1">
              <SelectValue>{workspace}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((ws) => (
                <SelectItem key={ws} value={ws}>
                  {ws}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Audit Log Header */}
      <div className="h-11 shrink-0 px-4 flex items-center gap-2 border-b bg-muted/30">
        <Bot className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground">Activity Log</h2>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start justify-between gap-2 pb-3 border-b border-border/40 last:border-0 ${
                task.indent ? 'ml-6' : ''
              }`}
            >
              <span className="text-sm break-all pr-2 flex-1">
                {task.url ? (
                  <a
                    href={task.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {task.text}
                  </a>
                ) : (
                  task.text
                )}
              </span>
              <Badge
                variant={
                  task.status === 'completed'
                    ? 'secondary'
                    : task.status === 'failed'
                    ? 'destructive'
                    : 'default'
                }
                className={`capitalize opacity-70 font-normal text-xs whitespace-nowrap ${
                  task.status === 'working' ? 'animate-pulse' : ''
                }`}
              >
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Command Input */}
      <footer className="h-20 shrink-0 px-6 py-5 border-t bg-muted/30">
        <div className="flex items-center gap-3 h-full">
          <div className="flex-1 flex items-center gap-3 p-2">
            <Textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 h-5 resize-none bg-background rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-1 ring-ring/20"
              placeholder="Enter your command..."
            />
            <Button className="h-10 px-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Run</span>
            </Button>
          </div>
        </div>
      </footer>
    </Card>
  )
}
