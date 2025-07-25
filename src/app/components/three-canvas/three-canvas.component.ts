
import { CommonModule } from '@angular/common';
import { Component, ElementRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';
import { ScreenManager } from 'src/app/Classes/ScreenManagerClass';
import { ShellService } from 'src/app/services/shell.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Register the plugin with GSAP
gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-three-canvas',
  templateUrl: './three-canvas.component.html',
  styleUrls: ['./three-canvas.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ThreeCanvasComponent implements AfterViewInit {

    // --- NEW: A robust state machine ---
    private currentSceneState = 0; // 0: Focused, 1: Overview, 2: HTML Content
    private readonly totalStates = 3;
    private isAnimating = false; // To prevent spamming scroll
    private htmlContentElement!: HTMLElement; // A reference to the HTML content layer


  private screenManager!: ScreenManager;
  private screenMesh!: THREE.Mesh;
  private currentCommand = '';
  private showCursor = true;
  private scrollOffset = 0; // NEW: The current scroll position
  private isBooted = false; // NEW: Flag to control initial state
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  private computerModel!: THREE.Group;
  private clock = new THREE.Clock(); // For the uTime uniform
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;

  constructor(private shellService: ShellService) {}

  ngOnInit(): void {
    if (this.renderer) return;


   console.log("HELLO")

  }
  async ngAfterViewInit(): Promise<void> {


    setTimeout(async() => {
      this.screenManager = new ScreenManager();
     await this.createScene();
      this.startRenderingLoop();
      this.isBooted = true; // Everything is ready
      // --- SETUP THE MASTER SCROLL ANIMATION ---
    this.setupScrollAnimations();
    this.isBooted = true;

    }, 200);
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }


  // Keyboard input is now much simpler
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Only allow typing if we are in the focused state (state 0)
    if (!this.isBooted || this.currentSceneState !== 0) return;

    // ... rest of the keydown handling logic is the same ...
  }

  // --- THE NEW MASTER ANIMATION FUNCTION ---
  private animateToState(newState: number) {
    this.isAnimating = true;
    const duration = 1.2; // Animation duration

    // FROM Focused (0) TO Overview (1)
    if (this.currentSceneState === 0 && newState === 1) {
      gsap.to(this.camera.position, {
        y: 6,
        z: 22,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => this.camera.lookAt(this.computerModel.position),

      });
    }
    // FROM Overview (1) TO Focused (0)
    else if (this.currentSceneState === 1 && newState === 0) {
      gsap.to(this.camera.position, {
        y: 5,  // Or whatever your original focus y was
        z: 20, // Or whatever your original focus z was
        duration,
        ease: 'power2.inOut',
        onUpdate: () => this.camera.lookAt(this.computerModel.position),

      });
    }
    // FROM Overview (1) TO HTML Content (2)
    else if (this.currentSceneState === 1 && newState === 2) {
      const tl = gsap.timeline({

      });
      tl.to(this.computerModel.position, { y: 25, duration, ease: 'power2.inOut' }, 0);
      tl.to(this.htmlContentElement, { top: '0%', duration, ease: 'power2.inOut' }, 0);
    }
    // FROM HTML Content (2) TO Overview (1)
    else if (this.currentSceneState === 2 && newState === 1) {
      const tl = gsap.timeline({

      });
      tl.to(this.computerModel.position, { y: 0, duration, ease: 'power2.inOut' }, 0);
      tl.to(this.htmlContentElement, { top: '100%', duration, ease: 'power2.inOut' }, 0);
    }
    else {
      // No valid transition, so unlock animation
      this.isAnimating = false;
    }

    this.currentSceneState = newState;
  }


    // --- REPLACE handleKeyDown, handleWheel with this one master function ---

    private setupScrollAnimations() {
      // A master timeline to hold all our animation steps
      const tl = gsap.timeline();

      // --- ANIMATION 1: Zoom from Focused to Overview ---
      tl.to(this.camera.position, {
          x: 0,
          y: 6, // Camera moves up
          z: 22, // Camera moves back
          scrollTrigger: {
            trigger: '.scroll-container', // The element that triggers the scroll
            start: 'top top',         // When the top of trigger hits the top of viewport
            end: '+=100%',            // End after scrolling 100% of the viewport height
            scrub: 1,                 // Smoothly scrub the animation
            // markers: true,           // (Optional) Uncomment to see start/end markers
          },
          onUpdate: () => {
            // Keep looking at the computer as we move
            this.camera.lookAt(this.computerModel.position);
          }
        }, 'zoomOut'); // Label this animation step

      // --- ANIMATION 2: Move Computer Up and Out ---
      tl.to(this.computerModel.position, {
        y: 20, // Move the whole computer model up
        scrollTrigger: {
          trigger: '.scroll-container',
          start: '100% top', // Start when we've scrolled 100% down
          end: '+=100%',
          scrub: 1,
        },
        onUpdate: () => {
          this.camera.lookAt(this.computerModel.position);
        }
      }, 'moveUp');

      // Make the background of our component fade out
      tl.to((this.scene.background as THREE.Color), {
        r: 243 / 255, // Target r value for #f3d9b1
        g: 217 / 255, // Target g value
        b: 177 / 255, // Target b value
        scrollTrigger: {
          trigger: '.scroll-container',
          start: '100% top',
          end: '+=100%',
          scrub: 1,
        }
      }, 'moveUp'); // Add this to the 'moveUp' step so it happens at the same time
    }


  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private async createScene(): Promise<void>  {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    // Camera
    const fov = 75;
    const aspect = this.getAspectRatio();
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 5;

    const vertexShader = await fetch('/assets/shaders/vertexShader.glsl').then(res => res.text());
    const fragmentShader = await fetch('/assets/shaders/fragmentShader.glsl').then(res => res.text());

    // The screen plane
    const screenGeometry = new THREE.PlaneGeometry(16, 9); // 16:9 aspect ratio
    // We will create the shader material in the next phase. For now, a basic material.


      // NEW SHADER MATERIAL
      const screenMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uTexture: { value: this.screenManager.texture }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

    this.screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);

    this.screenMesh.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.screenMesh);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x404040));
  }

  private startRenderingLoop(): void {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    const animate = () => {
      const elapsedTime = this.clock.getElapsedTime();

      this.showCursor = Math.floor(elapsedTime * 2) % 2 === 0;
      requestAnimationFrame(animate);
       // Update the time uniform for the shader

       if (this.screenMesh.material instanceof THREE.ShaderMaterial) {
           this.screenMesh.material.uniforms['uTime'].value = elapsedTime;
       }
      this.renderer.render(this.scene, this.camera);
      this.screenManager.draw(this.currentCommand, this.showCursor, this.scrollOffset);
    };
    animate();
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  // Handle window resizing
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

   // This method will handle all keyboard input for the terminal
   private onKeyDown(event: KeyboardEvent): void {
    event.preventDefault();

    if (event.key === 'Enter') {

      const output = this.shellService.executeCommand(this.currentCommand);

      if (output === 'COMMAND_CLEAR_SCREEN') {
        //this.screenManager.clearScreen();
      } else {
        //this.screenManager.addText(output);
      }

      this.currentCommand = '';
    } else if (event.key === 'Backspace') {
      this.currentCommand = this.currentCommand.slice(0, -1);
    } else if (event.key.length === 1) { // Regular character
      this.currentCommand += event.key;
    }



    // We need to redraw the screen to show the current command being typed
    // This is an optimization for a later step, for now it's okay to call this here.
    // this.screenManager.updateCurrentCommand(this.currentCommand);
  }

  @HostListener('document:wheel', ['$event'])
  handleWheel(event: WheelEvent) {
if (!this.isBooted || this.isAnimating) return;
let nextState = this.currentSceneState;
 // Scrolling down
 if (event.deltaY > 0) {
  nextState = Math.min(this.totalStates - 1, this.currentSceneState + 1);
}
 // Scrolling up
 else {
  nextState = Math.max(0, this.currentSceneState - 1);
}

if (nextState !== this.currentSceneState) {
  this.animateToState(nextState);
}

      event.preventDefault();

      if(event.deltaY < 0) { // Scrolling up
        this.scrollOffset = Math.max(0, this.scrollOffset - 1);
      } else if (event.deltaY > 0) { // Scrolling down
        this.scrollOffset += 1;
      }
  }
}

