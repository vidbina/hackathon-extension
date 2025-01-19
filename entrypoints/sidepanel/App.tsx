import { useState } from "react";

import * as React from "react"
import { Bot, Send, Sparkles } from 'lucide-react'
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
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
  { id: '2', text: 'Plan spreadsheet data-entry effort', status: 'completed' },
  { id: '3', text: 'Search websites for input:', status: 'completed' },
  { id: '4', text: 'https://a16z.com/', status: 'completed', indent: true },
  { id: '5', text: 'https://www.openocean.vc/', status: 'completed', indent: true },
  { id: '6', text: 'https://lakestar.com/', status: 'completed', indent: true },
  { id: '7', text: 'https://atlanticlabs.de/', status: 'completed', indent: true },
  { id: '8', text: 'https://www.balderton.com/', status: 'completed', indent: true },
  { id: '9', text: 'https://www.imaginary.vc', status: 'failed', indent: true },
  { id: '10', text: 'Plan which input is needed per investor', status: 'completed' }
]

function Popup() {
  const [workspace, setWorkspace] = React.useState(workspaces[0])
  const [command, setCommand] = React.useState("Complete the form by finding the missing information")

  return (
    <Card className="w-[400px] h-[600px] flex flex-col">
      {/* Workspace Selector */}
      <div className="p-4 border-b">
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
      </div>

      {/* Audit Log */}
      <div className="flex flex-col flex-1">
        <div className="px-4 py-2 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground">Activity Log</h2>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start justify-between gap-2 pb-3 border-b border-border/40 last:border-0 ${
                  task.indent ? 'ml-6' : ''
                }`}
              >
                <span className="text-sm">
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
                  className={`capitalize opacity-70 font-normal text-xs ${
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
      <div className="p-6 border-t bg-muted/30">
        <div className="flex gap-3 items-start relative">
          <Sparkles className="w-5 h-5 absolute left-3 top-[18px] text-primary" />
          <Textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1 pl-10 min-h-[64px] resize-none bg-background shadow-sm"
            placeholder="Enter your command..."
          />
          <Button size="icon" className="shrink-0 h-12 w-12 mt-0">
            <Send className="w-5 h-5" />
            <span className="sr-only">Send command</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1>Chorebot</h1>
			<Popup />
		</>
	);
}

export default App;
