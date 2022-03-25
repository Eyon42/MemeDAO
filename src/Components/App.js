import React from 'react';
import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { profileHolder, provider } from '../wallet';
import AppContainer from './app-container/AppContainer';
import FollowingDao from './following-dao/FollowingDao';
import LeftSidebar from './left-sidebar/LeftSidebar';

function App() {
  const [profileId, setProfileId] = useState('');
  const [signer, setSigner] = useState('');
  console.log(' profileId ', profileId);
  console.log(' signer ', signer);

  useEffect(async () => {
    const pid1 = await profileHolder;
    console.log(' pid =>  ', pid1);
    const pid = await profileHolder.profileId();
    // const pid = (await profileHolder.profileId()).toNumber();
    const s = await provider.getSigner();
    console.log(' s ', s);
    setSigner(s);
    setProfileId(pid);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Hello World! Yay</h1>
              Profile id: {profileId}
            </div>
          }
        ></Route>
        <Route exact path="/publication" element={<AppContainer />}></Route>
        <Route exact path="/test" element={<LeftSidebar test="testing" />} />
        <Route path="*" element={<FollowingDao />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
