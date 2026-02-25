import './AnimalForm.css'
import { useAnimalForm } from '../../Hooks/useAnimalForm'
import Button from '../Buttons/Button'
import Spinner from '../Spinner/Spinner'
import DropZone from '../DropZone/DropZone'
import { AiOutlineClose } from 'react-icons/ai'
import IdeaBulb from '../IdeaBulb/IdeaBulb'
import ScrollButton from '../ScrollButton/ScrollButton'
import { useRef } from 'react'

const PLACEHOLDER = '../placeholder.png'

function TemperamentSelector({ options, selected, onChange }) {
  const scrollRef = useRef(null)
  const toggle = (t) => {
    if (selected.includes(t)) onChange(selected.filter(x => x !== t))
    else onChange([...selected, t])
  }
  return (
    <div className="temperament-mode-container">
      <div className="temperament-selector" ref={scrollRef}>
        {options.map(t => (
          <button key={t} type="button" className={selected.includes(t) ? "selected" : ""} onClick={() => toggle(t)}>
            {t}
          </button>
        ))}
      </div>
      <ScrollButton scrollRef={scrollRef} scrollAmount={120} />
    </div>
  )
}

export default function AnimalForm({ type = 'dog', initialData = {}, onSubmit, onCancel, isSubmitting }) {
  const { state, handlers, refs } = useAnimalForm({ type, initialData, onSubmit, onCancel })
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1)
  const currentField = state.fields[state.step]

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form className="animal-edit-form" onSubmit={handlers.handleFormSubmit}>
        <div className='modal-close' onClick={onCancel}><AiOutlineClose size={24} /></div>
        <h2 className="form-title-vertical">{initialData._id ? `Edit ${capitalizedType}` : `Add ${capitalizedType}`}</h2>
        <div className="animal-layout-wrapper">
          <div className="form-section-visuals">
            <div className="visual-toggle">
              <button type="button" className={!state.showTemperaments ? "active" : ""} onClick={() => handlers.setShowTemperaments(false)}>Image</button>
              <button type="button" className={state.showTemperaments ? "active" : ""} onClick={() => handlers.setShowTemperaments(true)}>Temperaments</button>
            </div>
            <div className="visual-content">
              {!state.showTemperaments ? (
                <div className="image-mode">
                  <div className="add-animal-image"><img src={state.preview || PLACEHOLDER} alt={capitalizedType} /></div>
                  <DropZone handleFileChange={handlers.handleFileChange} height="120px" fontSize="14px" />
                  {state.uploading && <Spinner />}
                </div>
              ) : (
                <div className="temperament-mode">
                  <TemperamentSelector options={state.temperamentOptions} selected={state.formData.temperament || []} onChange={(newTemps) => handlers.setFormData(prev => ({ ...prev, temperament: newTemps }))} />
                </div>
              )}
            </div>
          </div>
          <div className='form-section-inputs'>
            <h3 className="form-title">{initialData._id ? `Edit ${capitalizedType}` : `Add ${capitalizedType}`}</h3>
            <div className='identity-inputs'>
              <input value={state.name} onChange={(e) => handlers.setName(e.target.value)} placeholder='Name' required />
              <input value={state.imageUrl} onChange={(e) => { handlers.setImageUrl(e.target.value); handlers.setPreview(e.target.value); }} placeholder='Image URL' />
            </div>
            <div className='characteristics-step'>
              <div className="input-wrapper">
                <input className="animal-info-input" style={{ borderColor: state.error ? 'var(--accent-color)' : '' }} key={currentField.key} ref={refs.inputRef} type="text" value={state.formData[currentField.key] || ''} onChange={(e) => handlers.handleFieldChange(e.target.value)} />
                <span className="floating-placeholder">{currentField.label}</span>
                {state.error && <div className="error-tooltip">{state.error}</div>}
                <IdeaBulb className="animal-form-tip" tip={`${capitalizedType}Form`} storageKey={`has_seen_${type}_form_tip`} />
              </div>
            </div>
            <div className="step-navigation">
              <button type="button" className="nav-arrow" disabled={state.step === 0} onClick={() => handlers.handleManualStep(state.step - 1)}>&larr;</button>
              <div className="step-dots">
                {state.fields.map((_, index) => (
                  <button key={index} type="button" className={`step-dot ${index === state.step ? 'active' : ''}`} onClick={() => handlers.handleManualStep(index)} />
                ))}
              </div>
              <button type="button" className="nav-arrow" disabled={state.step === state.fields.length - 1 || !!state.error} onClick={() => handlers.handleManualStep(state.step + 1)}>&rarr;</button>
            </div>
            <div className="admin-animal-form-buttons">
              <Button type='submit' loading={isSubmitting || state.uploading} loadingText="Saving..." showSpinner disabled={!!state.error || !state.name}>Save {capitalizedType}</Button>
              <button type='button' onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}