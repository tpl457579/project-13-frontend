import { useCallback, useEffect, useState } from 'react'

export const useScreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (typeof document === 'undefined') return false
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )
  })

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ))
    }

    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ]

    events.forEach(event => document.addEventListener(event, handleChange))

    return () => {
      events.forEach(event => document.removeEventListener(event, handleChange))
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const docEl = document.documentElement

    if (!isFullscreen) {
      const requestMethod = 
        docEl.requestFullscreen || 
        docEl.webkitRequestFullscreen || 
        docEl.mozRequestFullScreen || 
        docEl.msRequestFullscreen

      if (requestMethod) {
        try {
          await requestMethod.call(docEl)
        } catch (err) {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        }
      }
    } else {
      const exitMethod = 
        document.exitFullscreen || 
        document.webkitExitFullscreen || 
        document.mozCancelFullScreen || 
        document.msExitFullscreen

      if (exitMethod) {
        try {
          await exitMethod.call(document)
        } catch (err) {
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        }
      }
    }
  }, [isFullscreen])

  return { isFullscreen, toggleFullscreen }
}