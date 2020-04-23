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

### Game

- GameId[Integer][Primary Key]
- FirstBotId[Integer][Foreign Key][Required]
- SecondBotId[Integer][Foreign Key][Required]
- SeriesId[Integer][Foreign Key][Required]
- GameWinner[Integer] (must be FirstBotId or SecondBotId)
- ReplayId[Integer]

### Series

- SeriesId[Integer][Primary Key]
- FirstBotId[Integer][Foreign Key][Required]
- SecondBotId[Integer][Foreign Key][Required]
- SeriesWinner[Integer][Required] (must be FirstBotId or SecondBotId)

### Player

- PlayerId [Integer][Primary Key]
- BotName [String][Required]
- Partner1 [String][Required]
- Partner2 [String]
- Partner3 [String]
- ELO [Float]
- Score [Float]

Rank should be calculated upon loading, according to score.

### Replay

- ReplayId [Integer][Primary Key]
- link [String][Required]

## STRETCH

### Account

 - AccountName [String][Primary Key]
 - PlayerId [Integer][Foreign Key]
 - Username [String][Required]
 - Password [String][Required]
 - Email [String]

### Script

 - ScriptId [Integer][Primary Key]
 - ScriptString [String][Required]
 - PlayerId [Integer][Foreign Key][Required]