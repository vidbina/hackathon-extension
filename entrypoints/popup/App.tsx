import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);
	const openSidePanel = () => {
		// TODO: Remove the popup entrypoint
		// It seems like it may be an either/or deal since I added sidepanel.
		// Couldn't get both to work, so this code was running before, but
		// didn't pull up the sidepanel and a fresh respawn of the browser, now
		// has the sidepanel rendering.
		browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
		console.log("opening?!?");
		console.log(browser);
	};

	return (
		<>
			<div>
				<a href="https://wxt.dev" rel="noreferrer" target="_blank">
					<img alt="WXT logo" className="logo" src={wxtLogo} />
				</a>
				<a href="https://react.dev" rel="noreferrer" target="_blank">
					<img alt="React logo" className="logo react" src={reactLogo} />
				</a>
			</div>
			<h1>WXT + React</h1>
			<div className="card">
				<button onClick={() => { setCount((count) => count + 1); }}>count is {count}</button>
				<button onClick={() => { openSidePanel() }}>open side panel</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the WXT and React logos to learn more</p>
		</>
	);
}

export default App;
