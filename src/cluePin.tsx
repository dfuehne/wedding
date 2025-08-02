export interface CluePin {
  id: string;
  x: number; // relative percentage (0–100) of width
  y: number; // relative percentage (0–100) of height
  label: string;
  link: string; // path to the clue/page
  zoom: number; //zoom on map
  tx: number;
  ty: number;
}