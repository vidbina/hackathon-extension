import { defineConfig, defineRunnerConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	extensionApi: "chrome",
	modules: ["@wxt-dev/module-react"],
	manifest: {
		icons: {
			16: '/icon/icon-16.png',
			24: '/icon/icon-24.png',
			32: '/icon/icon-32.png',
			45: '/icon/icon-48.png',
			96: '/icon/icon-96.png',
			128: '/icon/icon-128.png',
		},
		optional_host_permissions: [
			"https://*/*",
			"http://*/*"
		],
		optional_permissions: ["activeTab", "clipboardRead", "clipboardWrite"],
	},

	runner: defineRunnerConfig({
		chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
	}),
});