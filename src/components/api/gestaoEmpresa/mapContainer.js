import React from 'react';
const _ = require('lodash');
const { compose, withProps, lifecycle } = require('recompose');
const { withScriptjs, withGoogleMap, GoogleMap, Marker } = require('react-google-maps');
const { SearchBox } = require('react-google-maps/lib/components/places/SearchBox');

const MapWithASearchBox = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDcHyxi8c8dLXzB540SRtirzxNcuvGoSL4&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        bounds: null,
        center: {
          lat: -15.77,
          lng: -47.87,
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        },
        onRightClick: clickEvent => {
          // this.props.change('latitude', clickEvent.latLng.lat());
          // this.props.change('longitude', clickEvent.latLng.lng());
          this.setState({
            center: clickEvent.latLng,
            markers: [{ position: clickEvent.latLng }],
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces(); /*eslint-disable*/
          const bounds = new google.maps.LatLngBounds();
          /*eslint-enable*/
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    onRightClick={props.onRightClick}>
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      /*eslint-disable*/
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      /*eslint-enable*/
      onPlacesChanged={props.onPlacesChanged}>
      <input
        type="text"
        placeholder="Customized your placeholder"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) => <Marker key={index} position={marker.position} />)}
  </GoogleMap>
));
export default MapWithASearchBox;
