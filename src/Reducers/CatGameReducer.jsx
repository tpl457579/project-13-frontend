export const initialState = {
  cards: [],
  flipped: [],
  matchedCards: [],
  score: 0,
  attempts: 5,
  matched: 0,
  gameOver: false,
  popup: null,
  popupMessage: ""
}

export function catGameReducer(state, action) {
  switch (action.type) {

    case 'SET_CARDS':
      return {
        ...initialState,
        cards: action.cards
      }

    case 'FLIP_CARD':
      return {
        ...state,
        flipped: [...state.flipped, action.index]
      }

    case 'CHECK_MATCH': {
      const [a, b] = state.flipped
      const cardA = state.cards[a]
      const cardB = state.cards[b]

      const isMatch = cardA.id === cardB.id

      if (isMatch) {
        return {
          ...state,
          score: state.score + 1,
          matchedCards: [...state.matchedCards, cardA.id],
          matched: state.matched + 2,
          flipped: []
        }
      }

      return {
        ...state,
        attempts: state.attempts - 1,
        flipped: []
      }
    }

    case 'RESET_ROUND':
      return {
        ...initialState,
        cards: action.cards
      }

    case 'GAME_OVER':
      return {
        ...state,
        gameOver: true,
        popup: "final",
        popupMessage: "Game Over!"
      }

    case 'SHOW_POPUP':
      return {
        ...state,
        popup: action.popup,
        popupMessage: action.message
      }

    case 'HIDE_POPUP':
      return {
        ...state,
        popup: null,
        popupMessage: ""
      }

    case 'RESTORE_STATE':
      return action.state

    case 'RESET':
      return initialState

    default:
      return state
  }
}