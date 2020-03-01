# Contribution guidelines

Thank you that you'd like to contribute to Babykarte. This set of guidelines is there to help you to understand our working process and to give an overview about the different ways of contributing.

## Mappers

Mappers can help by adding data to OpenStreetMap, the basement for all the POI data we show. You can read [here](usedTags.md) which tags Babykarte processes.

## Customers

### Issues

- If you'd like to report a bug, please give us as little information as possible about
  - what browser and OS are you using
  - does the bug just appear on a specified POI? Or it is appearing across Babykarte? _Link to that POI_
  - the steps to reproduce the problem
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

- **js/filters.js**: The POI filters e.g. changing tables, cafès, restaurants are managed by this module and their profiles are registered just there.

- **js/map.js**: Manages the communication with Leaflet API, manages map events and the map view and map behaviour rules.

- **js/PDV.js**: It manages the POI Details View (PDV) poping up everytime when someone clicks on a marker on the map. It contains the rules what the PDV should contain/show because each POI category (filters are organized in groups as you can see also on the colour legends) has it's own PDV exspecially playgrounds. If you change something there then check if your change works with all POI's listed [here](#validate)

- **js/request.js**: It handles the requests to the Babykarte backend or to other services and provides an API for other modules to use.

- **js/ui.js**: It adds the interactivity to the UI of Babykarte and manages its toggle states. It is also responsible for the notification system and the search.

### Validate

The POIs behind the links tend to have the best dataset to test, if changes to the code in `js/PDV.js` will work for all kind of POI's Babykarte shows. You can use this collection of links to debug and validate new PDV features. This list should be understood just as starting point for testing and is not complete nor accurate. But we aim to give you help via this list.

- [local](http://localhost:8080/#19&54.33396741701923&10.122873812979378), [live](https://babykarte.openstreetmap.de/#19&54.33396741701923&10.122873812979378) &nbsp; Restaurant with some data about baby friendliness.
- [local](http://localhost:8080/#19&54.3474881322212&10.140878587917543), [live](https://babykarte.openstreetmap.de/#19&54.3474881322212&10.140878587917543) &nbsp; POI "Forstbaumschule" with a rich set of data.
- [local](http://localhost:8080/#19&51.5615645&12.9846290), [live](https://babykarte.openstreetmap.de/#19&51.5615645&12.9846290) &nbsp; Hospital "Torgau".
- [local](http://localhost:8080/#19&54.324401566139166&10.124362438982645), [live](https://babykarte.openstreetmap.de/#19&54.324401566139166&10.124362438982645) &nbsp; Cafè "Liebling" with a rich dataset.
- [local](http://localhost:8080/#18&54.32542770245289&10.12296035874897), [live](https://babykarte.openstreetmap.de/#18&54.32542770245289&10.12296035874897) &nbsp; Nappy with a rich dataset.
- [local](http://localhost:8000/#15&52.4009309&13.0591397), [live](https://babykarte.openstreetmap.de/#15&52.4009309&13.0591397) &nbsp; Potsdam has a very good dataset available for testing.
- [local](http://localhost:8080/#19&47.62184500528181&-122.10279844701292), [live](http://babykarte.github.io/#19&47.62184500528181&-122.10279844701292) &nbsp; A playground with equipment mapped seperate in Seattle, USA.
- [local](http://localhost:8080/#15&54.3235354&9.6885383), [live](http://babykarte.github.io/#15&54.3235354&9.6885383) &nbsp; A playground with equipment mapped (not seperate).
- [local](http://localhost:8080/#19&54.32228820781011&10.126189291477205), [live](https://babykarte.openstreetmap.de/#19&54.32228820781011&10.126189291477205) &nbsp; A cafe with `changing_table=limit

## Join the development team

Joining the development is easy and welcome. You become a member of the development team by following and resolving issues (your choice on which to work on). If we notice it that you help to push this project forward on a regular basis, you will be notified via the email address you provided in your GitHub profile. If you prevent your email address from being seen by your profile visitors, then we write you by any network you left on your profile or we open an issue mentioning you and inviting you to become part of the development team. Becoming a member of the development team means for you that you get access granted to upload to our repository when we think we can trust you.
