import React, { useEffect, useState, useRef } from 'react';
import { Artist } from '../types';

interface ArtistNamesAnimationProps {
  artists: Artist[];
  isVisible: boolean;
  textElementRef: React.RefObject<HTMLHeadingElement>;
}

interface AnimatedArtist extends Artist {
  delay: number;
  x: number;
  y: number;
  id: string;
  displayName: string;
  smokeParticles: SmokeParticle[];
  isVisible: boolean;
  lifetime: number; // How long this name stays visible (in ms)
}

interface SmokeParticle {
  id: string;
  endX: number;
  endY: number;
  delay: number;
  duration: number;
}

interface TextBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

const ArtistNamesAnimation: React.FC<ArtistNamesAnimationProps> = ({ 
  artists, 
  isVisible, 
  textElementRef 
}) => {
  const [animatedArtists, setAnimatedArtists] = useState<AnimatedArtist[]>([]);
  const [textBounds, setTextBounds] = useState<TextBounds | null>(null);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const artistsRef = useRef<AnimatedArtist[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    artistsRef.current = animatedArtists;
  }, [animatedArtists]);

  // Update text bounds when element is available or window resizes
  // Using getBoundingClientRect for fixed positioning (relative to viewport)
  const updateTextBounds = () => {
    if (!textElementRef.current) return;

    const rect = textElementRef.current.getBoundingClientRect();

    setTextBounds({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    });
  };

  // Check if two positions collide (for collision detection)
  const checkCollision = (
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    minDistance: number = 100
  ): boolean => {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance < minDistance;
  };

  // Check if position is within screen bounds
  const isWithinBounds = (x: number, y: number, padding: number = 50): boolean => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ArtistNamesAnimation.tsx:88',message:'isWithinBounds check',data:{x,y,padding,windowWidth:window.innerWidth,windowHeight:window.innerHeight,result:(x>=padding&&x<=window.innerWidth-padding&&y>=padding&&y<=window.innerHeight-padding)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    
    return (
      x >= padding &&
      x <= window.innerWidth - padding &&
      y >= padding &&
      y <= window.innerHeight - padding
    );
  };

  // Create a single artist with position
  const createSingleArtist = (
    artist: Artist,
    bounds: TextBounds
  ): AnimatedArtist | null => {
    const existingPositions = artistsRef.current.filter(a => a.isVisible);
    
    // Randomly choose Hebrew or English name (50/50)
    const displayName = Math.random() > 0.5 ? artist.name : artist.englishName;
    
    const minDistance = 120;
    const maxDistance = 250;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ArtistNamesAnimation.tsx:107',message:'createSingleArtist entry',data:{artistName:artist.name,displayName,minDistance,maxDistance,bounds,existingCount:existingPositions.length,windowWidth:window.innerWidth},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    const zones = ['top', 'bottom', 'left', 'right'] as const;
    
    let position: { x: number; y: number } | null = null;
    let attempts = 0;
    const maxAttempts = 50;

    while (!position && attempts < maxAttempts) {
      attempts++;
      
      // Randomly select a zone
      const zone = zones[Math.floor(Math.random() * zones.length)];
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      
      let x: number, y: number;

      switch (zone) {
        case 'top':
          x = bounds.centerX + (Math.random() - 0.5) * bounds.width * 1.5;
          y = bounds.y - distance - Math.random() * 30;
          break;
        case 'bottom':
          x = bounds.centerX + (Math.random() - 0.5) * bounds.width * 1.5;
          y = bounds.y + bounds.height + distance + Math.random() * 30;
          break;
        case 'left':
          x = bounds.x - distance - Math.random() * 30;
          y = bounds.centerY + (Math.random() - 0.5) * bounds.height * 1.5;
          break;
        case 'right':
          x = bounds.x + bounds.width + distance + Math.random() * 30;
          y = bounds.centerY + (Math.random() - 0.5) * bounds.height * 1.5;
          break;
      }

      // Check if position is valid (no collision, within bounds, not inside text)
      const isInsideText = 
        x >= bounds.x - 20 && 
        x <= bounds.x + bounds.width + 20 &&
        y >= bounds.y - 20 && 
        y <= bounds.y + bounds.height + 20;

      if (!isInsideText && isWithinBounds(x, y)) {
        // Check collision with existing visible positions
        const hasCollision = existingPositions.some(existing => 
          checkCollision(x, y, existing.x, existing.y)
        );

        if (!hasCollision) {
          position = { x, y };
        }
      }
    }

    // If we couldn't find a position, use a fallback position
    if (!position) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      position = {
        x: bounds.centerX + Math.cos(angle) * distance,
        y: bounds.centerY + Math.sin(angle) * distance,
      };
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ArtistNamesAnimation.tsx:162',message:'Using fallback position',data:{position,attempts:maxAttempts,bounds},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
    }

    // Generate smoke particles (5-8 particles per name)
    const particleCount = 5 + Math.floor(Math.random() * 4);
    const smokeParticles: SmokeParticle[] = Array.from({ length: particleCount }, (_, i) => {
      const particleAngle = (Math.random() * 2 * Math.PI);
      const particleDistance = 30 + Math.random() * 50;
      return {
        id: `smoke-${artist.id}-${Date.now()}-${i}`,
        endX: Math.cos(particleAngle) * particleDistance,
        endY: Math.sin(particleAngle) * particleDistance,
        delay: 0.2 + i * 0.1,
        duration: 2 + Math.random() * 1, // 2-3 seconds
      };
    });

    // Random lifetime: 4-7 seconds
    const lifetime = 4000 + Math.random() * 3000;

    return {
      ...artist,
      delay: 0,
      x: position.x,
      y: position.y,
      id: `${artist.id}-${Date.now()}-${Math.random()}`,
      displayName,
      smokeParticles,
      isVisible: false, // Will be set to true when spawning
      lifetime,
    };
  };

  // Main animation loop - maintain continuous flow
  useEffect(() => {
    if (!isVisible || !textBounds || artists.length === 0) {
      // Cleanup all timers
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
      setAnimatedArtists([]);
      return;
    }

    // Spawn a single artist name
    const spawnSingleArtist = () => {
      if (!textBounds || artists.length === 0) return;

      const shuffled = [...artists].sort(() => Math.random() - 0.5);
      
      for (const artist of shuffled) {
        const newArtist = createSingleArtist(artist, textBounds);
        
        if (newArtist) {
          // Add to state (not visible yet)
          setAnimatedArtists(prev => [...prev, newArtist]);

          // Show the artist after a tiny delay to trigger animation
          setTimeout(() => {
            setAnimatedArtists(current => 
              current.map(a => a.id === newArtist.id ? { ...a, isVisible: true } : a)
            );
          }, 50);

          // Schedule disappearance
          const disappearTimer = setTimeout(() => {
            setAnimatedArtists(prev => {
              const updated = prev.map(a => 
                a.id === newArtist.id ? { ...a, isVisible: false } : a
              );
              // Remove after fade-out animation completes (2.5s)
              setTimeout(() => {
                setAnimatedArtists(current => current.filter(a => a.id !== newArtist.id));
              }, 2500);
              return updated;
            });
            timersRef.current.delete(newArtist.id);
          }, newArtist.lifetime);

          timersRef.current.set(newArtist.id, disappearTimer);
          return; // Successfully spawned one, exit
        }
      }
    };

    // Spawn initial 2-3 names with staggered delays
    const initialCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => spawnSingleArtist(), i * 600);
    }

    // Function to check and maintain minimum count
    const maintainMinimumCount = () => {
      const currentArtists = artistsRef.current;
      const visibleCount = currentArtists.filter(a => a.isVisible).length;
      
      // Maintain 2-4 visible names
      const minCount = 2;
      const maxCount = 4;
      
      if (visibleCount < minCount) {
        // Spawn new ones to maintain minimum
        const needed = minCount - visibleCount;
        for (let i = 0; i < needed; i++) {
          setTimeout(() => spawnSingleArtist(), i * 500);
        }
      }
    };

    // Check every 1.5 seconds
    const checkInterval = setInterval(() => {
      maintainMinimumCount();
    }, 1500);

    // Spawn new names at irregular intervals (when one disappears, spawn a new one)
    const scheduleNextSpawn = () => {
      // Random interval: 1.5-3.5 seconds
      const nextDelay = 1500 + Math.random() * 2000;
      
      const spawnTimer = setTimeout(() => {
        spawnSingleArtist();
        scheduleNextSpawn(); // Schedule next spawn
      }, nextDelay);

      return spawnTimer;
    };

    const firstSpawnTimer = scheduleNextSpawn();

    return () => {
      clearInterval(checkInterval);
      clearTimeout(firstSpawnTimer);
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [isVisible, textBounds, artists]);

  // Update text bounds on mount and resize
  useEffect(() => {
    if (!textElementRef.current) return;

    // Initial measurement
    updateTextBounds();

    // Update on resize
    const handleResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        updateTextBounds();
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    // Use ResizeObserver for more accurate tracking
    if (window.ResizeObserver && textElementRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        updateTextBounds();
      });
      resizeObserverRef.current.observe(textElementRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeObserverRef.current && textElementRef.current) {
        resizeObserverRef.current.unobserve(textElementRef.current);
      }
    };
  }, [textElementRef]);

  if (!isVisible || animatedArtists.length === 0 || !textBounds) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-visible" 
      style={{ zIndex: 15 }}
    >
      {animatedArtists.map((artist) => (
        <div
          key={artist.id}
          className="absolute artist-name-popup"
          style={{
            left: `${artist.x}px`,
            top: `${artist.y}px`,
            transform: 'translate(-50%, -50%)',
            animationDelay: '0s',
            opacity: artist.isVisible ? undefined : 0,
            animation: artist.isVisible ? 'pop-up-explode 2.5s ease-out forwards' : 'fade-out 2.5s ease-out forwards',
          }}
        >
          <span className="text-white/70 text-lg md:text-2xl font-bold uppercase tracking-tighter whitespace-nowrap">
            {artist.displayName}
          </span>
          
          {/* Enhanced smoke particles */}
          {artist.smokeParticles.map((particle) => (
            <div
              key={particle.id}
              className="smoke-particle absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animationDelay: `${artist.delay + particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                '--smoke-end-x': `${particle.endX}px`,
                '--smoke-end-y': `${particle.endY}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ArtistNamesAnimation;
