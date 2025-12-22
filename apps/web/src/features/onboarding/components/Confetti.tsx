import { useEffect, useState } from 'react';

// ============================================================================
// CONFETTI COMPONENT
// ============================================================================
//
// ARCHITECTURE NOTE: Celebration animation for onboarding completion
// - 1000ms duration (per project_context.md)
// - 50 particles
// - Fades out automatically
//
// ============================================================================

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#95E1D3', // Mint
  '#FF8B94', // Pink
  '#98DDCA', // Light green
  '#D5A6BD', // Lavender
  '#87CEEB', // Sky blue
];

const PARTICLE_COUNT = 50;
const ANIMATION_DURATION = 1000;

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Generate confetti pieces
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.4,
        size: 6 + Math.random() * 8,
      });
    }
    setPieces(newPieces);

    // Hide after animation
    const timer = setTimeout(() => {
      setVisible(false);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}
