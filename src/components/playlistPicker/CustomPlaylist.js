import React, { Component } from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import { bindActionCreators } from 'redux';
import * as Actions from '../../redux/action';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
  return {
    ...state,
    user: state.userReducer,
    token: state.tokenReducer.token,
    // token_init: state.tokenReducer.token_init,
    // playlist: state.playlistReducer
  }
}

const mapDispatchToProps = dispatch => {
  return (
    bindActionCreators(Actions, dispatch)
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(class CustomPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ''
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let modified_uri = this.state.id.replace('spotify:playlist:', '');
    await axios.put(`${process.env.REACT_APP_API_URL}users/updatePlaylist`, { spotify_id: this.props.spotify_id, playlist_uri: modified_uri });
    await this.props.getPlaylist();
    this.props.storeTopic(this.props.user.spotify_id)
    this.props.history.push('player');
  }

  handleEditChange = (e) => {
    this.setState({ id: e.target.value })
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text"
            value={this.state.id}
            placeholder='Enter the Spotify URI link for you playlist'
            name="id"
            onChange={e => this.handleEditChange(e)} />
          <button type="submit"> Submit! </button>
        </form>
      </div>
    )
  }
}))