import './FunDogFacts.css'
import { useEffect, useState, useCallback } from 'react'
import Button from '../../components/Buttons/Button.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'
import { apiFetch } from '../../components/apiFetch.js'

export default function FunDogFacts() {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)

 

const fetchFact = useCallback(async () => {
  setLoading(true);
  try {
    // We call your new endpoint. 
    // Note: The '/' at the start depends on if your API_BASE ends with /v1
    const data = await apiFetch('/dogs/facts'); 

    if (Array.isArray(data) && data.length > 0) {
      // Pick a random fact from the array returned by your MongoDB
      const randomIndex = Math.floor(Math.random() * data.length);
      setFact(data[randomIndex].fact);
    } else {
      setFact('No facts found.');
    }
  } catch (error) {
    // apiFetch already logs errors, so we just set the UI state
    setFact('Could not fetch dog fact right now.');
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchFact();
}, [fetchFact]);

  return (
    <div className='dog-fact-container'>
      <h2 className='dog-fact-header'>Did you know?</h2>

      <div className='dog-fact'>
        {loading ? (
          <div className='loading-dog-fact'>
            <p>Loading dog fact</p>
            <Spinner className='fact-spinner' size={32} />
          </div>
        ) : (
          <p className='fact-text'>{fact}</p>
        )}
      </div>

      
        <Button
          variant='secondary'
          onClick={fetchFact}
          className='new-fact-btn'
        >
          New Fact
        </Button>
      </div>
    
  )
}
