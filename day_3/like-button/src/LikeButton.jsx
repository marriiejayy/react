import { useState } from 'react';
import './LikeButton.css';

function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  
  function handleLike() {
    if (isDisabled) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
  
    if (newLikedState) {
      setLikeCount(likeCount + 1);
    } else {
      setLikeCount(likeCount - 1);
    }
    
    // Challenge: Disable button for 1 second
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  }
  
  return (
    <div className="like-button">
      <button 
        onClick={handleLike}
        className={`btn-like ${isLiked ? 'liked' : ''}`}
        disabled={isDisabled}
      >
        {isLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
      <p className="like-count">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</p>
    </div>
  );
}

export default LikeButton;