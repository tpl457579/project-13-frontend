import './AdminCatCard.css'
import { memo } from 'react'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'

const PLACEHOLDER = '../placeholder.png'

const AdminCatCard = memo(({ 
  cat, 
  onEdit, 
  onDelete, 
  className = '', 
  disabled = false 
}) => {
  if (!cat || !cat._id) return null

  const { name, imageUrl, image_link } = cat

  return (
    <div className={`admin-cat-card ${className} ${disabled ? 'cat-card-disabled' : ''}`}>
      <div className="cat-card-img">
        <img 
          src={imageUrl || image_link || PLACEHOLDER} 
          alt={name || 'Cat'} 
          className="cat-card-img" 
        />
      </div>

      <div className="admin-cat-card-content">
        <h4 
          className="cat-card-title" 
          style={{ fontSize: name && name.length > 21 ? "15px" : "18px" }}
        >
          {name || 'Unnamed Cat'}
        </h4>

        <div className="admin-cat-card-buttons">
          <button 
            type="button" 
            disabled={disabled} 
            onClick={(e) => { e.stopPropagation(); onEdit(cat); }}
          >
            <AiOutlineEdit size={18}/> Edit
          </button>
          <button 
            type="button" 
            disabled={disabled} 
            onClick={(e) => { e.stopPropagation(); onDelete(cat); }}
          >
            <AiOutlineDelete size={18}/> Delete
          </button>
        </div>
      </div>
    </div>
  )
})


export default AdminCatCard