import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../redux/action';
import axios from 'axios';
import ReroutingButton from '../header_footer/ReroutingButton';
import Player from './Player';



class PlayerPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Player />
        {/* <img src={`${this.props.user.profile_pic}`}/> */}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state,
    user: state.userReducer
  }
}

const mapDispatchToProps = dispatch => {
  return (
    bindActionCreators(Actions, dispatch)
  )
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayerPage));