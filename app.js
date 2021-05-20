/**
 * Name: Nikola Bojanic
 * Date: Wed May 19 2021
 * Section: CSE 154 AF
 * This file provides server side tic tac toe logic
 */
"use strict";

const express = require("express");
const app = express();

const CLIENT_ERROR = 400;
const DEFAULT_PORT = 8000;

let games = {};

/**
 * Join the game with given id or create one if nonexistent.
 * If the game is full joined attribute returned false.
 */
app.get("/start", (req, res) => {
  const gameId = req.query.id;
  if (gameId) {
    let response = {
      joined: false,
      state: null,
      playerId: null
    };
    if (games[gameId]) {
      if (!games[gameId].full) {
        games[gameId].full = true;
        response.joined = true;
        response.state = games[gameId];
        response.playerId = 2;
        res.json(response);
      } else {
        res.json(response);
      }
    } else {
      response.joined = true;
      response.state = newGame(gameId);
      response.playerId = 1;
      res.json(response);
    }
  } else {
    res.status(CLIENT_ERROR).json({error: "Game ID not provided"});
  }
});

/**
 * Fetches the state of a given game
 */
app.get("/state", (req, res) => {
  const gameId = req.query.id;
  if (gameId && games[gameId]) {
    res.json(games[gameId]);
  } else {
    res.status(CLIENT_ERROR).json({error: "Game ID not provided/invalid"});
  }
});

/**
 * Fetches all joinable games
 */
app.get("/games", (req, res) => {
  res.type("text");
  let ids = "";
  const keys = Object.keys(games);
  for (let i = 0; i < keys.length; i++) {
    if (!games[keys[i]].full) {
      ids = ids + " " + keys[i];
    }
  }
  res.send(ids.trim());
});

/**
 * Plays the move specified by the query parameters.
 */
app.get("/move", (req, res) => {
  const row = parseInt(req.query.row);
  const col = parseInt(req.query.col);
  const playerId = parseInt(req.query.playerid);
  const gameId = req.query.gameid;
  if (!isNaN(row) && !isNaN(col) && !isNaN(playerId) && gameId) {
    if (!games[gameId] || !games[gameId].full) {
      res.status(CLIENT_ERROR).json({error: "Invalid game"});
    } else if (games[gameId].toMove !== playerId || games[gameId].board[row][col] !== 0) {
      res.status(CLIENT_ERROR).json({error: "Illegal move"});
    } else {
      move(row, col, gameId);
      res.json(games[gameId]);
    }
  } else {
    res.status(CLIENT_ERROR).json({error: "Missing/improper parameters"});
  }
});

app.use(express.static('public'));

/**
 * Initializes a new game.
 * @param {string} gameId - Id to start game with
 * @returns {{}} - initial game state
 */
function newGame(gameId) {
  const empty = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  const state = {
    full: false,
    board: empty,
    toMove: 2,
    won: 0,
    movesPlayed: 0
  };
  games[gameId] = state;
  return state;
}

/**
 * Plays a move and calculates results
 * @param {number} row - row to play
 * @param {number} col - column to play
 * @param {string} gameId - game board to play on
 */
function move(row, col, gameId) {
  const game = games[gameId];
  game.board[row][col] = game.toMove;
  game.toMove = game.toMove === 1 ? 2 : 1; // Toggle player to move
  game.movesPlayed++;
  const winner = checkWin(game.board);
  if (winner !== 0) {
    game.toMove = 0;
    game.won = winner;
  } else if (game.movesPlayed === game.board.length * game.board[0].length) {
    game.toMove = 0;
  }
}

/**
 * Checks for a winning state
 * @param {{}} board - the current game board
 * @returns {number} - id of the winner (zero if none)
 */
function checkWin(board) {
  let winner = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== 0) {
      winner = board[0][i];
    } else if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== 0) {
      winner = board[i][0];
    }
  }
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== 0) {
    winner = board[0][0];
  } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== 0) {
    winner = board[0][2];
  }
  return winner;
}

const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);