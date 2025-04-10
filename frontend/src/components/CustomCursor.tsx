
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
    
    </>
  );
}
