import { useState, useRef, useEffect } from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const { width, height } = useWindowSize();
  const newGameSection = useRef(null);

  const allHeld = dice.every((die) => die.isHeld);
  const firstValue = dice[0].value;
  const allSameValue = dice.every((die) => die.value === firstValue);

  const gameWon = allHeld && allSameValue;

  useEffect(() => {
    if (gameWon && newGameSection.current) {
      newGameSection.current.focus();
    }
  }, [gameWon]);

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  const diceElement = dice.map((die) => {
    return (
      <Die
        key={die.id}
        id={die.id}
        value={die.value}
        isHeld={die.isHeld}
        hold={() => hold(die.id)}
      />
    );
  });

  function rollDice() {
    if (gameWon) {
      setDice(generateAllNewDice());
    } else {
      setDice((preDice) =>
        preDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) },
        ),
      );
    }
  }
  function hold(id) {
    setDice((prevHold) => {
      return prevHold.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      });
    });
  }

  return (
    <main>
      {gameWon && <Confetti width={width} height={height} />}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
      </div>
      <div className="inner-box">
        <div className="content">
          <h1 className="title">Tenzies</h1>
          <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
          <div className="die-wrapper">
            <div className="die-container">{diceElement}</div>
            <button
              className="roll-dice-button"
              ref={newGameSection}
              onClick={rollDice}
            >
              {gameWon ? 'New Game' : 'Roll'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
