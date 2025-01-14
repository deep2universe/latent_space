import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { Download, Eraser, Paintbrush, RotateCcw, ThumbsUp, Minus, Plus } from 'lucide-react';

interface DrawingGameProps {
  onProgress: (progress: number) => void;
}

interface DrawingLine {
  tool: 'pen' | 'eraser';
  points: number[];
  color: string;
  strokeWidth: number;
}

/**
 * Available colors for drawing
 */
const colors = [
  { name: 'Schwarz', value: '#000000' },
  { name: 'Rot', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Gelb', value: '#eab308' },
  { name: 'Grün', value: '#22c55e' },
  { name: 'Blau', value: '#3b82f6' },
  { name: 'Lila', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Braun', value: '#92400e' }
];

const guesses = [
  { guess: "Is that a dancing elephant in a ballerina tutu? 🎭", type: "funny" },
  { guess: "Oh, I see a giraffe skateboarding! 🛹", type: "funny" },
  { guess: "That must be a penguin doing the limbo! 💃", type: "funny" },
  { guess: "Is that a lion baking pizza? 🍕", type: "funny" },
  { guess: "A kangaroo playing video games? 🎮", type: "funny" },
  { guess: "Wow! A beautiful piece of art! 🎨", type: "praise" },
  { guess: "That's fantastic! ⭐", type: "praise" },
  { guess: "You're a true artist genius! 🌟", type: "praise" },
  { guess: "These colors are well chosen! 🎨", type: "praise" },
  { guess: "The lines are so expressive! ✨", type: "praise" }
];

export const DrawingGame: React.FC<DrawingGameProps> = ({ onProgress }) => {
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [showGuess, setShowGuess] = useState(false);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentColor, setCurrentColor] = useState(colors[0].value);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { 
      tool, 
      points: [pos.x, pos.y],
      color: tool === 'eraser' ? '#ffffff' : currentColor,
      strokeWidth: tool === 'eraser' ? strokeWidth * 4 : strokeWidth
    }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    setLines([]);
    setShowGuess(false);
    setShowSuccess(false);
  };

  const downloadDrawing = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'meine-zeichnung.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGuess = () => {
    downloadDrawing();
    
    const funnyGuess = guesses.filter(g => g.type === 'funny')[
      Math.floor(Math.random() * 5)
    ];
    const praise = guesses.filter(g => g.type === 'praise')[
      Math.floor(Math.random() * 5)
    ];
    
    setCurrentGuess(`${funnyGuess.guess}\n\n${praise.guess}`);
    setShowGuess(true);
    onProgress(50);
  };

  const handleResponse = (isCorrect: boolean) => {
    setShowGuess(false);
    setShowSuccess(true);
    onProgress(isCorrect ? 100 : 75);
  };

  const adjustStrokeWidth = (delta: number) => {
    setStrokeWidth(prev => Math.min(Math.max(1, prev + delta), 50));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {!showGuess && !showSuccess && (
        <div className="mb-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setTool('pen')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  tool === 'pen' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Paintbrush className="w-5 h-5" />
                Stift
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  tool === 'eraser'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eraser className="w-5 h-5" />
                Radierer
              </button>
              <button
                onClick={clearCanvas}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Neu
              </button>

              <div className="flex items-center gap-2 ml-4 bg-gray-100 p-2 rounded-lg">
                <button
                  onClick={() => adjustStrokeWidth(-1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="min-w-[2rem] text-center">{strokeWidth}</span>
                <button
                  onClick={() => adjustStrokeWidth(1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <button
              onClick={handleGuess}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              disabled={lines.length === 0}
            >
              <Download className="w-5 h-5" />
              Rate was ich gezeichnet habe!
            </button>
          </div>

          <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
            <span className="text-sm text-gray-600 mr-2">Farben:</span>
            {colors.map(color => (
              <button
                key={color.value}
                onClick={() => setCurrentColor(color.value)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  currentColor === color.value ? 'scale-110 ring-2 ring-purple-400 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Stage
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="border-2 border-purple-200 rounded-xl bg-white"
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>

        {showGuess && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/95 p-8 rounded-xl shadow-lg max-w-md text-center">
              <img
                src="https://images.unsplash.com/photo-1579168765467-3b235f938439?w=400&auto=format&fit=crop"
                alt="Koala"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-purple-600 mb-4">
                Koala Karl sagt:
              </h3>
              <p className="text-gray-700 whitespace-pre-line mb-6">
                {currentGuess}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleResponse(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Ja, genau!
                </button>
                <button
                  onClick={() => handleResponse(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Nein, nicht ganz
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/95 p-8 rounded-xl shadow-lg max-w-md text-center">
              <ThumbsUp className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-purple-600 mb-4">
                Fantastisch gemacht!
              </h3>
              <p className="text-gray-700 mb-6">
                Dein Kunstwerk ist wunderschön! Du hast echtes Talent! 🎨✨
              </p>
              <button
                onClick={clearCanvas}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Noch ein Kunstwerk malen
              </button>
            </div>
          </div>
        )}
      </div>

      {!showGuess && !showSuccess && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Male ein schönes Bild und lass Koala Karl raten, was es ist! 🐨
        </div>
      )}
    </div>
  );
};
