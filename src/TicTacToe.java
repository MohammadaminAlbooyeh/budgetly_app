import java.util.Random;
import java.util.Scanner;

/**
 * A simple Tic Tac Toe game implementation in Java.
 * The game allows a human player to play against a computer that uses a basic AI strategy.
 */

public class TicTacToe {
    private char[] board;
    private char playerTurn;
    private Random random;
    private Scanner scanner;

    public TicTacToe() {
        board = new char[10]; // index 0 unused
        for (int i = 1; i < 10; i++) {
            board[i] = ' ';
        }
        random = new Random();
        scanner = new Scanner(System.in);
        playerTurn = getRandomFirstPlayer();
    }

    private char getRandomFirstPlayer() {
        return random.nextBoolean() ? 'X' : 'O';
    }

    private void showBoard() {
        System.out.println();
        System.out.println(" " + board[1] + "|" + board[2] + "|" + board[3]);
        System.out.println("-------");
        System.out.println(" " + board[4] + "|" + board[5] + "|" + board[6]);
        System.out.println("-------");
        System.out.println(" " + board[7] + "|" + board[8] + "|" + board[9]);
        System.out.println();
    }

    private void swapPlayerTurn() {
        playerTurn = (playerTurn == 'X') ? 'O' : 'X';
    }

    private boolean isBoardFilled() {
        for (int i = 1; i < 10; i++) {
            if (board[i] == ' ') {
                return false;
            }
        }
        return true;
    }

    private void fixSpot(int cell, char player) {
        board[cell] = player;
    }

    private boolean hasPlayerWon(char player) {
        // Rows
        for (int i = 1; i <= 7; i += 3) {
            if (board[i] == player && board[i + 1] == player && board[i + 2] == player) {
                return true;
            }
        }
        // Columns
        for (int i = 1; i <= 3; i++) {
            if (board[i] == player && board[i + 3] == player && board[i + 6] == player) {
                return true;
            }
        }
        // Diagonals
        return (board[1] == player && board[5] == player && board[9] == player)
            || (board[3] == player && board[5] == player && board[7] == player);
    }

    private int getBestMove(char computer, char opponent) {
        // 1. Try to win
        for (int i = 1; i <= 9; i++) {
            if (board[i] == ' ') {
                board[i] = computer;
                if (hasPlayerWon(computer)) {
                    board[i] = ' ';
                    return i;
                }
                board[i] = ' ';
            }
        }

        // 2. Try to block opponent
        for (int i = 1; i <= 9; i++) {
            if (board[i] == ' ') {
                board[i] = opponent;
                if (hasPlayerWon(opponent)) {
                    board[i] = ' ';
                    return i;
                }
                board[i] = ' ';
            }
        }

        // 3. Choose center if available
        if (board[5] == ' ') return 5;

        // 4. Choose random empty
        for (int i = 1; i <= 9; i++) {
            if (board[i] == ' ') return i;
        }

        return -1; // Should never reach here
    }

    public void start() {
        System.out.print("Do you want to be X or O? (X goes first): ");
        char userChar = scanner.next().toUpperCase().charAt(0);
        while (userChar != 'X' && userChar != 'O') {
            System.out.print("Invalid input. Please enter X or O: ");
            userChar = scanner.next().toUpperCase().charAt(0);
        }
        playerTurn = getRandomFirstPlayer();
        System.out.println("Randomly selected first player: " + playerTurn);
        char human = userChar;
        char computer = (human == 'X') ? 'O' : 'X';

        while (true) {
            showBoard();
            int cell;

            if (playerTurn == human) {
                System.out.print("Your turn (" + human + "). Enter cell (1-9): ");
                cell = scanner.nextInt();
                if (cell < 1 || cell > 9 || board[cell] != ' ') {
                    System.out.println("Invalid or occupied cell. Try again.");
                    continue;
                }
            } else {
                cell = getBestMove(computer, human);
                System.out.println("Computer (" + computer + ") chose cell: " + cell);
            }

            fixSpot(cell, playerTurn);

            if (hasPlayerWon(playerTurn)) {
                showBoard();
                System.out.println("Player " + playerTurn + " wins!");
                break;
            }

            if (isBoardFilled()) {
                showBoard();
                System.out.println("It's a tie!");
                break;
            }

            swapPlayerTurn();
        }
    }

    public static void main(String[] args) {
        TicTacToe game = new TicTacToe();
        game.start();
    }
}
