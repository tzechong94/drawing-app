import { useEffect, useRef, useState } from "react";
import { Draw, Point } from "../../../types/typing";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const onMouseDown = () => {
    setMouseDown(true);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;
      const currentPoint = computePointInCanvas(e);
      const ctx = canvasRef.current?.getContext("2d");

      if (!ctx || !currentPoint) return;

      //   console.log({ x: currentPoint.x, y: e.y });
      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };
    // add evnt listener
    canvasElement?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    // remove event listener
    return () => {
      canvasElement?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [mouseDown, onDraw]);

  return { canvasRef, onMouseDown, clear };
};
