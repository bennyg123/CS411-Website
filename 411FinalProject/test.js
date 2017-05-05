import React, { PropTypes, Component } from 'react';
import {connect} from 'react-redux';
import * as peopleActions from './actions/people-actions';
import Homepage from './components/Homepage';
import {bindActionCreators} from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
injectTapEventPlugin();

import Mappage from './components/Mappage';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  PrivateRouter,
  Link
} from 'react-router-dom'

const home = () => (
      <MuiThemeProvider>
          <Homepage loggedIn={peopleActions.loggedIN}/>
      </MuiThemeProvider>
    );
const login = () => (
      <MuiThemeProvider>
        <Mappage 
          loggedOut={peopleActions.loggedIN} 
        />
      </MuiThemeProvider>
  );

class App extends Component {
  render() {
    console.log(this.props);
    if (this.props.people.logged == true) {
      console.log("loggedin");
      <Redirect to={"/searchtweets"}/>
    }

    return (
      <Router>
        <div>
          <Route exact path="/" component={home} />
          <Route path="/searchtweets" component={login}/>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(peopleActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);