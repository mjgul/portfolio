// src/app/three/screen-text.ts

export enum LineStyle {
  NORMAL,
  BOXED,
  BULLET,
  IMAGE
}

// Represents a single drawable element on our screen
export interface StyledLine {
  text?: string;        // The text content (optional for images)
  style: LineStyle;
  imageSrc?: string;    // Path to the image (for LineStyle.IMAGE)
  color?: string;       // Override the default color
  bgColor?: string;     // Background color for boxed style
  indent?: number;      // How many spaces to indent
}