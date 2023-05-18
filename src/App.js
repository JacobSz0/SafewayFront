import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Nav.js";
import MainPage from "./MainPage.js";
import DotCom from "./DotCom.js";
import Driver from "./Driver.js";
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
            <Route path="/driver" element={<Driver />} />
          </Routes>
        </div>
        <Foot/>
    </div>
  );
}

export default App;
