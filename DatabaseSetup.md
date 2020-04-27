# Database Setup

We use AWS to host our data. We created a MySQL RDS instance to store the player and game information. We also created an S3 instance to store the game replay data.

Amazon RDS instance:

Had to make the database available to the public.
See <https://stackoverflow.com/questions/37212945/aws-cant-connect-to-rds-database-from-my-machine>

- Free Tier
- host: tron-database.cepklshydjdt.us-east-1.rds.amazonaws.com
- database: main
- username: admin
- password: tronpassword
- port: 3306

## Tables and Schema

### Series

- seriesId[Integer][Primary Key]
- playerOneId[Integer][Foreign Key][Required]
- playerTwoId[Integer][Foreign Key][Required]
- seriesWinner[Integer][Required] (must be FirstBotId or SecondBotId)
- winCount[Integer][Required] (must be b/w 3-5, since every series is best of 5)
- replayLink[String]

### Player

- playerId [Integer][Primary Key]
- botName [String][Required]
- partner1 [String][Required]
- partner2 [String]
- partner3 [String]
- elo [Float]
- score [Float]

Rank should be calculated upon loading, according to score.

## STRETCH

### Account

- accountName [String][Primary Key]
- playerId [Integer][Foreign Key]
- username [String][Required]
- password [String][Required]
- email [String]

### Script

- ScriptId [Integer][Primary Key]
- ScriptString [String][Required]
- PlayerId [Integer][Foreign Key][Required]
