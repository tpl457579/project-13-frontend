import '../SuitableDog/SuitableDog.css'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Loader from '../../components/Loader/Loader'
import Button from '../../components/Buttons/Button'
import { useModal } from '../../Hooks/useModal.js'
import AnimalPopup from '../../components/AnimalPopup/AnimalPopup.jsx'
import SmallAnimalCard from '../../components/SmallAnimalCard/SmallAnimalCard.jsx'
import { apiFetch } from '../../components/apiFetch.js'

const STORAGE_KEY = 'suitableDogState'

export default function SuitableDog() {
  const [dogs, setDogs] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState([])
  const [selectedDog, setSelectedDog] = useState(null)
  const [error, setError] = useState(null)
  const { isOpen, openModal, closeModal } = useModal()

  const questions = useMemo(() => [
    { id: 'good_with_children', text: 'Do you have children at home?', options: [{ value: 5, label: 'Yes, young kids' }, { value: 3, label: 'Yes, older kids' }, { value: 1, label: 'No children' }] },
    { id: 'good_with_other_dogs', text: 'Do you already have other dogs or pets?', options: [{ value: 5, label: 'Yes, very social' }, { value: 3, label: 'Sometimes territorial' }, { value: 1, label: 'No other pets' }] },
    { id: 'grooming', text: 'How much grooming are you okay with?', options: [{ value: 1, label: 'Minimal grooming' }, { value: 3, label: 'Occasional grooming' }, { value: 5, label: 'Regular grooming is fine' }] },
    { id: 'energy', text: 'How active should your dog be?', options: [{ value: 5, label: 'Very energetic (over 1 hr exercise)' }, { value: 3, label: 'Moderately active (30–60 mins)' }, { value: 1, label: 'Low energy (less than 30 mins)' }] },
    { id: 'good_with_strangers', text: 'Do you prefer a protective or friendly dog?', options: [{ value: 1, label: 'Very friendly with strangers' }, { value: 3, label: 'Balanced' }, { value: 5, label: 'Highly protective' }] },
    { id: 'playfulness', text: 'How playful should your dog be?', options: [{ value: 5, label: 'Very playful' }, { value: 3, label: 'Moderately playful' }, { value: 1, label: 'Calm/relaxed' }] },
    { id: 'shedding', text: 'How fussy are you about shedding hair?', options: [{ value: 1, label: "I don't like dog hairs" }, { value: 3, label: "I don't mind some shedding" }, { value: 5, label: "I don't mind at all about shedding" }] }
  ], [])

  const calculateScore = useCallback((dog, currentAnswers) => {
    let totalScore = 0
    let count = 0
    let breakdown = []
    questions.forEach(q => {
      const uVal = currentAnswers[q.id]
      const dVal = dog[q.id]
      if (uVal !== undefined && dVal != null) {
        count++
        const match = Math.max(0, 100 - Math.abs(uVal - dVal) * 20)
        totalScore += match
        breakdown.push({ id: q.id, trait: q.text, match })
      }
    })
    return { ...dog, score: count > 0 ? Math.round(totalScore / count) : 0, breakdown }
  }, [questions])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved) {
      setAnswers(saved.answers || {})
      setCurrent(saved.current || 0)
      setFinished(saved.finished || false)
      setResults(saved.results || [])
    }

    apiFetch('/dogs')
  .then(data => {
    console.log("DOG API RESPONSE:", data)
    setDogs(Array.isArray(data) ? data : data.data || [])
  })
  .catch(err => setError(err?.message || String(err)))
  }, [])


  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, current, finished, results })
    )
  }, [answers, current, finished, results])

  const handleAnswer = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value }
    setAnswers(newAnswers)
    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1)
    } else {
      const topMatches = dogs
        .map(dog => calculateScore(dog, newAnswers))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
      setResults(topMatches)
      setFinished(true)
    }
  }

  const resetQuiz = () => {
    setAnswers({})
    setCurrent(0)
    setFinished(false)
    setResults([])
    setSelectedDog(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleDogClick = (dog) => {
    setSelectedDog(dog)
    openModal()
    const isShortScreen = window.innerHeight <= 520
    if (isShortScreen && !document.fullscreenElement) {
      const element = document.documentElement
      if (element.requestFullscreen) element.requestFullscreen().catch(() => {})
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen()
    }
  }

  if (error) return <p>Error loading dogs: {error}</p>
  if (!dogs) return <Loader />

  return (
    <>
      {finished ? (
        <div className='top-dogs'>
          <h1>Top 10 Matching Dogs</h1>
          <p className='resultsText'>Click on the cards to learn more!</p>
          <div className='cardDiv'>
            {results.map((dog) => (
              <SmallAnimalCard 
                key={dog.id ?? dog._id}

                dog={dog}
                onClick={() => handleDogClick(dog)}
              >
                <p><strong>Total Match:</strong> {dog.score || 0}%</p>
              </SmallAnimalCard>
            ))}
          </div>
          <div className='repeat'>
            <Button variant='primary' style={{ width: '120px' }} onClick={resetQuiz}>
              Repeat
            </Button>
          </div>
        </div>
      ) : (
        <div className='questionnaire'>
          <h1>Which dog is going to be your new best friend?</h1>
          <h2>Question {current + 1} of {questions.length}</h2>
          <p>{questions[current].text}</p>
          <div className='options'>
            {questions[current].options.map((opt) => (
              <Button 
                variant='primary'
                key={opt.value}
                className='optionInput'
                onClick={() => handleAnswer(questions[current].id, opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <Button 
            variant='primary'
            width='140px'
            height='34px'
            fontSize='16px'
            className='questionnaire-back-btn'
            onClick={() => setCurrent(c => c - 1)}
            disabled={current === 0}
          >
            Back
          </Button>
        </div>
      )}

      <AnimalPopup 
        isOpen={isOpen}
        closePopup={closeModal}
        dog={selectedDog}
      />
    </>
  )
}
