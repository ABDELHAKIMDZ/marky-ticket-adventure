
import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface RouteMapProps {
  from: string;
  to: string;
}

export const RouteMap = ({ from, to }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // In a real app, this would use a mapping service like Google Maps or Mapbox
    // For now, we'll create a simple visual representation
    const canvas = document.createElement('canvas');
    canvas.width = mapRef.current.clientWidth;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw route
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(40, 100);
      ctx.bezierCurveTo(
        canvas.width / 3,
        50,
        (2 * canvas.width) / 3,
        150,
        canvas.width - 40,
        100
      );
      ctx.stroke();

      // Draw start point
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(40, 100, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw end point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(canvas.width - 40, 100, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Add labels
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.fillText(from, 20, 80);
      ctx.fillText(to, canvas.width - 100, 80);
    }

    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(canvas);
  }, [from, to]);

  return (
    <Card className="p-4">
      <div ref={mapRef} className="w-full h-[200px]" />
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm">Start: {from}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm">End: {to}</span>
        </div>
      </div>
    </Card>
  );
};
