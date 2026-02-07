import './Modal.css'
import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, children }) {
  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={handleClose}>
      <div className='modal-inner' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}