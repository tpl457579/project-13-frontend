import { useCallback, useEffect } from 'react'

export const useFullscreen = (ref = null) => {
  const enterFullscreen = useCallback(() => {
    const isShortScreen = window.innerHeight <= 520
    if (isShortScreen && !document.fullscreenElement) {
      const element = document.documentElement
      const request = element.requestFullscreen || element.webkitRequestFullscreen
      if (request) request.call(element).catch(() => {})
      if (ref?.current) ref.current.focus()
    }
  }, [ref])

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    }
  }, [])

  const handleOrientationChange = useCallback(() => {
    exitFullscreen()
  }, [exitFullscreen])

  useEffect(() => {
    enterFullscreen()
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      exitFullscreen()
    }
  }, [])

  return { enterFullscreen, exitFullscreen }
}