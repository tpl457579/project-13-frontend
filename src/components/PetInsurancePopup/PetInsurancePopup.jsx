import './PetInsurancePopup.css'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Modal from '../Modal/Modal.jsx'
import Button from '../Buttons/Button.jsx'

export default function PetInsurancePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const location = useLocation()

  const handleClose = () => {
  if (dontShowAgain) {
    localStorage.setItem('petInsurancePopupDismissed', 'true')
  }
  sessionStorage.setItem('petInsurancePopupShown', 'true')
  setIsOpen(false)
}

  const handleLearnMore = () => {
    window.open('https://petplan.es/en/home/', '_blank')
    handleClose()
  }

    useEffect(() => {
  if (!location.pathname.includes('/shop')) return

  const permanentlyDismissed = localStorage.getItem('petInsurancePopupDismissed')
  if (permanentlyDismissed === 'true') return

  const shownThisSession = sessionStorage.getItem('petInsurancePopupShown')
  if (shownThisSession === 'true') return

  const timer = setTimeout(() => {
    setIsOpen(true)
  }, 20000)

  return () => clearTimeout(timer)
}, [location.pathname])


  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="popup-container">
      <div className="pet-insurance-popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={handleClose}>×</button>
        
        <div className="popup-icon">
          <span className="shield-icon">
            <img src="./insurance.png" alt="Insurance" />
          </span>
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
          <p className="limited-offer">Limited Time: Get 10% off your first year!</p>
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
      </div>
    </Modal>
  )
}