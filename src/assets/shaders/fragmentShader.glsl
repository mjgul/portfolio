// src/assets/shaders/fragmentShader.glsl
precision highp float;
// ======== UNIFORMS & VARYINGS ========
uniform sampler2D uTexture; // Our p5.js canvas texture
uniform float uTime;       // Time uniform for animations
varying vec2 vUv;          // The UV coordinates from the vertex shader

// Data passed from the vertex shader


// Function to create scanlines
float scanline(vec2 uv) {
  return sin(uv.y * 1000.0) * 0.1;
}

// Function for barrel distortion (screen curvature)
vec2 barrelDistortion(vec2 uv) {
    vec2 center = vec2(0.5, 0.5);
    float barrelPower = 0.1; // How much curve
    vec2 diff = uv - center;
    float dist = length(diff);
    // Formula for distortion
    uv = uv + diff * dist * barrelPower;
    return uv;
}


void main() {
  vec2 distortedUv = barrelDistortion(vUv);

  // Check if the distorted UV is within the [0, 1] range. If not, discard.
  // This creates the curved corners of the screen.
  if (distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) {
      discard;
  }

  // 3. Sample the texture from our p5.js canvas at the distorted coordinate
  vec4 textureColor = texture2D(uTexture, distortedUv);

  // 4. Create the final output color. Start with the color from the texture.
  // Since our p5 canvas is already drawing in amber, we can just use its color.
  vec3 finalColor = textureColor.rgb;

   // 5. Add retro effects

  // Add subtle scanlines. We subtract from the color to make lines darker.
  finalColor -= scanline(distortedUv);



  // Get the color from our screen texture
  vec4 color = texture2D(uTexture, distortedUv);

  // Add scanlines
  color.rgb -= scanline(distortedUv);

  // Add a vignette (darker edges)
  float vignette = smoothstep(0.8, 0.4, length(distortedUv - vec2(0.5)));
  color.rgb *= vignette;

  // Add a subtle flicker
  color.rgb -= (sin(uTime * 10.0) * 0.01);
  finalColor -= (sin(uTime * 15.0) * 0.015);

  // Add a touch of "vertical hold" roll/jitter for extra realism.
  // We offset the texture lookup slightly based on time.
  float vh_roll = sin(uTime * 0.3) * 0.003;

  finalColor *= texture2D(uTexture, distortedUv + vec2(0.0, vh_roll)).rgb;

  gl_FragColor = color;
}