# Contribution guidelines

Thank you that you'd like to contribute to Babykarte. This set of guidelines is there to help you to understand our working process and to give an overview about the different ways of contributing.

## Mappers

Mappers can help by adding data to OpenStreetMap, the basement for all the POI data we show. You can read [here](usedTags.md) which tags Babykarte processes.

## Customers

### Issues

- If you'd like to report a bug, please give us as little information as possible about
  - what browser and OS are you using?
  - does the bug just appear on a specified POI? Link to that POI? Or it is appearing across Babykarte?
  - What are the steps to reproduce the problem?
- If you'd like to suggest a feature, please keep in mind that this map is mainly aimed at parents of babies and toddlers. New filters should contain POIs that are relevant for that age group. So e.g. no schools or youth centres.

## Developers

### Pull requests

- Before creating a pull request, please have a look at the issues. Maybe your idea has been discussed before.
- If you'd like to add features to the map (e.g. an additional filter), maybe it's a good idea to first create an issue so that we can discuss if the addition is really fitting to the project.
- Please create pull requests against the `devel` branch, not `master`.

Code contributions must follow the [code style rules](CODESTYLE.md) which is there to avoid technical problems when editing code and to make working with the codebase possible

### Code is too complicated

You can always drop me a line via e-mail (see my GitHub account) but the following should give you a starting point:

- **js/de.js**: Language file for the German language. Improvements to the German texts shown in the UI belong there.

- **js/en.js**: Language file for the English language. Improvements to the English texts shown in the UI belong there.

- **js/de.js**: Language file for the French language. Improvements to the French texts shown in the UI belong there.

- **js/lang.js**: It manages the language switching system of Babykarte and keeps track of the default language of the user, the already registered language files of Babykarte, provides an API for all other code modules to easily access and display UI texts in the right language and does the error handling in cases when something goes terrible wrong with the language loading process.

- **js/filters.js**: The POI filters e.g. changing tables, cafès, restaurants are managed by these module and their profiles are registered just there.

- **js/map.js**: Manages the communication with Leaflet API, manages map events and the map view and map behaviour rules.

- **js/PDV.js**: It manages the POI Details View (PDV) poping up everytime when someone clicks on a marker on the map. It contains the rules what the PDV should contain/show because each POI category (filters are organized in groups as you can see also on the colour legends) has it's own PDV exspecially playgrounds.

- **js/request.js**: It handles the requests to the Babykarte backend and provides an API for other modules to use.

- **js/ui.js**: It adds the interactivity to the UI of Babykarte and manages its toggle states.

### Join the development team

Joining the development is easy and welcome. You become a member of the development team by following and resolving issues (your choice on which to work on). If we notice it that you help to push this project forward on a regular basis, you will be notified via the email address you provided in your GitHub profile. If you prevent your email address from being seen by your profile visitors, then we write you by any network you left on your profile or we open an issue mentioning you and inviting you to become part of the development team. Becoming a member of the development team means for you that you get access granted to upload to our repository when we think we can trust you.
