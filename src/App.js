import React from 'react';
import { BrowserRouter as Router, Route ,Routes } from 'react-router-dom';
import Daugia from './page/Daugia1';
import Index from './page/Index1';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/daugia" element={<Daugia />} />
        <Route path="/" element={<Index />} />
        {/* Các Route khác nếu cần */}
      </Routes>
    </Router>
  );
}


export default App;
