import React from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import Rating from "@mui/material/Rating";

import london from "../../assets/images/london.png";
import "./PlaceDetails.scss";

function PlaceDetails({ place }) {
  //console.log(place);
  return (
    <>
      {place.name && (
        <Card elevation={6}>
          <CardMedia
            style={{ height: 350 }}
            image={place.photo ? place.photo.images.large.url : london}
            title={place.name}
          />
          <CardContent>
            <h5>{place.name}</h5>
            <Box className="place__box">
              <Rating
                value={Number(place.rating)}
                precision={0.5}
                className="place__rating"
                readOnly
              ></Rating>

              <p className="place__detail">
                out of {place.num_reviews} reviews
              </p>
            </Box>
            {place.price_level && (
              <Box className="place__box">
                <p>Price</p>
                <p className="place__detail">
                  {place.price_level?.replace(/\$/g, "£")}
                </p>
              </Box>
            )}
            {place.ranking && (
              <Box className="place__box">
                <p>Ranking</p>
                <p className="place__detail">{place.ranking}</p>
              </Box>
            )}
            {place.address && (
              <div className="place__icon-container">
                <LocationOnIcon />
                <p className="place__detail">{place.address}</p>
              </div>
            )}
            {place.phone && (
              <div className="place__icon-container">
                <PhoneIcon />
                <p className="place__detail">{place.phone}</p>
              </div>
            )}
            {place.cuisine?.map(({ name }) => (
              <Chip
                key={name}
                size="small"
                label={name}
                className="place__chip"
              ></Chip>
            ))}
            <CardActions>
              {place.web_url && (
                <Button
                  size="small"
                  onClick={() => window.open(place.web_url, "_blank")}
                >
                  Trip Advisor
                </Button>
              )}
              {place.website && (
                <Button
                  size="small"
                  onClick={() => window.open(place.website, "_blank")}
                >
                  Website
                </Button>
              )}
            </CardActions>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default PlaceDetails;
