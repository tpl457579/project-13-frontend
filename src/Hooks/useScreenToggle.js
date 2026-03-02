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
    const rootElement = document.documentElement

    if (!isFullscreen) {
      const requestMethod = 
        rootElement.requestFullscreen || 
        rootElement.webkitRequestFullscreen || 
        rootElement.mozRequestFullScreen || 
        rootElement.msRequestFullscreen

      if (requestMethod) {
        try {
          await requestMethod.call(rootElement)
        } catch (err) {
          console.error(err)
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
          console.error(err)
        }
      }
    }
  }, [isFullscreen])

  return { isFullscreen, toggleFullscreen }
}