'use client';

interface QRCodeProps {
  value: string;
  size?: number;
}

export function QRCode({ value, size = 180 }: QRCodeProps) {
  const grid = 25;
  const cells = generatePattern(value, grid);

  const cellSize = size / grid;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-lg"
      style={{ background: 'white' }}
    >
      {/* Corner markers */}
      {[
        [0, 0],
        [grid - 7, 0],
        [0, grid - 7],
      ].map(([x, y], i) => (
        <g key={`marker-${i}`}>
          <rect
            x={x * cellSize}
            y={y * cellSize}
            width={7 * cellSize}
            height={7 * cellSize}
            fill="white"
            stroke="black"
            strokeWidth={cellSize}
          />
          <rect
            x={(x + 2) * cellSize}
            y={(y + 2) * cellSize}
            width={3 * cellSize}
            height={3 * cellSize}
            fill="black"
          />
        </g>
      ))}

      {/* Data cells */}
      {cells.map((row, y) =>
        row.map((cell, x) => {
          if (
            (x < 7 && y < 7) ||
            (x >= grid - 7 && y < 7) ||
            (x < 7 && y >= grid - 7)
          ) {
            return null;
          }
          return cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill="black"
            />
          ) : null;
        })
      )}
    </svg>
  );
}

function generatePattern(value: string, size: number): boolean[][] {
  // Deterministic hash-based pattern — visually convincing QR-like code
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // Simple hash to seed
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash) + value.charCodeAt(i);
    hash = hash & 0x7fffffff;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      hash = ((hash << 5) + hash) + (x * 7 + y * 13 + 17);
      hash = hash & 0x7fffffff;
      grid[y][x] = (hash % 100) > 55;
    }
  }

  return grid;
}
