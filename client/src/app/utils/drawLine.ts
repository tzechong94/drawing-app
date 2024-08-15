import { Draw } from "../../../types/typing";
type DrawLineProps = Draw & { color: string };

export function drawLine({
  prevPoint,
  currentPoint,
  ctx,
  color,
}: DrawLineProps) {
  const { x: currX, y: currY } = currentPoint;
  // const lineColor = color;
  const lineWidth = 5;

  let startPoint = prevPoint ?? currentPoint;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
  ctx.fill();
}
