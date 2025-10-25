function Question({ question, selectedAnswer, onAnswerSelect }) {
  return (
    <div className="general"> 
        <div className="question">
            <h2>Question {question.id}:</h2>
            <hr />
            <p>{question.question}</p>
        </div>

        <div className="question-option">
            {question.options.map((option, index) => (
            <div className="option" key={index}>
                <input 
                type="radio" 
                id={`option-${index}`}
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => onAnswerSelect(option)}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
            </div>
            ))}
        </div>
    </div>
  );
}

export default Question;