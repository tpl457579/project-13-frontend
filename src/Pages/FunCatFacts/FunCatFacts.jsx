import './FunCatFacts.css'
import { useEffect, useState, useCallback } from 'react'
import Button from '../../components/Buttons/Button.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'

export default function FunCatFacts() {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)

  const API_BASE = 'https://cat-facts-api.onrender.com'

  const fetchFact = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/cat-fact`)
      const data = await res.json()
      setFact(data.fact || 'No fact found.')
    } catch (error) {
      console.error('Error fetching fact:', error)
      setFact('Could not fetch cat fact right now.')
    } finally {
      setLoading(false)
    }
  }, [API_BASE])

  useEffect(() => {
    fetchFact()
  }, [fetchFact])

  return (
    <div className='cat-fact-container'>
      <h2 className='cat-fact-header'>Did you know?</h2>

      <div className='cat-fact'>
        {loading ? (
          <div className='loading-cat-fact'>
            <p>Loading cat fact</p>
            <Spinner className='fact-spinner' size={32} />
          </div>
        ) : (
          <p className='fact-text'>{fact}</p>
        )}
      </div>

      <div className='btn-group'>
        <Button
          variant='secondary'
          onClick={fetchFact}
          className='new-fact-btn'
        >
          New Fact
        </Button>
      </div>
    </div>
  )
}
