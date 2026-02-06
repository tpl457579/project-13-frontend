import { useState, useCallback, useEffect } from 'react';

export const useAdminActions = (ref) => {
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFullscreen = useCallback(() => {
    const isLandscape = window.innerHeight <= 520;
    if (isLandscape && !document.fullscreenElement) {
      const element = document.documentElement;
      const request = element.requestFullscreen || element.webkitRequestFullscreen;
      if (request) request.call(element).catch(() => {});
      if (ref?.current) ref.current.focus();
    }
  }, [ref]);

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    };
  }, []);

  const openModal = useCallback((item = null) => {
    setEditingItem(item);
    setIsSubmitting(false);
    setShowModal(true);
    handleFullscreen();
  }, [handleFullscreen]);

  const closeModal = useCallback(() => {
    setEditingItem(null);
    setShowModal(false);
  }, []);

  const openDeleteModal = useCallback((item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  }, []);

  return {
    editingItem, setEditingItem,
    showModal, setShowModal,
    deleteModal, setDeleteModal,
    selectedItem, setSelectedItem,
    isSubmitting, setIsSubmitting,
    isDeleting, setIsDeleting,
    openModal, closeModal, openDeleteModal,
    handleFullscreen
  };
};