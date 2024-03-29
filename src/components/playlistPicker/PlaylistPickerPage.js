import React, { Component } from 'react'
import UserPlaylist from './UserPlaylist';
import axios from 'axios'
import { bindActionCreators } from 'redux';
import * as Actions from '../../redux/action';
import { connect } from 'react-redux';
import CustomPlaylist from './CustomPlaylist';
import { ListGroup, Container, Col, Row, Card } from 'react-bootstrap';

class PlaylistPickerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPlaylists: null
    }
  }

  componentDidMount() {
    axios.get(`https://api.spotify.com/v1/users/${this.props.user.spotify_id}/playlists`, { headers: { Authorization: `${this.props.token}` } })
      .then(userPlaylists => {
        let mappedPlaylists = userPlaylists.data.items.map(item => { return { id: item.id, name: item.name } })
        //console.log(userPlaylists.data.items)
        console.log(mappedPlaylists)
        this.setState({ userPlaylists: mappedPlaylists })
      })
  }

  render() {
    let renderUserPlaylists;
    console.log(this.state.userPlaylists);
    (this.state.userPlaylists !== null ? renderUserPlaylists = this.state.userPlaylists.map(playlist => {
      return <UserPlaylist
        spotify_id={this.props.user.spotify_id}
        name={playlist.name}
        id={playlist.id}
      />
    }) : renderUserPlaylists = <p> No Playlist Loaded </p>)
    return (
      <Container>
        <Row>
          <Col md={{ offset: 2, span: 8 }} >
            <Card className='titlePickCard' >CHOOSE YOUR TUNES</Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col style={{ marginTop: '1.5em' }} lg={{ span: 5, offset: 0 }}>
            <Card className='pickACard'>Your Spotify Playlists</Card>
            <ListGroup>
              {renderUserPlaylists}
            </ListGroup>
          </Col>
          <Col style={{ marginTop: '1.5em' }} lg={{ span: 5, offset: 0 }}>
            <Card className='pickACard'>Upload A Playlist</Card>
            <CustomPlaylist spotify_id={this.props.user.spotify_id} />
            <Card className='infoCard'>
              <Card.Text>
                <ul style={{ paddingInlineStart: '1.5em', color:'#1C5253'}} className='ulBullets'><b >If you'd like to listen to a Spotify playlist other than your own:</b>
                  <li className="listItemFont"> Go to the desired Spotify playlist's page </li>
                  <li className="listItemFont"> Click on the ellipsis ... </li>
                  <li className="listItemFont"> Copy Playlist Link</li>
                  <li className="listItemFont"> Paste into the field above </li>
                </ul>
              </Card.Text>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPickerPage);