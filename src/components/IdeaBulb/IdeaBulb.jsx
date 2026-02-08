import './IdeaBulb.css'
import { GoLightBulb } from "react-icons/go";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal"; 
import Button from "../../components/Buttons/Button";

export default function IdeaBulb() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem("hideIdeaBulbHelp");
    if (hidden === "true") return;
  }, []);

  const openHelp = () => {
    const hidden = localStorage.getItem("hideIdeaBulbHelp");
    if (hidden === "true") return;
    setIsOpen(true);
  };

  const closeHelp = () => {
    if (dontShow) {
      localStorage.setItem("hideIdeaBulbHelp", "true");
    }
    setIsOpen(false);
  };

  return (
    <>
      <button className="idea-bulb-btn" onClick={openHelp}>
        💡
      </button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeHelp}>
          <div className="idea-bulb-content">
            <h2>Need Help?</h2>
            <p>
              Here you can explain whatever help text you want.  
              This popup will not appear again if you check the box below.
            </p>

            <label className="dont-show">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
              />
              Don’t show again
            </label>

            <Button onClick={closeHelp}>Close</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
