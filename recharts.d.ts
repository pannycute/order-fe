declare module 'recharts' {
  import { ReactElement } from 'react';
  
  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children: ReactElement;
  }
  
  export const ResponsiveContainer: React.FC<ResponsiveContainerProps>;
  export const BarChart: React.FC<any>;
  export const Bar: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const Legend: React.FC<any>;
} 