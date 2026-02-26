import { useCallback, useEffect } from 'react'

export const useFullscreen = (ref = null) => {
  const handleFullscreen = useCallback(() => {
    const isShortScreen = window.innerHeight <= 520
    if (isShortScreen && !document.fullscreenElement) {
      const element = document.documentElement
      const request = element.requestFullscreen || element.webkitRequestFullscreen
      if (request) request.call(element).catch(() => {})
      if (ref?.current) ref.current.focus()
    }
  }, [ref])

  useEffect(() => {
    handleFullscreen()
    window.addEventListener('resize', handleFullscreen)
    window.addEventListener('orientationchange', handleFullscreen)

    return () => {
      window.removeEventListener('resize', handleFullscreen)
      window.removeEventListener('orientationchange', handleFullscreen)
      if (document.fullscreenElement) {
        document.exitFullscreen?.()
      }
    }
  }, [handleFullscreen])

  return { handleFullscreen }
}