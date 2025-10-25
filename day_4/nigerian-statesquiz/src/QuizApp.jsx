import { useState } from 'react';
import Question from './Question';
import ScoreBoard from './ScoreBoard';
import AnswerFeedback from './AnswerFeedback';

function QuizApp() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What is the capital of Nigeria?",
      options: ["Lagos", "Abuja", "Port Harcourt", "Kano"],
      correctAnswer: "Abuja"
    },
    {
      id: 2,
      question: "Which state is known as the 'Centre of Excellence'?",
      options: ["Lagos", "Ogun", "Rivers", "Delta"],
      correctAnswer: "Lagos"
    },
    {
      id: 3,
      question: "What is the capital of Lagos State?",
      options: ["Lagos Island", "Ikeja", "Victoria Island", "Lekki"],
      correctAnswer: "Ikeja"
    },
    {
      id: 4,
      question: "Which state is known for its oil and gas production?",
      options: ["Kano", "Rivers", "Oyo", "Enugu"],
      correctAnswer: "Rivers"
    },
    {
      id: 5,
      question: "What is the capital of Kano State?",
      options: ["Kano City", "Dala", "Fagge", "Kano"],
      correctAnswer: "Kano"
    }
  ];

  function handleAnswerSelect(answer) {
    setSelectedAnswer(answer);
  }

  function handleSubmit() {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowFeedback(true);
  }

  function handleNext() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
    }
  }

  function handleRestart() {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setQuizFinished(false);
  }

  if (quizFinished) {
    return (
      <div>
        <h1>Nigerian States Quiz</h1>
        <h2>Quiz Completed!</h2>
        <p>Your final score: {score} out of {questions.length}</p>
        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Nigerian States Quiz</h1>
      <ScoreBoard 
        score={score} 
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
      <Question 
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
      />
      {!showFeedback ? (
        <button 
          onClick={handleSubmit} 
          disabled={!selectedAnswer}
        >
          Submit Answer
        </button>
      ) : (
        <>
          <AnswerFeedback 
            isCorrect={selectedAnswer === currentQuestion.correctAnswer}
            correctAnswer={currentQuestion.correctAnswer}
          />
            <button  onClick={handleNext}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
        </>
      )}
    </div>
  );
}

export default QuizApp;