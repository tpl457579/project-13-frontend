import axios from 'axios'

const API_BASE = 'https://project-13-backend-1.onrender.com'

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const { method = 'GET', data, headers = {}, params } = options
    
    const token = localStorage.getItem('token')

    const res = await axios({
      url: `${API_BASE}${endpoint}`,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers
      },
      params
    })

    return res.data
  } catch (err) {
    if (err.response) {
      console.error(`API error: ${err.response.status} - ${err.response.data}`)
      throw err.response.data
    } else {
      console.error('API request failed:', err.message)
      throw err
    }
  }
}