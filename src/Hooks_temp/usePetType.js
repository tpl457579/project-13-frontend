import { useState, useEffect } from 'react';

export default function usePetType() {
  const [petType, setPetType] = useState(() => {
    return localStorage.getItem('petType') || null;
  });

  const choosePet = (type) => {
    setPetType(type);
    localStorage.setItem('petType', type);
  };

  const clearPet = () => {
    setPetType(null);
    localStorage.removeItem('petType');
  };

  return { petType, choosePet, clearPet };
}

