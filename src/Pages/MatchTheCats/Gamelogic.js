import { themes } from './themes.js'

let currentThemeIndex = parseInt(localStorage.getItem('currentThemeIndex')) || 0
let score = parseInt(localStorage.getItem('score')) || 0
let attempts = parseInt(localStorage.getItem('attempts')) || 5
let firstCard = null
let secondCard = null
let matchedCards = JSON.parse(localStorage.getItem('matchedCards')) || []
let matchesMade = parseInt(localStorage.getItem('matchesMade')) || 0

export const initGame = () => {
  const cardGrid = document.querySelector('.card-grid')
  const scoreDisplay = document.querySelector('.score')
  const attemptsDisplay = document.querySelector('.attempts')

  if (!cardGrid || !scoreDisplay || !attemptsDisplay) return

  hidePopup()

  scoreDisplay.textContent = `Score: ${score}`
  attemptsDisplay.textContent = `Attempts Left: ${attempts}`

  loadTheme(currentThemeIndex)
}

export const loadTheme = (themeIndex) => {
  const cardGrid = document.querySelector('.card-grid')
  if (!cardGrid) return

  cardGrid.innerHTML = ''

  matchesMade = 0
  localStorage.setItem('matchesMade', 0)

  attempts = 5
  localStorage.setItem('attempts', attempts)

  const theme = themes[themeIndex]
  if (!theme) return

  const attemptsDisplay = document.querySelector('.attempts')
  if (attemptsDisplay) {
    attemptsDisplay.textContent = `Attempts Left: ${attempts}`
  }

  const savedPositions = retrieveCardPositions(theme)
  const savedMatchedCards = JSON.parse(localStorage.getItem('matchedCards')) || []

  savedPositions.forEach(({ cardValue, imageClass }) => {
    const card = document.createElement('div')
    card.classList.add('card')
    if (imageClass) card.classList.add(imageClass)
    card.dataset.value = cardValue

    card.addEventListener('click', function () {
      if (this.classList.contains('flipped') || secondCard) return

      this.classList.add('flipped')

      if (!firstCard) {
        firstCard = this
      } else {
        secondCard = this
        checkForMatch()
      }
    })

    if (savedMatchedCards.includes(cardValue)) {
      card.classList.add('matched', 'flipped')
      card.style.pointerEvents = 'none'
    }

    cardGrid.appendChild(card)
  })
}

export const retrieveCardPositions = (theme) => {
  const savedData = JSON.parse(localStorage.getItem('savedGameData')) || {}

  if (savedData.themeName !== theme.name) {

    const pairs = theme.cards.map((card, idx) => ({
      cardValue: card,
      imageClass: theme.imageClasses[idx]
    }))

    const duplicated = [...pairs, ...pairs]

    const shuffled = duplicated.sort(() => Math.random() - 0.5)

    localStorage.setItem(
      'savedGameData',
      JSON.stringify({
        themeName: theme.name,
        cardPositions: shuffled
      })
    )

    return shuffled
  }

  return savedData.cardPositions || []
}

export const checkForMatch = () => {
  if (!firstCard || !secondCard) return

  const scoreDisplay = document.querySelector('.score')
  const attemptsDisplay = document.querySelector('.attempts')

  if (firstCard.dataset.value === secondCard.dataset.value) {
    score++
    matchesMade++

    if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`

    matchedCards.push(firstCard.dataset.value)

    firstCard.classList.add('matched')
    secondCard.classList.add('matched')

    saveGameState()
    resetBoard()

    const totalMatches = themes[currentThemeIndex].cards.length

    if (matchesMade === totalMatches) {
      nextRound()
    }
  } else {
    attempts--

    if (attemptsDisplay) {
      attemptsDisplay.textContent = `Attempts Left: ${Math.max(attempts, 0)}`
    }

    saveGameState()

    setTimeout(() => {
      firstCard.classList.remove('flipped')
      secondCard.classList.remove('flipped')
      resetBoard()
    }, 500)

    if (attempts <= 0) {
      gameOver()
    }
  }
}

export const resetBoard = () => {
  firstCard = null
  secondCard = null
}

export const saveGameState = () => {
  localStorage.setItem('score', score)
  localStorage.setItem('attempts', attempts)
  localStorage.setItem('matchedCards', JSON.stringify(matchedCards))
  localStorage.setItem('matchesMade', matchesMade)
}

export const nextRound = () => {
  matchedCards = []
  localStorage.removeItem('matchedCards')

  attempts = 5
  matchesMade = 0

  localStorage.setItem('attempts', attempts)
  localStorage.setItem('matchesMade', matchesMade)

  currentThemeIndex++
  localStorage.setItem('currentThemeIndex', currentThemeIndex)

  if (currentThemeIndex >= themes.length) {
   
    showPopup('Congratulations! You completed all 3 rounds!')
    return
  }

  loadTheme(currentThemeIndex)
}

export const resetGame = () => {
  currentThemeIndex = 0
  score = 0
  attempts = 5
  matchesMade = 0
  matchedCards = []

  localStorage.clear()

  saveGameState()

  const cardGrid = document.querySelector('.card-grid')
  if (cardGrid) cardGrid.innerHTML = ''

  hidePopup()
  loadTheme(currentThemeIndex)

  const scoreDisplay = document.querySelector('.score')
  const attemptsDisplay = document.querySelector('.attempts')
  if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`
  if (attemptsDisplay) attemptsDisplay.textContent = `Attempts Left: ${attempts}`
}

export const gameOver = () => {

  showPopup('Game Over')

  const playAgainButton = document.querySelector('#play-again')
  if (playAgainButton) {
    playAgainButton.onclick = resetGame
  }
}

export const hidePopup = () => {
  const overlay = document.querySelector('.overlay')
  const popup = document.querySelector('.popup')

  if (!overlay || !popup) return

  overlay.style.display = 'none'
  popup.style.display = 'none'
}

export const showPopup = (message) => {
  const overlay = document.querySelector('.overlay')
  const popup = document.querySelector('.popup')

  if (!overlay || !popup) return

  const popupText = popup.querySelector('.pixelated-text')
  if (popupText) popupText.textContent = message

  const playAgainButton = document.querySelector('#play-again')

  if (message.includes('Congratulations')) {
    popupText.style.fontSize = '18px'
    popupText.style.textAlign = 'center'
    if (playAgainButton) playAgainButton.onclick = resetGame
  }

  overlay.style.display = 'flex'
  popup.style.display = 'block'
}
