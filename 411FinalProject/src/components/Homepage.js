import React, { Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { Grid, Row, Col } from 'react-bootstrap';
import AlertContainer from 'react-alert';
import {greenA700, grey800} from 'material-ui/styles/colors';

import {browserHistory} from 'react-router-dom'
import * as peopleActions from '../actions/people-actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
/*
username: person.uname,
    venues: person.venues,
    status: person.logged
*/

class Homepage extends Component {
    state = {
        loginmodel: false,
        signupmodel: false
    }

    handleLoginOpen = () => {
        this.setState({loginmodel: true});
    }

    handleSignupOpen = () => {
        this.setState({signupmodel: true});
    }

    handleLoginClose = () => {
        //console.log("Logged IN");

        var self = this;

        axios.post('/loginUser', {
                username: this.refs.lname.getValue(), 
                password: this.refs.lpass.getValue() 
        }).then(function (response){
                //console.log(response);
                if (response.data.value) {
                    peopleActions.loggedIN({
                        uname: self.refs.lname.getValue(),
                        venues: "Venues",
                        logged: true
                    });
                    self.props.history.push("/search")
                }else {
                    msg.error('Error loggin in, password or email is incorrect');
                }
        }).catch(function (error) {
                console.log(error);
                msg.error('Error logging in, password or email is incorrect');
        });

        this.setState({loginmodel: false});
    }

    handleLoginCancel = () => {
        this.setState({loginmodel: false});
    }

    handleSignupClose = () => {
        if (this.refs.spass1.getValue() == this.refs.spass2.getValue()) {
            axios.post('/createUser', {
                username: this.refs.sname.getValue(), 
                password: this.refs.spass1.getValue(), 
                email: this.refs.semail.getValue() 
            }).then(function (response){
                //console.log(response);
                peopleActions.loggedIN({
                        uname: response.data,
                        venues: "Venues",
                        logged: true
                });
            }).catch(function (error) {
                console.log(error);
                msg.error('Error creating account');
            });
            this.setState({signupmodel: false});
        }else {
            msg.error('Password do not match');
        }
    }

    handleSignupCancel = () => {
        this.setState({signupmodel: false});
    }

    render() {
        //console.log(this.props);
        const logactions = [
            <RaisedButton
                label="Cancel"
                onTouchTap={this.handleLoginCancel}
            />,
            <RaisedButton
                label="Log In"
                onTouchTap={this.handleLoginClose}
            />,
        ];

        const signactions = [
            <RaisedButton
                label="Cancel"
                onTouchTap={this.handleSignupCancel}
            />,
            <RaisedButton
                label="Sign In"
                onTouchTap={this.handleSignupClose}
            />,
        ];

        const styles = {
            green : {
                color: greenA700
            },
            grey : {
                color: grey800
            }
        }

        return (
            <div>
                <Grid style={{marginTop: "35vh"}}>
                    <Row className="show-grid">
                        <Col xs={12}>
                            <center>
                                <h1 style={{
                                    color: greenA700,
                                    fontSize: "80px"
                                    }}>CrowdSurf</h1>
                            </center>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={12}>
                            <hr style={{borderColor: greenA700}}/>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xsOffset={2} xs={3}>
                            <RaisedButton 
                                labelColor={greenA700}
                                backgroundColor={grey800}
                                label="Log In" 
                                fullWidth={true} 
                                onTouchTap={this.handleLoginOpen} />
                        </Col>
                        <Col xsOffset={2} xs={3}>
                            <RaisedButton 
                                labelColor={greenA700}
                                backgroundColor={grey800}
                                label="Sign Up" 
                                fullWidth={true} 
                                onTouchTap={this.handleSignupOpen}/>  
                        </Col>
                    </Row>
                </Grid>
                <Dialog
                    title="Please Login"
                    titleStyle={{color:greenA700}}
                    actions={logactions}
                    modal={true}
                    open={this.state.loginmodel}
                >
                    <TextField
                        hintText=""
                        errorText="This field is required"
                        fullWidth = {true}
                        ref="lname"
                        floatingLabelText="Please enter your Username"
                        floatingLabelFocusStyle={styles.green}
                        errorStyle={styles.green}
                    /><br />
                    <TextField
                        hintText=""
                        fullWidth = {true}
                        type="password"
                        errorText="This field is required"
                        ref="lpass"
                        floatingLabelText="Please enter your Password"
                        floatingLabelFocusStyle={styles.green}
                        errorStyle={styles.green}
                    /><br />
                </Dialog>
                <Dialog
                    title="Please Sign Up"
                    titleStyle={{color:greenA700}}
                    actions={signactions}
                    modal={true}
                    open={this.state.signupmodel}
                >
                    <TextField
                        hintText=""
                        fullWidth = {true}
                        errorText="This field is required"
                        ref="sname"
                        floatingLabelText="Please enter a Username"
                        floatingLabelFocusStyle={styles.green}
                        errorStyle={styles.green}
                    /><br />
                    <TextField
                        hintText=""
                        fullWidth = {true}
                        errorText="This field is required"
                        type="password"
                        ref="spass1"
                        floatingLabelText="Please enter a Password"
                        floatingLabelFocusStyle={styles.green}
                        errorStyle={styles.green}
                    /><br />
                    <TextField
                        hintText=""
                        fullWidth = {true}
                        type="password"
                        errorText="This field is required"
                        ref="spass2"
                        floatingLabelText="Please verify your Password"
                        floatingLabelFocusStyle={styles.green}
                        errorStyle={styles.green}
                    /><br />
                    <TextField
                        hintText=""
                        fullWidth = {true}
                        errorText="This field is required"
                        ref="semail"
                        floatingLabelText="Please enter your email"
                        floatingLabelFocusStyle={styles.green}
                        errorStyle={styles.green}
                    /><br />
                </Dialog>
                <AlertContainer ref={function(a) { global.msg = a}} {...{
                        offset: 14,
                        position: 'top right',
                        theme: 'dark',
                        time: 1000,
                        transition: 'scale'
                    }} />
            </div>
        );
    }
};

Homepage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);