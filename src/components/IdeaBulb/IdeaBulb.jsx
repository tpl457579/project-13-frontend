import "./IdeaBulb.css";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Button from "../Buttons/Button";
import { GoLightBulb } from "react-icons/go";

const filterTip = {
  title: "Filter Tip!",
  text: "Clicking the Clear Filters button resets all filters and resets to page 1. You can also click on individual filters to reset only that filter (e.g., click on a rating or a selected alphabet letter to reset it)."
};

const TIPS = {
  AdminDogs: filterTip,
  Shop: filterTip,
  DogSearch: filterTip,
  DogForm: {
    title: "Add/Edit Tip!",
    text: "Paste the URL of the image and it inserts automatically. When adding dog info, just type (e.g., 10-20) then click the spacebar, it adds the units and moves to the next step automatically."
  },
  ProductForm: {
    title: "Add/Edit Tip!",
    text: "Paste the URL of the product and the form fills automatically!",
  }
}

export default function IdeaBulb({ tip, storageKey, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const savedStatus = localStorage.getItem(storageKey);
    if (savedStatus === "true") {
      setIsHidden(true);
    }
  }, [storageKey]);

  // Pulse animation every 10 seconds
  useEffect(() => {
    if (isHidden) return;

    const pulseInterval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000); // Animation lasts 2 seconds
    }, 10000); // Changed to 10 seconds

    return () => clearInterval(pulseInterval);
  }, [isHidden]);

  const { title, text } = TIPS[tip] || {
    title: "Help",
    text: "No help text found for this page."
  };

  const openHelp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const closeHelp = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (dontShow) {
      localStorage.setItem(storageKey, "true");
      setIsHidden(true);
    }
    setIsOpen(false);
  };

  if (isHidden) return null;

  return (
    <>
      <button 
        type="button" 
        className={`idea-bulb-btn-filter ${className}`}
        onClick={openHelp}
      >
        <GoLightBulb className={isPulsing ? 'pulsing-icon' : ''} />
      </button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeHelp}>
          <div className="idea-bulb-container" onClick={(e) => e.stopPropagation()}>
            <div className="idea-bulb-content">
              <h2 className="idea-bulb-title">{title}</h2>
              <p className="idea-bulb-text">{text}</p>

              <label className="dont-show">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={dontShow}
                  onChange={(e) => setDontShow(e.target.checked)}
                />
                Don't show again
              </label>

              <Button onClick={closeHelp}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}