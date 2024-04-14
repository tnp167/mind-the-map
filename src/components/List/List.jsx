import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import "./List.scss";
import PlaceDetails from "../PlaceDetails/PlaceDetails";
import Rating from "@mui/material/Rating";

function List({
  setPlaces,
  places,
  setToilets,
  toilets,
  ratingFilter,
  setRatingFilter,
  isChecked,
  setIsChecked,
  filteredToilets,
  setFilteredToilets,
  selectedRoute,
  handlePlaceClick,
  type,
}) {
  const travel_accessToken = process.env.REACT_APP_TRAVEL_ADVISOR_ACCESS_TOKEN;
  const toilet_accessToken =
    process.env.REACT_APP_PUBLIC_BATHROOMS_ACCESS_TOKEN;

  let selectedRouteCoordinates = [];
  const [convertedPlaceData, setConvertedPlaceData] = useState("");
  const [convertedToiletData, setConvertedToiletData] = useState("");

  selectedRoute.legs.map((leg) => {
    if (leg.mode.id === "walking") {
      const coordinates = JSON.parse(leg.path.lineString);
      const filteredCoordinates = coordinates.filter(
        (_, index) => index % 10 === 0
      );
      selectedRouteCoordinates.push(...filteredCoordinates);
    } else {
      selectedRouteCoordinates.push([
        leg.arrivalPoint.lat,
        leg.arrivalPoint.lon,
      ]);
    }
  });

  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const URL_place =
    "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng";
  const optionsRestaurants = selectedRouteCoordinates.map((option) => ({
    params: {
      latitude: option[0],
      longitude: option[1],
      distance: "0.5",
    },
    headers: {
      "X-RapidAPI-Key": "4196f2e639msh6f8ec59aa20330ep1e7b94jsn324a5c1fa5ad",
      "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
    },
  }));

  const getRestaurant = async () => {
    const placesArray = [];
    try {
      for (let i = 0; i < optionsRestaurants.length; i++) {
        const { data } = await axios(URL_place, optionsRestaurants[i]);
        placesArray.push(data);
      }
      setConvertedPlaceData(placesArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (convertedPlaceData) {
      const combinedDataArray = convertedPlaceData.reduce(
        (acc, curr) => acc.concat(curr.data),
        []
      );
      const combinedObject = { data: combinedDataArray };
      const uniqueIds = new Set();
      const uniqueData = combinedObject.data.filter((obj) => {
        if (!uniqueIds.has(obj.location_id)) {
          uniqueIds.add(obj.location_id);
          return true;
        }
        return false;
      });

      const combinedObjectWithUniqueIds = { data: uniqueData };
      console.log(combinedObjectWithUniqueIds);
      setPlaces(combinedObjectWithUniqueIds);
    }
  }, [convertedPlaceData]);

  const URL_Toilet = "https://public-bathrooms.p.rapidapi.com/location";
  const optionsToilet = selectedRouteCoordinates.map((option) => ({
    params: {
      lat: option[0],
      lng: option[1],
    },
    headers: {
      "X-RapidAPI-Key": toilet_accessToken,
      "X-RapidAPI-Host": "public-bathrooms.p.rapidapi.com",
    },
  }));

  const getToilet = async () => {
    const placesArray = [];
    try {
      for (let i = 0; i < optionsToilet.length; i++) {
        const { data } = await axios(URL_Toilet, optionsToilet[i]);
        placesArray.push(data);
      }
      setConvertedToiletData(placesArray);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRestaurant();
    getToilet();
  }, []);

  useEffect(() => {
    if (convertedToiletData) {
      const flattenedArray = convertedToiletData?.reduce(
        (acc, curr) => acc.concat(curr),
        []
      );

      const uniqueObjectsMap = new Map();
      flattenedArray.forEach((obj) => uniqueObjectsMap.set(obj.id, obj));

      const uniqueObjectsArray = Array.from(uniqueObjectsMap.values());

      const obj = {
        data: uniqueObjectsArray,
      };

      setToilets(obj);
    }
  }, [convertedToiletData]);

  useEffect(() => {
    let filteredObj;
    if (type === "Restaurants") {
      filteredObj = places?.data?.filter(
        (place) => place.rating > ratingFilter
      );
      setFilteredPlaces(filteredObj);
    } else if (type === "Toilets") {
      let filteredObj;
      if (isChecked) {
        filteredObj = toilets?.data?.filter(
          (place) => place.accessible === true && place.distance < 2
        );
      } else {
        filteredObj = toilets?.data?.filter((place) => place.distance < 2);
      }
      setFilteredToilets(filteredObj);
    }
  }, [ratingFilter, places, toilets, isChecked]);

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
  };

  const handleAccessibleFilterChange = (event) => {
    setIsChecked(event.target.checked);
  };

  console.log(filteredPlaces);
  console.log(filteredToilets);
  return (
    <>
      {type === "Restaurants" ? (
        <div className="list__container">
          <h2>Restaurants</h2>
          <FormControl>
            <InputLabel>Rating</InputLabel>
            <Select
              value={ratingFilter}
              className="list__form"
              onChange={handleRatingFilterChange}
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={3}>
                <Rating value={3} className="place__rating" readOnly />
              </MenuItem>
              <MenuItem value={4}>
                <Rating value={4} className="place__rating" readOnly />
              </MenuItem>
              <MenuItem value={4.5}>
                <Rating
                  value={4.5}
                  className="place__rating"
                  precision={0.5}
                  readOnly
                />
              </MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={3} className="list__card">
            {filteredPlaces
              ? filteredPlaces.map((place, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    id={`item-${place.location_id}`}
                    onClick={() => handlePlaceClick(place.location_id)}
                  >
                    <PlaceDetails place={place} type={type} />
                  </Grid>
                ))
              : places?.data?.map((place, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    id={`item-${place.location_id}`}
                    onClick={() => handlePlaceClick(place.location_id)}
                  >
                    <PlaceDetails place={place} type={type} />
                  </Grid>
                ))}
            {!places && !filteredPlaces && <CircularProgress />}
          </Grid>
        </div>
      ) : null}
      {type === "Toilets" ? (
        <div className="list__container">
          <h2>Toilets</h2>
          <div className="list__filter">
            <InputLabel>Accessible Only</InputLabel>
            <Checkbox
              onChange={handleAccessibleFilterChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>
          <Grid container spacing={3} className="list__card">
            {filteredToilets
              ? filteredToilets.map((place, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    id={`item-${place.id}`}
                    onClick={() => handlePlaceClick(place.id)}
                  >
                    <PlaceDetails place={place} type={type} />
                  </Grid>
                ))
              : toilets?.data?.map((place, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    id={`item-${place.id}`}
                    onClick={() => handlePlaceClick(place.id)}
                  >
                    <PlaceDetails place={place} type={type} />
                  </Grid>
                ))}
            {!toilets && !filteredToilets && <CircularProgress />}
          </Grid>
        </div>
      ) : null}
    </>
  );
}

export default List;
