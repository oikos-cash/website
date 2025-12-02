/**
 * Background Effects - Attractors & Convolutions
 * Ported from Oikos Frontend Components to Vanilla JS
 */

// Utility Functions
const randomInRange = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(randomInRange(min, max));
const randomBool = (probability = 0.5) => Math.random() < probability;
const lerp = (a, b, t) => a + t * (b - a);

const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

// Shared Noise Function
const createNoise2D = () => {
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const permutation = new Uint8Array(512);
    for (let i = 0; i < 256; i++) permutation[i] = i;
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    for (let i = 0; i < 256; i++) permutation[256 + i] = permutation[i];

    const grad = (hash, x, y) => {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    return (x, y) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = fade(x);
        const v = fade(y);
        const A = permutation[X] + Y;
        const B = permutation[X + 1] + Y;
        return lerp(lerp(grad(permutation[A], x, y), grad(permutation[B], x - 1, y), u), lerp(grad(permutation[A + 1], x, y - 1), grad(permutation[B + 1], x - 1, y - 1), u), v);
    };
};

// ==========================================
// ATTRACTOR BACKGROUND
// ==========================================

class AttractorBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationId = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.resizeHandler = this.resize.bind(this);

        // Configuration
        this.attractorTypes = ["lorenz", "thomas", "aizawa", "chen-lee", "wang-sun", "dadras", "rossler", "halvorsen", "simone", "arneodo"];
        this.attractorType = this.attractorTypes[Math.floor(Math.random() * this.attractorTypes.length)];

        // Random Parameters
        this.params = {
            numParticles: Math.floor(randomInRange(3, 8)),
            thomasA: randomInRange(0.1, 0.25),
            aizawaA: randomInRange(0.5, 1.2),
            aizawaB: randomInRange(0.5, 1.0),
            aizawaC: randomInRange(0.4, 0.8),
            simoneA: randomInRange(4, 7),
            simoneB: randomInRange(3, 6),
            simoneScale: randomInRange(1.5, 3),
            arneodoA: -randomInRange(4, 7),
            arneodoB: randomInRange(2, 5),
            arneodoD: -randomInRange(0.5, 2),
            zoom: 1.4,
            bloom: Math.random() > 0.3,
            motionBlur: true,
            glow: Math.random() > 0.3,
            particleMode: Math.random() > 0.5,
            singleColor: Math.random() > 0.7,
            mixedColors: Math.random() > 0.7,
            particleSize: randomInRange(0.5, 2),
            particleDensity: Math.floor(randomInRange(3, 15)),
            particleShape: Math.floor(randomInRange(0, 5)),
            randomShapes: Math.random() > 0.7,
            precompute: Math.floor(randomInRange(1500, 6000))
        };

        this.baseColors = ["#4ade80", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa", "#f87171", "#34d399", "#38bdf8"];
        this.selectedColor = this.baseColors[Math.floor(Math.random() * this.baseColors.length)];

        // Rotation state
        this.rotation = { x: 0.5, y: 0, z: 0 };
        this.autoRotate = true;

        this.init();
    }

    init() {
        // Safety: Cleanup previous state if re-initializing
        if (this.animationId) cancelAnimationFrame(this.animationId);
        window.removeEventListener('resize', this.resizeHandler);

        this.resize();
        window.addEventListener('resize', this.resizeHandler);

        // Attractor definitions
        this.attractors = {
            lorenz: {
                params: { sigma: 10, rho: 28, beta: 8 / 3 },
                dt: 0.005, scale: 12,
                update: (x, y, z, dt, p) => ({
                    dx: p.sigma * (y - x) * dt,
                    dy: (x * (p.rho - z) - y) * dt,
                    dz: (x * y - p.beta * z) * dt,
                }),
                init: () => ({ x: 0.1, y: 0, z: 0 }),
            },
            thomas: {
                params: { a: this.params.thomasA },
                dt: 0.05, scale: 40,
                update: (x, y, z, dt, p) => ({
                    dx: (-p.a * x + Math.sin(y)) * dt,
                    dy: (-p.a * y + Math.sin(z)) * dt,
                    dz: (-p.a * z + Math.sin(x)) * dt,
                }),
                init: () => ({ x: 1.1, y: 1.1, z: -0.01 }),
            },
            aizawa: {
                params: { a: this.params.aizawaA, b: this.params.aizawaB, c: this.params.aizawaC, d: 3.5, e: 0.1 },
                dt: 0.01, scale: 120,
                update: (x, y, z, dt, p) => ({
                    dx: ((z - p.b) * x - p.d * y) * dt,
                    dy: (p.d * x + (z - p.b) * y) * dt,
                    dz: (p.c + p.a * z - (z * z * z) / 3 - (x * x) + p.e * z * (x * x * x)) * dt,
                }),
                init: () => ({ x: 0.1, y: 0, z: 0 }),
            },
            "chen-lee": {
                params: { a: 5, b: -10, c: -0.38 },
                dt: 0.003, scale: 8,
                update: (x, y, z, dt, p) => ({
                    dx: (p.a * x - y * z) * dt,
                    dy: (p.b * y + x * z) * dt,
                    dz: (p.c * z + x * y / 3) * dt,
                }),
                init: () => ({ x: 1, y: 0, z: 4.5 }),
            },
            "wang-sun": {
                params: { a: 0.2, b: -0.03, c: 0.3, d: -0.4, e: -1.5, f: -1.5 },
                dt: 0.01, scale: 100,
                update: (x, y, z, dt, p) => ({
                    dx: (p.a * x + p.c * y * z) * dt,
                    dy: (p.b * x + p.d * y - x * z) * dt,
                    dz: (p.e * z + p.f * x * y) * dt,
                }),
                init: () => ({ x: 0.5, y: 0.5, z: 0.5 }),
            },
            dadras: {
                params: { a: 3, b: 2.7, c: 1.7, d: 2, e: 9 },
                dt: 0.005, scale: 10,
                update: (x, y, z, dt, p) => ({
                    dx: (y - p.a * x + p.b * y * z) * dt,
                    dy: (p.c * y - x * z + z) * dt,
                    dz: (p.d * x * y - p.e * z) * dt,
                }),
                init: () => ({ x: 1, y: 1, z: 1 }),
            },
            rossler: {
                params: { a: 0.2, b: 0.2, c: 5.7 },
                dt: 0.02, scale: 15,
                update: (x, y, z, dt, p) => ({
                    dx: (-y - z) * dt,
                    dy: (x + p.a * y) * dt,
                    dz: (p.b + z * (x - p.c)) * dt,
                }),
                init: () => ({ x: 0.1, y: 0, z: 0 }),
            },
            halvorsen: {
                params: { a: 1.89 },
                dt: 0.005, scale: 20,
                update: (x, y, z, dt, p) => ({
                    dx: (-p.a * x - 4 * y - 4 * z - y * y) * dt,
                    dy: (-p.a * y - 4 * z - 4 * x - z * z) * dt,
                    dz: (-p.a * z - 4 * x - 4 * y - x * x) * dt,
                }),
                init: () => ({ x: -1.48, y: -1.51, z: 2.04 }),
            },
            simone: {
                params: { a: this.params.simoneA, b: this.params.simoneB, s: this.params.simoneScale },
                dt: 0.005, scale: 80,
                update: (x, y, z, dt, p) => {
                    const xn = Math.sin(p.a * y) + Math.cos(p.b * z);
                    const yn = Math.sin(p.a * z) + Math.cos(p.b * x);
                    const zn = Math.sin(p.a * x) + Math.cos(p.b * y);
                    const nextX = p.s * xn;
                    const nextY = p.s * yn;
                    const nextZ = p.s * zn;
                    return {
                        dx: (nextX - x) * dt,
                        dy: (nextY - y) * dt,
                        dz: (nextZ - z) * dt,
                    };
                },
                init: () => ({ x: 0.1, y: 0.1, z: 0.1 }),
            },
            arneodo: {
                params: { a: this.params.arneodoA, b: this.params.arneodoB, d: this.params.arneodoD },
                dt: 0.01, scale: 40,
                update: (x, y, z, dt, p) => ({
                    dx: y * dt,
                    dy: z * dt,
                    dz: (-p.a * x - p.b * y - z + p.d * Math.pow(x, 3)) * dt,
                }),
                init: () => ({ x: 0.1, y: 0, z: 0 }),
            },
        };

        // Setup instances
        this.config = this.attractors[this.attractorType];
        this.trailLength = 1000;
        this.attractorInstances = [];

        const instanceParticles = [];
        for (let i = 0; i < this.params.numParticles; i++) {
            const init = this.config.init();
            instanceParticles.push({
                x: init.x + i * 0.01,
                y: init.y + i * 0.01,
                z: init.z,
                points: [],
            });
        }

        this.attractorInstances.push({
            particles: instanceParticles,
            offset: { x: 0, y: 0 },
            paramVariation: 1,
        });

        // Precompute
        const totalPrecompute = Math.max(this.trailLength, this.params.precompute);
        for (let step = 0; step < totalPrecompute; step++) {
            this.attractorInstances.forEach((instance) => {
                instance.particles.forEach((particle) => {
                    const { dx, dy, dz } = this.config.update(
                        particle.x,
                        particle.y,
                        particle.z,
                        this.config.dt * instance.paramVariation,
                        this.config.params
                    );

                    particle.x += dx * instance.paramVariation;
                    particle.y += dy * instance.paramVariation;
                    particle.z += dz * instance.paramVariation;

                    if (step >= totalPrecompute - this.trailLength) {
                        particle.points.push({ x: particle.x, y: particle.y, z: particle.z });
                    }
                });
            });
        }

        this.start();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeHandler);

        // Full Context Reset
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(0,0,0,0)';
        this.ctx.strokeStyle = 'rgba(0,0,0,0)';

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    rotate3D(x, y, z, rx, ry, rz) {
        let y1 = y * Math.cos(rx) - z * Math.sin(rx);
        let z1 = y * Math.sin(rx) + z * Math.cos(rx);
        let x1 = x * Math.cos(ry) + z1 * Math.sin(ry);
        let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
        let x2 = x1 * Math.cos(rz) - y1 * Math.sin(rz);
        let y2 = x1 * Math.sin(rz) + y1 * Math.cos(rz);
        return { x: x2, y: y2, z: z2 };
    }

    getColor(index) {
        if (this.params.singleColor) {
            return this.selectedColor;
        } else if (this.params.mixedColors) {
            return this.baseColors[Math.floor(Math.random() * this.baseColors.length)];
        } else {
            return this.baseColors[index % this.baseColors.length];
        }
    }

    drawShape(ctx, x, y, size, shape) {
        const actualShape = this.params.randomShapes ? Math.floor(Math.random() * 5) : shape;
        ctx.beginPath();
        switch (actualShape) {
            case 0: ctx.arc(x, y, size, 0, Math.PI * 2); break;
            case 1: ctx.rect(x - size, y - size, size * 2, size * 2); break;
            case 2:
                ctx.moveTo(x, y - size);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x - size, y + size);
                ctx.closePath();
                break;
            case 3:
                ctx.moveTo(x, y - size);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x - size, y);
                ctx.closePath();
                break;
            case 4:
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const px = x + size * Math.cos(angle);
                    const py = y + size * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                break;
            default: ctx.arc(x, y, size, 0, Math.PI * 2);
        }
    }

    start() {
        const render = () => {
            if (this.params.motionBlur) {
                this.ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
                this.ctx.fillRect(0, 0, this.width, this.height);
            } else {
                this.ctx.clearRect(0, 0, this.width, this.height);
            }

            const centerX = this.width / 2;
            const centerY = this.height / 2;
            const scale = Math.min(this.width, this.height) / 60 * (this.config.scale / 10) * this.params.zoom;

            // Center offsets for specific attractors
            const centerOffsets = {
                lorenz: { x: 0, y: 0, z: -27 },
                rossler: { x: 0, y: 5, z: 0 },
            };
            const offset = centerOffsets[this.attractorType] || { x: 0, y: 0, z: 0 };

            if (this.params.bloom) {
                this.ctx.globalCompositeOperation = 'screen';
            } else {
                this.ctx.globalCompositeOperation = 'source-over';
            }

            if (this.autoRotate) {
                this.rotation.y += 0.003;
                this.rotation.x += 0.001;
            }

            const rx = this.rotation.x;
            const ry = this.rotation.y;
            const rz = this.rotation.z;

            this.attractorInstances.forEach((instance) => {
                const drawCenterX = centerX + instance.offset.x;
                const drawCenterY = centerY + instance.offset.y;

                // Update Physics
                instance.particles.forEach((particle) => {
                    const { dx, dy, dz } = this.config.update(
                        particle.x, particle.y, particle.z,
                        this.config.dt * instance.paramVariation,
                        this.config.params
                    );
                    particle.x += dx * instance.paramVariation;
                    particle.y += dy * instance.paramVariation;
                    particle.z += dz * instance.paramVariation;
                    particle.points.push({ x: particle.x, y: particle.y, z: particle.z });
                    if (particle.points.length > this.trailLength) particle.points.shift();
                });

                // Draw
                instance.particles.forEach((particle, index) => {
                    const color = this.getColor(index);

                    if (particle.points.length > 1) {
                        if (this.params.particleMode) {
                            for (let i = 0; i < particle.points.length; i += this.params.particleDensity) {
                                const p = this.rotate3D(particle.points[i].x + offset.x, particle.points[i].y + offset.y, particle.points[i].z + offset.z, rx, ry, rz);
                                const depth = (p.z + 50) / 100;
                                const progress = i / particle.points.length;
                                const alpha = progress * (0.3 + depth * 0.7);
                                const pointSize = (1.5 + depth * 2.5 + progress * 2) * this.params.particleSize;
                                const screenX = drawCenterX + p.x * scale;
                                const screenY = drawCenterY + p.y * scale;

                                if (this.params.glow && i % (this.params.particleDensity * 3) === 0) {
                                    this.drawShape(this.ctx, screenX, screenY, pointSize * 4, this.params.particleShape);
                                    this.ctx.fillStyle = color;
                                    this.ctx.globalAlpha = alpha * 0.15;
                                    this.ctx.fill();
                                }

                                this.drawShape(this.ctx, screenX, screenY, pointSize, this.params.particleShape);
                                this.ctx.fillStyle = color;
                                this.ctx.globalAlpha = alpha;
                                this.ctx.fill();
                            }
                            this.ctx.globalAlpha = 1;
                        } else {
                            this.ctx.lineCap = "round";
                            this.ctx.lineJoin = "round";
                            for (let i = 1; i < particle.points.length; i += 2) {
                                const p1 = this.rotate3D(particle.points[i - 1].x + offset.x, particle.points[i - 1].y + offset.y, particle.points[i - 1].z + offset.z, rx, ry, rz);
                                const p2 = this.rotate3D(particle.points[i].x + offset.x, particle.points[i].y + offset.y, particle.points[i].z + offset.z, rx, ry, rz);

                                const depth = (p2.z + 50) / 100;
                                const depthAlpha = 0.3 + depth * 0.7;
                                const depthWidth = 1 + depth * 3;
                                const progress = i / particle.points.length;
                                const alpha = progress * depthAlpha;

                                this.ctx.beginPath();
                                this.ctx.moveTo(drawCenterX + p1.x * scale, drawCenterY + p1.y * scale);
                                this.ctx.lineTo(drawCenterX + p2.x * scale, drawCenterY + p2.y * scale);
                                this.ctx.strokeStyle = color;
                                this.ctx.lineWidth = depthWidth * (0.5 + progress);
                                this.ctx.globalAlpha = alpha;
                                this.ctx.stroke();
                            }
                            this.ctx.globalAlpha = 1;
                        }
                    }

                    // Draw Head
                    const currentRotated = this.rotate3D(particle.x + offset.x, particle.y + offset.y, particle.z + offset.z, rx, ry, rz);
                    const currentDepth = (currentRotated.z + 50) / 100;
                    const pointSize = 3 + currentDepth * 5;
                    const screenX = drawCenterX + currentRotated.x * scale;
                    const screenY = drawCenterY + currentRotated.y * scale;

                    if (this.params.bloom) {
                        for (let layer = 3; layer >= 1; layer--) {
                            this.drawShape(this.ctx, screenX, screenY, pointSize * layer * 1.5, this.params.particleShape);
                            this.ctx.fillStyle = color;
                            this.ctx.globalAlpha = 0.1 / layer;
                            this.ctx.fill();
                        }
                        this.ctx.globalAlpha = 1;
                    }

                    this.drawShape(this.ctx, screenX, screenY, pointSize, this.params.particleShape);
                    this.ctx.fillStyle = color;
                    if (this.params.glow) {
                        this.ctx.shadowColor = color;
                        this.ctx.shadowBlur = 20 + currentDepth * 20;
                    }
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                });
            });

            this.ctx.globalCompositeOperation = 'source-over';
            this.animationId = requestAnimationFrame(render);
        };
        render();
    }
}

// ==========================================
// CONVOLUTION BACKGROUND
// ==========================================

class ConvolutionBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.time = 0;
        this.resizeHandler = this.resize.bind(this);

        this.types = [
            "cosmic-quantum",
            "neural-nexus",
            "hyperspace",
            "flow-field",
            "fourier-spiral",
            "aurora-borealis",
            "cosmic-gas"
        ];

        this.type = this.types[Math.floor(Math.random() * this.types.length)];

        this.randomColors = [this.randomColor(), this.randomColor(), this.randomColor(), this.randomColor()];
        this.colorMode = randomInt(0, 5);
        this.presetScheme = randomInt(0, 12);
        this.baseHue = Math.random() * 360;
        this.colorShift = randomInRange(0.1, 0.5);
        this.saturationRange = [randomInRange(50, 70), randomInRange(80, 100)];
        this.lightnessRange = [randomInRange(40, 55), randomInRange(60, 75)];

        this.params = {
            motionBlur: true,
            bloom: true,
            bloomIntensity: randomInRange(0.15, 0.5),
            bloomSize: randomInt(4, 16),
            depthEffect: randomBool(0.8),
            perspectiveStrength: randomInRange(0.3, 1.0),

            numParticles: randomInt(1500, 3000),
            noiseScale: randomInRange(0.001, 0.01),
            flowSpeed: randomInRange(0.5, 4),
            particleSizeMin: randomInRange(0.5, 1.5),
            particleSizeMax: randomInRange(2, 5),
            flowDepthLayers: randomInt(2, 5),
            flowTrailFade: 0.05,
            flowCurliness: randomInRange(2, 8),

            numHarmonics: randomInt(3, 16),
            spiralSpeed: randomInRange(0.0005, 0.006),
            numTrails: randomInt(2, 6),
            trailLength: randomInt(1000, 2000),
            spiralScale: randomInRange(0.6, 1.5),
            spiral3D: true,
            spiralRotationX: randomInRange(0.2, 0.8),
            spiralRotationSpeed: randomInRange(0.0001, 0.001),
            spiralLineWidthMin: randomInRange(0.5, 2),
            spiralLineWidthMax: randomInRange(3, 8)
        };

        this.presetPalettes = [
            ["#f8bd45", "#8D6108", "#DAA520", "#B8860B"],
            ["#fbbf24", "#f87171", "#a78bfa", "#34d399"],
            ["#34d399", "#38bdf8", "#e879f9", "#fb923c"],
            ["#22d3d2", "#818cf8", "#fb7185", "#a3e635"],
            ["#84cc16", "#06b6d4", "#d946ef", "#f43f5e"],
            ["#f97316", "#ec4899", "#8b5cf6", "#14b8a6"],
            ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"],
            ["#6366f1", "#ec4899", "#f59e0b", "#22c55e"],
            ["#8b5cf6", "#06b6d4", "#f43f5e", "#84cc16"],
            ["#0ea5e9", "#f472b6", "#fcd34d", "#4ade80"],
            ["#a855f7", "#22d3ee", "#fb7185", "#facc15"],
            ["#14b8a6", "#f97316", "#a78bfa", "#f472b6"],
        ];

        this.init();
    }

    randomColor() {
        const h = Math.random() * 360;
        const s = randomInRange(60, 100);
        const l = randomInRange(45, 70);
        return hslToHex(h, s, l);
    }

    getColors() {
        switch (this.colorMode) {
            case 0: return this.presetPalettes[this.presetScheme % this.presetPalettes.length];
            case 1: return this.randomColors;
            case 2: return [
                hslToHex(this.baseHue, this.saturationRange[0], this.lightnessRange[0]),
                hslToHex(this.baseHue, this.saturationRange[1], this.lightnessRange[0]),
                hslToHex(this.baseHue, this.saturationRange[0], this.lightnessRange[1]),
                hslToHex(this.baseHue, this.saturationRange[1], this.lightnessRange[1]),
            ];
            case 3: return [
                hslToHex(this.baseHue, this.saturationRange[1], this.lightnessRange[0]),
                hslToHex((this.baseHue + 180) % 360, this.saturationRange[1], this.lightnessRange[0]),
                hslToHex(this.baseHue, this.saturationRange[0], this.lightnessRange[1]),
                hslToHex((this.baseHue + 180) % 360, this.saturationRange[0], this.lightnessRange[1]),
            ];
            case 4: return [
                hslToHex(this.baseHue, this.saturationRange[1], this.lightnessRange[0]),
                hslToHex((this.baseHue + 30) % 360, this.saturationRange[1], this.lightnessRange[1]),
                hslToHex((this.baseHue + 60) % 360, this.saturationRange[0], this.lightnessRange[0]),
                hslToHex((this.baseHue - 30 + 360) % 360, this.saturationRange[0], this.lightnessRange[1]),
            ];
            default: return this.presetPalettes[0];
        }
    }

    init() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        window.removeEventListener('resize', this.resizeHandler);

        this.resize();
        window.addEventListener('resize', this.resizeHandler);

        this.colors = this.getColors();
        this.colorRgbs = this.colors.map(hexToRgb);

        switch (this.type) {
            case "cosmic-quantum": this.setupCosmicQuantum(); break;
            case "neural-nexus": this.setupNeuralNexus(); break;
            case "hyperspace": this.setupHyperspace(); break;
            case "flow-field": this.setupFlow(); break;
            case "fourier-spiral": this.setupFourier(); break;
            case "aurora-borealis": this.setupAurora(); break;
            case "cosmic-gas": this.setupCosmicGas(); break;
            default: this.setupCosmicQuantum();
        }

        this.start();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeHandler);

        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;

        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    getGradientRgb(t) {
        const tt = ((t % 1) + 1) % 1;
        const numColors = this.colorRgbs.length;
        const segment = tt * (numColors - 1);
        const idx = Math.floor(segment);
        const frac = segment - idx;
        const c1 = this.colorRgbs[Math.min(idx, numColors - 1)];
        const c2 = this.colorRgbs[Math.min(idx + 1, numColors - 1)];
        return {
            r: Math.floor(c1.r + (c2.r - c1.r) * frac),
            g: Math.floor(c1.g + (c2.g - c1.g) * frac),
            b: Math.floor(c1.b + (c2.b - c1.b) * frac),
        };
    }

    getGradientColor(t, alpha = 1) {
        const rgb = this.getGradientRgb(t);
        return alpha < 1 ? `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})` : `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    }

    setupCosmicQuantum() {
        const noise2d = createNoise2D();
        const particleCount = 2000;
        const cosmicScale = 0.003;

        const colors = [
            {r: 15, g: 23, b: 42},
            {r: 67, g: 56, b: 202},
            {r: 168, g: 85, b: 247},
            {r: 236, g: 72, b: 153},
            {r: 103, g: 232, b: 249}
        ];

        const getCosmicColor = (t) => {
            const idx = Math.floor(t * (colors.length - 1));
            const c1 = colors[idx];
            const c2 = colors[Math.min(idx + 1, colors.length - 1)];
            const f = (t * (colors.length - 1)) - idx;
            return `rgba(${c1.r + (c2.r - c1.r) * f}, ${c1.g + (c2.g - c1.g) * f}, ${c1.b + (c2.b - c1.b) * f}`;
        };

        this.particles = [];
        for(let i=0; i<particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: 0, vy: 0,
                life: Math.random(),
                size: Math.random() > 0.95 ? randomInRange(2, 4) : randomInRange(0.5, 1.5)
            });
        }

        this.offCanvas = document.createElement('canvas');
        this.offCanvas.width = this.width;
        this.offCanvas.height = this.height;
        this.offCtx = this.offCanvas.getContext('2d');

        this.animate = () => {
            this.time += 0.005;
            this.offCtx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            this.offCtx.fillRect(0, 0, this.width, this.height);
            this.offCtx.globalCompositeOperation = 'lighter';

            this.particles.forEach(p => {
                const n = noise2d(p.x * cosmicScale, p.y * cosmicScale + this.time);
                const angle = n * Math.PI * 4;
                p.vx += Math.cos(angle) * 0.1;
                p.vy += Math.sin(angle) * 0.1;
                p.vx *= 0.9;
                p.vy *= 0.9;
                p.x += p.vx + Math.cos(angle);
                p.y += p.vy + Math.sin(angle);

                if(p.x < 0) p.x = this.width;
                if(p.x > this.width) p.x = 0;
                if(p.y < 0) p.y = this.height;
                if(p.y > this.height) p.y = 0;

                p.life += 0.01;
                const intensity = (Math.sin(p.life) + 1) / 2;
                const colorT = (n + 1) / 2;

                this.offCtx.beginPath();
                this.offCtx.arc(p.x, p.y, p.size * (0.5 + intensity * 0.5), 0, Math.PI * 2);
                this.offCtx.fillStyle = getCosmicColor(colorT) + `, ${0.3 + intensity * 0.7})`;
                this.offCtx.fill();
            });

            this.offCtx.globalCompositeOperation = 'source-over';
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(this.offCanvas, 0, 0);
        };
    }

    setupNeuralNexus() {
        const numNodes = 80;
        const maxDist = 150;

        this.nodes = [];
        for (let i = 0; i < numNodes; i++) {
            this.nodes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 2 + 1
            });
        }

        this.animate = () => {
            this.ctx.clearRect(0, 0, this.width, this.height);

            this.nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > this.width) node.vx *= -1;
                if (node.y < 0 || node.y > this.height) node.vy *= -1;
            });

            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";

            for (let i = 0; i < numNodes; i++) {
                const n1 = this.nodes[i];
                this.ctx.beginPath();
                this.ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = "#a5b4fc";
                this.ctx.fill();

                for (let j = i + 1; j < numNodes; j++) {
                    const n2 = this.nodes[j];
                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < maxDist) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(n1.x, n1.y);
                        this.ctx.lineTo(n2.x, n2.y);
                        const alpha = 1 - (dist / maxDist);
                        this.ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.6})`;
                        this.ctx.stroke();
                    }
                }
            }
        };
    }

    setupHyperspace() {
        const starCount = 1000;
        this.stars = [];
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        for(let i=0; i<starCount; i++) {
            this.stars.push({
                x: Math.random() * this.width - centerX,
                y: Math.random() * this.height - centerY,
                z: Math.random() * this.width
            });
        }

        this.animate = () => {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.stars.forEach(star => {
                star.z -= 10;
                if (star.z <= 0) {
                    star.z = this.width;
                    star.x = Math.random() * this.width - centerX;
                    star.y = Math.random() * this.height - centerY;
                }

                const k = 128.0 / star.z;
                const px = star.x * k + centerX;
                const py = star.y * k + centerY;

                if (px >= 0 && px <= this.width && py >= 0 && py <= this.height) {
                    const size = (1 - star.z / this.width) * 3;
                    const shade = parseInt((1 - star.z / this.width) * 255);
                    this.ctx.fillStyle = `rgb(${shade}, ${shade}, 255)`;
                    this.ctx.beginPath();
                    this.ctx.arc(px, py, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            });
        };
    }

    setupFlow() {
        const noise2d = createNoise2D();

        this.particles = [];
        const particlesPerLayer = Math.floor(this.params.numParticles / this.params.flowDepthLayers);
        for (let layer = 0; layer < this.params.flowDepthLayers; layer++) {
            for (let i = 0; i < particlesPerLayer; i++) {
                const z = layer / (this.params.flowDepthLayers - 1);
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    z,
                    vx: 0, vy: 0,
                    color: Math.random(),
                    size: lerp(this.params.particleSizeMin, this.params.particleSizeMax, z),
                });
            }
        }

        this.offCanvas = document.createElement('canvas');
        this.offCanvas.width = this.width;
        this.offCanvas.height = this.height;
        this.offCtx = this.offCanvas.getContext('2d');
        this.offCtx.fillStyle = "#0a0a0a";
        this.offCtx.fillRect(0, 0, this.width, this.height);

        this.animate = () => {
            this.time += 0.003;
            this.offCtx.fillStyle = `rgba(10, 10, 10, ${this.params.flowTrailFade})`;
            this.offCtx.fillRect(0, 0, this.width, this.height);
            this.particles.sort((a, b) => a.z - b.z);

            this.particles.forEach(p => {
                const layerNoiseScale = this.params.noiseScale * (0.5 + p.z * 1.0);
                const layerSpeed = this.params.flowSpeed * (0.4 + p.z * 0.8);
                const angle = noise2d(p.x * layerNoiseScale, p.y * layerNoiseScale + this.time * (0.5 + p.z * 0.5)) * Math.PI * this.params.flowCurliness;
                p.vx = Math.cos(angle) * layerSpeed;
                p.vy = Math.sin(angle) * layerSpeed;
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = this.width;
                if (p.x > this.width) p.x = 0;
                if (p.y < 0) p.y = this.height;
                if (p.y > this.height) p.y = 0;

                const colorVal = (p.color + this.time * this.colorShift) % 1;
                const depthAlpha = this.params.depthEffect ? 0.3 + p.z * 0.5 : 0.6;

                this.offCtx.beginPath();
                this.offCtx.arc(p.x, p.y, this.params.depthEffect ? p.size : this.params.particleSizeMax, 0, Math.PI * 2);
                this.offCtx.fillStyle = this.getGradientColor(colorVal, depthAlpha);
                this.offCtx.fill();
            });

            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(this.offCanvas, 0, 0);
            if (this.params.bloom) {
                 this.ctx.globalCompositeOperation = 'screen';
                 this.ctx.filter = `blur(${this.params.bloomSize}px)`;
                 this.ctx.globalAlpha = this.params.bloomIntensity * 0.8;
                 this.ctx.drawImage(this.offCanvas, 0, 0);
                 this.ctx.filter = 'none';
                 this.ctx.globalAlpha = 1;
                 this.ctx.globalCompositeOperation = 'source-over';
            }
        };
    }

    setupAurora() {
        const noise2d = createNoise2D();
        const layers = [
            { baseHue: 160, range: 30, speed: 0.03, scale: 0.004, offset: 0, yOffset: 0.3, driftFactor: 0.0005 },   // Teal/Green
            { baseHue: 270, range: 40, speed: 0.04, scale: 0.005, offset: 100, yOffset: 0.4, driftFactor: 0.0007 }, // Purple
            { baseHue: 320, range: 30, speed: 0.025, scale: 0.006, offset: 200, yOffset: 0.5, driftFactor: 0.0004 }, // Pink
            { baseHue: 200, range: 40, speed: 0.045, scale: 0.0045, offset: 300, yOffset: 0.35, driftFactor: 0.0008 }, // Blue
            { baseHue: 120, range: 40, speed: 0.035, scale: 0.0055, offset: 400, yOffset: 0.45, driftFactor: 0.0006 }, // Green
            { baseHue: 240, range: 50, speed: 0.042, scale: 0.005, offset: 500, yOffset: 0.55, driftFactor: 0.0009 }  // Deep Blue/Violet
        ];

        let xDrift = 0; // Cumulative horizontal drift

        this.animate = () => {
            this.time += 1.5; // Faster global time increment
            xDrift += 0.5; // Constant horizontal drift amount per frame (adjust for speed)

            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#020617';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.filter = 'blur(10px)'; // Significantly reduced blur

            layers.forEach((layer, i) => {
                this.ctx.beginPath();
                
                const hue = layer.baseHue + Math.sin(this.time * 0.008 + i) * layer.range; // Increased hue shift frequency
                const color = `hsla(${hue}, 85%, 60%,`; 
                
                const pulse = (Math.sin(this.time * 0.08 + layer.offset) + 1) / 2; // Much faster pulse
                const alpha = 0.2 + pulse * 0.4; // Stronger alpha pulse (0.2 to 0.6)

                const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
                gradient.addColorStop(0, color + '0)');
                gradient.addColorStop(0.4, color + (alpha * 0.5) + ')'); 
                gradient.addColorStop(0.5, color + alpha + ')'); 
                gradient.addColorStop(0.6, color + (alpha * 0.5) + ')');
                gradient.addColorStop(1, color + '0)');
                
                this.ctx.fillStyle = gradient;
                
                let started = false;
                
                // Draw top curve
                for (let x = 0; x <= this.width; x += 10) { // Reduced x step for smoother curves
                    const xCoord = (x + xDrift * layer.driftFactor); // Apply global drift, scaled per layer
                    const n1 = noise2d(xCoord * layer.scale, this.time * layer.speed + layer.offset);
                    const n2 = noise2d(xCoord * layer.scale * 3, this.time * layer.speed * 2 + layer.offset);
                    const y = this.height * layer.yOffset + (n1 * 400 + n2 * 150); // Maintain high amplitude
                    
                    if (!started) {
                        this.ctx.moveTo(x, y);
                        started = true;
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                
                // Draw bottom
                for (let x = this.width; x >= 0; x -= 10) { // Reduced x step
                    const xCoord = (x + xDrift * layer.driftFactor); // Apply global drift
                    const n1 = noise2d(xCoord * layer.scale, this.time * layer.speed + layer.offset + 20);
                    const n2 = noise2d(xCoord * layer.scale * 3, this.time * layer.speed * 2 + layer.offset + 20);
                    const thickness = 150 + Math.sin(x * 0.01 + this.time * 0.02) * 50; // Faster thickness modulation
                    const y = this.height * (layer.yOffset + 0.1) + (n1 * 400 + n2 * 150) + thickness;
                    this.ctx.lineTo(x, y);
                }
                
                this.ctx.closePath();
                this.ctx.fill();
            });

            this.ctx.filter = 'none';
            this.ctx.globalCompositeOperation = 'source-over';
        };
    }

    setupCosmicGas() {
        const noise2d = createNoise2D();
        const layers = [
            { baseHue: 220, range: 60, speed: 0.02, scale: 0.003, offset: 0, yOffset: 0.2, thicknessFactor: 0.5, drift: 0.0002 }, // Deep Blue
            { baseHue: 280, range: 50, speed: 0.03, scale: 0.004, offset: 100, yOffset: 0.35, thicknessFactor: 0.6, drift: 0.0003 }, // Purple
            { baseHue: 340, range: 60, speed: 0.015, scale: 0.0025, offset: 200, yOffset: 0.5, thicknessFactor: 0.7, drift: 0.0001 }, // Pink/Red
            { baseHue: 180, range: 40, speed: 0.025, scale: 0.0035, offset: 300, yOffset: 0.4, thicknessFactor: 0.4, drift: 0.0004 }, // Cyan
            { baseHue: 260, range: 50, speed: 0.02, scale: 0.003, offset: 400, yOffset: 0.6, thicknessFactor: 0.6, drift: 0.0002 }  // Violet
        ];

        let xDrift = 0;

        this.animate = () => {
            this.time += 1.0; // Much faster
            xDrift += 1.0; // Constant flow

            this.ctx.clearRect(0, 0, this.width, this.height);
            
            this.ctx.fillStyle = '#01010A'; 
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.globalCompositeOperation = 'screen'; 
            this.ctx.filter = 'blur(30px)'; // Reduced blur for better visibility

            layers.forEach((layer, i) => {
                this.ctx.beginPath();
                
                const hue = layer.baseHue + Math.sin(this.time * 0.01 + i) * layer.range; 
                const color = `hsla(${hue}, 75%, 55%,`; 
                
                const pulse = (Math.sin(this.time * 0.05 + layer.offset) + 1) / 2; 
                const alpha = 0.3 + pulse * 0.3; // Brighter, denser gas

                const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
                gradient.addColorStop(0, color + '0)');
                gradient.addColorStop(0.2, color + (alpha * 0.6) + ')'); 
                gradient.addColorStop(0.5, color + alpha + ')'); 
                gradient.addColorStop(0.8, color + (alpha * 0.6) + ')');
                gradient.addColorStop(1, color + '0)');
                
                this.ctx.fillStyle = gradient;
                
                let started = false;
                
                // Draw top curve
                for (let x = 0; x <= this.width; x += 20) {
                    const drift = xDrift * layer.drift * 500;
                    const xCoord = x + drift;
                    
                    const n1 = noise2d(xCoord * layer.scale, this.time * layer.speed + layer.offset);
                    const n2 = noise2d(xCoord * layer.scale * 2, this.time * layer.speed * 1.5 + layer.offset);
                    
                    const turbulence = n1 * 400 + n2 * 150;
                    const y = this.height * layer.yOffset + turbulence;
                    
                    if (!started) {
                        this.ctx.moveTo(x, y);
                        started = true;
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                
                // Draw bottom
                for (let x = this.width; x >= 0; x -= 20) {
                    const drift = xDrift * layer.drift * 500;
                    const xCoord = x + drift;

                    const n1 = noise2d(xCoord * layer.scale, this.time * layer.speed + layer.offset + 50);
                    const n2 = noise2d(xCoord * layer.scale * 2, this.time * layer.speed * 1.5 + layer.offset + 50);
                    
                    const thickness = this.height * layer.thicknessFactor + Math.sin(x * 0.002 + this.time * 0.02) * 150;
                    const turbulence = n1 * 400 + n2 * 150;
                    const y = this.height * (layer.yOffset + 0.1) + turbulence + thickness;
                    this.ctx.lineTo(x, y);
                }
                
                this.ctx.closePath();
                this.ctx.fill();
            });

            this.ctx.filter = 'none';
            this.ctx.globalCompositeOperation = 'source-over';
        };
    }

    setupFourier() { this.setupFlow(); }

    start() {
        const render = () => {
            this.animate();
            this.animationId = requestAnimationFrame(render);
        }
        render();
    }
}

// ==========================================
// MANAGER
// ==========================================

let currentBackground = null;

export function initBackground(canvas, activeType) {
    if (!canvas) {
        console.error("Canvas not found");
        return;
    }

    if (currentBackground) {
        currentBackground.destroy();
    }

    let type = activeType;

    if (!type) {
        type = Math.random() > 0.5 ? 'attractor' : 'cosmic-quantum';
    }

    let instance;
    if (type === 'attractor') {
        instance = new AttractorBackground(canvas);
    } else {
        instance = new ConvolutionBackground(canvas);
        const convTypes = ["cosmic-quantum", "neural-nexus", "hyperspace", "flow-field", "fourier-spiral", "aurora-borealis", "cosmic-gas"];
        if (convTypes.includes(type)) {
            instance.type = type;
            instance.init();
        }
    }

    currentBackground = instance;
    return instance;
}

export function switchBackground(canvas, type) {
    return initBackground(canvas, type);
}

export function destroyBackground() {
    if (currentBackground) {
        currentBackground.destroy();
        currentBackground = null;
    }
}
