import * as p5 from 'p5';
import * as THREE from 'three';
import { StyledLine, LineStyle } from './screentextclass'; // Import our new model

// Update our config for the new look
const ScreenConfig = {
  width: 1024,
  height: 768,
  font: 'VT323, monospace', // A great retro font. Add it via Google Fonts.
  fontSize: 28,
  lineHeight: 34,
  margin: 40,
  cursor: '|',
  // Amber color scheme
  bgColor: '#1a1001',
  textColor: '#ffb020',
  boxColor: '#ffb020',
  boxTextColor: '#1a1001'
};

export class ScreenManager {
  public readonly texture: THREE.CanvasTexture;
  private p5Instance: p5;
  private screenBuffer: StyledLine[] = []; // The main buffer of what's been output
  private portraitImage: p5.Image | null = null; // To hold our loaded portrait

  constructor() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const sketch = (p: p5) => {
      // The preload function is perfect for loading assets like images and fonts
      p.preload = () => {
        //this.portraitImage = p.loadImage('../../assets/icon/Profile.jpg');
      };

      p.setup = () => {
        p.createCanvas(ScreenConfig.width, ScreenConfig.height);
        p.textFont(ScreenConfig.font);
        p.textSize(ScreenConfig.fontSize);
      };
    };

    this.p5Instance = new p5(sketch, container);
    const canvasElement = this.p5Instance.drawingContext.canvas;
    this.texture = new THREE.CanvasTexture(canvasElement);

    this.createSplashScreen();
  }

  // Generate the initial "boot up" screen content
  private createSplashScreen(): void {
    this.screenBuffer = [
      { text: '', style: LineStyle.NORMAL }, // Spacer line
      { text: 'Hi there,', style: LineStyle.NORMAL },
      { text: "I'm Junaid Gul", style: LineStyle.BOXED }, // CHANGE TO YOUR NAME
      { text: '', style: LineStyle.NORMAL },
      { text: 'Software Engineer', style: LineStyle.BULLET, indent: 2 },
      { text: 'ML Engineer', style: LineStyle.BULLET, indent: 2 },
      { text: 'WebGL Developer', style: LineStyle.BULLET, indent: 2 },
      { text: '', style: LineStyle.NORMAL },
      { text: '', style: LineStyle.NORMAL },
      { text: '>> type "help" to get started', style: LineStyle.NORMAL },
    ];
    // Add this to our screen buffer as a special drawable item
    this.screenBuffer.splice(1, 0, { style: LineStyle.IMAGE, imageSrc: '../../assets/icon/Profile.jpg' });
  }

  // This will become our primary drawing function
  public draw(command: string, showCursor: boolean, scrollOffset: number): void {
    const p = this.p5Instance;
    p.background(ScreenConfig.bgColor);

    let currentY = ScreenConfig.margin;

    // Draw the main buffer, respecting the scroll offset
    for (let i = scrollOffset; i < this.screenBuffer.length; i++) {
        const line = this.screenBuffer[i];
        this.drawLine(line, currentY);

        if(line.style === LineStyle.IMAGE && this.portraitImage){
            currentY += this.portraitImage.height * 0.4 + ScreenConfig.lineHeight; // Add extra space for the image
        } else {
            currentY += ScreenConfig.lineHeight;
        }

        // Stop drawing if we're off the bottom of the screen
        if (currentY > p.height - ScreenConfig.margin) break;
    }

    // Draw the user input prompt at the bottom
    const prompt = `User:~$ ${command}${showCursor ? ScreenConfig.cursor : ''}`;
    this.drawLine({ text: prompt, style: LineStyle.NORMAL }, p.height - ScreenConfig.margin);

    this.texture.needsUpdate = true;
  }

  // A helper function to draw a single styled line
  private drawLine(line: StyledLine, y: number): void {
    const p = this.p5Instance;
    const x = ScreenConfig.margin + (line.indent || 0) * ScreenConfig.fontSize;

    switch(line.style) {
      case LineStyle.IMAGE:
        if (this.portraitImage) {
          p.push();
          p.tint(ScreenConfig.textColor); // Apply the amber tint to the dithered image
          const imgWidth = this.portraitImage.width * 0.4; // Scale it down
          // Draw image on the right side
          p.image(this.portraitImage, p.width - imgWidth - ScreenConfig.margin, y, imgWidth, this.portraitImage.height * 0.4);
          p.pop();
        }
        break;

      case LineStyle.BOXED:
        if (line.text) {
          p.fill(ScreenConfig.boxColor);
          // Simple box calculation based on text length
          p.rect(x, y - ScreenConfig.fontSize, line.text.length * ScreenConfig.fontSize * 0.65, ScreenConfig.lineHeight);
          p.fill(ScreenConfig.boxTextColor);
          p.text(line.text, x + 5, y);
        }
        break;

      case LineStyle.BULLET:
        p.fill(ScreenConfig.textColor);
        p.text(`▪ ${line.text}`, x, y);
        break;

      case LineStyle.NORMAL:
      default:
        p.fill(ScreenConfig.textColor);
        p.text(line.text || '', x, y);
        break;
    }
  }

  // --- Methods to interact with the buffer ---
  public addCommandResult(prompt: string, output: string) {
    this.screenBuffer.push({ text: `User:~$ ${prompt}`, style: LineStyle.NORMAL });
    const outputLines = output.split('\n');
    outputLines.forEach(line => {
        this.screenBuffer.push({ text: line, style: LineStyle.NORMAL });
    });
  }

  public clear() {
      // Don't clear the splash screen, just add space
      this.screenBuffer.push({text: ' ', style: LineStyle.NORMAL});
      this.screenBuffer.push({text: '--- screen cleared ---', style: LineStyle.NORMAL});
      this.screenBuffer.push({text: ' ', style: LineStyle.NORMAL});
  }
}