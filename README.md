# Tron-Tournament-Runner

## CS1320 Final Project

This is meant to be a webpage for Brown's CS1410 (Intro to AI) final project, the Tron Tournament. The webpage is meant to make the tournament more fun and accessible for students in the class with an interactive leaderboard, match replays, and more information about the tournament.

## How to Run

After pulling repo:

- cd into 'Tron-Tournament-Runner' directory
- 'npm install'
- 'npm start run'

## TODO (in rough priority)

- [DONE] Set up express routing for different pages
- [DONE] Set up Database backend for storing player scripts, match results, player data, etc.
- [DONE] Create Landing/Home page
- [DONE] Create About page
- [DONE] Create leaderboard page template
- [DONE] integrate backend test data with leaderboard, so it pulls from db
- [DONE] Create Student Profile template page
- [DONE] Link players on Leaderboard page to player profile pages
- [DONE] Create Account/Login Page
- [DONE] Make current site and styling look more like the prototype
- Make player profile page look nice
  - [DONE] display series on player page (each series is a clickable link)
  - [DONE] create series replay page
    - display replays on series page
    - style series page
- [DONE] Display match history on Player Profile page
- [DONE] Get EC2 storage working, so replays/scripts can be stored online
- [DONE] Make fake game/series data (or find a way to use data provided by Leon)
- Display replays
- Make series page look nice
- Figure out how to get server to upload and run python scripts
- figure out how to get tournament results
- Figure out how we're going to support accounts/login
  - upon login we can just go straight to the player's page
  - Figure out how this will work with script uploading...

### Basic Features

- Students can upload and submit a python script to the tournament
- The server will run the tournament and visualize results on a daily or pre-determined basis
- The results of tournament matches as well as user rankings are stored in a database
- Students can view leaderboards that get updated as the tournament 'season' continues
- Students can view replays of all past matchups
- Instructions page with details about how the game works, how to submit/participate, etc.
See assignment handout: <https://cs.brown.edu/courses/csci1410/assignments/tron.pdf>

### Stretch Goals

- Customization
- Tournament design and scheduling
- User accounts

## Database Tables and Scheme

See DatabaseSetup.md

### Feature List Details

Our main priority is having a cohesive web application that will display a leaderboard of every student’s submission, as well as a page for every student’s game replays. This will require:

- A web page for displaying the leaderboard
- Linking pages for displaying each student’s replays
- Visualizations for every game replay

A list of what pages/screens your app will include and a brief description of the content that will go on each page/screen

- **Page 1:** Instructions (How to play the game, how to submit a script, etc..)
- **Page 2:** Display rankings of all-tournament (a list of player rankings in descending order)
- **Page 3:** Replays of matches that the tournament runs

Notes on which features will be prioritized vs. what features are secondary
Key features: View rankings of all tournament games, and view replays of matches that the tournament runs.
Secondary features: upload scripts, and tournament running and scheduling.
