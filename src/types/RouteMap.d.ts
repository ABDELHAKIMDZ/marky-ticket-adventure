
declare module "@/components/RouteMap" {
  export interface RouteMapProps {
    from: string;
    to: string;
    intermediateStops?: string[];
  }
  
  export const RouteMap: React.FC<RouteMapProps>;
}
