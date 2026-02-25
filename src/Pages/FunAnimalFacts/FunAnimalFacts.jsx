import './FunAnimalFacts.css'
import { useEffect, useState, useCallback } from 'react'
import Button from '../../components/Buttons/Button.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'
import { apiFetch } from '../../components/apiFetch.js'

export default function FunAnimalFacts({ type = 'dog' }) {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)
  const label = type === 'cat' ? 'cat' : 'dog'

  const fetchFact = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch(`/${label}s/facts`)

      if (Array.isArray(data)) {
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length)
          setFact(data[randomIndex].fact || 'Fact text is missing.')
        } else {
          setFact(`No ${label} facts found.`)
        }
      } else {
        console.error(`[FunAnimalFacts] Expected array, received:`, data)
        setFact('Invalid data format received.')
      }
    } catch (error) {
      console.error(`[FunAnimalFacts] Error:`, error.message)
      setFact(`Could not fetch ${label} fact right now.`)
    } finally {
      setLoading(false)
    }
  }, [label])

  useEffect(() => {
    fetchFact()
  }, [fetchFact])

  return (
    <div className='animal-fact-container'>
  <h2 className='animal-fact-header'>Did you know?</h2>
  <div className='animal-fact'>
    {loading ? (
      <div className='loading-animal-fact'>
        <p>Loading {label} fact...</p>
        <Spinner className='fact-spinner' size={32} />
      </div>
    ) : (
      <p className='fact-text'>{fact}</p>
    )}
    <Button variant='secondary' onClick={fetchFact} className='new-fact-btn'>
      New Fact
    </Button>
  </div>
</div>
  )}