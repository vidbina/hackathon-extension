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
  "Founders",
  "CDMX 2025 Family Trip",
  "Real estate hunt",
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
  { id: '10', text: 'Plan data fetch list per investor', status: 'completed' },
  { id: '11', text: 'Analyse task', status: 'completed' },
  { id: '12', text: 'Qualify instruction', status: 'completed' }
]

export default function Popup() {
  const [workspace, setWorkspace] = React.useState(workspaces[0])
  const [command, setCommand] = React.useState("Complete the form by finding the missing information")

  return (
    <div className="flex h-lvh w-full bg-gradient-to-b from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-2">
      <Card className="w-full flex flex-col">
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

        {/* Main Content Area with ScrollArea */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="p-4">
			  {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start justify-between gap-2 py-2 border-b border-border/40 last:border-0 ${
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
        </div>

        {/* Command Input */}
        <footer className="h-20 shrink-0 px-6 py-5 border-t bg-muted/30">
          <div className="flex items-center gap-3 h-full">
            <Textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 h-10 resize-none bg-background rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-1 ring-ring/20"
              placeholder="Enter your command..."
            />
            <Button className="h-10 px-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Run</span>
            </Button>
          </div>
        </footer>
      </Card>
    </div>
  )
}
