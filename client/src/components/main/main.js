import React, { useState, useEffect } from 'react'
import './main.css'
import Tweet from '../tweet/tweet'
import PostTweet from '../post-tweet/PostTweet'
import { SkynetClient, genKeyPairFromSeed } from 'skynet-js'
import dummy from '../images/dummy.png'

const portal = 'https://siasky.net/'
const client = new SkynetClient(portal)
const SEEDPHASE = 'seedphase'
const { privateKey, publicKey } = genKeyPairFromSeed(SEEDPHASE)
const dataKey = 'datakey'

const Main = () => {
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

  return (
    <div id="container-main">
      <PostTweet
        image={image}
        setMessage={setMessage}
        setImage={setImage}
        createPost={createPost}
        onChangePicture={onChangePicture}
      />

      <div className="white-container">
        <div id="nav-header">
          <div id="box-nav" className="box-Tweets">
            <p id="nav">All Memes</p>
          </div>

          <div id="box-nav" className="box-replies">
            <p id="nav">My Memes</p>
          </div>

          <div id="box-nav" className="box-Media">
            <p id="nav">Comments</p>
          </div>

          <div id="box-nav" className="box-Likes">
            <p id="nav">Likes</p>
          </div>
        </div>

        <div id="line"></div>

        <Tweet posts={posts} />
        <img src={dummy} alt="dummy" style={{ width: '100%' }} />
      </div>
    </div>
  )
}

export default Main
