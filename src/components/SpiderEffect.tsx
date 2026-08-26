"use client";

import { useEffect, useRef } from "react";

class Spider {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  angle: number;
  speed: number;
  tick: number; // For leg animation

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 2 + 1; // Speed between 1 and 3
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.maxLife = Math.random() * 150 + 150; // Life 150 to 300 frames
    this.life = this.maxLife;
    this.size = Math.random() * 2 + 3; // Size 3 to 5
    this.tick = Math.random() * 100;
  }

  update() {
    // Erratic spider movement
    this.angle += (Math.random() - 0.5) * 0.8;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.tick += this.speed * 0.4; // Leg animation speed based on movement
  }

  draw(ctx: CanvasRenderingContext2D) {
    const opacity = (this.life / this.maxLife) * 0.7; // Max 70% opacity for better visibility
    ctx.globalAlpha = Math.max(0, opacity);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Spider color - matching the brand (Red)
    ctx.fillStyle = "#E63946"; 
    ctx.strokeStyle = "#E63946";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Abdomen (back part)
    ctx.beginPath();
    ctx.arc(-this.size * 0.6, 0, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Cephalothorax (head/front part)
    ctx.beginPath();
    ctx.arc(this.size * 0.6, 0, this.size * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Legs (8 distinct bent legs)
    ctx.lineWidth = Math.max(1, this.size * 0.25);
    
    const legSpreads = [-1.2, -0.4, 0.4, 1.2]; // Spread of legs along the X axis
    
    for (let i = -1; i <= 1; i += 2) { // left and right (-1, 1)
      for (let j = 0; j < 4; j++) { // 4 legs on each side
        const spread = legSpreads[j];
        
        ctx.beginPath();
        // Start at the side of the body
        const startX = spread * this.size * 0.5;
        const startY = i * this.size * 0.8;
        ctx.moveTo(startX, startY);
        
        // Knee joint (out and slightly forward/back depending on leg)
        const kneeX = startX + spread * this.size * 0.8;
        const kneeY = i * this.size * 2.5;
        ctx.lineTo(kneeX, kneeY);
        
        // Leg animation offset
        // Alternate legs move opposite ways
        const wiggle = Math.sin(this.tick + (j + (i > 0 ? 1 : 0)) * Math.PI / 2) * this.size * 0.8;
        
        // Foot (further out and down, with wiggle)
        const footX = kneeX + spread * this.size + wiggle;
        const footY = i * this.size * 4;
        ctx.lineTo(footX, footY);
        
        ctx.stroke();
      }
    }
    
    ctx.restore();
    ctx.globalAlpha = 1.0;
  }
}

export default function SpiderEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let spiders: Spider[] = [];
    let spawnTimer = 0;
    
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        // Set actual canvas size for sharp rendering
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        // Scale context to match DPR
        ctx.scale(dpr, dpr);
        // Set CSS size
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
      }
    };
    
    window.addEventListener("resize", resize);
    resize();

    const spawnBurst = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const startX = Math.random() * parent.clientWidth;
      const startY = Math.random() * parent.clientHeight;
      // 1.5x more spiders: ~22 to 52
      const count = Math.floor((Math.random() * 20 + 15) * 1.5); 
      
      for (let i = 0; i < count; i++) {
        spiders.push(new Spider(startX, startY));
      }
    };

    const render = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      // Clear using logical width/height since context is scaled
      ctx.clearRect(0, 0, parent.clientWidth, parent.clientHeight);
      
      spawnTimer--;
      if (spawnTimer <= 0) {
        spawnBurst();
        spawnTimer = Math.random() * 200 + 150; 
      }

      for (let i = spiders.length - 1; i >= 0; i--) {
        const spider = spiders[i];
        spider.update();
        spider.draw(ctx);
        if (spider.life <= 0) {
          spiders.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    spawnBurst();
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0" 
    />
  );
}
