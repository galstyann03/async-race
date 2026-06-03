import { NavLink, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import GaragePage from './features/garage/GaragePage';
import WinnersPage from './features/winners/WinnersPage';
import './App.css';

function App() {
  const isRaceRunning = useAppSelector((state) => state.race.isRaceRunning);

  function blockIfRacing(event: React.MouseEvent<HTMLAnchorElement>) {
    if (isRaceRunning) event.preventDefault();
  }

  const linkClass = `app__link${isRaceRunning ? ' app__link--disabled' : ''}`;

  return (
    <div className="app">
      <header className="app__header">
        <nav className="app__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            className={linkClass}
            end
            aria-disabled={isRaceRunning}
            tabIndex={isRaceRunning ? -1 : 0}
            onClick={blockIfRacing}
          >
            Garage
          </NavLink>
          <NavLink
            to="/winners"
            className={linkClass}
            aria-disabled={isRaceRunning}
            tabIndex={isRaceRunning ? -1 : 0}
            onClick={blockIfRacing}
          >
            Winners
          </NavLink>
        </nav>

        <div className="app__brand">
          <span>Async</span>
          <span>Race</span>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<GaragePage />} />
        <Route path="/winners" element={<WinnersPage />} />
      </Routes>
    </div>
  );
}

export default App;