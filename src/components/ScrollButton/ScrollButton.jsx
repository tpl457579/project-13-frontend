import './ScrollButton.css'
import { useState, useEffect, useCallback } from 'react'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'

const ScrollButton = ({ scrollRef, scrollAmount = 120 }) => {
  const [isAtBottom, setIsAtBottom] = useState(false)

  const handleScrollLogic = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!scrollRef.current) return
    if (isAtBottom) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      scrollRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' })
    }
  }

  const onScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5)
  }, [scrollRef])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    element.addEventListener('scroll', onScroll)
    onScroll()

    return () => element.removeEventListener('scroll', onScroll)
  }, [scrollRef, onScroll])

  return (
    <div className="scroll-button-container" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="scroll-button" onClick={handleScrollLogic}>
        {isAtBottom ? <AiOutlineArrowUp size={20} /> : <AiOutlineArrowDown size={20} />}
      </button>
    </div>
  )
}

export default ScrollButton