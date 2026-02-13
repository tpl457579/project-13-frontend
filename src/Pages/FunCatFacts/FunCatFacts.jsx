import './FunCatFacts.css'
import { useEffect, useState, useCallback } from 'react'
import Button from '../../components/Buttons/Button.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'
import { apiFetch } from '../../components/apiFetch.js'

export default function CatFacts() {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCatFacts = useCallback(async () => {
    console.log('[CatFacts] Event: fetchCatFacts triggered');
    setLoading(true);

    try {
      console.log('[CatFacts] Action: Calling apiFetch("/cats/facts")');
      // Ensure your backend has the /cats/facts endpoint ready
      const data = await apiFetch('/cats/facts'); 

      // CRITICAL LOG: Checking if data is undefined or malformed
      console.log('[CatFacts] Data Received:', data);
      console.log('[CatFacts] Data Type:', typeof data);

      if (Array.isArray(data)) {
        console.log(`[CatFacts] Success: Array received with length ${data.length}`);
        
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          // Check if the property name is 'fact' (matching your MongoDB schema)
          const selectedFact = data[randomIndex].fact;
          
          console.log('[CatFacts] Selected Entry:', data[randomIndex]);
          setFact(selectedFact || 'Fact text is missing in database entry.');
        } else {
          console.warn('[CatFacts] Warning: Data array is empty []');
          setFact('No cat facts found in the database.');
        }
      } else {
        console.error('[CatFacts] Error: Expected Array, but received:', data);
        setFact('Invalid data format received from server.');
      }
    } catch (error) {
      console.error('[CatFacts] Catch Block Error:', error.message);
      setFact('Could not fetch cat facts right now.');
    } finally {
      console.log('[CatFacts] Lifecycle: fetchCatFacts finished');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('[CatFacts] Lifecycle: Component Mounted');
    fetchCatFacts();
  }, [fetchCatFacts]);

  // Constant state monitoring
  console.log(`[CatFacts] UI Render - Loading: ${loading}, Current Fact: "${fact.substring(0, 20)}..."`);

  return (
    <div className='cat-fact-container'>
      <h2 className='cat-fact-header'>Cat Trivia</h2>

      <div className='cat-fact'>
        {loading ? (
          <div className='loading-cat-fact'>
            <p>Fetching feline wisdom...</p>
            <Spinner className='fact-spinner' size={32} />
          </div>
        ) : (
          <p className='fact-text'>{fact}</p>
        )}
        
        <Button
          variant='secondary'
          onClick={() => {
            console.log('[CatFacts] UI Interaction: "New Cat Fact" clicked');
            fetchCatFacts();
          }}
          className='new-fact-btn'
        >
          New Cat Fact
        </Button>
      </div>
    </div>
  )
}