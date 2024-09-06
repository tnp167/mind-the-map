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

  const getRestaurant = async () => {
    const placesArray = [];
    try {
      for (let i = 0; i < selectedRouteCoordinates.length; i++) {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/facilities/restaurants`,
          {
            params: {
              lat: selectedRouteCoordinates[i][0],
              lon: selectedRouteCoordinates[i][1],
            },
          }
        );
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
      setPlaces(combinedObjectWithUniqueIds);
    }
  }, [convertedPlaceData]);

  const getToilet = async () => {
    const placesArray = [];
    try {
      for (let i = 0; i < selectedRouteCoordinates.length; i++) {
        const { data } = await axios(
          `${process.env.REACT_APP_API_BASE_URL}/api/facilities/toilets`,
          {
            params: {
              lat: selectedRouteCoordinates[i][0],
              lon: selectedRouteCoordinates[i][1],
            },
          }
        );
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
  }, [selectedRoute]);

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
          (place) => place.accessible === true && place.distance < 1
        );
      } else {
        filteredObj = toilets?.data?.filter((place) => place.distance < 1);
      }
      setFilteredToilets(filteredObj);
    }
  }, [ratingFilter, places, toilets, isChecked, type]);

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
  };

  const handleAccessibleFilterChange = (event) => {
    setIsChecked(event.target.checked);
  };

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
            {!places && !filteredPlaces && (
              <Grid item xs={12} className="list__loading">
                <CircularProgress
                  className="list__circular"
                  size="md"
                  color="warning"
                />
              </Grid>
            )}
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
            {!toilets && !filteredToilets && (
              <Grid item xs={12} className="list__loading">
                <CircularProgress className="list__circular" size="md" />
              </Grid>
            )}
          </Grid>
        </div>
      ) : null}
    </>
  );
}

export default List;
