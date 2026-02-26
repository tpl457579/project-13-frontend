import './MatchTheCats.css'
import { useEffect, useReducer, useState } from 'react'
import { catGameReducer, initialState } from '../../Reducers/CatGameReducer.jsx'
import { useFullscreen } from '../../Hooks/useFullScreen.js'

export default function MatchTheCats() {
  const { handleFullscreen } = useFullscreen()
  const [state, dispatch] = useReducer(catGameReducer, initialState)
  const [round, setRound] = useState(() => {
    const saved = localStorage.getItem('catGameRound')
    return saved ? parseInt(saved) : 1
  })

  const rounds = {
    1: [
      { id: 1, img: 'https://tse3.mm.bing.net/th/id/OIP.BfQvggmdi3bPuCS9Ukp0jwHaFj?pid=Api&P=0&h=180' },
      { id: 2, img: 'https://tse1.mm.bing.net/th/id/OIP.ScTmMrs-pEbVJUNOmxgrxgHaE8?pid=Api&P=0&h=180' },
      { id: 3, img: 'https://tse3.mm.bing.net/th/id/OIP.Tfm2OceUBYVl-0Q32bpLggHaEo?pid=Api&P=0&h=180'  }, 
      { id: 4, img: 'https://tse2.mm.bing.net/th/id/OIP.wRkCk6fVJUvriaVP0zaZhwHaHK?pid=Api&P=0&h=180' },
      { id: 5, img: 'https://tse1.mm.bing.net/th/id/OIP.WAN1IBvEbj-Qwpm_z89F1gHaEK?pid=Api&P=0&h=180' },
      { id: 6, img: 'https://tse4.mm.bing.net/th/id/OIP.zYxzsqPajZvnghL7O-q9RgHaHa?pid=Api&P=0&h=180' }
    ],
    2: [
      { id: 7, img: 'https://tse1.mm.bing.net/th/id/OIP.LHY7V9t92TDdFf83TH8QfwHaJ4?pid=Api&P=0&h=180' },
      { id: 8, img: 'https://tse3.mm.bing.net/th/id/OIP.MwHcnnFEECaqY9uvzmVxbQHaEK?pid=Api&P=0&h=180' },
      { id: 9, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIDQU7kqSBdt3uSRwJhB7wKs8nOC2VvEnuuQ&s' },
      { id: 10, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzcmX3gx32E8hpo2KuTRiGqVoprZ6jj66xTcN2_ceQSA&s' },
      { id: 11, img: 'https://thunderdungeon.com/wp-content/uploads/2025/02/funny-cats-29-20250212.jpg' },
      { id: 12, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2gmZikIWcF0v_L99qvpJTStLCBwUP_39aIA&s' }
    ],
    3: [
      { id: 13, img: 'https://cdn-fastly.petguide.com/media/2022/06/21/8297940/top-10-exotic-looking-cat-breeds.jpg?size=720x845&nocrop=1' },
      { id: 14, img: 'https://cdn-fastly.petguide.com/media/2022/06/21/8297934/top-10-exotic-looking-cat-breeds.jpg?size=720x845&nocrop=1' },
      { id: 15, img: 'https://tse2.mm.bing.net/th/id/OIP.rR9NMVq7FkX42f9y5Kh0mwHaE8?pid=Api&P=0&h=180' },
      { id: 16, img: 'https://cdn-fastly.petguide.com/media/2022/06/21/8297945/top-10-exotic-looking-cat-breeds.jpg?size=720x845&nocrop=1' },
      { id: 17, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBuBWAISl9Jv62eXbM4XBFnmYBPQYli0vx2g&s' },
      { id: 18, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNYxq9GgS-anuGgbtDXEP_AcFD28qIy7U2cQ&s' }
    ]
  }

  const closePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const offsets = {
  1: '-55px 0px',  
  3: '-55px 0px',
  4: '-25px 0px',
  6: '-37px 0px',
  8: '-75px 10px',
  13: '-100px 0px',
  14: '-40px 0px',
  15: '-60px 0px',
  16: '-100px 0px',
  18: '-39px 0px'
 
}

  useEffect(() => {
    const savedState = localStorage.getItem('catGameState')
    if (savedState) {
      const parsed = JSON.parse(savedState)
      dispatch({ type: 'RESTORE_STATE', state: { ...parsed, popup: null, popupMessage: '' } })
    } else {
      const baseCards = rounds[round]
      const shuffled = [...baseCards, ...baseCards].sort(() => Math.random() - 0.5)
      dispatch({ type: 'SET_CARDS', cards: shuffled })

      const roundNames = { 1: "Cute Kittens", 2: "Funny Cats", 3: "Exotic Cats" }

      dispatch({
        type: 'SHOW_POPUP',
        popup: 'intro',
        message: `Round ${round}: ${roundNames[round]}`
      })

      setTimeout(() => {
        dispatch({ type: 'HIDE_POPUP' })
      }, 1500)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('catGameRound', round)
  }, [round])

  useEffect(() => {
    const { popup, popupMessage, ...persistableState } = state
    localStorage.setItem('catGameState', JSON.stringify(persistableState))
  }, [state])

  useEffect(() => {
    if (state.flipped.length === 2) {
      setTimeout(() => {
        dispatch({ type: 'CHECK_MATCH' })
      }, 800)
    }
  }, [state.flipped])

  useEffect(() => {
    if (state.attempts <= 0) {
      dispatch({ type: 'GAME_OVER' })
    }
  }, [state.attempts])

  useEffect(() => {
    if (state.matched === state.cards.length && state.cards.length > 0) {
      if (round < 3) {
        const nextRound = round + 1
        const baseCards = rounds[nextRound]
        const shuffled = [...baseCards, ...baseCards].sort(() => Math.random() - 0.5)
        setRound(nextRound)
        dispatch({ type: 'RESET_ROUND', cards: shuffled })

        const roundNames = { 1: "Cute Kittens", 2: "Funny Cats", 3: "Exotic Cats" }

        dispatch({
          type: 'SHOW_POPUP',
          popup: 'intro',
          message: `Round ${nextRound}: ${roundNames[nextRound]}`
        })

        setTimeout(() => {
          dispatch({ type: 'HIDE_POPUP' })
        }, 1500)
      } else {
        dispatch({
          type: 'SHOW_POPUP',
          popup: 'final',
          message: "Congratulations! You completed all 3 rounds!"
        })
      }
    }
  }, [state.matched, state.cards.length, round])

  const handleFlip = (index) => {
    if (
      state.flipped.includes(index) ||
      state.matchedCards.includes(state.cards[index].id) ||
      state.gameOver
    ) return

    dispatch({ type: 'FLIP_CARD', index })
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
    setRound(1)

    const baseCards = rounds[1]
    const shuffled = [...baseCards, ...baseCards].sort(() => Math.random() - 0.5)
    dispatch({ type: 'SET_CARDS', cards: shuffled })

    dispatch({ type: 'HIDE_POPUP' })

    localStorage.removeItem('catGameState')
    localStorage.removeItem('catGameRound')
  }

  return (
    <div className="cat-game-container" onClick={handleFullscreen}>
      <h1>Match the Cats</h1>

      <div className="game-info">
        <div className="score">Score: {state.score}</div>
        <div className="attempts">Lives: {state.attempts}</div>
      </div>

      <div className="card-grid">
        {state.cards.map((card, index) => {
          const isFlipped =
            state.flipped.includes(index) ||
            state.matchedCards.includes(card.id)

          const isMatched = state.matchedCards.includes(card.id)

          return (
            <div
              key={index}
              className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => handleFlip(index)}
            >
              <img src={card.img} alt="cat"  style={{ objectPosition: offsets[card.id] ?? 'center center' }}/>
            </div>
          )
        })}
      </div>

      {state.popup && (
        <div className="overlay active">
          <div className="popup">
            <h2>{state.popupMessage}</h2>

            {state.popup === "final" && (
              <button onClick={handleReset}>Play Again</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}