import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShackPage from './pages/ShackPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShackPage />} />
      </Routes>
    </Router>
  );
};

export default App;
