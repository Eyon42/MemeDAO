import React, { useState, useEffect } from 'react';
import './App.css';
import Main from './components/main/main';
import NavBar from './components/navBar/navbar';
import Right from './components/right/right';
import Profile from './components/profile/Profile';
import MemeCompetion from './components/meme-competion/MemeCompetion';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core';
import { profileHolder, provider, lensHub, reactionsModule } from './wallet';

console.log('lensHub', lensHub);
console.log('reactionsModule', reactionsModule);
console.log('profileHolder', profileHolder);

const Home = () => {
  const [profileId, setProfileId] = useState('');
  const [signer, setSigner] = useState('');
  const [handle, setHandle] = useState('');
  console.log(' profileId ', profileId);
  console.log(' signer ', signer);
  console.log(' handle ***************** ', handle);

  useEffect(() => {
    connectWallet();
  }, []);

  const createComment = async () => {
    // comment((uint256,string,uint256,uint256,address,bytes,address,bytes))
    // getProfile(uint256 profileId)
  };

  const connectWallet = async () => {
    console.log('🚀 🚀 🚀 🚀 ');
    const pid1 = await profileHolder;
    console.log(' pid =>  ', pid1);
    const pid = (await profileHolder.profileId()).toNumber();
    const handle = await profileHolder.handle();
    const s = await provider.getSigner();
    console.log(' s ', s);

    const getProfile = await lensHub.getProfile(3);
    console.log('🚀 🚀🚀🚀 getProfile', getProfile);

    setSigner(s);
    setProfileId(pid);
    setHandle(handle);
  };

  return (
    <div id="container">
      <div id="nav-box">
        <NavBar />
      </div>
      <Main />
      <Right />
    </div>
  );
};

const ProfileComponent = () => {
  return (
    <div id="container">
      <div id="nav-box">
        <NavBar />
      </div>
      <Profile />
      <Right />
    </div>
  );
};

const MemeCompetionComponent = () => {
  return (
    <div id="container">
      <div id="nav-box">
        <NavBar />
      </div>
      <MemeCompetion />
      <Right />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/follow-nfts">
          <ProfileComponent />
        </Route>
        <Route exact path="/competion">
          <MemeCompetionComponent />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
