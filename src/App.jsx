import { useState } from 'react'
import './App.css'
import Card from './components/Card'
import questionsJson from "./components/questions.json";

function App() {
  const [count, setCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [questions, setQuestions] = useState(questionsJson.questions);
  const [masteredQuestions, setMasteredQuestions] = useState ([])
  const [showMastered, setShowMastered] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const changeCard = () => {
    let newCount = (count + 1) % questions.length
    if (!showMastered) {
      while (questions[newCount].isMastered) {
        newCount = (newCount + 1) % questions.length
      } 
    }
    setCount (newCount);
    setIsFlipped(false);
    setAnswer("");
    setCorrect("");
  };
  const changeCardBackward = () => {
    let newCount = count - 1
    if (newCount < 0) {
      newCount = questions.length -1
    }
    if (!showMastered) {
      while (questions[newCount].isMastered) {
        newCount = newCount -1
        if (newCount < 0) {
          newCount = questions.length -1
        }
      } 
    }
    setCount (newCount)
    setIsFlipped(false);
    setAnswer("");
    setCorrect("");
  };
  const turnCard = () => {
    setIsFlipped(!isFlipped);
  };
  const markMastered = () => {
    const currentCard = questions[count];
    const updatedQuestions = questions.map((card, i) =>
      i === count ? { ...card, isMastered: !card.isMastered } : card
    );
    const updatedMastered = updatedQuestions.filter((card) => card.isMastered);
    setMasteredQuestions (updatedMastered);
    setQuestions(updatedQuestions);
    if (!showMastered && !currentCard.isMastered){
      if (updatedMastered.length === questions.length) {
      console.log("all mastered")
      setShowModal(true);
    } else {
      changeCard();
    }
    }
    };
  const handleCheckbox = (e) => {
    const isChecked = e.target.checked;
    setShowMastered(isChecked);
    if (!isChecked) {
      if (masteredQuestions.length === questions.length) {
      setShowModal(true);
    } else
      if (questions[count].isMastered)
      {changeCard();
      }
  }
  };
  const handleShowMastered = () => {
    console.log("close modal")
    setShowMastered(true);
    setShowModal(false);
  };

  const [answer, setAnswer] = useState ("");
  const [correct, setCorrect] = useState("");
  const [currentStreak, setCurrentStreak] = useState (0);
  const [longestStreak, setLongestStreak] = useState (0)
  const checkAnswer = (e) => {
    e.preventDefault();
    const userAnswer = answer.trim().toLowerCase()
    const correctAnswer = questions[count].back.trim().toLowerCase()
    if (correctAnswer.includes(userAnswer) && userAnswer != "") {
      setAnswer (questions[count].back)
      if (correct!=true) {
      if (currentStreak == longestStreak) {
        setLongestStreak (currentStreak + 1)
      }
      setCurrentStreak (prevCurrentStreak => prevCurrentStreak + 1)
    }
      setCorrect (true)
    }
    else {
      setCorrect (false)
      setCurrentStreak (0)
    }
  };
  const shuffleCards = () => {
    const shuffledQuestions = [...questions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[randomIndex]] = [shuffledQuestions[randomIndex], shuffledQuestions[i]];
    }
    let newCount = count
    if (!showMastered) {
      if (masteredQuestions.length === questions.length){
        setShowModal(true);
      }
      else {
        while (shuffledQuestions[newCount].isMastered){
          newCount = newCount+1
          if (newCount > (questions.length-1)) {
            newCount = 0
          }
        }
      }
    }
    setCount(newCount)
    setQuestions(shuffledQuestions);
  };
  const resetQuiz = () => {
    setQuestions (questionsJson.questions);
    setCount (0);
    setIsFlipped(false);
    setCurrentStreak(0);
    setLongestStreak(0);
    setMasteredQuestions([]);
    setShowModal(false);
  };
  return (
    <div className="App">
      <h1>Geography Quiz</h1>
      <h2>How well do you know geography? Test your knowledge with these 12 questions!</h2>
      <h4>Instructions: You can click on the card to flip it and see the answer. You can also choose whether questions marked as mastered would be removed from the card pack and not displayed. If you reset the quiz, all your progress is deleted. Good luck!</h4>
      <h3>Questions total: {questions.length} Questions mastered: {masteredQuestions.length} Questions left: {questions.length - count} </h3>
      <h3>Current streak: {currentStreak} Longest streak: {longestStreak} </h3>
      {!showModal && (
      <>
      <div className = "Quiz">
        <button onClick = {changeCardBackward}>⭠</button>
        <Card onClick = {turnCard} card={count} isFlipped={isFlipped} questions={questions}/>
        <button onClick = {changeCard}> ⭢ </button>
      </div>
      <form className="Input">
          <input type = 'text' value = {answer} onChange = {(e)=>setAnswer(e.target.value)} className={correct ? "Correct" : (correct === false ? "Wrong" : "")}/>
        <label>
        <input 
          type="checkbox" 
          checked={showMastered} 
          onChange={handleCheckbox} 
        />
        Show mastered cards
      </label>
      </form>
      </>)
      }
      {showModal && (
        <div className="modal">
          <h2>All cards have been mastered!</h2>
          <p>Do you want to reset the quiz or show mastered cards?</p>
          <button onClick={resetQuiz}>Reset Quiz</button>
          <button onClick={handleShowMastered}>Show your Mastered Cards</button>
        </div>
      )}
      {!showModal && (
      <>
      <div className = "Buttons">
        <button onClick={checkAnswer}> {correct === false ? "Check again" : "Submit answer"} </button>
        <button onClick = {markMastered}> {questions[count].isMastered ? "Remove from mastered": "Mastered"} </button>
      </div>
      <div className = "SecondButtons">
        <button onClick = {shuffleCards}>Shuffle cards</button>
        <button onClick = {resetQuiz}>Reset Quiz</button>
      </div>
      </>)
    }
    </div>
  )
}

export default App
