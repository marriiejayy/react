function AnswerFeedback({ isCorrect, correctAnswer }) {
  return (
    <div style={{ 
      padding: '10px', 
      margin: '10px 0',
      backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
      border: `1px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}`,
      color: isCorrect ? 'green' : 'red'
    }}>
      {isCorrect ? (
        <p>✅ Correct!</p>
      ) : (
        <p>❌ Incorrect. The correct answer is: <strong>{correctAnswer}</strong></p>
      )}
    </div>
  );
}

export default AnswerFeedback;