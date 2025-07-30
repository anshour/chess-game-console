# Chess Game Console

A console-based chess game implemented in TypeScript with full chess rules, input validation, and comprehensive testing.

## Features

- **Full Chess Implementation**: Complete chess rules including piece movement, capturing, and pawn promotion
- **Console-Based Interface**: Beautiful CLI rendering with colors and formatted board display
- **Input Validation**: Supports both algebraic notation (e.g., "e2 e4") and numeric coordinates (e.g., "1,4 3,4")
- **Game State Management**: Turn-based gameplay with proper player switching and game status tracking
- **Comprehensive Testing**: Extensive unit tests covering all game logic and edge cases
- **TypeScript**: Fully typed codebase for better development experience and reliability
- **Error Handling**: Robust error handling with user-friendly error messages

## Installation

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/anshour/chess-game-console.git
   cd chess-game-console
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

   or
   
   For watch mode (development):
   ```bash
   npm run build:watch
   ```

## Usage

### Starting the Game

Run the game with:
```bash
npm start
```

### How to Play

1. **Enter Player Names**: When prompted, enter names for both white and black players
2. **Make Moves**: Enter moves using one of the supported formats:
   - **Algebraic notation**: `e2 e4`, `e2,e4`, `a1-h8`
   - **Numeric coordinates**: `1,4 3,4` (row,column format)
3. **Pawn Promotion**: When a pawn reaches the opposite end, you'll be prompted to choose the promotion piece
4. **Game End**: The game ends when a king is captured

### Move Format Examples

- `e2 e4` - Move pawn from e2 to e4
- `a1,h8` - Move piece from a1 to h8
- `1,4 3,4` - Move piece from row 1, column 4 to row 3, column 4

## Development

### Available Scripts

- `npm start` - Run the compiled game
- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Watch mode compilation
- `npm run build:release` - Clean build for release
- `npm run test` - Run all unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint the codebase
- `npm run prettier` - Format code
- `npm run prettier:check` - Check code formatting
- `npm run clean` - Clean build artifacts

### Project Structure

```
src/
├── cli/                    # Command-line interface components
│   ├── cli-controller.ts   # Main game controller
│   ├── input-handler.ts    # User input handling
│   └── renderer.ts         # Console output rendering
├── core/                   # Core game logic
│   ├── board.ts           # Chess board implementation
│   ├── game.ts            # Game state management
│   ├── player.ts          # Player representation
│   ├── position.ts        # Board position utilities
│   ├── types.ts           # Type definitions
│   └── pieces/            # Chess piece implementations
│       ├── piece.ts       # Base piece class
│       ├── pawn.ts        # Pawn piece logic
│       ├── rook.ts        # Rook piece logic
│       ├── knight.ts      # Knight piece logic
│       ├── bishop.ts      # Bishop piece logic
│       ├── queen.ts       # Queen piece logic
│       └── king.ts        # King piece logic
├── utils/
│   └── enums.ts           # Game enumerations
└── main.ts                # Application entry point

__tests__/                 # Test suite
├── unit/                  # Unit tests
├── test-helpers.ts        # Test utilities
└── vitest.config.ts       # Test configuration
```

### Technologies Used

- **TypeScript** - Main programming language
- **Node.js** - Runtime environment
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Chalk** - Terminal colors
- **CLI-Table3** - Formatted table display
- **Readline-Sync** - Synchronous input handling

### Testing

The project includes comprehensive unit tests covering:

- Game logic and rules
- Piece movement validation
- Board state management
- Player turn handling
- Pawn promotion mechanics
- Game end conditions
- Error handling scenarios

Run tests with:
```bash
npm test
```

For watch mode during development:
```bash
npm run test:watch
```

### Code Quality

The project maintains high code quality through:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for consistent formatting
- **Comprehensive tests** with high coverage
- **Clear project structure** and separation of concerns

## Game Rules

This implementation follows standard chess rules:

- **Piece Movement**: All pieces move according to standard chess rules
- **Turn-Based**: Players alternate turns (white goes first)
- **Capturing**: Pieces can capture opponent pieces by moving to their square
- **Pawn Promotion**: Pawns reaching the opposite end must be promoted to Queen, Rook, Bishop, or Knight
- **Game End**: Game ends when a king is captured (simplified ruleset - no checkmate detection)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request
