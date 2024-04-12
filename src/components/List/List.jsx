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
}) {
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const URL =
    "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng";
  const options = {
    params: {
      latitude: startPoint[1],
      longitude: startPoint[0],
      distance: "5",
    },
    headers: {
      "X-RapidAPI-Key": "4196f2e639msh6f8ec59aa20330ep1e7b94jsn324a5c1fa5ad",
      "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
    },
  };
  const getRestaurant = async () => {
    try {
      const { data } = await axios(URL, options);
      setPlaces(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRestaurant();
  }, []);

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
          <Grid item key={index} xs={12}>
            <PlaceDetails place={place} />
          </Grid>
        ))}
        {!filteredPlaces && <CircularProgress />}
      </Grid>
    </div>
  );
}

export default List;
