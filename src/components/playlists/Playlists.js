import React, { Component } from 'react'
import axios from 'axios';
import PlaylistRedirectButton from './PlaylistRedirectButton'
import { Accordion, Card, Container, Row, Col } from 'react-bootstrap'
import "./index.css"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../redux/action';
import { withRouter } from 'react-router-dom'

class Playlists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      loaded: false
    }
  }

  componentDidMount() {

    axios.get(`${process.env.REACT_APP_API_URL}users/active`)
      .then(response => {
        console.log(response.data)
        this.setState({
          users: response.data,
          loaded: true
        })
        console.log()
      })
      .catch(error =>
        console.log(error)
      )

  }

  async getMyPlaylist() {
    this.props.getPlaylist()
    this.props.storeTopic(this.props.user.spotify_id)
    this.props.history.push('/player')
  }

  pickPageRedirect = () => {
    this.props.history.push('/pick');
  }

  render() {
    let content = <p>loading</p>
    if (this.state.loaded) {
      let usersList = this.state.users.map(user => {
        if(user.spotify_id !== this.props.user.spotify_id){
        return <li><PlaylistRedirectButton topic_id={user.topic_id} display_name={user.display_name} playlist_master={user.playlist_master}/></li>
        }
      })
      content = usersList
    }


    return (
   
      <Container>
        <Row>
          <Col lg={{ span: 8, offset: 2 }}>
        <Accordion defaultActiveKey="0" >
          <Card className="accordionWhole">
            <Accordion.Toggle as={Card.Header} eventKey="1"className="cardForPersonal">
              {this.props.user.display_name}'s Playlist
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body className="accordionToggleYour" >
                <ul style={{ paddingInlineStart: '0' }}>
                  <li><button  className="your" onClick={() => this.getMyPlaylist()}  >Start Your Music!</button></li>
                  <li>
                    <button  className="your" onClick={() => this.pickPageRedirect()} > Pick A Playlist </button>
                  </li>
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card className="accordionWhole">
            <Accordion.Toggle as={Card.Header} eventKey="0" className="activeUser">
              Active Users
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body className="accordionToggleOthers" ><ul style={{ paddingInlineStart: '0' }}>{content}</ul></Card.Body>
            </Accordion.Collapse>
          </Card>
          </Accordion>
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
    token_init: state.tokenReducer.token_init,
    playlist: state.playlistReducer,
    topic_id: state.topicReducer.topic_id,
  }
}

const mapDispatchToProps = dispatch => {
  return (
    bindActionCreators(Actions, dispatch)
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Playlists));