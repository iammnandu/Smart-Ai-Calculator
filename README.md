# Smart AI Calculator

A modern web-based calculator that uses artificial intelligence to solve mathematical  expressions, equations, and graphical problems  by analyzing hand-drawn input on a digital canvas.

## Features

### Core Functionality.

- **Hand-drawn Input**: Draw mathematical expressions directly on a digital canvas.
- **AI-Powered Analysis**: Uses Google's Gemini AI to interpret and solve mathematical problems
- **Multiple Problem Types**: Supports various mathematical concepts including :
  - Simple arithmetic expressions (2 + 2, 3 \* 4, etc.)
  - Algebraic equations (x^2 + 2x + 1 = 0)
  - Variable assignments (x = 4, y = 5)
  - Graphical math problems (geometry, trigonometry, word problems)
  - Abstract concept detection from  drawings

### User Interface

- **Interactive Canvas**: Responsive drawing area with multiple color options
- **Real-time Results**: Instant mathematical expression solving
- **Variable Management**: Track and reuse assigned variables across calculations
- **Draggable Results**: Move calculation results around the interface
- **Clean Design**: Modern UI built with React and Tailwind CSS

## Technology Stack

### Backend

- **FastAPI**: Modern Python web framework for building APIs
- **Google Generative AI**: Gemini 1.5 Flash model for image analysis
- **PIL (Pillow)**: Image processing library
- **Uvicorn**: ASGI server for running the FastAPI application



### Frontend

- **React 18**: Modern JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Mantine**: React components library
- **Axios**: HTTP client for API requests
- **HTML2Canvas**: Canvas to image conversion
- **React Draggable**: Draggable components

## Project Structure

```
Smart-Ai-Calculator/
├── calc-be-main/                 # Backend API
│   ├── apps/
│   │   └── calculator/
│   │       ├── route.py          # API endpoints
│   │       └── utils.py          # AI processing logic
│   ├── constants.py              # Configuration constants
│   ├── main.py                   # FastAPI application entry point
│   ├── requirements.txt          # Python dependencies
│   └── schema.py                 # Data models
└── calc-fe-main/                 # Frontend application
    ├── src/
    │   ├── components/           # Reusable UI components
    │   ├── screens/
    │   │   └── home/
    │   │       └── index.tsx     # Main calculator interface
    │   ├── constants.ts          # Frontend constants
    │   └── main.tsx              # React application entry point
    ├── package.json              # Node.js dependencies
    └── vite.config.ts            # Vite configuration
```

## Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Google AI API key (Gemini)

### Backend Setup

1. Navigate to the backend directory :

   ```bash
   cd calc-be-main
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:

   - Create a `.env` file in the `calc-be-main` directory
   - Add your Google AI API key:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. Start the FastAPI server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd calc-fe-main
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Usage

1. **Open the Application**: Navigate to the frontend URL in your web browser
2. **Draw on Canvas**: Use your mouse or touch input to draw mathematical expressions
3. **Select Colors**: Choose from available color swatches for different line colors
4. **Submit for Analysis**: Click the analyze button to process your drawing
5. **View Results**: See the interpreted expression and calculated result
6. **Use Variables**: Assign values to variables and reuse them in subsequent calculations
7. **Clear Canvas**: Reset the drawing area to start over

## API Endpoints

### POST /calculate

Analyzes a drawn mathematical expression and returns the solution.

**Request Body:**

```json
{
  "image": "data:image/png;base64,<base64_encoded_image>",
  "dict_of_vars": {}
}
```

**Response:**

```json
{
  "message": "Image processed",
  "data": [
    {
      "expr": "2 + 3",
      "result": "5",
      "assign": false
    }
  ],
  "status": "success"
}
```

## Mathematical Expression Types

1. **Arithmetic**: Basic operations (+, -, \*, /)
2. **Algebraic**: Polynomial equations and variable solving
3. **Assignments**: Variable declarations (x = 5)
4. **Graphical Problems**: Visual math problems with drawings
5. **Abstract Concepts**: Recognition of conceptual drawings

## Development

### Code Style

- Backend: Follows PEP 8 Python style guidelines
- Frontend: Uses ESLint with TypeScript rules
- Formatting: Consistent code formatting across the project

### Testing

Run linting for the frontend:

```bash
cd calc-fe-main
npm run lint
```

### Building for Production

Build the frontend for production:

```bash
cd calc-fe-main
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, issues, or feature requests, please open an issue in the GitHub repository.

## Acknowledgments

- Google Generative AI for powering the mathematical analysis
- The open-source community for the excellent libraries used in this project
- Contributors who help improve the calculator's functionality
