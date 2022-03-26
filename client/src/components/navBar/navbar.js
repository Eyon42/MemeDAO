import './navbar.css';
import { Link } from 'react-router-dom';
import { BiHomeCircle, BiMessageSquareDetail, BiBookmark, BiUserVoice } from 'react-icons/bi';
import { Button } from '@material-ui/core';
import { IoNotificationsOutline } from 'react-icons/io5';
import { RiContactsFill } from 'react-icons/ri';
import { CgMoreO } from 'react-icons/cg';
import logo from '../images/logo.png';

const NavBar = () => {
  return (
    <div id="container-nav">
      <div id="nav-up">
        <img src={logo} alt="Dao logo" className="logo" />

        <button id="row">
          <BiHomeCircle id="home-icon" />
          <Button component={Link} to="/" id="nav-title">
            Home
          </Button>
        </button>

        <button id="row">
          <IoNotificationsOutline id="home-icon" />
          <Button component={Link} to="/follow-nfts" id="nav-title">
            FollowNFTs
          </Button>
          <p id="nav-title"></p>
        </button>

        <button id="row">
          <BiUserVoice id="home-icon" />
          <Button component={Link} to="/competion" id="nav-title">
            Competion
          </Button>
        </button>

        <button id="row">
          <BiMessageSquareDetail id="home-icon" />
          <Button component={Link} to="/collections" id="nav-title">
            Collections
          </Button>
        </button>

        <button id="row">
          <RiContactsFill id="home-icon" />
          <Button component={Link} to="/follow-nfts" id="nav-title">
            My Profiles
          </Button>
        </button>

        <button id="row">
          <BiBookmark id="home-icon" />
          <p id="nav-title">Mirrors</p>
        </button>
        <button id="row">
          <CgMoreO id="home-icon" />
          <p id="nav-title">More</p>
        </button>
      </div>

      <div id="bottom-nav">
        <span id="user-box">
          <img
            src="https://avatars.githubusercontent.com/u/10853211?v=4"
            alt="img-profile"
            id="person"
          />
          <span>
            <p id="name">Electrone Smith</p>
            <p id="id">@Electrone</p>
          </span>
        </span>
      </div>
    </div>
  );
};

export default NavBar;
