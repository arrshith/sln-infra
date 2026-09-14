"use client";

import { useEffect, useRef } from "react";

/**
 * "After dark" — the only WebGL on the site, and the only place it has a reason
 * to exist. The subject of this image is light: a whole community's windows,
 * street lamps and avenue lighting seen from the air. A flat photograph freezes
 * that; a shader lets it behave the way lit architecture actually behaves at
 * night — warm sources breathing at slightly different rates, bloom spilling
 * into the dark planting around them, and the faintest movement of night air.
 *
 * Everything here is one full-screen quad: no geometry, no lights, no loaders
 * beyond a single texture. The pass is paused whenever the section is off
 * screen, the pixel ratio is capped, and the whole component is only mounted on
 * pointer-capable widescreen devices — everywhere else the still image is used
 * as-is and nothing is downloaded.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform vec2  uRes;
  uniform vec2  uTexRes;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2  uPointer;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // How much a pixel reads as an artificial warm light source rather than sky,
  // planting or paving. Drives every effect below, so nothing touches the dark.
  float lampMask(vec3 c) {
    float lum  = dot(c, vec3(0.299, 0.587, 0.114));
    float warm = clamp((c.r - c.b) * 2.2, 0.0, 1.0);
    return smoothstep(0.34, 0.88, lum) * (0.28 + 0.72 * warm);
  }

  void main() {
    // cover-fit, then a slow push in across the section's scroll
    float screenAspect = uRes.x / uRes.y;
    float imageAspect  = uTexRes.x / uTexRes.y;
    vec2 fit = screenAspect > imageAspect
      ? vec2(1.0, imageAspect / screenAspect)
      : vec2(screenAspect / imageAspect, 1.0);

    float zoom = 1.0 + uProgress * 0.16;
    vec2 uv = (vUv - 0.5) * fit / zoom + 0.5;
    uv += uPointer * 0.008;

    vec3 col = texture2D(uTex, uv).rgb;
    float lamp = lampMask(col);

    // Each light breathes on its own clock: a low-frequency noise field sampled
    // in image space, so neighbouring windows drift apart instead of blinking
    // together like a string of bulbs.
    float clock = noise(uv * 7.0 + vec2(uTime * 0.035, uTime * 0.021));
    float pulse = 0.86 + 0.30 * sin(clock * 6.2831 + uTime * 0.55);
    col += col * lamp * pulse * 0.42;

    // Bloom: a ring of taps around each pixel, weighted by how strongly the
    // neighbours read as lamps. This is what makes the planting glow.
    vec3 bloom = vec3(0.0);
    float radius = 0.0042 + 0.0022 * sin(uTime * 0.3);
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.7853981;
      vec2 offset = vec2(cos(a), sin(a)) * radius * vec2(1.0, uRes.x / uRes.y);
      vec3 s = texture2D(uTex, uv + offset).rgb;
      bloom += s * lampMask(s);
    }
    bloom /= 8.0;
    col += bloom * vec3(1.0, 0.78, 0.46) * 0.55 * pulse;

    // Night air. Sparse, slow, only readable against the dark — never over the
    // lit facades, where it would just look like dirt on the lens.
    vec2 mote = uv * vec2(120.0, 120.0 * uTexRes.y / uTexRes.x);
    mote.y -= uTime * 0.35;
    vec2 cell = floor(mote);
    float seed = hash(cell);
    if (seed > 0.982) {
      float d = length(fract(mote) - 0.5);
      float dust = smoothstep(0.34, 0.0, d) * (0.4 + 0.6 * sin(uTime * 0.9 + seed * 40.0));
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col += dust * vec3(1.0, 0.86, 0.62) * 0.18 * (1.0 - smoothstep(0.1, 0.5, lum));
    }

    // Settle the frame: a touch of grain, then a vignette that keeps the eye on
    // the avenue running up the middle of the plan.
    float grain = (hash(vUv * uRes + uTime) - 0.5) * 0.028;
    col += grain;

    float vignette = smoothstep(1.25, 0.32, length((vUv - 0.5) * vec2(1.1, 1.0)));
    col *= 0.42 + 0.58 * vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function NightScene({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.domElement.className = "night-canvas";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.Camera();

      const texture = await new THREE.TextureLoader().loadAsync(src);
      if (disposed) {
        texture.dispose();
        renderer.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const uniforms = {
        uTex: { value: texture },
        uRes: { value: new THREE.Vector2(1, 1) },
        uTexRes: {
          value: new THREE.Vector2(texture.image.width, texture.image.height),
        },
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms,
        depthTest: false,
        depthWrite: false,
      });
      scene.add(new THREE.Mesh(geometry, material));

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = mount;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(mount);

      // Scroll drives the push-in; the pointer adds a few pixels of drift.
      const onScroll = () => {
        const rect = mount.getBoundingClientRect();
        const total = rect.height + window.innerHeight;
        uniforms.uProgress.value = Math.min(
          1,
          Math.max(0, (window.innerHeight - rect.top) / total),
        );
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      const onPointer = (event: PointerEvent) => {
        uniforms.uPointer.value.set(
          event.clientX / window.innerWidth - 0.5,
          event.clientY / window.innerHeight - 0.5,
        );
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let visible = true;
      const visibility = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "120px" },
      );
      visibility.observe(mount);

      let frame = 0;
      const start = performance.now();
      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        uniforms.uTime.value = (performance.now() - start) / 1000;
        renderer.render(scene, camera);
      };
      tick();
      mount.dataset.ready = "true";

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        visibility.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointer);
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [src]);

  return <div className={`night-gl ${className}`.trim()} ref={host} aria-hidden="true" />;
}
