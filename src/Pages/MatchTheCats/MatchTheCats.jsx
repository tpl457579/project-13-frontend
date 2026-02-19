import { useEffect } from 'react'
import './MatchTheCats.css'
import { initGame } from './Gamelogic.js'

export default function MatchTheCats() {
  useEffect(() => {
    initGame()
  }, [])

  return (
    <div className="cat-game-container">
      <h1>Match the Cats</h1>

<div className='game-info'>
      <div className="score">Score: 0</div>
      <div className="attempts">Attempts Left: 5</div>
</div>
      <div className="card-grid"></div>

      <div className="overlay"></div>

      <div className="popup">
        <h1>Game Over</h1>
        <button id="play-again">Play Again</button>
      </div>
    </div>
  )
}
