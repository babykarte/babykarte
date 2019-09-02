## About this quide
This guide exists to
- avoid technical problems when editing code and
- make working with the codebase as easy as possible

## Indentations
Please **don't ever** use spaces for indentations. Please use tabs for indentations. Some code editors allow one to change the tabbing style without disrupting the look of the code for other developers. E.g. gedit allows me to tweak the tab width but this setting does not affect different setups of other developers. To indent via spaces could break someone else's working flow which we want to prevent where possible.

## Strings
- In HTML code we use the `'` char (single quote) to declare strings or values like `'This is a string'`
  - Realistic example: `<img class='small-icon custom-leaflet-icon' src='/images/locating.svg' onclick='requestLocation()' />`
- In JavaScript code and in JSON we use the `"` char (double quote) to declare strings like `"This is a string"`
  - Realistic example for JSON: `{iconUrl: "/markers/marker-green.svg", code: "#00c700"}`
  - Realistic example for JavaScript: `checkbox.id = "filter" + id;`

## Use of `eval()`
The use of `eval` is allowed but please note the following:
- Don't use `eval` in conjunction with data sent back to Babykarte by servers.
- Don't use `eval` in conjunction with user generated code or content.

## Use of cookies and other storage technology
We don't make use of cookies and other opaque technologies on our site. A request that includes the use of these technologies will be rejected.

## Coding long JSON one-liners
Coding long JSON one-liners is allowed as you can see when looking through the code. Most developers should have the tools that helps them to read it. Such functions could be but are not limited to: syntax highlighting, bracket detection, line and column numbering and breakpoints.
You're free to prettify existing one-liners into multi-liners to make the code more readable.

## jQuery
The use of jQuery is allowed but the use of other frameworks is not. This prevents us from loading too many dependencies into the browser's cache and prevents Babykarte from being slowed down.
