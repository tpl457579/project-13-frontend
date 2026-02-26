import { useState, useCallback, useEffect } from 'react'
import { useFullscreen } from './useFullScreen.js'

export const useAdminActions = (ref) => {
  const [editingItem, setEditingItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { handleFullscreen } = useFullscreen(ref)

  const openModal = useCallback((item = null) => {
    setEditingItem(item)
    setIsSubmitting(false)
    setShowModal(true)
    handleFullscreen()
  }, [handleFullscreen])

  const closeModal = useCallback(() => {
    setEditingItem(null)
    setShowModal(false)
  }, [])

  const openDeleteModal = useCallback((item) => {
    setSelectedItem(item)
    setDeleteModal(true)
  }, [])

  return {
    editingItem, setEditingItem,
    showModal, setShowModal,
    deleteModal, setDeleteModal,
    selectedItem, setSelectedItem,
    isSubmitting, setIsSubmitting,
    isDeleting, setIsDeleting,
    openModal, closeModal, openDeleteModal,
    handleFullscreen
  }
}