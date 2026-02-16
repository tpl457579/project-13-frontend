import '../SuitableCat/SuitableCat.css'
import { useState, useEffect, useCallback, useMemo } from 'react'
import DogLoader from '../../components/DogLoader/DogLoader'
import Button from '../../components/Buttons/Button'
import { useModal } from '../../Hooks/useModal.js'
import DogPopup from '../../components/DogPopup/DogPopup.jsx'
import SmallAnimalCard from '../../components/SmallAnimalCard/SmallAnimalCard.jsx'
import { apiFetch } from '../../components/apiFetch.js'

const STORAGE_KEY = 'suitableCatState'

export default function SuitableCat() {
  console.log("RENDER START")

  const [cats, setCats] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [error, setError] = useState(null)
  const { isOpen, openModal, closeModal } = useModal()

  console.log("STATE:", { cats, current, answers, finished, results, selectedCat })

  const questions = useMemo(() => [
    { id: 'childFriendly', text: 'Do you have children at home?', options: [{ value: 5, label: 'Yes, young kids' }, { value: 3, label: 'Yes, older kids' }, { value: 1, label: 'No children' }] },
    { id: 'dogFriendly', text: 'Do you have dogs?', options: [{ value: 5, label: 'Yes, very social' }, { value: 3, label: 'Sometimes territorial' }, { value: 1, label: 'No dogs' }] },
    { id: 'grooming', text: 'How much grooming are you okay with?', options: [{ value: 1, label: 'Minimal grooming' }, { value: 3, label: 'Occasional grooming' }, { value: 5, label: 'Regular grooming is fine' }] },
    { id: 'energyLevel', text: 'How active should your cat be?', options: [{ value: 5, label: 'Very energetic' }, { value: 3, label: 'Moderately active' }, { value: 1, label: 'Low energy' }] },
    { id: 'strangerFriendly', text: 'Do you prefer a shy or friendly cat?', options: [{ value: 1, label: 'Very friendly with strangers' }, { value: 3, label: 'Balanced' }, { value: 5, label: 'Highly protective' }] },
    { id: 'affectionLevel', text: 'How affectionate should your cat be?', options: [{ value: 5, label: 'Very playful' }, { value: 3, label: 'Moderately playful' }, { value: 1, label: 'Calm/relaxed' }] },
    { id: 'sheddingLevel', text: 'How fussy are you about shedding hair?', options: [{ value: 1, label: "I don't like cat hairs" }, { value: 3, label: "I don't mind some shedding" }, { value: 5, label: "I don't mind at all about shedding" }] }
  ], [])

  const calculateScore = useCallback((cat, currentAnswers) => {
    console.log("CALCULATE SCORE FOR:", cat.name || cat.id, currentAnswers)

    let totalScore = 0, count = 0, breakdown = []
    questions.forEach(q => {
      const uVal = currentAnswers[q.id], dVal = cat[q.id]
      if (uVal !== undefined && dVal != null) {
        count++
        const match = Math.max(0, 100 - Math.abs(uVal - dVal) * 20)
        totalScore += match
        breakdown.push({ id: q.id, trait: q.text, match })
      }
    })

    const finalScore = count > 0 ? Math.round(totalScore / count) : 0
    console.log("FINAL SCORE:", finalScore)

    return { ...cat, score: finalScore, breakdown }
  }, [questions])

  useEffect(() => {
    console.log("RESTORING STATE FROM LOCALSTORAGE")
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    console.log("SAVED STATE:", saved)

    if (saved) {
      setAnswers(saved.answers || {})
      setCurrent(saved.current || 0)
      setFinished(saved.finished || false)
      setResults(saved.results || [])
    }
  }, [])

  useEffect(() => {
  console.log("FETCHING /cats ...")

  apiFetch('/cats')
    .then(data => {
      console.log("RAW API RESPONSE:", data)
      console.log("TYPE:", typeof data)
      console.log("IS ARRAY:", Array.isArray(data))

      let list = []

      if (Array.isArray(data)) {
        console.log("USING ROOT ARRAY")
        list = data
      } 
      else if (Array.isArray(data?.cats)) {
        console.log("USING data.cats ARRAY")
        list = data.cats
      } 
      else if (Array.isArray(data?.data)) {
        console.log("USING data.data ARRAY")
        list = data.data
      } 
      else {
        console.log("❌ NO VALID ARRAY FOUND IN API RESPONSE")
      }

      console.log("FINAL LIST BEFORE SET:", list)
      setCats(list)
    })
    .catch(err => {
      console.log("FETCH ERROR:", err)
      setError(err.message || "Failed to load cats")
    })
}, [])

  useEffect(() => {
    console.log("SAVING STATE TO LOCALSTORAGE:", { answers, current, finished, results })
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, current, finished, results }))
  }, [answers, current, finished, results])

  const handleAnswer = (qId, value) => {
    console.log("ANSWER CLICKED:", qId, value)

    const newAnswers = { ...answers, [qId]: value }
    console.log("NEW ANSWERS:", newAnswers)

    setAnswers(newAnswers)

    if (current < questions.length - 1) {
      console.log("MOVING TO NEXT QUESTION")
      setCurrent(prev => prev + 1)
    } else {
      console.log("QUIZ FINISHED — CALCULATING RESULTS")

      const topMatches = cats
        .map(cat => calculateScore(cat, newAnswers))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

      console.log("TOP MATCHES:", topMatches)

      setResults(topMatches)
      setFinished(true)
    }
  }

  const resetQuiz = () => {
    console.log("RESET QUIZ")
    setAnswers({})
    setCurrent(0)
    setFinished(false)
    setResults([])
    setSelectedCat(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleCatClick = (cat) => {
    console.log("CAT CLICKED:", cat)
    setSelectedCat(cat)
    openModal()
  }

  if (error) {
    console.log("ERROR:", error)
    return <p>Error loading cats: {error}</p>
  }

  if (!cats) {
    console.log("CATS STILL LOADING")
    return <DogLoader />
  }

  console.log("RENDERING UI — FINISHED?", finished)

  return (
    <>
      {finished ? (
        <div className='top-cats'>
          <h1>Top 10 Matching Cats</h1>
          <p className='resultsText'>Click on the cards to learn more!</p>

          <div className='cardDiv'>
            {results.length === 0 && <p>No results found</p>}
            {results.map(cat => {
              console.log("RENDERING RESULT CARD:", cat)
              return (
                <SmallAnimalCard 
                  key={cat.id}
                  cat={cat}
                  onClick={() => handleCatClick(cat)}
                >
                  <p><strong>Total Match:</strong> {cat.score || 0}%</p>
                </SmallAnimalCard>
              )
            })}
          </div>

          <div className='repeat'>
            <Button variant='primary' style={{ width: '120px' }} onClick={resetQuiz}>
              Repeat
            </Button>
          </div>
        </div>
      ) : (
        <div className='questionnaire'>
          <h1>Which cat is going to be your new best friend?</h1>
          <h2>Question {current + 1} of {questions.length}</h2>
          <p>{questions[current].text}</p>

          <div className='options'>
            {questions[current].options.map(opt => (
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
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            Back
          </Button>
        </div>
      )}

      <DogPopup 
        isOpen={isOpen}
        closePopup={closeModal}
        cat={selectedCat}
      />
    </>
  )
}
