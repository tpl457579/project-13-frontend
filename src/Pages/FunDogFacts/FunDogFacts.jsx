import './FunDogFacts.css'
import { useEffect, useState, useCallback } from 'react'
import Button from '../../components/Buttons/Button.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'
import { apiFetch } from '../../components/apiFetch.js'

export default function FunDogFacts() {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchDogFacts = useCallback(async () => {
    console.log('[FunDogFacts] Event: fetchDogFacts triggered');
    setLoading(true);
    
    try {
      console.log('[FunDogFacts] Action: Calling apiFetch("/dogs/facts")');
      const data = await apiFetch('/dogs/facts'); 

      // CRITICAL LOG: This will show you exactly what is causing the .length error
      console.log('[FunDogFacts] Data Received:', data);
      console.log('[FunDogFacts] Type of Data:', typeof data);

      if (Array.isArray(data)) {
        console.log(`[FunDogFacts] Success: Data is an array with length ${data.length}`);
        
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const selectedFact = data[randomIndex].fact;
          
          console.log('[FunDogFacts] Selected Fact Object:', data[randomIndex]);
          setFact(selectedFact);
        } else {
          console.warn('[FunDogFacts] Warning: Data array is empty');
          setFact('No facts found.');
        }
      } else {
        // This log triggers if data is null, undefined, or an object instead of an array
        console.error('[FunDogFacts] Error: Expected Array but received:', data);
        setFact('Invalid data format received.');
      }
    } catch (error) {
      console.error('[FunDogFacts] Catch Block Triggered:', error.message);
      setFact('Could not fetch dog fact right now.');
    } finally {
      console.log('[FunDogFacts] Lifecycle: fetchDogFacts finished (finally)');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('[FunDogFacts] Lifecycle: Component Mounted / useEffect triggered');
    fetchDogFacts();
  }, [fetchDogFacts]);

  // Log on every render to track state changes
  console.log(`[FunDogFacts] Render State - Loading: ${loading}, Fact length: ${fact?.length || 0}`);

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
        
        <Button
          variant='secondary'
          onClick={() => {
            console.log('[FunDogFacts] UI Interaction: "New Fact" button clicked');
            fetchDogFacts();
          }}
          className='new-fact-btn'
        >
          New Fact
        </Button>
      </div>
    </div>
  )
}