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

> [!WARNING]
> Seems like ZenUML is too new for GH support quite yet, so go to the MermaidJS Live Editor to see what this is all about.

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
      @RDS DB
    }

    @Starter(User)
    BrowserExtension.instruct(query) {
        screenshot = Browser.captureScreenshot();
        url = Browser.url;
        screen_dims = Browser.tabDimensions;
        scroll_pos = Browser.scrollPosition;
        // `POST /query`
        API.plan(workspace, instruction, screenshot, url, screen_dims, scroll_pos) {
            DB.write(request)
            // Qualify: Is the instruction clear enough in the context of the screenshot and workspace context? If not, what do we still need to know?
            Engine.qualify(request) {
                res = AI.reason(QUALIFICATION_PROMPT, request)
                if(res = ok) {
                    // Plan: Break down the request into a sequence of well-defined steps to complete
                    // TODO: Defined these intents/step types
                    Engine.plan(request) {
                        plan = AI.plan(PLANNING_PROMPT, request)
                        while(plan) {
                            Engine.run(plan_step) {
                                DB.write(plan_step)
                                Engine -> API : step_commands
                                API -> BrowserExtension: step_commands
                                BrowserExtension -> Browser: step_commands
                                Browser -> BrowserExtension : step_report
                                // `POST /results/{step_id}`
                                BrowserExtension -> API.update()
                                
                            }
                        }
                    }
                    
                } else {
                    API -> BrowserExtension: clarification_request
                }
            }
            
        }
    }
```

### Dev TODOs

> [!NOTE]
> These are just nice things to simplify development

- [ ] Add Storybook to simplify component development