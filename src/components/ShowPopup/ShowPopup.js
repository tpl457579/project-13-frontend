import './ShowPopup.css'

function ShowPopup(message) {
  const popup = document.createElement('div')
  popup.className = 'popup-message'
  popup.textContent = message
  document.body.appendChild(popup)
  setTimeout(() => popup.remove(), 2500)
}

export default ShowPopup