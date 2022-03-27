import React, { useState, useEffect } from 'react'
import {
  StylesProvider,
  Container,
  TextField,
  IconButton,
  Button,
  Grid,
  Card,
} from '@material-ui/core'
import './PostTweet.css'
import { PhotoCamera } from '@material-ui/icons'
import ImageIcon from '@material-ui/icons/Image'
import ImageSearchIcon from '@material-ui/icons/ImageSearch'

function Post({ image, setMessage, setImage, createPost, onChangePicture }) {
  return (
    <StylesProvider injectFirst>
      <Container style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Card className="card-post">
          <Grid container>
            <Grid item xs={2} sm={2}>
              <img
                src="https://avatars.githubusercontent.com/u/10853211?v=4"
                alt="img-profile"
                id="person"
              />
            </Grid>
            <Grid item xs={10} sm={10}>
              <form className="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  id="outlined-basic"
                  className="input-form"
                  defaultValue=""
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  minRows={4}
                  required
                />
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="img-preview"
                    style={{ width: '100%' }}
                  />
                ) : (
                  ''
                )}
                <br />
                <label htmlFor="icon-button-phot">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                    <ImageIcon />
                    <ImageSearchIcon />
                  </IconButton>
                </label>
                <input
                  accept="image/*"
                  className="input"
                  id="icon"
                  defaultValue={image}
                  onChange={(e) => onChangePicture(e)}
                  // onChange={(e) => setImage(e.target.files[0]) }
                  type="file"
                />

                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  onClick={createPost}
                  className="post-btn"
                >
                  Post
                </Button>
              </form>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </StylesProvider>
  )
}

export default Post
