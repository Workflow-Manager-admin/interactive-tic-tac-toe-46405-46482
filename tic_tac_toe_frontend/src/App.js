import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Checks if a player has won. Returns "X", "O", or null.
 * @param {Array} squares - 9-element array of board.
 */
function calculateWinner(squares) {
  // Lines for a 3x3 board
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

/**
 * @returns true if board is full and no winner
 */
function isDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

// PUBLIC_INTERFACE
/**
 * Renders a square cell.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " ttt-square-highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Square: ${value}` : "Empty Square"}
      disabled={!!value}
      tabIndex="0"
      type="button"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
/**
 * Renders the Tic Tac Toe Board.
 */
function Board({ squares, onCellClick, winningLine }) {
  function renderSquare(idx) {
    return (
      <Square
        key={idx}
        value={squares[idx]}
        onClick={() => onCellClick(idx)}
        highlight={winningLine.includes(idx)}
      />
    );
  }

  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return renderSquare(idx);
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Main application component for the Tic Tac Toe game.
 */
function App() {
  const [theme, setTheme] = useState("light");
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // true => X, false => O
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [winningLine, setWinningLine] = useState([]);

  // Effect for theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Effect to update status and winning line
  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setStatus(`Winner: ${winner}`);
      // Find line
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      const win = lines.find(
        ([a, b, c]) =>
          squares[a] && squares[a] === squares[b] && squares[a] === squares[c]
      );
      setWinningLine(win || []);
    } else if (isDraw(squares)) {
      setStatus("It's a draw!");
      setWinningLine([]);
    } else {
      setStatus(`Next turn: ${xIsNext ? "X" : "O"}`);
      setWinningLine([]);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  /**
   * Handles click on a board cell.
   */
  const handleCellClick = (idx) => {
    if (squares[idx] || calculateWinner(squares)) return;
    const newSquares = squares.slice();
    newSquares[idx] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);
    setHistory((prev) => [...prev, squares]);
  };

  // PUBLIC_INTERFACE
  /**
   * Reset the board to start a new game.
   */
  const resetBoard = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHistory([]);
    setWinningLine([]);
    setStatus("");
  };

  // PUBLIC_INTERFACE
  /**
   * Toggle app theme (light/dark)
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{ position: "absolute", top: 20, right: 20 }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <div className="ttt-container">
          <h1 className="ttt-title" style={{ color: "#1976D2", marginBottom: 4 }}>
            Tic Tac Toe
          </h1>
          <div
            className="ttt-status"
            style={{
              color: status.startsWith("Winner") ? "#43a047" : status.includes("draw") ? "#FF5252" : "#424242",
              fontWeight: 600,
              margin: "0.5rem 0 1.25rem 0",
            }}
            data-testid="status"
          >
            {status}
          </div>
          <Board squares={squares} onCellClick={handleCellClick} winningLine={winningLine} />
          <div className="ttt-controls">
            <button
              className="ttt-restart-btn"
              onClick={resetBoard}
              type="button"
              style={{
                background: "#1976D2",
                color: "#fff",
                fontSize: "1rem",
                padding: "0.55em 1.5em",
                border: "none",
                borderRadius: "6px",
                margin: "1em 0 0",
                cursor: "pointer",
                fontWeight: 500,
                boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                outline: "none"
              }}
              data-testid="restart"
            >
              Restart Game
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
