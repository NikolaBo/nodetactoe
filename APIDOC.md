# Node Tac Toe API Documentation
The API provides game mechanics for tic tac toe

## Start a game
**Request Format:** /start

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Start a game


**Example Request:** /start?id=test

**Example Response:**
```
{
  "joined": true,
  "state": {
    "full": false,
    "board": [[0,0,0],[0,0,0],[0,0,0]],
    "toMove" :2,
    "won":0,
    "movesPlayed":0
  },
  "playerId": 1
}
```

**Error Handling:**
400 if invalid/missing id

## Play a move
**Request Format:** /move

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Make a move


**Example Request:** /move?gameid=test&playerid=2&row=0&col=0

**Example Response:**
```
{
  "full": true,
  "board": [[2,0,0],[0,0,0],[0,0,0]],
  "toMove" :1,
  "won":0,
  "movesPlayed":1
}
}
```

## Get board state
**Request Format:** /state

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retreive the current game status


**Example Request:** /state?id=mygame

**Example Response:**
```
{
  "full": true,
  "board": [[2,0,0],[0,0,0],[0,0,0]],
  "toMove" :1,
  "won":0,
  "movesPlayed":1
}
}
```

## Get open games
**Request Format:** /games

**Request Type:** GET

**Returned Data Format**: Text

**Description:** Retrieve a list of joinable games


**Example Request:** /games

**Example Response:**
```
game1 game2 game3 game4
```