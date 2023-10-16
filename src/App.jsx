import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Amplify } from "aws-amplify";

import awsconfig from "./aws-exports";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import StoreViewPage from "./pages/StorePages/StoreView";
import InfoPage from "./pages/InfoPage";


Amplify.configure(awsconfig);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/view" element={<StoreViewPage />} />
          <Route path="/info" element={<InfoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
