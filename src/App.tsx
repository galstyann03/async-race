import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';

function GaragePage() {
  return (
    <main className="page">
      <h1>Garage</h1>
      <p className="page__hint">Garage controls will be added next.</p>
    </main>
  );
}

function WinnersPage() {
  return (
    <main className="page">
      <h1>Winners</h1>
      <p className="page__hint">Winners table will be added after race logic.</p>
    </main>
  );
}

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <nav className="app__nav" aria-label="Main navigation">
          <NavLink to="/" className="app__link">
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
