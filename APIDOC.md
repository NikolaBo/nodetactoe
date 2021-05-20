# Node Tac Toe API Documentation
The API provides game mechanics for tic tac toe

## Start a game
**Request Format:** /start?id=yourid

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

## *Fill in Endpoint 2 Title*
**Request Format:** *Fill in example request format*

**Request Type:** *Fill in request type*

**Returned Data Format**: JSON

**Description:** *Fill in description*

**Example Request:** *Fill in example request*

**Example Response:**
*Fill in example response in the {}*

```json
{

}
```

**Error Handling:**
*Fill in an example of the error handling*
