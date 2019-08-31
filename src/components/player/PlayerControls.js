import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../redux/action';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class PlayerControls extends Component {
  constructor(props){
    super(props);
    this.state={};
  }
 
  
  onPrevClick() {
    if(!this.props.player){
      this.props.checkForPlayer()
    } 
    else {

      this.props.player.previousTrack();
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/following/contains',
        headers: {
          Authorization: `${this.props.token}`
        }
      })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  onPlayClick() {
    this.props.player.togglePlay();
  }

  onNextClick() {
    this.props.player.nextTrack();
  }
  render() {
    const play = <FontAwesomeIcon icon={faPlay} />
    const pause = <FontAwesomeIcon icon={faPause} />
    const next = <FontAwesomeIcon icon={faForward} />
    const previous = <FontAwesomeIcon icon={faBackward} />

    if(this.props.spotifyInit){
    return (
      <div>
        <button onClick={() => this.onPrevClick()}>{previous}</button>
              <button onClick={() => this.onPlayClick()}>{this.props.playing ? pause : play}</button>
              <button onClick={() => this.onNextClick()} >{next}</button>
              <button onClick={() => this.props.joinButton()}>Join</button>

      </div>
    )}
    else {
      return(
        <p>Loading</p>
      )
    }
  }
}


const mapStateToProps = (state, props) => {
  return {
    ...state,
    user: state.userReducer,
    token: state.tokenReducer.token,
    playlist: state.playlistReducer,
  }
}

const mapDispatchToProps = dispatch => {
  return (
    bindActionCreators(Actions, dispatch)
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(PlayerControls);