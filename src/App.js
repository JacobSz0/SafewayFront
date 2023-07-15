import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Nav.js";
import MainPage from "./MainPage.js";
import DotCom from "./DotCom.js";
import NewDotCom from "./NewDotCom.js"
import Driver from "./Driver.js";
import QR from "./QR.js"
import JustAddresses from "./JustAddresses.js"
import Foot from "./Foot.js";
import React, { useState } from 'react';


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
            <Route path="/qr" element={<QR />}/>
            <Route path="/newdotcom" element={<NewDotCom />}/>
            <Route path="/just-addresses" element={<JustAddresses />}/>
          </Routes>
        </div>
        <Foot/>
    </div>
  );
}

export default App;
