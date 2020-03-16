# Cosmonaut
Cosmonaut is an application for querying Cosmos databases using the Gremlin querying language.

## About
Cosmos Emulator does not ship with any sort of client supporting the Gremlin querying language, and Azure portal only has a single line input for writing queries, while also being clunky to use when switching databases and collections. This application is intended as a remedy for these issues.

The application features connection profiles that allow for easy connecting to and switching between various databases, be they hosted in Azure or by Cosmos Emulator.

![Profile listing](screenshots/profile-list.png) 
![Profile form](screenshots/profile-form.png)

When connected to a profile, queries are written in Monaco Editor, and output is shown as formatted JSON.

![Profile form](screenshots/app-view.png)

## Installation

Run ``yarn`` to download the dependencies, ``yarn build`` to build the project and ``yarn electron`` to start the application.
