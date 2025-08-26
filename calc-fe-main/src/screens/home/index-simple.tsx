import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { SWATCHES, DRAWING_TOOLS, BRUSH_SIZES } from "@/constants";

interface GeneratedResult {
  expression: string;
  answer: string;
}

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [reset, setReset] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [result, setResult] = useState<GeneratedResult>();
  const [latexPosition, setLatexPosition] = useState({ x: 50, y: 100 });
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
  const [selectedTool, setSelectedTool] = useState("pen");
  const [brushSize, setBrushSize] = useState(4);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const renderLatexToCanvas = useCallback(
    (expression: string, answer: string) => {
      const latex = `${expression} = ${answer}`;
      setLatexExpression((prev) => [...prev, latex]);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result, renderLatexToCanvas]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexExpression([]);
      setResult(undefined);
      setDictOfVars({});
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth - 32;
        canvas.height = window.innerHeight - 200;
        ctx.lineCap = "round";
        ctx.lineWidth = brushSize;
      }
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
        },
      });
    };

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [brushSize]);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        setStartPos({ x, y });
        setIsDrawing(true);

        if (selectedTool === "pen") {
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        ctx.lineWidth = brushSize;

        if (selectedTool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = brushSize * 2;
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = color;
        }

        if (selectedTool === "pen" || selectedTool === "eraser") {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;

        switch (selectedTool) {
          case "line":
            ctx.beginPath();
            ctx.moveTo(startPos.x, startPos.y);
            ctx.lineTo(x, y);
            ctx.stroke();
            break;
          case "rectangle":
            ctx.beginPath();
            ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
            ctx.stroke();
            break;
          case "circle": {
            const radius = Math.sqrt(
              Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
            );
            ctx.beginPath();
            ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          }
        }
      }
    }
  };

  const runRoute = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/calculate`,
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictOfVars,
        },
      });

      const resp = await response.data;
      console.log("Response", resp);
      resp.data.forEach((data: Response) => {
        if (data.assign === true) {
          setDictOfVars({
            ...dictOfVars,
            [data.expr]: data.result,
          });
        }
      });

      const ctx = canvas.getContext("2d");
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (imageData.data[i + 3] > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setLatexPosition({ x: centerX, y: centerY });
      resp.data.forEach((data: Response) => {
        setTimeout(() => {
          setResult({
            expression: data.expr,
            answer: data.result,
          });
        }, 1000);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="toolbar">
        {/* First row: Action buttons */}
        <div className="toolbar-row">
          <button onClick={() => setReset(true)} className="btn btn-danger">
            Clear
          </button>
          <button onClick={runRoute} className="btn btn-primary">
            Calculate
          </button>
        </div>

        {/* Second row: Tools and colors */}
        <div className="toolbar-row">
          <div className="toolbar-group">
            <span className="toolbar-label">Tools:</span>
            <div className="tool-grid">
              {DRAWING_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`tool-btn ${
                    selectedTool === tool.id ? "active" : ""
                  }`}
                  title={tool.label}
                >
                  {tool.label[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar-group">
            <span className="toolbar-label">Colors:</span>
            <div className="color-picker">
              {SWATCHES.map((swatch) => (
                <div
                  key={swatch}
                  onClick={() => setColor(swatch)}
                  className={`color-swatch ${
                    color === swatch ? "selected" : ""
                  }`}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>

          <div className="toolbar-group">
            <span className="toolbar-label">Size:</span>
            <div className="brush-sizes">
              {BRUSH_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`brush-size-btn ${
                    brushSize === size ? "active" : ""
                  }`}
                  title={`${size}px`}
                >
                  <div
                    className="brush-size-dot"
                    style={{
                      width: Math.min(size, 16) + "px",
                      height: Math.min(size, 16) + "px",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas area */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </div>

      {/* Results */}
      {latexExpression &&
        latexExpression.map((latex, index) => (
          <Draggable
            key={index}
            defaultPosition={latexPosition}
            onStop={(_, data) => setLatexPosition({ x: data.x, y: data.y })}
          >
            <div className="result-container absolute">
              <div className="result-text">{latex}</div>
            </div>
          </Draggable>
        ))}
    </div>
  );
}
