import React, { useState, useRef, useEffect } from 'react';
import Matter from 'matter-js';
import { Play, RotateCcw } from 'lucide-react';

interface PhysicsDrawingGameProps {
  onProgress: (progress: number) => void;
}

interface Point {
  x: number;
  y: number;
}

export const PhysicsDrawingGame: React.FC<PhysicsDrawingGameProps> = ({ onProgress }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<Point[][]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const ballRef = useRef<Matter.Body>();
  const bucketRef = useRef<Matter.Body>();
  const lineBodiesRef = useRef<Matter.Body[]>([]);
  const requestRef = useRef<number>();
  const groundSensorRef = useRef<Matter.Body>();

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const BALL_RADIUS = 15;
  const BUCKET_WIDTH = 80;
  const BUCKET_HEIGHT = 60;
  const MARGIN = 100;

  const getRandomBallPosition = () => ({
    x: MARGIN + Math.random() * (CANVAS_WIDTH - 2 * MARGIN),
    y: MARGIN + Math.random() * (CANVAS_HEIGHT / 3)
  });

  /**
   * Initialize the physics engine and game objects
   */
  const initializeEngine = () => {
    const engine = Matter.Engine.create();
    // Important: Set gravity to 0 initially
    engine.gravity.y = 0;
    engineRef.current = engine;

    const startPos = getRandomBallPosition();
    const ball = Matter.Bodies.circle(startPos.x, startPos.y, BALL_RADIUS, {
      restitution: 0.7,
      friction: 0.001,
      density: 0.001,
      render: { fillStyle: '#ff0000' }
    });
    ballRef.current = ball;
    setBallPosition(startPos);

    const bucket = Matter.Bodies.rectangle(
      CANVAS_WIDTH - 100,
      CANVAS_HEIGHT - 40,
      BUCKET_WIDTH,
      BUCKET_HEIGHT,
      { isStatic: true }
    );
    bucketRef.current = bucket;

    const groundSensor = Matter.Bodies.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 5,
      CANVAS_WIDTH,
      10,
      { 
        isStatic: true,
        isSensor: true,
        render: { visible: false }
      }
    );
    groundSensorRef.current = groundSensor;

    const walls = [
      Matter.Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 30, CANVAS_WIDTH, 60, { isStatic: true }),
      Matter.Bodies.rectangle(-30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT, { isStatic: true }),
      Matter.Bodies.rectangle(CANVAS_WIDTH + 30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT, { isStatic: true }),
      Matter.Bodies.rectangle(CANVAS_WIDTH / 2, -30, CANVAS_WIDTH, 60, { isStatic: true })
    ];

    Matter.World.add(engine.world, [ball, bucket, groundSensor, ...walls]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        if ((pair.bodyA === groundSensor && pair.bodyB === ball) ||
            (pair.bodyA === ball && pair.bodyB === groundSensor)) {
          handleGameReset();
        }
      });
    });

    return engine;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = initializeEngine();

    return () => {
      Matter.Engine.clear(engine);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const getMousePosition = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSimulating) return;

    const point = getMousePosition(e);
    
    if (!gameStarted || showIntro) {
      setShowIntro(false);
      setGameStarted(true);
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([point]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || isSimulating) return;

    const point = getMousePosition(e);
    setCurrentPoints(prev => [...prev, point]);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPoints.length > 1) {
      setLines(prev => [...prev, currentPoints]);
      addLineToPhysics(currentPoints);
    }
    setIsDrawing(false);
    setCurrentPoints([]);
  };

  const addLineToPhysics = (points: Point[]) => {
    if (!engineRef.current || points.length < 2) return;

    const segments: Matter.Body[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      const segment = Matter.Bodies.rectangle(
        (p1.x + p2.x) / 2,
        (p1.y + p2.y) / 2,
        length,
        4,
        {
          isStatic: true,
          angle: angle,
          render: { fillStyle: '#000000' }
        }
      );
      
      segments.push(segment);
    }

    Matter.World.add(engineRef.current.world, segments);
    lineBodiesRef.current = [...lineBodiesRef.current, ...segments];
  };

  const startSimulation = () => {
    if (!engineRef.current || !ballRef.current) return;

    setIsSimulating(true);
    setAttempts(prev => prev + 1);

    // Activate gravity on start
    engineRef.current.gravity.y = 0.5;
    Matter.Body.setVelocity(ballRef.current, { x: 0, y: 0 });

    const animate = () => {
      Matter.Engine.update(engineRef.current!, 1000 / 60);
      
      if (ballRef.current) {
        setBallPosition({
          x: ballRef.current.position.x,
          y: ballRef.current.position.y
        });

        if (bucketRef.current) {
          const ball = ballRef.current;
          const bucket = bucketRef.current;
          
          if (Matter.Collision.collides(ball, bucket, null)) {
            setScore(prev => prev + 1);
            onProgress(Math.min((score + 1) * 20, 100));
            handleGameReset();
            return;
          }
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  const handleGameReset = () => {
    if (!engineRef.current || !ballRef.current) return;

    // Stop animation
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    // Deactivate gravity
    engineRef.current.gravity.y = 0;

    // Remove all lines
    lineBodiesRef.current.forEach(body => {
      Matter.World.remove(engineRef.current!.world, body);
    });
    lineBodiesRef.current = [];

    // New position for the ball
    const newPos = getRandomBallPosition();
    Matter.Body.setPosition(ballRef.current, newPos);
    Matter.Body.setVelocity(ballRef.current, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(ballRef.current, 0);
    setBallPosition(newPos);

    // Reset game state
    setLines([]);
    setCurrentPoints([]);
    setIsSimulating(false);
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bucket
    if (bucketRef.current) {
      ctx.fillStyle = '#4a5568';
      const bucket = bucketRef.current;
      ctx.fillRect(
        bucket.position.x - BUCKET_WIDTH / 2,
        bucket.position.y - BUCKET_HEIGHT / 2,
        BUCKET_WIDTH,
        BUCKET_HEIGHT
      );
    }

    // Draw ball
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      ballPosition.x,
      ballPosition.y,
      BALL_RADIUS,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw lines
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    lines.forEach(points => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });

    if (currentPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      currentPoints.slice(1).forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }

    requestAnimationFrame(drawGame);
  };

  useEffect(() => {
    requestAnimationFrame(drawGame);
  }, [lines, currentPoints, isSimulating, ballPosition]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-purple-600 font-bold">Score: {score}</div>
        <div className="text-gray-600">Attempts: {attempts}</div>
      </div>

      {showIntro && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl max-w-md text-center">
            <h3 className="text-2xl font-bold text-purple-600 mb-4">
              Welcome to the Physics Game!
            </h3>
            <p className="text-gray-600 mb-6">
              Draw lines to guide the ball into the bucket. 
              Use gravity to your advantage!
            </p>
            <button
              onClick={() => setShowIntro(false)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="border-2 border-purple-200 rounded-xl bg-white cursor-crosshair"
        />

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={startSimulation}
            disabled={isSimulating || lines.length === 0}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isSimulating || lines.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Play className="w-5 h-5" />
            Start
          </button>
          <button
            onClick={handleGameReset}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-center text-lg font-semibold text-purple-600 bg-purple-50 p-4 rounded-lg">
        Skillfully draw your lines and guide the ball to the bucket! 🎯
      </div>
    </div>
  );
};
