import React from "react";
import questionsJson from "./questions.json";

const Card = (props) => {
    const newCard = props.questions[props.card]
    return (
        <div className = {`Card ${newCard.difficulty}`} onClick={props.onClick}>
            <h4>Difficulty: {newCard.difficulty}</h4>
            <img src={newCard.image} />
            <p> {props.isFlipped
        ? newCard.back
        : newCard.front}
            </p>
        </div>
    )
}
export default Card;