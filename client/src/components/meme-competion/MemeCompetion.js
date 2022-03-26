import React, { useState, useEffect } from 'react'
import PostTweet from '../post-tweet/PostTweet'
import { FiShare } from 'react-icons/fi'
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { FaRegComment } from 'react-icons/fa'
import {
  CardContent,
  Grid,
  Card,
  Container,
  CardHeader,
  Avatar,
  Typography,
  StylesProvider,
} from '@material-ui/core'

import CircularStatic from '../commons/CircularProgressWithLabel'
import locked from '../images/locked.png'
import './MemeCompetion.css'
import { SkynetClient, genKeyPairFromSeed } from 'skynet-js'
const portal = 'https://siasky.net/'
const client = new SkynetClient(portal)
const SEEDPHASE = 'seedphase'
const { privateKey, publicKey } = genKeyPairFromSeed(SEEDPHASE)
const dataKey = 'datakey'

const MemeCompetion = ({ post = { like: '12' } }) => {
  const [like, setLike] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [image, setImage] = useState('')
  const [posts, setPosts] = useState('')
  const [imgData, setImgData] = useState('')
  const [follow, setFollow] = useState(true)

  const followHandler = () => {
    if (follow === true) {
      setFollow(false)
    } else if (follow === false) {
      setFollow(true)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  // console.log(' imgData',imgData )
  const onChangePicture = async (e) => {
    if (e.target.files[0]) {
      console.log('picture: ', e.target.files)
      setImage(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImgData(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const createPost = async () => {
    console.log('eee', imgData, message)
    // const { skylink } = await client.uploadFile(imgData)
    const dataImage = await client.uploadFile(image)
    const imgLink = dataImage.skylink

    console.log('🚀 ~ file: main.js ~ line 53 ~ createPost ~ imgLink', imgLink)
    console.log('🚀 data', dataImage.skylink)

    // skylinks start with `sia://` and don't specify a portal URL
    // generate URLs for our current portal though.
    const skylinkUrl = await client.getSkylinkUrl(imgLink)

    const obj = {
      image: skylinkUrl,
      description: message,
    }
    let { data } = await client.db.getJSON(publicKey, dataKey)

    if (data?.length) {
      data.unshift(obj)
    } else {
      data = [obj]
    }
    // add data to skynet
    const result = await client.db.setJSON(privateKey, dataKey, data)
    window.location.reload()
    // call here
    // console.log('🚀🚀🚀  result', result)
    // if(result) {

    // }
  }

  const fetchData = async () => {
    let { data } = await client.db.getJSON(publicKey, dataKey)
    setPosts(data)
  }
  const postsArr = [
    {
      avatar: 'https://avatars.githubusercontent.com/u/10853211?v=4',
      text: 'Here is my meme, the lord of Memes!!',
      img:
        'https://images.unsplash.com/photo-1523406909961-95040afc761a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    },
    {
      avatar: 'https://avatars.githubusercontent.com/u/10853211?v=4',
      text: 'Here is my meme, the lord of Memes!!',
      img:
        'https://images.unsplash.com/photo-1523406909961-95040afc761a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    },
    {
      avatar: 'https://avatars.githubusercontent.com/u/10853211?v=4',
      text: 'Here is my meme, the lord of Memes!!',
      img:
        'https://images.unsplash.com/photo-1523406909961-95040afc761a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    },
    {
      avatar: 'https://avatars.githubusercontent.com/u/10853211?v=4',
      text: 'Here is my meme, the lord of Memes!!',
      img:
        'https://images.unsplash.com/photo-1523406909961-95040afc761a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    },
  ]

  return (
    <div id="container-main">
      <div className="each-card">
        <Card className="card">
          <CardHeader
            avatar={
              <Avatar
                alt="profile"
                src="https://avatars.githubusercontent.com/u/10853211?v=4"
                className="small"
              />
            }
            title="MemeDao (private)"
            subheader="March 25, 2022"
          />

          <CardContent className="card-content">
            <Typography variant="body2">
              MEME COMPETITION This impressive paella is a perfect party dish
              and a fun meal to cook together with your guests. Add 1 cup of
              frozen peas along with the mussels, if you like.
            </Typography>
          </CardContent>
          {/* BOTTTOM */}
          <div id="nav-bottom-post">
            <div id="box-comment-number">
              <span className="comment" id="nav-icon-box">
                <FaRegComment />
              </span>
              <p id="comment-tweet"> {0} </p>
            </div>
            <span className="retweet" id="nav-icon-box">
              <AiOutlineRetweet />
            </span>
            <div id="box-like-number">
              <span
                // onClick={likeHandler}
                className="like"
                id="nav-icon-box"
              >
                {like === true ? (
                  <AiFillHeart id="red-heart" />
                ) : (
                  <AiOutlineHeart />
                )}
              </span>
              <span id="like-number">
                {like === true ? parseInt(post.likeNumber) + 1 : 0}
              </span>
            </div>
            <span className="share" id="nav-icon-box">
              <FiShare />
            </span>
            {/* <span className="analytic" id="nav-icon-box">
                          <SiGoogleanalytics />
                        </span> */}
          </div>
        </Card>
      </div>

      <div className="comments-meme">
        {/* post Form */}
        <PostTweet
          image={image}
          setMessage={setMessage}
          setImage={setImage}
          createPost={createPost}
          onChangePicture={onChangePicture}
        />
        <Container>
          {loading ? (
            <CircularStatic />
          ) : (
            <div>
              <Grid container>
                {postsArr && postsArr?.length ? (
                  postsArr.map((post, index) => (
                    <div className="each-card-meme" key={index}>
                      <Card className="card" key={index}>
                        <CardHeader
                          avatar={
                            <Avatar
                              alt="profile"
                              src="https://avatars.githubusercontent.com/u/10853211?v=4"
                              className="small"
                            />
                          }
                          title="MemeDao (public)"
                          subheader="March 25, 2022"
                        />

                        <CardContent className="card-content">
                          <Typography variant="body2">
                            This impressive paella is a perfect party dish and a
                            fun meal to cook together with your guests. Add 1
                            cup of frozen peas along with the mussels, if you
                            like.
                            {post.description}
                          </Typography>
                          <br />
                          {post.img ? (
                            <img
                              src={post.img}
                              alt="tweets"
                              style={{ width: '50%' }}
                            />
                          ) : (
                            ' '
                          )}
                        </CardContent>

                        {/* BOTTTOM */}
                        <div id="nav-bottom-post">
                          <div id="box-comment-number">
                            <span className="comment" id="nav-icon-box">
                              <FaRegComment />
                            </span>
                            <p id="comment-tweet"> {0} </p>
                          </div>
                          <span className="retweet" id="nav-icon-box">
                            <AiOutlineRetweet />
                          </span>
                          <div id="box-like-number">
                            <span
                              // onClick={likeHandler}
                              className="like"
                              id="nav-icon-box"
                            >
                              {like === true ? (
                                <AiFillHeart id="red-heart" />
                              ) : (
                                <AiOutlineHeart />
                              )}
                            </span>
                            <span id="like-number">
                              {like === true
                                ? parseInt(post.likeNumber) + 1
                                : 0}
                            </span>
                          </div>
                          <span className="share" id="nav-icon-box">
                            <FiShare />
                          </span>
                        </div>
                      </Card>
                    </div>
                  ))
                ) : (
                  <h2>No Comments Yet...</h2>
                )}
              </Grid>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

export default MemeCompetion
