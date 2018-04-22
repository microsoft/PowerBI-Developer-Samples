# 2.0.0-beta.1 (GA candidate)

## Breaking

- DOMContentLoaded handler is now opt-in instead of the default behavior
  - Reasons:
    - The primary use case will be using the core library within another library which may not have the DOM ready even if DOMContentLoaded has fired.
    - Most developers using SPA applications will fetch embed data asynchronously and not know report data by the time the DOMContentLoaded has fired.
  - How to opt-in to DOMContentLoaded:
    - Call `enableAutoEmbed()` on an instance of the PowerBi service to add the event listener.
      
      Example:
      ```
      <script src="powerbi.js"></script>
      <script>
      powerbi.enableAutoEmbed();
      </script>
      ```
      
      Alternately if you are creating an instance of the service you can pass a configuration parameter `autoEmbedOnContentLoaded`
      
      Example:
      ```
      var powerbiService = new Powerbi({ autoEmbedOnContentLoaded: true });
      ```
- `powerbi.get(element: HTMLElement)` now only returns the instance of powerbi component associated with the element and does not implicitly emebed. Use `powerbi.embed(element: HTMLElement, config: IEmbedOptions = {})`.
  - Reasons:
    - powerbi.embed performed the same function and is more semantic.
    - Now that overwrite: true is the default behavior for .embed having a separate method (get) for only retrieving compnents is good separation of intents.
- Embed urls must be provided by the server and will not be constructed by the components. This implies that the attributes `powerbi-report` will no longer be used.
  - Reasons:
  
      The construction of these urls was unreliable since it dependeded on assumptions about server configuration (target environment, component type, etc).
      Since url would be incorrect in some cases it could cause trouble for developers. Also, since the sever is already returning access tokens it's trival for the server to also provide embed urls and this reduces complexity.
  
      Previously you could supply the embed information in two ways:
      
      1. Using report id:
      
      `<div powerbi-embed powerbi-report="5dac7a4a-4452-46b3-99f6-a25915e0fe55" powerbi-access-token="..."></div>`
      
      This would implicitly construct the embed url to be something like: `https://embedded.powerbi.com/reports/5dac7a4a-4452-46b3-99f6-a25915e0fe55`
      However 
      
      2. Using embed url:
      
      `<div powerbi-embed-url="https://embedded.powerbi.com/reports/5dac7a4a-4452-46b3-99f6-a25915e0fe55" powerbi-access-token="..."></div>`
      
      Now only the latter options (#2) is supported.
      
- Embed url attribute changed from `powerbi-embed` to `powerbi-embed-url`
- Component type is specified by attribute `powerbi-type`. Use `powerbi-type="report"` instead of applying the attribute `powerbi-report`
- Configuration settings attributes all start with prefix `powerbi-settings-`.

## Changes

- Fix bug to prevent memory leak of holding references to iframe elements which had been removed from the DOM.
- Detect overwriting container with new component and either throw error or properly cleanup and replace old component based on `config.overwrite` setting. 
- Fix bug with prematurely attempting to parse post message data until it is known that it originated from embedded iframe.
  
# 1.0.0 (Preview)