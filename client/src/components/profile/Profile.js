import React from 'react'
import { Button, Container, StylesProvider } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import './Profile.css'
import locked from '../images/locked.png'
function Profile() {
  return (
    <StylesProvider injectFirst>
      <div id="container-main">
        <Container className="profile-container">
          <img
            src="https://avatars.githubusercontent.com/u/38871879?v=4"
            alt="profile"
            className="profile-img"
          />
          <h2>MemeDao(Private)</h2> <br />
          <h3>Followers 444</h3>
          <br />
          <Button
            startIcon={<AddCircleIcon />}
            variant="contained"
            className="follow-btn"
          >
            Follow
          </Button>
          <br />
          <br />
          <Button
            variant="contained"
            className="mint-btn"
            startIcon={<MonetizationOnIcon />}
          >
            Mint FollowNFT 0.2eth
          </Button>
          <br />
          <br />
          <Button variant="contained" className="followers-only-btn">
            Only followers can see and comment on MEMEDAO(PRIVATE)'s
            publications
          </Button>
          <img src={locked} alt="locked" className="locked-img" />
          <img src={locked} alt="locked" className="locked-img" />
          <img src={locked} alt="locked" className="locked-img" />
        </Container>
      </div>
    </StylesProvider>
  )
}

export default Profile
