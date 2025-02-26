
import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface BusStop {
  name: string;
  distance: number; // percentage along the route (0-1)
}

interface RouteMapProps {
  from: string;
  to: string;
}

export const RouteMap = ({ from, to }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const getBusStops = (start: string, end: string): BusStop[] => {
    // This would ideally come from an API
    const stops: Record<string, BusStop[]> = {
      "Béjaïa Center-Tichy": [
        { name: "Place 1er Novembre", distance: 0.2 },
        { name: "Ihaddaden", distance: 0.4 },
        { name: "Sidi Ahmed", distance: 0.6 },
        { name: "Four à Chaux", distance: 0.8 }
      ],
      "Béjaïa Center-Aokas": [
        { name: "Amriw", distance: 0.25 },
        { name: "Ighil Ouazoug", distance: 0.5 },
        { name: "Souk El Tenine", distance: 0.75 }
      ],
      "Béjaïa Center-Gouraya": [
        { name: "Port de Béjaïa", distance: 0.3 },
        { name: "Cap Carbon", distance: 0.6 }
      ],
      "default": [
        { name: "Stop 1", distance: 0.33 },
        { name: "Stop 2", distance: 0.66 }
      ]
    };

    const routeKey = `${start}-${end}`;
    return stops[routeKey] || stops.default;
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = mapRef.current.clientWidth;
    canvas.height = 300; // Increased height for better visibility
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw main route
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(40, 150);
      ctx.bezierCurveTo(
        canvas.width / 3,
        100,
        (2 * canvas.width) / 3,
        200,
        canvas.width - 40,
        150
      );
      ctx.stroke();

      // Get bus stops for this route
      const busStops = getBusStops(from, to);

      // Draw bus stops
      busStops.forEach(stop => {
        // Calculate position along the curve
        const x = 40 + (canvas.width - 80) * stop.distance;
        const y = 150 + Math.sin(stop.distance * Math.PI) * 50;

        // Draw stop point
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Draw stop name
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(stop.name, x, y - 15);
      });

      // Draw start point
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(40, 150, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw end point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(canvas.width - 40, 150, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Add main labels
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'start';
      ctx.fillText(from, 20, 130);
      ctx.textAlign = 'end';
      ctx.fillText(to, canvas.width - 20, 130);
    }

    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(canvas);
  }, [from, to]);

  return (
    <Card className="p-4">
      <div ref={mapRef} className="w-full h-[300px]" />
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm">Start: {from}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm">Bus Stops</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm">End: {to}</span>
        </div>
      </div>
    </Card>
  );
};
