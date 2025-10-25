function ScoreBoard({ score, currentQuestion, totalQuestions }) {
  return (
    <div>
      <h2>Score: {score}/{totalQuestions}</h2>
      <p>Question {currentQuestion} of {totalQuestions}</p>
    </div>
  );
}

export default ScoreBoard;