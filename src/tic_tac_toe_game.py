import random


class TicTacToe:
    def __init__(self):
        self.board =  [' '] * 10  # list(map(str,range(10))) # index 0 is not considered
        self.player_turn = self.get_random_first_player_()

    def get_random_first_player_(self):
        return random.choice(['X', 'O'])

    def show_board(self):
        print('\n')
        print(' ' + self.board[1] +'|'+ self.board[2] +'|'+ self.board[3])
        
        print('-------')
        
        print(' ' + self.board[4] +'|'+ self.board[5] +'|'+ self.board[6])
        
        print('-------')
        
        print(' ' + self.board[7] +'|'+ self.board[8] +'|'+ self.board[9])
        print('\n')
    
    def swap_player_turn(self):
        self.player_turn = 'X' if self.player_turn == 'O' else 'O'
        return self.player_turn
    
    def is_board_filled(self):
        return ' ' not in self.board[:1]

    def fix_spot(self, cell, player):
        self.board[cell] = player
    
    def has_player_won(self, player):
        # check rows
        for i in range(1, 8, 3):
            if self.board[i] == player and self.board[i+1] == player and self.board[i+2] == player:
                return True
        
        # check columns
        for i in range(1, 4):
            if self.board[i] == player and self.board[i+3] == player and self.board[i+6] == player:
                return True
        
        # check diagonals
        if self.board[1] == player and self.board[5] == player and self.board[9] == player:
            return True
        if self.board[3] == player and self.board[5] == player and self.board[7] == player:
            return True
        
        return False
    
    def start(self):
        while True:
            self.show_board()
            print(f'Player {self.player_turn} turn. Choose a cell to place your mark (1-9):')
            
            if self.player_turn == 'X':  # Human player
                cell = int(input("Enter cell number from 1-9: "))
            
            # if not cell.isdigit() or int(cell) not in range(1, 10):
            #     print("Invalid cell number. Choose another cell.")
            #     continue

            # cell = int(cell)

                if self.board[cell] in ['X', 'O']:
                    print("Cell already filled. Choose another cell.")
                    continue

            else:  # Computer player
                cell = random.choice([i for i in range (1, 10) if self.board[i] == ' '])
                print(f'Computer placed a mark in cell {cell}.')

            self.fix_spot(cell, self.player_turn)

            if self.has_player_won(self.player_turn):
                self.show_board()
                print(f'Player {self.player_turn} wins!')
                break

            if self.is_board_filled():
                self.show_board()
                print("It's a tie!")
                break

            self.swap_player_turn()
            
                
if __name__ == '__main__':
    game = TicTacToe()
    game.start()
