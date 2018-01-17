import React, {Component} from 'react';
import $ from 'jquery';
import FilterMenu from './FilterMenu/FilterMenu'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

import './FilterMenu/FilterMenu.css'

export class MapContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      placeInformation: '',
      places: props.places
    };

    this.onMapClicked = this.onMapClicked.bind(this);
    this.findPlaceDescription = this.findPlaceDescription.bind(this);
    this.updatePlaces = this.updatePlaces.bind(this);
    this.itemClicked = this.itemClicked.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.findMarker = this.findMarker.bind(this);
    this.onMapError = this.onMapError.bind(this);
  }

  findPlaceDescription = function (name) {
    let self = this;

    let wikiUrl = "https://pt.wikipedia.org/w/api.php";
    wikiUrl += '?' + $.param({
      "action": "query",
      "format": "json",
      "list": "search",
      "utf8": 1,
      "srsearch": name,
      "srlimit": "1"
    });

    let wikiRequestTimeout = setTimeout(function () {
      self.setState({
        placeInformation: 'failed to get the description'
      });
    }, 3000);

    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      success: function( response ) {

        self.setState({
          placeInformation: response.query.search[0].title
        });

        this.findMarker(name).marker
          .setIcon('https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png');

        clearTimeout(wikiRequestTimeout);
      }.bind(this)
    });
  };

  findMarker = function(name) {
    let marker = {};
    this.props.places.map(function (place, index) {
      if (place.name === name) {
         marker = this['marker-' + index];
      }
    }.bind(this));

    return marker;
  };

  openInfoWindow = function(props, marker) {
    this.setState({
      placeInformation: 'Carregando...',
      activeMarker: marker,
      showingInfoWindow: true
    });

    this.findMarker(props.title).marker
      .setIcon('https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png');

    this.findPlaceDescription(props.title);

  };

  itemClicked = function (name) {
    let marker = this.findMarker(name);

    this.openInfoWindow(marker.props, marker.marker);
  };

  onMapClicked = function() {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  updatePlaces = function (updatePlaces) {
    this.setState({places: updatePlaces});
  };

  onMapError = function () {
    alert('Error happened while fetching Google Maps API');
  };

  render() {
    const style = {
      width: '100%',
      height: '100%'
    };

    return (
      <div>
        <FilterMenu title={'Filter Locations'}
                    list={this.state.places}
                    updateListCallback={this.updatePlaces}
                    itemClicked={this.itemClicked}/>
        <Map google={this.props.google}
             ref={(c) => this['map'] = c }
             style={style}
             initialCenter={{
               lat: -22.846645,
               lng: -47.063862
             }}
             zoom={12}
             onClick={this.onMapClicked}
             onError={this.onMapError}>
          {
            this.state.places.map(function (place, index) {
              return <Marker
                ref={(c) => this['marker-' + index] = c }
                title={place.name}
                name={place.name}
                position={{lat: place.visible && place.lat, lng: place.lng}}
                onClick={this.openInfoWindow}
                key={'marker-' + index}
              />
            }.bind(this))
          }
          <InfoWindow
            marker={this.state.activeMarker}
            onClose={this.onMapClicked}
            visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.placeInformation}</h1>
              {
                this.state.placeInformation === 'Carregando...' ? '' :
                  <a href={ 'https://en.wikipedia.org/wiki/ ' + this.state.placeInformation}>click here for more information</a>

              }
            </div>
          </InfoWindow>
        </Map>
      </div>
    )
  }
}



export default GoogleApiWrapper({
  apiKey: 'AIzaSyCJDO-vf6VUdfzh5FiYf9JgA67ECEC8L9w'
})(MapContainer)