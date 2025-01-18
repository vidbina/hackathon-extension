# Extension: Chorebot

This extension built with WXT + React is an attempt to provide browser users an AI-enabled chore-running machine.

## Background

See https://github.com/wxt-dev/examples/tree/main/examples for some examples for specific cases.

Here are some capabilities that we will need to verify:
- [ ] Capture screenshot along with dimensions and scroll position
  See [`browser.tabs.captureVisibleTab()`](https://github.com/wxt-dev/examples/blob/main/examples/active-tab-screenshot/entrypoints/background.ts#L6C44-L6C51) which we can trigger in background.ts and then use this to send the image to the processing backend.
- [ ] Overlay polygons that track scrolling position on the active tab
  See https://github.com/wxt-dev/examples/tree/main/examples/vue-overlay for a non-scrolling variant in Vue.
- [ ] Open an audio stream to capture audio and route back audio (for the conversational thing)
  Seems possible based on https://developer.chrome.com/docs/extensions/how-to/web-platform/screen-capture. We may need to use the Offscreen API `chrome.offscreen` for a smoother experience (i.e.: not disrupting the UX on the active tab).
- [ ] Check ability to switch active tab
- [ ] Check ability to operate across multiple tabs

### User TODOs

- [ ] Stub sidebar/sidepane for the main UI
- [ ] Create chat input box where user can add their prompt
- [ ] Create workspace selection dropdown, where user to scope the context to a given workspace
- [ ] Create Status report list where user can see what the machine is doing

```mermaid
zenuml
    title Prototype
    @Actor User

    group BrowserScope {
        @Boundary Browser
        BrowserExtension
    }
    
    group Backend {
      @Lambda API
      @Entity AI
      @Entity Engine
    }

    @Starter(User)
    BrowserExtension.instruct(query) {
        screenshot = Browser.captureScreenshot();
        url = Browser.url;
        screen_dims = Browser.tabDimensions;
        scroll_pos = Browser.scrollPosition;
        // `POST /query`
        API.plan(workspace, query, screenshot, url, screen_dims, scroll_pos) {
            // Qualify: Is the instruction clear enough in the context of the screenshot and workspace context? If not, what do we still need to know?
            is_qualified = AI.reason(clarity_prompt, query, screenshot)
            if(is_qualified) {
                // Plan: Break down the request into a sequence of well-defined steps to complete
                // TODO: Defined these intents/step types
                plan = AI.plan(clarity_prompt, query, screenshot)
                while(plan AND spent_credits < max_run_credits) {
                    run_result = Engine.run(plan_step)
                    API -> BrowserExtension: run_result
                }
            } else {
                API -> BrowserExtension: clarification_request
            }
        }
    }
```

### Dev TODOs

> [!NOTE]
> These are just nice things to simplify development

- [ ] Add Storybook to simplify component development