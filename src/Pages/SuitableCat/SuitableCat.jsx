import '../SuitableCat/SuitableCat.css'
import { useState, useEffect, useCallback, useMemo } from 'react'
import DogLoader from '../../components/DogLoader/DogLoader'
import Button from '../../components/Buttons/Button'
import { useModal } from '../../Hooks/useModal.js'
import DogPopup from '../../components/DogPopup/DogPopup.jsx'
import SmallAnimalCard from '../../components/SmallAnimalCard/SmallAnimalCard.jsx'

const STORAGE_KEY = 'suitableCatState'

export default function SuitableCat() {
  console.log("🔵 Component Rendered")

  const [cats, setCats] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [error, setError] = useState(null)
  const { isOpen, openModal, closeModal } = useModal()

  console.log("🟣 State Snapshot:", { cats, current, answers, finished, results, selectedCat, error })

  const questions = useMemo(() => {
    console.log("🟡 useMemo: Questions initialized")
    return [
      { id: 'childFriendly', text: 'Do you have children at home?', options: [{ value: 5, label: 'Yes, young kids' }, { value: 3, label: 'Yes, older kids' }, { value: 1, label: 'No children' }] },
      { id: 'dogFriendly', text: 'Do you have dogs?', options: [{ value: 5, label: 'Yes, very social' }, { value: 3, label: 'Sometimes territorial' }, { value: 1, label: 'No dogs' }] },
      { id: 'grooming', text: 'How much grooming are you okay with?', options: [{ value: 1, label: 'Minimal grooming' }, { value: 3, label: 'Occasional grooming' }, { value: 5, label: 'Regular grooming is fine' }] },
      { id: 'energyLevel', text: 'How active should your cat be?', options: [{ value: 5, label: 'Very energetic' }, { value: 3, label: 'Moderately active' }, { value: 1, label: 'Low energy' }] },
      { id: 'strangerFriendly', text: 'Do you prefer a shy or friendly cat?', options: [{ value: 1, label: 'Very friendly with strangers' }, { value: 3, label: 'Balanced' }, { value: 5, label: 'Highly protective' }] },
      { id: 'affectionLevel', text: 'How affectionate should your cat be?', options: [{ value: 5, label: 'Very affectionate' }, { value: 3, label: 'Moderately affectionate' }, { value: 1, label: 'Independent' }] },
      { id: 'sheddingLevel', text: 'How fussy are you about shedding hair?', options: [{ value: 1, label: "I don't like cat hairs" }, { value: 3, label: "I don't mind some shedding" }, { value: 5, label: "I don't mind at all about shedding" }] }
    ]
  }, [])

  const calculateScore = useCallback((cat, currentAnswers) => {
    console.log("🧮 Calculating score for:", cat.name)
    let totalScore = 0
    let count = 0
    let breakdown = []

    questions.forEach(q => {
      const uVal = currentAnswers[q.id]
      const dVal = cat[q.id]
      console.log(`➡️ Trait: ${q.id} | User: ${uVal} | Cat: ${dVal}`)

      if (uVal !== undefined && dVal != null) {
        count++
        const match = Math.max(0, 100 - Math.abs(uVal - dVal) * 20)
        totalScore += match
        breakdown.push({ id: q.id, trait: q.text, match })
      }
    })

    const finalScore = count > 0 ? Math.round(totalScore / count) : 0
    console.log(`✅ Final Score for ${cat.name}:`, finalScore)

    return { ...cat, score: finalScore, breakdown }
  }, [questions])

  useEffect(() => {
    console.log("📦 Loading from localStorage…")
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved) {
      console.log("📦 Loaded saved state:", saved)
      setAnswers(saved.answers || {})
      setCurrent(saved.current || 0)
      setFinished(saved.finished || false)
      setResults(saved.results || [])
    }
  }, [])

  useEffect(() => {
    console.log("🌐 Fetching cats…")
    fetch('https://project-13-backend-1sra.onrender.com/api/v1/cats')
      .then(res => {
        console.log("🌐 Response received:", res)
        return res.json()
      })
      .then(data => {
        console.log("🌐 Data received:", data)

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.cats)
          ? data.cats
          : Array.isArray(data?.data)
          ? data.data
          : []

        console.log("📋 Parsed list:", list)

        const normalized = list.map(cat => ({
          ...cat,
          childFriendly: Number(cat.childFriendly),
          dogFriendly: Number(cat.dogFriendly),
          grooming: Number(cat.grooming),
          energyLevel: Number(cat.energyLevel),
          strangerFriendly: Number(cat.strangerFriendly),
          affectionLevel: Number(cat.affectionLevel),
          sheddingLevel: Number(cat.sheddingLevel)
        }))

        console.log("📋 Normalized cats:", normalized)

        setCats(normalized)
      })
      .catch(err => {
        console.error("❌ Fetch error:", err)
        setError(err?.message || "Failed to load cats")
      })
  }, [])

  useEffect(() => {
    console.log("💾 Saving to localStorage:", { answers, current, finished, results })
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, current, finished, results })
    )
  }, [answers, current, finished, results])

  const handleAnswer = (qId, value) => {
    console.log(`🟢 Answer selected: ${qId} = ${value}`)
    const newAnswers = { ...answers, [qId]: value }
    setAnswers(newAnswers)

    if (current < questions.length - 1) {
      console.log("➡️ Moving to next question")
      setCurrent(prev => prev + 1)
    } else {
      console.log("🏁 Quiz finished — calculating results…")
      const topMatches = cats
        .map(cat => calculateScore(cat, newAnswers))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

      console.log("🏆 Top matches:", topMatches)

      setResults(topMatches)
      setFinished(true)
    }
  }

  const resetQuiz = () => {
    console.log("🔄 Resetting quiz")
    setAnswers({})
    setCurrent(0)
    setFinished(false)
    setResults([])
    setSelectedCat(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleCatClick = (cat) => {
    console.log("🐱 Card clicked:", cat)
    setSelectedCat(cat)
    openModal()
  }

  if (error) {
    console.error("❌ Render error:", error)
    return <p>Error loading cats: {error}</p>
  }

  if (!cats) {
    console.log("⏳ Showing loader — cats not loaded yet")
    return <DogLoader />
  }

  console.log("🎨 Rendering UI — finished:", finished)

  return (
    <>
      {finished ? (
        <div className='top-cats'>
          <h1>Top 10 Matching Cats</h1>
          <p className='resultsText'>Click on the cards to learn more!</p>
          <div className='cardDiv'>
            {results.map(cat => (
              <SmallAnimalCard 
                key={cat.id ?? cat._id}

                cat={cat}
                onClick={() => handleCatClick(cat)}
              >
                <p><strong>Total Match:</strong> {cat.score || 0}%</p>
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
            onClick={() => {
              console.log("⬅️ Back button clicked")
              setCurrent(c => Math.max(0, c - 1))
            }}
            disabled={current === 0}
          >
            Back
          </Button>
        </div>
      )}

      <DogPopup 
        isOpen={isOpen}
        closePopup={() => {
          console.log("❌ Closing popup")
          closeModal()
        }}
        cat={selectedCat}
      />
    </>
  )
}
