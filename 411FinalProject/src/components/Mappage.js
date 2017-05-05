import React, { Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import axios from 'axios';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Grid, Row, Col } from 'react-bootstrap';
import AutoComplete from 'material-ui/AutoComplete';
import {greenA700,grey900,greenA200,yellow600,red500,redA700} from 'material-ui/styles/colors';
import AlertContainer from 'react-alert';
import LinearProgress from 'material-ui/LinearProgress';

import {browserHistory} from 'react-router-dom'
import * as peopleActions from '../actions/people-actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const categorylist = [
    "venues,musicvenues",
    "comedyclubs",
    "bars",
    "stadiumsarenas",
    "social_clubs"
]

class Mappage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1, 
            list: [], 
            map:[], 
            catvalue:1, 
            category:"", 
            markerlist:[],
            initialpos:[42.361145,-71.057083],
            semanticscore:[],
            semanticComponent:[]};
    }

    clicked = () => {
        peopleActions.loggedIN({
            uname: "",
            venues: "Venues",
            logged: false
        });
        this.props.history.push("/")
    }

    handleUpdateInput = (searchtext) => {
        this.setState({value: require('../city').city.indexOf(searchtext)});
    }
    submit = () => {
        var self = this;

        //check city input
        if (this.state.value == -1) {
            msg.error('Please pick a state from the dropdown list');
            return;

        }
        
        axios.post("/twitterSearch",{
            twitterterm: this.refs.twittersearch.getValue(),
            capital: this.state.value
        }).then(function (response) {
            console.log(response);
            var list = [];
            var semanticlist = [];
            var sentiment = require('sentiment');
            response.data.map(
                
                function(item) { 
                    list.push(
                        <a href={"https://twitter.com/statuses/" + item.id_str} target="_blank">
                            <ListItem
                            innerDivStyle={{color: grey900}}
                            leftAvatar={<Avatar src={item.user.profile_image_url}/>}
                            primaryText={item.user.screen_name}
                            secondaryText={<span style={{color:grey900}}>{item.text}</span>}
                            secondaryTextLines={2}/>
                        </a>);
                    if (sentiment(item.text)['score'] >= 0) {
                        semanticlist.push(sentiment(item.text)['score']+1);
                    }else {
                        semanticlist.push(sentiment(item.text)['score'])
                    }
                }
            )
            //console.log(semanticlist)
            console.log("twitter end");
            self.setState({"list": list, semanticscore : semanticlist});

            //console.log(categorylist[self.state.catvalue-1])

            axios.post("/yelpSearch", {
                capital:[self.state.value],
                category: categorylist[self.state.catvalue-1]
            }).then(function(response) {
                var list = [];
                
                self.setState({initialpos: [response.data[1]['latitude'], response.data[1]['longitude']]})
                
                response.data[0].businesses.map(function(item) {
                    list.push(
                        <Marker position={[item.coordinates.latitude, item.coordinates.longitude]}>
                            <Popup maxWidth={300}>
                                <div>
                                    <b>{item.name}</b>
                                    <a href={item.url} target="_blank">
                                        <p> {item.display_phone}<br/>
                                            {item.location.display_address[0]}<br/>
                                            {item.location.display_address[1]}<br/>
                                        </p>
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    )
                });
                console.log(self.state.semanticscore);
                var sum = 0.0, sum2 = -100.0;
                self.state.semanticscore.forEach(function(item) {
                    sum += item*1.2;
                    if (item*1.2 > sum2) {
                        sum2= item*1.2;
                    }
                });
                
                if (sum2 > 0) {
                    sum = (sum / (self.state.semanticscore.length*sum2))*200
                }else {
                    sum = -1*(sum / (self.state.semanticscore.length*sum2))*100
                }
                var c;
                if (!isNaN(sum)) {
                    sum2 = sum;
                    if (sum >= 50) {
                        c = greenA700
                    }else if (sum >=0) {
                        c = yellow600
                    }else {
                        sum *= -1;
                        c = red500
                    }
                }else {
                    c = redA700;
                    sum = 0;
                }

                //{greenA700,greenA200,yellow600,red500,redA700}

                self.setState({semanticComponent:[
                        <div>
                            <h4>Semantic score: {sum2}</h4>
                            <LinearProgress mode="determinate" value={sum} color={c} style={{height:"15px"}}/>
                        </div>
                ]});
                //console.log(sum);
                /*
                    -10 -> -7
                    -7 -> -5
                    -
                */
                self.setState({markerlist: list});
        
            }).catch(function(error){
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        })
    }

    handleChangeCategory = (event, index, value) => this.setState({catvalue: value,category: categorylist[value]});

    render() {
        return (
            <div>
                <RaisedButton labelColor={greenA700} label="Log Out" onTouchTap={this.clicked}/>
                <br/>
                <Grid className="container-fluid" style={{marginTop:"30px"}}>
                    <Row className="show-grid">
                        <Col xs={5}>
                            <TextField
                                ref="twittersearch"
                                defaultValue=""
                                floatingLabelFocusStyle={{color: greenA700}}
                                underlineFocusStyle={{color: greenA700}}
                                errorStyle={{color: greenA700}}
                                floatingLabelText="Enter your band/act name"
                                fullWidth = {true}
                            />
                        </Col>
                        <Col xs={4}>
                            <AutoComplete
                                ref="citysearch"
                                floatingLabelText="Enter city"
                                fullWidth={true}
                                filter={AutoComplete.fuzzyFilter}
                                floatingLabelFocusStyle={{color: greenA700}}
                                underlineFocusStyle={{color: greenA700}}
                                errorStyle={{color: greenA700}}
                                onUpdateInput={this.handleUpdateInput.bind(this)}
                                dataSource={require('../city').city}
                                maxSearchResults={5}
                            />
                        </Col>
                        <Col xs={2} style={{top:"16px"}}>
                            <DropDownMenu 
                                value={this.state.catvalue} 
                                onChange={this.handleChangeCategory}
                                style={{width:155}}
                                selectedMenuItemStyle={{color:greenA700}}
                                autoWidth={false}
                            >
                                <MenuItem value={1} primaryText="Venues" />
                                <MenuItem value={2} primaryText="Comedy Clubs" />
                                <MenuItem value={3} primaryText="Bars" />
                                <MenuItem value={4} primaryText="Stadiums" />
                                <MenuItem value={5} primaryText="Social Clubs" />
                            </DropDownMenu>
                        </Col>
                        <Col xs={1} style={{top:"27px", left:"20px"}}>

                            <RaisedButton 
                                labelColor={greenA700}
                                label="Submit" 
                                onTouchTap={this.submit} />
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={8}>
                            <Map center={this.state.initialpos} zoom={13} style={{height: "500px", width:"100%"}}>
                                <TileLayer
                                url={'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?'}
                                maxZoom={15}
                                />
                                {this.state.markerlist}
                            </Map>
                        </Col>
                        <Col xs={4}>
                            <List style={{
                                overflowY:"scroll", 
                                overflowX:"hidden",
                                height: "500px", 
                                width:"100%"}}>
                                {this.state.list}
                            </List>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={12} style={{top:"20px"}} >
                            {this.state.semanticComponent}
                        </Col>
                    </Row>
                    <AlertContainer ref={function(a) { global.msg = a}} {...{
                        offset: 14,
                        position: 'top right',
                        theme: 'dark',
                        time: 1500,
                        transition: 'scale'
                    }} />
                </Grid>
            </div>
        );
    }
};

Mappage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Mappage);
