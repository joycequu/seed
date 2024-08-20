import React, { useState, useEffect, useLayoutEffect } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./MapView.css";
import leaf_1 from "../../public/leaf-1.png";
import flower_1 from "../../public/flower-1.png";
import mit_pic from "../../public/mit-pic.png";
import bostongarden_pic from "../../public/bostongarden-pic.png";

let map;
// initMap is now async
async function initMap() {
  // Request libraries when needed, not in the script tag.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  // Short namespaces can be used.
  const map = new Map(document.getElementById("map"), {
    center: { lat: 42.3756, lng: -71.1256 }, //center around boston
    zoom: 12,
    mapId: "4504f8b37365c3d0",
  });

  // Set LatLng and title text for the markers. The first marker (Boynton Pass)
  // receives the initial focus when tab is pressed. Use arrow keys to
  // move between markers; press tab again to cycle through the map controls.
  const tourStops = [
    {
      position: { lat: 42.359205, lng: -71.093571 },
      title: "MIT <3",
      image: mit_pic,
    },
    {
      position: { lat: 42.35379, lng: -71.0684 },
      title: "Boston Public Garden",
      // image: "",
    },
    {
      position: { lat: 42.33609, lng: -71.15333 },
      title: "Chestnut Hill Reservation",
    },
    {
      position: { lat: 42.35489, lng: -71.0463 },
      title: "Fan Pier Park",
    },
    {
      position: { lat: 42.37717, lng: -71.1207 },
      title: "Cambridge Common",
    },
  ];
  // Create an info window to share between markers.
  const infoWindow = new InfoWindow();

  // Create the markers.
  tourStops.forEach(({ position, title, image }, i) => {
    const pin = new PinElement({
      glyph: `${i + 1}`,
    });
    const marker = new AdvancedMarkerElement({
      position,
      map,
      title: `${i + 1}. ${title}`,
      content: pin.element,
    });

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", ({ domEvent, latLng }) => {
      const { target } = domEvent;

      infoWindow.close();
      const infoWindowContent = `
      <div style="padding: 10px;">
  <h3 style="margin-bottom: 10px;">${title}</h3>
  <img src="${image}" alt="${title}" style="transform: rotate(90deg); max-width: 300px; max-height: 400px; margin-top: 10px;">
</div>
    `;
      infoWindow.setContent(infoWindowContent);
      infoWindow.open(marker.map, marker);
    });
  });
}

const Map = ({ userId, setShowNavBar }) => {
  const [stories, setStories] = useState([]);
  useEffect(() => {
    initMap();
  }, []);
  // useLayoutEffect(() => {
  //   setShowNavBar(true);
  // }, []);
  return (
    <div id="map">
      <img className="flower-image" src={flower_1} />
    </div>
  );
};

export default Map;
