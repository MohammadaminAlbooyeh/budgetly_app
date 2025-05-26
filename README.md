
````markdown
# 🎮 Tic Tac Toe - Python Console Game

This is a simple console-based Tic Tac Toe game implemented in Python. It allows a human player (X) to play against the computer (O). The computer makes random valid moves, and the game continues until there's a winner or a tie.

----------

## 🧠 Features

- Human vs Computer gameplay.
- Randomized computer moves.
- Automatic winner or tie detection.
- Clean, readable console board display.
- Turn management between players.

----------

## 🖥️ How to Run

1. Make sure you have Python installed (Python 3.x recommended).
2. Save the code in a file, e.g. `tic_tac_toe.py`.
3. Run the game in your terminal:

```bash
python tic_tac_toe.py
```

----------

## 🎲 Game Rules

- The game board has 9 cells, indexed from 1 to 9:
```
 1 | 2 | 3
-----------
 4 | 5 | 6
-----------
 7 | 8 | 9
```

- `X` is always the human player.
- `O` is the computer player.
- Players take turns placing their mark in empty cells.
- The first to align 3 marks horizontally, vertically, or diagonally wins.
- If all cells are filled without a winner, it's a tie.

----------

## 🧩 Code Structure

- `__init__`: Initializes the board and randomly chooses who starts.
- `show_board()`: Displays the current game board in the terminal.
- `swap_player_turn()`: Switches the turn between players.
- `is_board_filled()`: Checks for a tie (board fully filled).
- `fix_spot()`: Places the player’s mark in the selected cell.
- `has_player_won()`: Checks if the current player has won.
- `start()`: Main game loop handling input and game flow.

----------

## 🔧 Future Improvements

- Smarter AI instead of random moves.
- GUI with `tkinter` or `pygame`.
- Score tracking over multiple rounds.
- Input validation improvements.

----------

## 📜 License

This project is open-source and free to use.

----------

Enjoy playing! 😄
````
