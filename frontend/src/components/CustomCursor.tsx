
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const updateTargetPosition = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
    };
    
    const updateCursorType = () => {
      const target = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .card-hover');
      let isTargetPointer = false;
      let isTargetHovering = false;
      
      target.forEach(el => {
        const element = document.elementFromPoint(targetPosition.x, targetPosition.y);
        if (el === element) {
          isTargetPointer = true;
        }
        if (element?.closest('.card-hover')) {
          isTargetHovering = true;
        }
      });
      
      setIsPointer(isTargetPointer);
      setIsHovering(isTargetHovering);
    };
    
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    
    window.addEventListener('mousemove', updateTargetPosition);
    window.addEventListener('mousemove', updateCursorType);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', updateTargetPosition);
      window.removeEventListener('mousemove', updateCursorType);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [targetPosition]);
  
  // Smooth cursor animation
  useEffect(() => {
    const smoothCursor = () => {
      const speed = 0.15; // Lower for smoother, higher for more responsive
      const dx = targetPosition.x - position.x;
      const dy = targetPosition.y - position.y;
      
      setPosition({
        x: position.x + dx * speed,
        y: position.y + dy * speed
      });
      
      requestAnimationFrame(smoothCursor);
    };
    
    const animationId = requestAnimationFrame(smoothCursor);
    return () => cancelAnimationFrame(animationId);
  }, [position, targetPosition]);
  
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null; // Don't render custom cursor on touch devices
  }
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          cursor: none;
        }
        a, button, [role="button"], input, select, textarea, .card-hover {
          cursor: none;
        }
      `}} />
      <div 
        className={`fixed pointer-events-none z-50 mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 ${isClicked ? 'scale-75' : 'scale-100'} ${isHovering ? 'scale-150' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        <div 
          className={`rounded-full bg-white transition-all duration-150 ease-out ${isPointer ? 'w-6 h-6 opacity-40' : 'w-4 h-4'}`}
        />
      </div>
      <div 
        className={`fixed pointer-events-none z-50 mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 ${isHovering ? 'scale-150' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div 
          className={`rounded-full border-2 border-white transition-all duration-150 ${isPointer ? 'w-10 h-10' : 'w-8 h-8'}`}
        />
      </div>
      <div 
        className="fixed pointer-events-none z-40 mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          filter: 'blur(4px)'
        }}
      >
        <div className="rounded-full bg-white w-12 h-12" />
      </div>
    </>
  );
}
