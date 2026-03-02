import { useState, useEffect } from 'react'
import { apiFetch } from '../components/apiFetch'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingRest, setLoadingRest] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInitial = async () => {
      setError(null)
      try {
        const data = await apiFetch('/products?page=1&limit=8', {
          method: 'GET'
        })
        const items = Array.isArray(data) ? data : data.products || []
        const validItems = items.filter((p) => p && p._id)
        setProducts(validItems)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingInitial(false)
      }
    }

    const fetchRest = async () => {
      try {
        const data = await apiFetch('/products?page=2&limit=1000', {
          method: 'GET'
        })
        const items = Array.isArray(data) ? data : data.products || []
        const validItems = items.filter((p) => p && p._id)

        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id))
          const newItems = validItems.filter((p) => !existingIds.has(p._id))
          return [...prev, ...newItems]
        })
      } catch (err) {
        console.error('Background fetch failed:', err.message)
      } finally {
        setLoadingRest(false)
      }
    }

    fetchInitial().then(() => {
      setLoadingRest(true)
      fetchRest()
    })
  }, [])

  return {
    products,
    setProducts,
    loading: loadingInitial || loadingRest,
    loadingInitial,
    loadingRest,
    error
  }
}
