import { useState, useEffect } from 'react'
import Modal from './Modal/Modal'
import Button from './Buttons/Button'
import './PetInsurancePopup.css'

export default function PetInsurancePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('petInsurancePopupDismissed')
    if (dismissed === 'true') return

    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 25000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('petInsurancePopupDismissed', 'true')
    }
    setIsOpen(false)
  }

  const handleLearnMore = () => {
    window.open('https://petplan.es/en/home/', '_blank')
    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="pet-insurance-popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={handleClose}>×</button>
        
        <div className="popup-icon">
          <span className="shield-icon">🛡️</span>
          <span className="paw-icon">🐾</span>
        </div>

        <h2 className="popup-title">Protect Your Furry Friend!</h2>
        
        <p className="popup-subtitle">
          Get peace of mind with comprehensive pet insurance
        </p>

        <div className="popup-benefits">
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span>Covers accidents & illnesses</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span>Up to 90% reimbursement</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span>No waiting period for accidents</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span>24/7 vet helpline included</span>
          </div>
        </div>

        <div className="popup-cta">
          <p className="limited-offer">🎉 Limited Time: Get 10% off your first year!</p>
          <Button 
            variant="primary" 
            className="cta-button"
            onClick={handleLearnMore}
          >
            Get Free Quote
          </Button>
        </div>

        <label className="dont-show-label">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          Don't show this again
        </label>
      </div>
    </Modal>
  )
}