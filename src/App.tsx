import { NavLink, Route, Routes } from 'react-router-dom';
import GaragePage from './features/garage/GaragePage';
import WinnersPage from './features/winners/WinnersPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <nav className="app__nav" aria-label="Main navigation">
          <NavLink to="/" className="app__link" end>
            Garage
          </NavLink>
          <NavLink to="/winners" className="app__link">
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