import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Nav.js";
import MainPage from "./MainPage.js";
import DotCom from "./DotCom.js";
import RouteDisplay from "./RouteDisplay.js";
import Foot from "./Foot.js";
import React from 'react';

function App() {
  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, '');

  return (
    <div className="bg">

        <Nav />
        <div className="borderd">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/dotcom" element={<DotCom />} />
            <Route path="/route-display" element={<RouteDisplay />} />
          </Routes>
        </div>
        <Foot/>
    </div>
  );
}

export default App;
