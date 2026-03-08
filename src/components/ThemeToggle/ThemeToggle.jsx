import './ThemeToggle.css'
import { useEffect, useState } from 'react'
import { PiSunLight, PiMoonLight } from 'react-icons/pi'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    return saved || (prefersDark ? 'dark' : 'light')
  })

  useEffect(() => {
  document.body.classList.remove('dark-theme', 'light-theme')
  document.body.classList.add(`${theme}-theme`)
  localStorage.setItem('theme', theme)
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
  console.log('themechange dispatched:', theme)
}, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className='switch' onClick={toggleTheme}>
      <div className={`toggle ${theme === 'dark' ? 'active' : ''}`}>
        {theme === 'dark' ? (
          <PiSunLight className='icon' />
        ) : (
          <PiMoonLight className='icon' />
        )}
      </div>
    </div>
  )
}
