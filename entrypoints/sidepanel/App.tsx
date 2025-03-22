'use client'

//import { WxtWindowEventMap } from "wxt/client";
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
	answer?: string
}

const allTasks: Task[] = [
	{ id: '1', text: 'Fill-in Q3', status: 'working', answer: "we're good but if a magical unicorn squirel of a cofounder pops by, we'll take em." },
	{ id: '2', text: 'Fill-in Q2', status: 'completed', answer: "Na'aman and David" },
	{ id: '3', text: 'Fill-in Q1:', status: 'completed', answer: "Na'aman and Asaf are childhood friends from way back in Israel. David and Na'aman met on the job at P&B when David hired Na'aman to help push tech, we're deciding to solve the gruntwork problem in innovation/research and we've just spent the most intense few hours together (not only because of the elevator)." },
	{ id: '4', text: 'Computing answers', status: 'completed', },
	{ id: '5', text: 'gdrive', status: 'completed', indent: true },
	{ id: '6', text: 'slack', status: 'completed', indent: true },
	{ id: '7', text: 'notion', status: 'completed', indent: true },
	{ id: '8', text: 'news.ycombinator.com', status: 'completed', indent: true },
	{ id: '9', text: 'Checking data sources', status: 'completed' },
	{ id: '10', text: 'Extracting application fields', status: 'completed' },
	{ id: '11', text: 'Analyse application', status: 'completed' },
	{ id: '12', text: 'Qualify instruction', status: 'completed' }
]

// For a given assignment, we produce a suggestion of steps and then work
// through them step-by-step and adapt as necessary
// (assignment) -> [suggested_steps]
// for every step, we should now be able to produce the next step:
// (step_input) -> step_output
type StepInput =
	| { type: 'browseTo'; url: string }
	| { type: 'capturePage' }
	| { type: 'scrollHorizontallyTo'; value: number; unit: 'percentage' | 'pixels' }
	| { type: 'focusItem'; identifier: string }
	| { type: 'promptUser'; message: string }
	| { type: 'click' }
	| { type: 'enterText'; text: string }

// type StepOutput = {
// 	status: 'success' | 'pending' | 'failure',
// 	input: StepInput,
// 	history: string[],
// 	context: {
// 		// arbitrary fields
// 	},
// }

const findFlightOnGoogle: StepInput[] = [
	{ type: 'browseTo', url: 'https://www.google.com/travel/flights' },
	{ type: 'focusItem', identifier: '[placeholder="Where from?"]' },
	{ type: 'enterText', text: 'New York' },
	{ type: 'click', },
	{ type: 'focusItem', identifier: '[placeholder="Where to?"]' },
	{ type: 'enterText', text: 'Zurich' },
	{ type: 'click', },
	{ type: 'focusItem', identifier: '[aria-label="Search flights"]' },
	{ type: 'click', },
	{ type: 'capturePage' }
]

// Background task execution helpers
const executeInBackground = {
	browseTo: async (tabId: number, url: string): Promise<void> => {
		await chrome.tabs.update(tabId, { url });
		return new Promise((resolve) => {
			chrome.tabs.onUpdated.addListener(function listener(tid, info) {
				if (tid === tabId && info.status === 'complete') {
					chrome.tabs.onUpdated.removeListener(listener);
					resolve();
				}
			});
		});
	},

	executeScript: async <T>(tabId: number, func: () => T, args?: any[]): Promise<T> => {
		const [{ result }] = await chrome.scripting.executeScript({
			target: { tabId },
			func,
			args
		});
		return result;
	},

	capturePage: async (tabId: number) => {
		return await executeInBackground.executeScript(tabId, () => {
			return {
				width: document.documentElement.scrollWidth,
				height: document.documentElement.scrollHeight,
				title: document.title
			};
		});
	},

	focusItem: async (tabId: number, selector: string) => {
		return await executeInBackground.executeScript(
			tabId,
			(sel: string) => {
				const el = document.querySelector(sel);
				if (!el) throw new Error(`Element not found: ${sel}`);
				(el as HTMLElement).focus();
			},
			[selector]
		);
	},

	click: async (tabId: number) => {
		return await executeInBackground.executeScript(tabId, () => {
			if (!document.activeElement) throw new Error('No active element');
			(document.activeElement as HTMLElement).click();
		});
	},

	enterText: async (tabId: number, text: string) => {
		return await executeInBackground.executeScript(
			tabId,
			(input: string) => {
				if (!document.activeElement) throw new Error('No active element');
				const el = document.activeElement as HTMLElement;
				
				if ('value' in el) {
					(el as HTMLInputElement).value = input;
					el.dispatchEvent(new Event('input', { bubbles: true }));
					el.dispatchEvent(new Event('change', { bubbles: true }));
				} else if (el.isContentEditable) {
					el.textContent = input;
					el.dispatchEvent(new Event('input', { bubbles: true }));
				} else {
					throw new Error('Active element cannot accept text input');
				}
			},
			[text]
		);
	}
};

// Execute a sequence of steps
const executeSteps = async (steps: StepInput[]): Promise<void> => {
	const tab = await chrome.tabs.create({ active: true });
	if (!tab.id) throw new Error('Failed to create tab');

	for (const step of steps) {
		try {
			switch (step.type) {
				case 'browseTo':
					await executeInBackground.browseTo(tab.id, step.url);
					break;
				case 'capturePage':
					await executeInBackground.capturePage(tab.id);
					break;
				case 'focusItem':
					await executeInBackground.focusItem(tab.id, step.identifier);
					break;
				case 'click':
					await executeInBackground.click(tab.id);
					break;
				case 'enterText':
					await executeInBackground.enterText(tab.id, step.text);
					break;
				case 'promptUser':
					// Handle user prompts separately
					break;
				case 'scrollHorizontallyTo':
					// Implement scroll handling
					break;
			}
		} catch (error) {
			console.error(`Step failed: ${step.type}`, error);
			throw error;
		}
	}
};

export default function Popup() {
	const [workspace, setWorkspace] = React.useState(workspaces[0])
	const [command, setCommand] = React.useState("fill in the blanks")
	const [tasks, setTasks] = React.useState<Task[]>([])

	const scrollAreaRef = React.useRef<HTMLDivElement>(null)
	const [isAnimating, setIsAnimating] = React.useState(false)

	const startAnimation = React.useCallback(() => {
		if (isAnimating) return

		setIsAnimating(true)
		setTasks([]) // Reset tasks before starting new animation

		let currentIndex = allTasks.length - 1 // Start from the end

		const addTask = () => {
			if (currentIndex >= 0) {
				setTasks(prev => [allTasks[currentIndex], ...prev]) // Add to beginning of array
				currentIndex--

				// Scroll to top since we're prepending
				if (scrollAreaRef.current) {
					const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
					if (scrollContainer) {
						scrollContainer.scrollTop = 0
					}
				}

				// Schedule next task with random delay (max 300ms)
				const delay = Math.random() * 1000
				setTimeout(addTask, delay)
			} else {
				setIsAnimating(false)
			}
		}

		// Start adding tasks
		addTask()
	}, [isAnimating])

	// TODO: Abstract this into a central place later
	const requestPermission = (permission_type: 'clipboardRead' | 'clipboardWrite', origin: string): boolean => {
		//const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
		const queryOpts = { permissions: [permission_type], origins: [origin] };

		chrome.permissions.request(queryOpts, (granted) => {
			if (granted) {
				console.log("yay");
				return true;
			} else {
				console.log("nope")
				return false;
			}
		});
	}

	const insertByPasting = async (activeElement: Element, text: string) => {
		// Inside the active tab, paste text into the active element 
		const data = new DataTransfer();
		data.setData('text', text);

		console.log("💃 do the paste dance");
		if (requestPermission('clipboardRead',)) {
			console.log("🧨 firing event on active el", activeElement);
			activeElement.dispatchEvent(
				new ClipboardEvent('paste', { clipboardData: data, bubbles: true, })
			);
		} else {
			alert('we need different permissions, boss')
		};

	}

	const insertByTyping = (activeElement: Element, text: string) => {
		// Inside the active tab, insert text into the active element using keyboard events
		for (let char of text) {
			const event = new KeyboardEvent('keydown', { key: char, bubbles: true });
			activeElement.dispatchEvent(event);
		}
	}

	const insertTextInActiveTab = (text: string) => {
		// This function will be injected into the active page
		const activeElement = document.activeElement;
		console.log("🎯", activeElement)
		if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
			activeElement.value = text;
		} else if (activeElement && activeElement.isContentEditable) {
			activeElement.innerText = text;
		} else {
			console.log("🏗️ trying to paste or type")

			try {
				// TODO: figure out how to xs WxtWindowEventMap
				// console.log("paste event", WxtWindowEventMap.paste);
				console.log("we have to solve this!")
				//insertByTyping(activeElement, text);
				for (let char of text) {
					const event = new KeyboardEvent('keydown', { key: char, bubbles: true });
					activeElement.dispatchEvent(event);
				}
			} catch (err) {
				console.error("Failed to write to clipboard:", err);
				alert("Failed to copy text to clipboard. Please check permissions.");

			}
		}
	}

	const insertText = async (text: string) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id) {
				const url = tabs[0].url

				console.log("🚪 request permissions for", url);
				chrome.permissions.getAll((permissions) => {
					console.log("🚪 current permissions", permissions);
				});

				requestPermission('clipboardWrite', url);
				requestPermission('activeTab', url);

				//await navigator.clipboard.writeText(text);
				console.log("📋 Text copied to clipboard:", text);

				console.log("🎉 wrecking your tab", tabs[0]);

				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: insertTextInActiveTab,
					args: [text] // Replace with your text
				});
			}
		});
	}

	const run = insertText;

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
				<div className="h-11 shrink-0 px-4 flex items-center gap-2 border-b bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors" onClick={() => { setTasks([]) }}>
					<Bot className="w-4 h-4 text-muted-foreground" />
					<h2 className="text-sm font-medium text-muted-foreground">Activity Log</h2>
				</div>

				{/* Main Content Area with ScrollArea */}
				<div className="flex-1 flex flex-col min-h-0">
					<ScrollArea className="flex-1" ref={scrollAreaRef}>
						<div className="p-4">
							<div className={`flex items-start justify-between gap-2 py-2 border-b border-border/40 last:border-0`}>
								<Button className="h-10 px-4 flex items-center gap-2" onClick={() => {console.log("A")}}>enter text</Button>
								<Button className="h-10 px-4 flex items-center gap-2" onClick={() => {console.log("B")}}>select calendar add</Button>
							</div>
							{[...tasks].reverse().map((task) => (
								<div
									key={task.id}
									className={`flex items-start justify-between gap-2 py-2 border-b border-border/40 last:border-0 ${task.indent ? 'ml-6' : ''
										}`}
									onClick={() => {
										console.log('task', task)
										if (task.answer) {
											insertText(task.answer)
										} else {
											alert("couldn't compute this, boss. info was lacking");
										}
									}}
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
										className={`capitalize opacity-70 font-normal text-xs whitespace-nowrap ${task.status === 'working' ? 'animate-pulse' : ''
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
						<Button className="h-10 px-4 flex items-center gap-2" onClick={startAnimation}>
							<Sparkles className="w-4 h-4" />
							<span className="text-sm">Run</span>
						</Button>
					</div>
				</footer>
			</Card>
		</div>
	)
}
