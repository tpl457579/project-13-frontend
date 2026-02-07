import React from "react"
import Modal from "../Modal/Modal"
import Button from "../Buttons/Button"
import './DeleteModal.css'

const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting, 
  itemName 
}) => {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='delete-modal-content'>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete <strong>{itemName}</strong>?</p>
        <div className='delete-modal-buttons'>
          <Button className='delete-button' onClick={onConfirm} loading={isDeleting} loadingText="Deleting..." showSpinner>Delete</Button>
          <Button className='delete-button' onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteModal