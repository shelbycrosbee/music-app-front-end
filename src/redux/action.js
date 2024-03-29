import { LOGIN, REGISTER, STORE_PLAYLIST, STORE_TOPIC, STORE_PLAYLIST_MS, AXIOS_CALL } from './actionType';
import axios from 'axios';

export function login(user, token, history) {
  console.log(user);
  return async function (dispatch, getState) {
    dispatch({
      type: LOGIN,
      payload: {
        spotify_id: user.id,
        display_name: user.display_name,
        profile_pic: (user.images[0] ? user.images[0].url : 'https://icon-library.net/images/generic-user-icon/generic-user-icon-3.jpg'),
        token,
        active: false,
        premium: (user.product === 'premium' ? 1 : 0),
      }
    })
  }
}

export function register() {
  return async function (dispatch, getState) {
    try {
      const currentState = getState();
      console.log(currentState)
      await axios.post(`${process.env.REACT_APP_API_URL}user`, {
        spotify_id: currentState.userReducer.spotify_id,
        active: currentState.userReducer.active,
        premium: currentState.userReducer.premium,
        display_name: currentState.userReducer.display_name
      })
      dispatch({
        type: REGISTER
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export function startListening(deviceId, spotify_id) {
  return function action(dispatch, getState) {
    const currentState = getState();
    dispatch({ type: AXIOS_CALL });

    const request = axios.get(`${process.env.REACT_APP_API_URL}playlist`, {
      params: { spotify_id }
    })
    request.then(
      data => {
        axios({
          method: 'put',
          url: "https://api.spotify.com/v1/me/player/play",
          data: {
            device_ids: [deviceId],
            play: true,
            context_uri: data.data.uri_link,
            offset: {
              position: 0
            },
            position_ms: 0
          },
          headers: {
            Authorization: currentState.tokenReducer.token
          }
        })
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
      },
      err => { }
    );
  }
}

export function storeTopic(topic_id) {
  return async function (dispatch, getState) {
    dispatch({
      type: STORE_TOPIC,
      payload: {
        topic_id
      }
    })
  }
}


export function getPlaylist() {
  return async function (dispatch, getState) {
    let state = getState();
    console.log(state)
    let playlist = await axios.get(`${process.env.REACT_APP_API_URL}playlist`, {
      params: {
        spotify_id: state.userReducer.spotify_id
      }
    })
    dispatch({
      type: STORE_PLAYLIST,
      payload: {
        playlist_uri: playlist.data.uri_link,
      }
    })
  }
}

export function storePlaylistMS(syncMS) {
  return async function (dispatch, getState) {
    dispatch({
      type: STORE_PLAYLIST_MS,
      payload: {
        syncMS
      }
    })
  }
}