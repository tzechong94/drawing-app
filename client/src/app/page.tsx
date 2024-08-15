"use client";
import { useEffect, useState } from "react";
import { Draw, Point } from "../../types/typing";
import { useDraw } from "./hooks/useDraw";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";
import { drawLine } from "./utils/drawLine";

const socket = io("http://localhost:3001");

interface DrawLineProps {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
}

export default function Home() {
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      // console.log(canvasRef.current.toDataURL());
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("received the state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color }: DrawLineProps) => {
        if (!ctx) return;

        drawLine({ prevPoint, currentPoint, ctx, color });
      }
    );

    socket.on("clear", clear);

    return () => {
      socket.off("clear");
      socket.off("draw-line");
      socket.off("canvas-state-from-server");
      socket.off("get-canvas-state");
      socket.off("client-ready");
    };
  }, [canvasRef, clear]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color }); // this has to match the server
    drawLine({ prevPoint, currentPoint, ctx, color });
    // whenever line is created, client emits and server listens
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          className="p-2 rounded-md border border-black"
          onClick={() => {
            socket.emit("clear");
          }}
        >
          Clear canvas
        </button>
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={500}
        height={500}
        className="border border-black"
      />
    </div>
  );
}
