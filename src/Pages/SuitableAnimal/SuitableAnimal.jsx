import './SuitableAnimal.css'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Loader from '../../components/Loader/Loader'
import Button from '../../components/Buttons/Button'
import { useModal } from '../../Hooks/useModal.js'
import AnimalPopup from '../../components/AnimalPopup/AnimalPopup.jsx'
import SmallAnimalCard from '../../components/SmallAnimalCard/SmallAnimalCard.jsx'

const QUESTIONS = {
  cat: [
    { id: 'childFriendly', text: 'Do you have children at home?', options: [{ value: 5, label: 'Yes, young kids' }, { value: 3, label: 'Yes, older kids' }, { value: 1, label: 'No children' }] },
    { id: 'dogFriendly', text: 'Do you have dogs?', options: [{ value: 5, label: 'Yes, very social' }, { value: 3, label: 'Sometimes territorial' }, { value: 1, label: 'No dogs' }] },
    { id: 'grooming', text: 'How much grooming are you okay with?', options: [{ value: 1, label: 'Minimal grooming' }, { value: 3, label: 'Occasional grooming' }, { value: 5, label: 'Regular grooming is fine' }] },
    { id: 'energyLevel', text: 'How active should your cat be?', options: [{ value: 5, label: 'Very energetic' }, { value: 3, label: 'Moderately active' }, { value: 1, label: 'Low energy' }] },
    { id: 'strangerFriendly', text: 'Do you prefer a shy or friendly cat?', options: [{ value: 1, label: 'Very friendly with strangers' }, { value: 3, label: 'Balanced' }, { value: 5, label: 'Highly protective' }] },
    { id: 'affectionLevel', text: 'How affectionate should your cat be?', options: [{ value: 5, label: 'Very affectionate' }, { value: 3, label: 'Moderately affectionate' }, { value: 1, label: 'Independent' }] },
    { id: 'sheddingLevel', text: 'How fussy are you about shedding hair?', options: [{ value: 1, label: "I don't like cat hairs" }, { value: 3, label: "I don't mind some shedding" }, { value: 5, label: "I don't mind at all about shedding" }] }
  ],
  dog: [
    { id: 'good_with_children', text: 'Do you have children at home?', options: [{ value: 5, label: 'Yes, young kids' }, { value: 3, label: 'Yes, older kids' }, { value: 1, label: 'No children' }] },
    { id: 'good_with_other_dogs', text: 'Do you already have other dogs or pets?', options: [{ value: 5, label: 'Yes, very social' }, { value: 3, label: 'Sometimes territorial' }, { value: 1, label: 'No other pets' }] },
    { id: 'grooming', text: 'How much grooming are you okay with?', options: [{ value: 1, label: 'Minimal grooming' }, { value: 3, label: 'Occasional grooming' }, { value: 5, label: 'Regular grooming is fine' }] },
    { id: 'energy', text: 'How active should your dog be?', options: [{ value: 5, label: 'Very energetic (over 1 hr exercise)' }, { value: 3, label: 'Moderately active (30–60 mins)' }, { value: 1, label: 'Low energy (less than 30 mins)' }] },
    { id: 'good_with_strangers', text: 'Do you prefer a protective or friendly dog?', options: [{ value: 1, label: 'Very friendly with strangers' }, { value: 3, label: 'Balanced' }, { value: 5, label: 'Highly protective' }] },
    { id: 'playfulness', text: 'How playful should your dog be?', options: [{ value: 5, label: 'Very playful' }, { value: 3, label: 'Moderately playful' }, { value: 1, label: 'Calm/relaxed' }] },
    { id: 'shedding', text: 'How fussy are you about shedding hair?', options: [{ value: 1, label: "I don't like dog hairs" }, { value: 3, label: "I don't mind some shedding" }, { value: 5, label: "I don't mind at all about shedding" }] }
  ]
}

const API_URLS = {
  cat: 'https://project-13-backend-1.onrender.com/api/v1/cats',
  dog: 'https://project-13-backend-1.onrender.com/api/v1/dogs'
}

// Pass type="cat" or type="dog" as a prop
export default function SuitableAnimal({ type = 'cat' }) {
  const isCat = type === 'cat'
  const label = isCat ? 'cat' : 'dog'
  const STORAGE_KEY = `suitable${isCat ? 'Cat' : 'Dog'}State`

  const [animals, setAnimals] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [error, setError] = useState(null)
  const { isOpen, openModal, closeModal } = useModal()

  const questions = useMemo(() => QUESTIONS[type], [type])

  const calculateScore = useCallback((animal, currentAnswers) => {
    let totalScore = 0
    let count = 0
    let breakdown = []

    questions.forEach(q => {
      const uVal = currentAnswers[q.id]
      const dVal = animal[q.id]

      if (uVal !== undefined && dVal != null) {
        count++
        const match = Math.max(0, 100 - Math.abs(uVal - dVal) * 20)
        totalScore += match
        breakdown.push({ id: q.id, trait: q.text, match })
      }
    })

    const finalScore = count > 0 ? Math.round(totalScore / count) : 0
    return { ...animal, score: finalScore, breakdown }
  }, [questions])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved) {
      setAnswers(saved.answers || {})
      setCurrent(saved.current || 0)
      setFinished(saved.finished || false)
      setResults(saved.results || [])
    }
  }, [STORAGE_KEY])

  useEffect(() => {
    fetch(API_URLS[type])
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.[`${label}s`])
          ? data[`${label}s`]
          : Array.isArray(data?.data)
          ? data.data
          : []

        const normalized = list.map(animal => ({
          ...animal,
          childFriendly: Number(animal.childFriendly),
          dogFriendly: Number(animal.dogFriendly),
          grooming: Number(animal.grooming),
          energyLevel: Number(animal.energyLevel),
          strangerFriendly: Number(animal.strangerFriendly),
          affectionLevel: Number(animal.affectionLevel),
          sheddingLevel: Number(animal.sheddingLevel)
        }))

        setAnimals(normalized)
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setError(err?.message || `Failed to load ${label}s`)
      })
  }, [type, label])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, current, finished, results }))
  }, [answers, current, finished, results, STORAGE_KEY])

  const handleAnswer = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value }
    setAnswers(newAnswers)

    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1)
    } else {
      const topMatches = animals
        .map(animal => calculateScore(animal, newAnswers))
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
    setSelectedAnimal(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal)
    openModal()
  }

  if (error) return <p>Error loading {label}s: {error}</p>
  if (!animals) return <Loader />

  return (
    <>
      {finished ? (
        <div className={`top-${label}s`}>
          <h1>Top 10 Matching {label}s</h1>
          <p className='resultsText'>Click on the cards to learn more!</p>
          <div className='cardDiv'>
            {results.map(animal => (
              <SmallAnimalCard
                key={animal.id ?? animal._id}
                {...{ [label]: animal }}
                onClick={() => handleAnimalClick(animal)}
              >
                <p><strong>Total Match:</strong> {animal.score || 0}%</p>
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
          <h1>Which {label} is going to be your new best friend?</h1>
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

      <AnimalPopup
        isOpen={isOpen}
        closePopup={closeModal}
        {...{ [label]: selectedAnimal }}
      />
    </>
  )
}