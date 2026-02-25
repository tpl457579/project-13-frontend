import './AdminAnimalCard.css'
import { memo } from 'react'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'

const PLACEHOLDER = '../placeholder.png'

const AdminAnimalCard = memo(({ 
  animal,
  type = 'dog',
  onEdit, 
  onDelete, 
  className = '', 
  disabled = false 
}) => {
  if (!animal || !animal._id) return null

  const { name, imageUrl, image_link } = animal

  return (
    <div className={`admin-animal-card ${className} ${disabled ? 'animal-card-disabled' : ''}`}>
      <div className="animal-card-img">
        <img 
          src={imageUrl || image_link || PLACEHOLDER} 
          alt={name || type} 
          className="animal-card-img" 
        />
      </div>

      <div className="admin-animal-card-content">
        <h4 
          className="animal-card-title" 
          style={{ fontSize: name && name.length > 21 ? "15px" : "18px" }}
        >
          {name || `Unnamed ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </h4>

        <div className="admin-animal-card-buttons">
          <button 
            type="button" 
            disabled={disabled} 
            onClick={(e) => { e.stopPropagation(); onEdit(animal); }}
          >
            <AiOutlineEdit size={18}/> Edit
          </button>
          <button 
            type="button" 
            disabled={disabled} 
            onClick={(e) => { e.stopPropagation(); onDelete(animal); }}
          >
            <AiOutlineDelete size={18}/> Delete
          </button>
        </div>
      </div>
    </div>
  )
})

export default AdminAnimalCard