import React, { useState, useEffect } from 'react'
import './DogIntro.css'

const DogIntro = ({ onFinished }) => {
  const [isBreaking, setIsBreaking] = useState(false)
  const colors = ['#FFD700', '#FF4500', '#00BFFF', '#ADFF2F', '#FF69B4', '#FFFFFF', '#8e44ad']

  useEffect(() => {
    const pulseTimeline = 2200; 
    const explosionDuration = 1200;

    const breakTimer = setTimeout(() => {
      setIsBreaking(true);
    }, pulseTimeline);

    const finishTimer = setTimeout(() => {
      if (onFinished) {
        onFinished();
      }
    }, pulseTimeline + explosionDuration); 

    return () => {
      clearTimeout(breakTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]); 

  return (
    <div className={`dog-intro-overlay dark-bg ${isBreaking ? 'shake' : ''}`}>
      <div className="dog-container">
        {!isBreaking ? (
          <img
            src='../dog1.png'
            className='dog-intro-icon'
            alt='Loading...'
          />
        ) : (
          <div className="pixel-wrap">
            {[...Array(250)].map((_, i) => (
              <div 
                key={i} 
                className="pixel-bit" 
                style={{
                  '--x': `${(Math.random() - 0.5) * 300}vw`,
                  '--y': `${(Math.random() - 0.5) * 300}vh`,
                  '--clr': colors[Math.floor(Math.random() * colors.length)],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.05}s`
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DogIntro