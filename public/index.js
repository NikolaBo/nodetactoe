/**
 * Name: Nikola Bojanic
 * Date: Wed May 19 2021
 * Section: CSE 154 AF
 * This file provides client side tic tac toe logic
 */
"use strict";
(function() {

  window.addEventListener("load", init);

  let gameId;
  let playerId;
  let toMove;
  const FETCH_INTERVAL = 1500;

  /**
   * Initialize the button to respond to click.
   */
  function init() {
    fetchGames();
    document.querySelector("button").addEventListener("click", onSubmit);
    const squares = document.querySelectorAll("#grid div");
    for (let i = 0; i < squares.length; i++) {
      squares[i].addEventListener("click", makeMove);
    }
  }

  /**
   * Attempt to make a move.
   */
  async function makeMove() {
    if (toMove === playerId) {
      try {
        const pos = this.id.split("x");
        const url = `/move?gameid=${gameId}&playerid=${playerId}&row=${pos[1]}&col=${pos[2]}`;
        let response = await fetch(url);
        response = await statusCheck(response);
        response = await response.json();
        updateBoard(response);
      } catch (err) {
        handleError(err);
      }
    }
  }

  /**
   * Sets display of active games
   */
  async function fetchGames() {
    try {
      let response = await fetch("/games");
      response = await statusCheck(response);
      response = await response.text();
      document.getElementById("open").textContent = response;
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Initiates a game with the selected ID
   */
  async function onSubmit() {
    const id = document.querySelector("input").value;
    if (id) {
      document.querySelector("input").value = "";
      try {
        let response = await fetch(`/start?id=${id}`);
        response = await statusCheck(response);
        response = await response.json();
        if (response.joined) {
          gameId = id;
          playerId = response.playerId;
          updateBoard(response.state);
          setInterval(fetchState, FETCH_INTERVAL);
          document.getElementById("start-view").classList.add("hidden");
          document.getElementById("game-view").classList.remove("hidden");
        } else {
          handleError("Game full!");
        }
      } catch (err) {
        handleError(err);
      }
    }
  }

  /**
   * Fetches the current game state
   */
  async function fetchState() {
    try {
      let response = await fetch(`/state?id=${gameId}`);
      response = await statusCheck(response);
      response = await response.json();
      updateBoard(response);
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Updates game board based on server state
   * @param {[]} state - the current state of the game
   */
  function updateBoard(state) {
    toMove = state.toMove;
    document.getElementById("you").textContent = playerId;
    const board = state.board;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        let char;
        if (board[i][j] !== 0) {
          char = board[i][j] === 1 ? "x" : "o";
        } else {
          char = "‎‎‎‏‏‎ ‎";
        }
        document.getElementById(`x${i}x${j}`).textContent = char;
      }
    }

    if (state.toMove !== 0) {
      document.getElementById("current").textContent = state.toMove;
    } else {
      document.querySelector("h3").classList.add("hidden");
      document.getElementById("over").classList.remove("hidden");
      if (state.won !== 0) {
        document.getElementById("win").textContent = `Player ${state.won} won!`;
      } else {
        document.getElementById("win").textContent = "Tie!";
      }
    }
  }

  /**
   * Warns the user of an error
   * @param {string} err - error information to be displayed
   */
  function handleError(err) {
    const errorDisplay = document.getElementById("error");
    errorDisplay.classList.remove("hidden");
    errorDisplay.textContent = `Something went wrong. [${err}]`;
  }

  /**
   * Throws an error if response status not OK
   * @param {response} response - the response to examine
   * @returns {response} response
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }
})();