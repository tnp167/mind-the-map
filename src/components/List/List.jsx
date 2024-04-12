import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import axios from "axios";
import "./List.scss";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

function List({
  startPoint,
  setPlaces,
  places,
  ratingFilter,
  setRatingFilter,
  selectedRoute,
}) {
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

  const URL =
    "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng";

  const options = selectedRouteCoordinates.map((option) => ({
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

  useEffect(() => {
    const filteredRestaurants = places?.data?.filter(
      (place) => place.rating > ratingFilter
    );

    setFilteredPlaces(filteredRestaurants);
  }, [ratingFilter, places]);

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
  };

  console.log(filteredPlaces);
  return (
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
          <MenuItem value={3}>Above 3</MenuItem>
          <MenuItem value={4}>Above 4</MenuItem>
          <MenuItem value={4.5}>Above 4.5</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={3} className="list__card">
        {/* {filteredPlaces?.length
          ? filteredPlaces?.map((place, index) => (
              <Grid item key={index} xs={12} id={`restaurant-${index}`}>
                <PlaceDetails place={place} />
              </Grid>
            ))
          : places?.data?.map((place, index) => (
              <Grid item key={index} xs={12} id={`restaurant-${index}`}>
                <PlaceDetails place={place} />
              </Grid>
            ))} */}
        {filteredPlaces?.map((place, index) => (
          <Grid item key={index} xs={12} id={`restaurant-${place.location_id}`}>
            <PlaceDetails place={place} />
          </Grid>
        ))}
        {!filteredPlaces && <CircularProgress />}
      </Grid>
    </div>
  );
}

export default List;
