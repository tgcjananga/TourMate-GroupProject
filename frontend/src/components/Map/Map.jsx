/*
Map used in SearchPlace page. 
*/

import React, { useEffect, useRef, useState, createRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Box,
  Paper,
  Rating,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import "./Map.css";

const locationIcon = L.divIcon({
  className: "custom-icon",
  html: `<div style="background: transparent; border: none; display: flex; justify-content: center; align-items: center; transform: scale(1.33);">
           <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#f02000" d="M32,52.789l-12-18C18.5,32,16,28.031,16,24c0-8.836,7.164-16,16-16s16,7.164,16,16 c0,4.031-2.055,8-4,10.789L32,52.789z"></path> <g> <path fill="#394240" d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289 l16,24C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289 C54.289,34.008,56,29.219,56,24C56,10.746,45.254,0,32,0z M44,34.789l-12,18l-12-18C18.5,32,16,28.031,16,24 c0-8.836,7.164-16,16-16s16,7.164,16,16C48,28.031,45.945,32,44,34.789z"></path> <circle fill="#394240" cx="32" cy="24" r="8"></circle> </g> </g> </g></svg>  <path d="M12 2C8.13 2 5 5.13 5 9C5 12.26 10 21 12 21C14 21 19 12.26 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.07 11.5 8.5 9.93 8.5 8C8.5 6.07 10.07 4.5 12 4.5C13.93 4.5 15.5 6.07 15.5 8C15.5 9.93 13.93 11.5 12 11.5Z" fill="black"/>
           </svg>
           
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const getIconByType = (type) => {
  switch (type) {
    case "restaurant":
      return L.divIcon({
        className: "custom-icon",
        html: `<div style="background: transparent; border: none; display: flex; justify-content: center; align-items: center; ">
                 <svg fill="#fafafa" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132px" height="132px" viewBox="-54.02 -54.02 648.24 648.24" xml:space="preserve" stroke="#fafafa"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-54.02" y="-54.02" width="648.24" height="648.24" rx="324.12" fill="#f50049" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M169.467,194.102v310.136c0,8.086,2.95,15.08,8.862,20.986c5.808,5.809,12.681,8.732,20.6,8.824 c7.914-0.092,14.792-3.016,20.606-8.824c5.906-5.906,8.855-12.9,8.855-20.986V194.102c8.862-3.103,42.081-32.711,42.081-42.204 V27.161c0-4.033-1.481-7.534-4.431-10.49c-2.956-2.95-6.457-4.431-10.49-4.431c-4.045,0-7.54,1.481-10.49,4.431 c-2.956,2.962-4.431,6.457-4.431,10.49v96.99c0,4.045-1.481,7.54-4.431,10.49c-2.956,2.956-6.451,4.425-10.49,4.425 c-4.045,0-7.54-1.469-10.49-4.425c-2.95-2.95-4.431-6.451-4.431-10.49v-96.99c0-4.033-1.481-7.534-4.431-10.49 c-2.95-2.95-6.45-4.431-10.489-4.431c-4.045,0-7.54,1.481-10.49,4.431c-2.956,2.962-4.431,6.457-4.431,10.49v96.99 c0,4.045-1.481,7.54-4.431,10.49c-2.956,2.956-6.451,4.425-10.49,4.425c-4.045,0-7.54-1.469-10.49-4.425 c-2.956-2.95-4.431-6.451-4.431-10.49v-96.99c0-4.033-1.475-7.534-4.431-10.49c-2.95-2.95-6.45-4.431-10.49-4.431 c-4.045,0-7.54,1.481-10.489,4.431c-2.95,2.962-4.431,6.457-4.431,10.49v124.732C121.266,161.384,160.605,190.993,169.467,194.102 z"></path> <path d="M199.308,534.08c-0.129,0-0.251-0.037-0.38-0.037c-0.128,0-0.245,0.037-0.379,0.037H199.308z"></path> <path d="M389.848,540.201c-0.129,0-0.25-0.037-0.379-0.037s-0.252,0.037-0.379,0.037H389.848z"></path> <path d="M326.139,268.588h33.869v241.771c0,8.084,2.949,15.08,8.855,20.984c5.812,5.809,12.686,8.734,20.605,8.826 c7.912-0.092,14.791-3.018,20.605-8.826c5.906-5.904,8.861-12.9,8.861-20.984V14.921c0-4.033-1.48-7.534-4.43-10.49 C411.549,1.481,408.055,0,404.016,0h-10.723c-20.52,0-38.084,7.308-52.693,21.916c-14.607,14.614-21.914,32.179-21.914,52.693 v186.52c0,2.02,0.74,3.77,2.215,5.245C322.369,267.848,324.119,268.588,326.139,268.588z"></path> </g> </g> </g></svg>
                 </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
      });
    case "hotel":
      return L.divIcon({
        className: "custom-icon",
        html: `<div style="background: transparent; border: none; display: flex; justify-content: center; align-items: center;">
                <svg width="24px" height="24px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M533.333333 277.333333m-149.333333 0a149.333333 149.333333 0 1 0 298.666667 0 149.333333 149.333333 0 1 0-298.666667 0Z" fill="#4CAF50"></path><path d="M298.666667 469.333333a85.333333 85.333333 0 1 1-0.042667 170.709334A85.333333 85.333333 0 0 1 298.666667 469.333333" fill="#FFB74D"></path><path d="M426.666667 746.666667H170.666667a21.333333 21.333333 0 0 1-21.333334-21.333334v-64a21.333333 21.333333 0 0 1 21.333334-21.333333h256a21.333333 21.333333 0 0 1 21.333333 21.333333v64a21.333333 21.333333 0 0 1-21.333333 21.333334z" fill="#E1BEE7"></path><path d="M917.333333 725.333333H426.666667a21.333333 21.333333 0 0 1-21.333334-21.333333v-192h476.096C914.602667 512 938.666667 536.192 938.666667 569.514667V704a21.333333 21.333333 0 0 1-21.333334 21.333333z" fill="#9C27B0"></path><path d="M192 896H85.333333V384h106.666667v320h746.666667v192h-106.666667v-85.333333H192v85.333333z" fill="#FF9800"></path><path d="M512 234.666667h42.666667v149.333333h-42.666667z" fill="#FFFFFF"></path><path d="M533.333333 192m-21.333333 0a21.333333 21.333333 0 1 0 42.666667 0 21.333333 21.333333 0 1 0-42.666667 0Z" fill="#FFFFFF"></path></g></svg>
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
      });
    case "attraction":
      return L.divIcon({
        className: "custom-icon",
        html: `<div style="background: transparent; border: none; display: flex; justify-content: center; align-items: center;">
                <svg viewBox="-3.2 -3.2 38.40 38.40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-3.2, -3.2), scale(1.2)" d="M16,28.988109229598194C18.97511016131165,29.182809971615228,21.719995092428853,27.44989589038099,23.909926069797088,25.42668281083528C26.008816175744983,23.48757972550146,27.163006577078516,20.86600210823949,27.805250437260057,18.08158416610935C28.485018525549084,15.134481704149746,29.37416055887899,11.756770485412904,27.633475557998747,9.283409754978496C25.925459712605573,6.85646902944866,22.437322721970823,6.885346752639995,19.524776324762236,6.315756639087507C17.147338298956925,5.850814622582533,14.820395377827785,5.707276140521883,12.476493355254675,6.319245056263899C9.872689976790314,6.999071565639477,7.184214392664124,7.829137014028712,5.547302777152444,9.965132444631303C3.759137535173612,12.298497758820993,2.6823932867475464,15.367485938276703,3.348060534570399,18.230878286045467C3.9973038083719543,21.023622300602188,6.729191053680863,22.58801568929834,8.91357413136312,24.44527348760054C11.117660457207133,26.319283847151812,13.11309552206906,28.799180950136556,16,28.988109229598194" fill="#414344" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>camera</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-258.000000, -467.000000)" fill="#f50000"> <path d="M286,471 L283,471 L282,469 C281.411,467.837 281.104,467 280,467 L268,467 C266.896,467 266.53,467.954 266,469 L265,471 L262,471 C259.791,471 258,472.791 258,475 L258,491 C258,493.209 259.791,495 262,495 L286,495 C288.209,495 290,493.209 290,491 L290,475 C290,472.791 288.209,471 286,471 Z M274,491 C269.582,491 266,487.418 266,483 C266,478.582 269.582,475 274,475 C278.418,475 282,478.582 282,483 C282,487.418 278.418,491 274,491 Z M274,477 C270.687,477 268,479.687 268,483 C268,486.313 270.687,489 274,489 C277.313,489 280,486.313 280,483 C280,479.687 277.313,477 274,477 L274,477 Z" id="camera" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg> 
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
      });
    default:
      return L.divIcon({
        className: "custom-icon",
        html: `<div style="background: transparent; border: none; display: flex; justify-content: center; align-items: center;">
                <svg viewBox="-3.2 -3.2 38.40 38.40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-3.2, -3.2), scale(1.2)" d="M16,28.988109229598194C18.97511016131165,29.182809971615228,21.719995092428853,27.44989589038099,23.909926069797088,25.42668281083528C26.008816175744983,23.48757972550146,27.163006577078516,20.86600210823949,27.805250437260057,18.08158416610935C28.485018525549084,15.134481704149746,29.37416055887899,11.756770485412904,27.633475557998747,9.283409754978496C25.925459712605573,6.85646902944866,22.437322721970823,6.885346752639995,19.524776324762236,6.315756639087507C17.147338298956925,5.850814622582533,14.820395377827785,5.707276140521883,12.476493355254675,6.319245056263899C9.872689976790314,6.999071565639477,7.184214392664124,7.829137014028712,5.547302777152444,9.965132444631303C3.759137535173612,12.298497758820993,2.6823932867475464,15.367485938276703,3.348060534570399,18.230878286045467C3.9973038083719543,21.023622300602188,6.729191053680863,22.58801568929834,8.91357413136312,24.44527348760054C11.117660457207133,26.319283847151812,13.11309552206906,28.799180950136556,16,28.988109229598194" fill="#414344" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>camera</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-258.000000, -467.000000)" fill="#f50000"> <path d="M286,471 L283,471 L282,469 C281.411,467.837 281.104,467 280,467 L268,467 C266.896,467 266.53,467.954 266,469 L265,471 L262,471 C259.791,471 258,472.791 258,475 L258,491 C258,493.209 259.791,495 262,495 L286,495 C288.209,495 290,493.209 290,491 L290,475 C290,472.791 288.209,471 286,471 Z M274,491 C269.582,491 266,487.418 266,483 C266,478.582 269.582,475 274,475 C278.418,475 282,478.582 282,483 C282,487.418 278.418,491 274,491 Z M274,477 C270.687,477 268,479.687 268,483 C268,486.313 270.687,489 274,489 C277.313,489 280,486.313 280,483 C280,479.687 277.313,477 274,477 L274,477 Z" id="camera" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg> 
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
      });
  }
};

const Map = ({
  setCoordinates,
  setBound,
  coordinates,
  places,
  setChildClicked,
  cardSelect,
}) => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  const position = [coordinates.lat, coordinates.long];

  const mapRef = useRef(null); // Create a reference to the map

  const initialBoundsSet = useRef(false); // Track if initial bounds have been set
  const debounceTimeout = useRef(null);

  const [elRefs, setElRefs] = useState([]);

  useEffect(() => {
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(position); // Update the map center when coordinates change
    }
  }, [coordinates]);

  const isValidCoordinates =
    coordinates &&
    coordinates.lat !== undefined &&
    coordinates.long !== undefined;

  if (!isValidCoordinates) {
    return (
      <div className="loading">
        <CircularProgress size="5rem" />
      </div>
    );
  }

  //Detect when map zoom or scroll and updates map bound accordingly
  const MapEventHandler = () => {
    const map = useMapEvents({
      moveend: () => {
        debounceUpdateBounds();
      },
      zoomend: () => {
        debounceUpdateBounds();
      },
    });

    //Add delay to update bounds
    const debounceUpdateBounds = () => {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        const bounds = map.getBounds();
        const center = map.getCenter();

        // Only update coordinates if they have actually changed
        if (center.lat !== coordinates.lat || center.lng !== coordinates.long) {
          setCoordinates({ lat: center.lat, long: center.lng });
        }
        setBound(bounds);
      }, 1000); // Adjust the delay as needed
    };

    //Set initial bounds
    useEffect(() => {
      if (!initialBoundsSet.current) {
        const bounds = map.getBounds();
        setBound(bounds);
        initialBoundsSet.current = true; // Mark initial bounds as set
      }
    }, [map]);

    return null;
  };

  return (
    <Box sx={{ height: "85vh", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        maxZoom={15}
        minZoom={8}
        ref={mapRef} // Assign the map reference
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {places?.map((place, i) => {
          const lat = Number(place.latitude);
          const lng = Number(place.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            return (
              <Marker
                position={[lat, lng]}
                key={i}
                icon={
                  cardSelect === i
                    ? locationIcon
                    : getIconByType(place.category.key)
                }
                eventHandlers={{
                  click: () => {
                    setChildClicked(i); // Update state when marker is clicked
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span>{place.name}</span>
                    <Rating
                      size="small"
                      value={Number(place.rating)}
                      readOnly
                    />
                  </div>
                </Tooltip>
                <Popup>
                  {!isDesktop ? (
                    <Paper elevation={3} className="paper">
                      <Typography variant="subtitle2">{place.name}</Typography>
                    </Paper>
                  ) : (
                    <Paper elevation={3} className="paper">
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        className="typography"
                      >
                        {place.name}
                      </Typography>
                      <img
                        src={
                          place.photo
                            ? place.photo.images.large.url
                            : "No Photo"
                        }
                        alt={place.name}
                        className="pointer"
                        style={{ width: "auto", height: "auto" }}
                      />
                      <Rating
                        size="small"
                        value={Number(place.rating)}
                        readOnly
                      />
                      {place.is_closed ? (
                        <Typography variant="subtitle" color="red">
                          Close
                        </Typography>
                      ) : (
                        <Typography variant="subtitle" color="green">
                          Open
                        </Typography>
                      )}
                    </Paper>
                  )}
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        <MapEventHandler />
      </MapContainer>
    </Box>
  );
};

export default Map;
