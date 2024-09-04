import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import UgExamCreation from "./UGAdminDashboard/UgExamCreation";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/UgExamCreation" element={<UgExamCreation />} />
          {/* You can add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
