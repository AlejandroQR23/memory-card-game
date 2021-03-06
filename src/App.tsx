import { useEffect, useState } from 'react';

import './App.css';

import { Cats, ICard } from './utilities/interfaces';
import { CardsGrid } from './components/cards-grid/cards-grid.component';
import { ScoreBoard } from './components/scoreboard/scoreboard.component';
import { LoadingSpinner } from './shared/loading-spinner/loading-spinner.component';
import { messages } from './utilities/messages';

function App() {
  // * The Cat API
  const apiUrl: string = `https://api.thecatapi.com/v1/images/search?size=small&limit=9&mime_types=jpg`;

  // * Hooks
  const [bestScore, setBestScore] = useState<number>(0);
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [touched, setTouched] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Couldnt find the url');
        setCards(initCards(await response.json()));
        setLoading(false);
        setMessage('TOUCH A CAT TO START. CAREFUL WITH THE BELLY!');
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, []);

  // * Game functions
  const initCards = (cards: Cats[]): ICard[] => {
    let minifiedCards: ICard[] = [];
    for (const card of cards) {
      const { id, url } = card;
      minifiedCards.push({ id, image: url });
    }

    return minifiedCards;
  };

  const handleCardClick = (id: string): void => {
    setCards(playRound(id));
  };

  const playRound = (id: string): ICard[] => {
    if (!touched.includes(id)) {
      setTouched((prevState) => [...prevState, id]);
      setScore((prevState) => prevState + 1);
      setMessage(messages[score]);
    } else {
      resetGame();
    }
    return [...cards].sort(() => Math.random() - 0.5);
  };

  const resetGame = () => {
    if (score > bestScore) {
      setBestScore(score);
    }
    setScore(0);
    setTouched([]);
    setMessage('GAME OVER');
  };

  return (
    <div className="App container">
      <ScoreBoard score={score} bestScore={bestScore} />
      <div className="text-muted my-3">{message}</div>
      {loading ? <LoadingSpinner /> : <CardsGrid cards={cards} handleCardClick={handleCardClick} />}
    </div>
  );
}

export default App;
