import './GuessTheDog.css'
import {
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState,
  useRef
} from 'react'
import Button from '../../components/Buttons/Button.jsx'
import { Pause, Play } from 'lucide-react'
import { dogGameReducer, initialState } from '../../Reducers/DogGameReducer.jsx'
import { useLocalStorage } from '../../Hooks/useLocalStorage.js'
import Loader from '../../components/Loader/Loader.jsx'
import { useFullscreen } from '../../Hooks/useFullScreen.js'

const STORAGE_KEY = 'dogGameState'
const getBreedFromUrl = (url) => {
  const match = url.match(/breeds\/([^/]+)\//)
  return match ? match[1].replace('-', ' ') : 'Unknown'
}

const GuessTheDog = () => {
  const { handleFullscreen } = useFullscreen()
  const [state, dispatch] = useReducer(dogGameReducer, initialState)
  const [savedState, setSavedState] = useLocalStorage(STORAGE_KEY, initialState)
  const {
    dogImages,
    correctBreed,
    score,
    lives,
    gameOver,
    timer,
    started,
    paused
  } = state
  const [loading, setLoading] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const [clickLocked, setClickLocked] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const preloadedImages = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (savedState?.started)
      dispatch({ type: 'LOAD_STATE', payload: savedState })
  }, [])
  useEffect(() => {
    setSavedState(state)
  }, [state, setSavedState])

  const preloadImages = useCallback(async (count = 3) => {
    const fetches = Array.from({ length: count * 2 }, () =>
      fetch('https://dog.ceo/api/breeds/image/random').then((res) => res.json())
    )
    const results = await Promise.all(fetches)
    const imgs = []
    for (const r of results) {
      const breed = getBreedFromUrl(r.message)
      if (!imgs.some((i) => getBreedFromUrl(i) === breed)) imgs.push(r.message)
      if (imgs.length === count) break
    }
    return imgs
  }, [])

  const fetchDogs = useCallback(async () => {
    setLoading(true)
    setClickLocked(false)
    setImagesLoaded(0)
    try {
      let imgs = preloadedImages.current.length
        ? preloadedImages.current.splice(0, 3)
        : await preloadImages()
      const correctIndex = Math.floor(Math.random() * 3)
      const correct = getBreedFromUrl(imgs[correctIndex])
      dispatch({
        type: 'SET_DOGS',
        payload: { images: imgs, correctBreed: correct }
      })
      preloadedImages.current = await preloadImages()
    } catch {
      dispatch({ type: 'SET_DOGS', payload: { images: [], correctBreed: '' } })
    } finally {
      setLoading(false)
      setFirstLoad(false)
    }
  }, [preloadImages])

  useEffect(() => {
    if (started && !gameOver) fetchDogs()
  }, [started, gameOver, fetchDogs])

  const handleGuess = useCallback(
    (url) => {
      if (gameOver || clickLocked || paused) return
      setClickLocked(true)
      const guess = getBreedFromUrl(url)
      if (guess === correctBreed) dispatch({ type: 'GUESS_CORRECT' })
      else dispatch({ type: 'GUESS_WRONG' })
      setTimeout(fetchDogs, 500)
    },
    [correctBreed, gameOver, clickLocked, paused, fetchDogs]
  )

  useEffect(() => {
    if (!started || paused || gameOver) return
    if (imagesLoaded < dogImages.length || dogImages.length === 0) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(timerRef.current)
  }, [started, paused, gameOver, imagesLoaded, dogImages.length])

  useEffect(() => {
    if (timer <= 0 && started && !paused && !gameOver) {
      dispatch({ type: 'GUESS_WRONG' })
      setTimeout(fetchDogs, 500)
    }
  }, [timer, started, paused, gameOver, fetchDogs])

  const startGame = () => dispatch({ type: 'START_GAME' })
  const togglePause = () => dispatch({ type: 'TOGGLE_PAUSE' })
  const restartGame = () => {
    dispatch({ type: 'RESET_GAME' })
    localStorage.removeItem(STORAGE_KEY)
    setFirstLoad(true)
    setClickLocked(false)
  }

  const ScoreLives = useMemo(
    () => (
      <div className='score-lives'>
        <p className='score'>
          Score: <span>{score}</span>
        </p>

        {!gameOver && <p className='timer'> Time: {timer}s</p>}

        <p className='lives'>
          Lives: {lives}
        </p>
      </div>
    ),
    [score, lives, gameOver, timer]
  )

  const DogGrid = useMemo(() => {
    if (firstLoad && loading) return <Loader />
    return (
      <div className='dog-grid'>
        {dogImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Dog ${idx}`}
            className='dog-image'
            onLoad={() => setImagesLoaded((n) => n + 1)}
            onClick={() => handleGuess(img)}
            loading='lazy'
          />
        ))}
      </div>
    )
  }, [dogImages, loading, firstLoad, handleGuess])

  return (
    <div className='game' onClick={handleFullscreen}>
      <h1>Guess the Dog Breed</h1>
      {!started && (
        <>
          <p className='game-text'>
            Take the challenge and see how many you can get correct.
          </p>
          <Button className='start-btn' onClick={startGame}>
            Start Game
          </Button>
        </>
      )}
      {started && (
        <>
          {ScoreLives}
          {!gameOver && (
            <Button
              className='pause-btn'
              variant='secondary'
              onClick={togglePause}
            >
              {paused ? <Play size={18} /> : <Pause size={18} />}
            </Button>
          )}

          {gameOver ? (
            <>
              <h2 className='game-over'>Game Over</h2>
              <Button className='restart-btn' onClick={restartGame}>
                Restart
              </Button>
            </>
          ) : (
            <>
              {!paused && (
                <>
                  <h2
                    className='question-text'
                    data-long={correctBreed.length > 10}
                  >
                    Which one is the:{' '}
                    <span className='breed'>{correctBreed}</span>?
                  </h2>
                  {DogGrid}
                </>
              )}
              {paused && <h2 className='paused'>Game Paused</h2>}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default GuessTheDog
