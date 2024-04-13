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
  startPoint,
  setPlaces,
  places,
  ratingFilter,
  setRatingFilter,
  selectedRoute,
  handlePlaceClick,
  type,
}) {
  const travel_accessToken = process.env.REACT_APP_TRAVEL_ADVISOR_ACCESS_TOKEN;
  const toilet_accessToken =
    process.env.REACT_APP_PUBLIC_BATHROOMS_ACCESS_TOKEN;
  let selectedRouteCoordinates = [];
  const [convertedPlaceData, setConvertedPlaceData] = useState("");
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
  let URL;
  let options;
  // if (type === "Restaurants") {
  //   URL = "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng";
  //   options = selectedRouteCoordinates.map((option) => ({
  //     params: {
  //       latitude: option[0],
  //       longitude: option[1],
  //       distance: "0.5",
  //     },
  //     headers: {
  //       "X-RapidAPI-Key": travel_accessToken,
  //       "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
  //     },
  //   }));
  // } else if (type === "Toilet")
  // {
  URL = "https://public-bathrooms.p.rapidapi.com/location";

  options = selectedRouteCoordinates.map((option) => ({
    params: {
      lat: option[0],
      lng: option[1],
    },
    headers: {
      "X-RapidAPI-Key": "4196f2e639msh6f8ec59aa20330ep1e7b94jsn324a5c1fa5ad",
      "X-RapidAPI-Host": "public-bathrooms.p.rapidapi.com",
    },
  }));
  //}

  const getRestaurant = async () => {
    const placesArray = [];
    try {
      for (let i = 0; i < options.length; i++) {
        const { data } = await axios(URL, options[i]);
        placesArray.push(data);
      }
      setConvertedPlaceData(placesArray);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRestaurant();
  }, []);

  console.log(convertedPlaceData);
  useEffect(() => {
    if (convertedPlaceData) {
      // if (type === "Restaurants") {
      //   const combinedDataArray = convertedPlaceData.reduce(
      //     (acc, curr) => acc.concat(curr.data),
      //     []
      //   );
      //   const combinedObject = { data: combinedDataArray };
      //   const uniqueIds = new Set();
      //   const uniqueData = combinedObject.data.filter((obj) => {
      //     if (!uniqueIds.has(obj.location_id)) {
      //       uniqueIds.add(obj.location_id);
      //       return true;
      //     }
      //     return false;
      //   });

      //   const combinedObjectWithUniqueIds = { data: uniqueData };
      //   console.log(combinedObjectWithUniqueIds);
      //   setPlaces(combinedObjectWithUniqueIds);
      // }
      const flattenedArray = convertedPlaceData?.reduce(
        (acc, curr) => acc.concat(curr),
        []
      );

      const uniqueObjectsMap = new Map();
      flattenedArray.forEach((obj) => uniqueObjectsMap.set(obj.id, obj));

      const uniqueObjectsArray = Array.from(uniqueObjectsMap.values());

      const obj = {
        data: uniqueObjectsArray,
      };

      setPlaces(obj);
    }
  }, [convertedPlaceData]);

  console.log(places);

  useEffect(() => {
    let filteredRestaurants;
    if (type === "Restaurants") {
      filteredRestaurants = places?.data?.filter(
        (place) => place.rating > ratingFilter
      );
    } else if (type === "Toilets") {
      filteredRestaurants = places?.data?.filter(
        (place) => place.unisex == true
      );
    }

    setFilteredPlaces(filteredRestaurants);
  }, [ratingFilter, places]);

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
  };

  console.log(type);
  console.log(filteredPlaces);
  return (
    <>
      {type === "Restaurants" ? (
        <div className="list__container">
          <h2>Restaurants</h2>
          <FormControl>
            <InputLabel>Unisex</InputLabel>
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
            {filteredPlaces?.map((place, index) => (
              <Grid
                item
                key={index}
                xs={12}
                id={`restaurant-${place.location_id}`}
                onClick={() => handlePlaceClick(place.location_id)}
                type={type}
              >
                <PlaceDetails place={place} />
              </Grid>
            ))}
            {!filteredPlaces && <CircularProgress />}
          </Grid>
        </div>
      ) : null}
      {type === "Toilets" ? (
        <div className="list__container">
          <h2>Toilets</h2>
          <FormControl>
            <InputLabel>Unisex</InputLabel>
            <Checkbox
              onChange={handleRatingFilterChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </FormControl>
          <Grid container spacing={3} className="list__card">
            {filteredPlaces?.map((place, index) => (
              <Grid
                item
                key={index}
                xs={12}
                id={`toilets-${place.id}`}
                onClick={() => handlePlaceClick(place.id)}
              >
                <PlaceDetails place={place} type={type} />
              </Grid>
            ))}
            {!filteredPlaces && <CircularProgress />}
          </Grid>
        </div>
      ) : null}
    </>
  );
}

export default List;
