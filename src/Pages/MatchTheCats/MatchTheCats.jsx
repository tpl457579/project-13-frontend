import { useEffect } from 'react'
import './MatchTheCats.css'
import { initGame } from './GameLogic'

export default function MatchTheCats() {
  useEffect(() => {
    initGame()
  }, [])

  return (
    <div className="cat-game-container">
      <h1>Match the Cats</h1>

      <button
        id="home-btn"
        onClick={() => window.history.back()}
      >
        {'<'}
      </button>

      <div className="score">Score: 0</div>
      <div className="attempts">Attempts Left: 5</div>

      <div className="card-grid"></div>

      <div className="overlay"></div>

      <div className="popup">
        <h1 className="pixelated-text">Game Over</h1>
        <button id="play-again">Play Again</button>
      </div>
    </div>
  )
}
