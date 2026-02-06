import './AdminDogCard.css'
import { memo } from 'react'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'

const PLACEHOLDER = '../placeholder.png'

const AdminDogCard = memo(({ 
  dog, 
  onEdit, 
  onDelete, 
  className = '', 
  disabled = false 
}) => {
  if (!dog || !dog._id) return null

  const { name, imageUrl, image_link } = dog

  return (
    <div className={`admin-dog-card ${className} ${disabled ? 'dog-card-disabled' : ''}`}>
      <div className="dog-card-img">
        <img 
          src={imageUrl || image_link || PLACEHOLDER} 
          alt={name || 'Dog'} 
          className="dog-card-img" 
        />
      </div>

      <div className="admin-dog-card-content">
        <h4 
          className="dog-card-title" 
          style={{ fontSize: name && name.length > 21 ? "15px" : "18px" }}
        >
          {name || 'Unnamed Dog'}
        </h4>

        <div className="admin-dog-card-buttons">
          <button 
            type="button" 
            disabled={disabled} 
            onClick={(e) => { e.stopPropagation(); onEdit(dog); }}
          >
            <AiOutlineEdit size={18}/> Edit
          </button>
          <button 
            type="button" 
            disabled={disabled} 
            onClick={(e) => { e.stopPropagation(); onDelete(dog); }}
          >
            <AiOutlineDelete size={18}/> Delete
          </button>
        </div>
      </div>
    </div>
  )
})


export default AdminDogCard