import React, {Component} from 'react';
import MapContainer from '../components/MapContainer';
import {places} from '../domain/Places.js';

import './HomePage.css';

export default class HomePage extends Component {

  render() {
    return (
        <MapContainer google={this.props.google}
                      places={places}/>
    );
  }
}
