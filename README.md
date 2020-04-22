# Tron-Tournament-Runner

## CS1320 Final Project

## TODO

- [DONE] Set up express routing for different pages
- Set up Database backend for storing player scripts, match results, player data, etc.
- [DONE] Create Landing/Home page
- [DONE] Create About page
- [DONE] Create leaderboard page template
- integrate backend test data with leaderboard, so it pulls from db
- Create Student Profile template page
- Create Account/Login Page
  - Figure out how we're going to support accounts/login
  - Figure out how this will work with script uploading...
- Figure out how to display replays

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

## Database Scheme

Tables and Schema

Games

- GameId[Integer][Primary Key]
- FirstBotId[Integer][Foreign Key][Required]
- SecondBotId[Integer][Foreign Key][Required]
- SeriesId[Integer][Foreign Key][Required]
- GameWinner[Integer] (must be FirstBotId or SecondBotId)
- ReplayId[Integer]

Series

- SeriesId[Integer][Primary Key]
- FirstBotId[Integer][Foreign Key][Required]
- SecondBotId[Integer][Foreign Key][Required]
- SeriesWinner[Integer][Required] (must be FirstBotId or SecondBotId)

Players/Bots

- BotId [Integer][Primary Key]
- BotName [String][Required]
- Partner1 [String][Required]
- Partner2 [String]
- Partner3 [String]
- Rank [Integer]
- ELO [Float]
- Score [Float]

Replays

- ReplayId [Integer][Primary Key]

STRETCH

Players/Accounts:
Scripts:

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
