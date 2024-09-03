import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import "./SavedRoutes.scss";
import close from "../../assets/icons/close.svg";
import { AuthContext } from "../../contexts/AuthContext";
import { Card, CardMedia, CardContent, CardActions, Grid } from "@mui/material";
import axios from "axios";
import emptyBox from "../../assets/images/empty-box.json";
import Lottie from "lottie-react";
import { Trash2, Pencil } from "lucide-react";

function SavedRoutes({ modalIsOpen, handleCloseModal }) {
  const { auth } = useContext(AuthContext);
  const [routes, setRoutes] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [routeNames, setRouteNames] = useState({});

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleNameChange = (id, newName) => {
    setRouteNames({
      ...routeNames,
      [id]: newName,
    });
  };

  const handleBlur = () => {
    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const getUserRoute = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/route/userId/${auth.user.user.id}`
      );
      setRoutes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserRoute();
  }, []);

  useEffect(() => {
    if (routes) {
      const initialNames = routes.reduce((acc, route) => {
        acc[route.id] = route.start_point;
        return acc;
      }, {});
      setRouteNames(initialNames);
    }
  }, [routes]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      className="routes"
      overlayClassName="Overlay"
    >
      <div className="routes__icon">
        <img
          src={close}
          onClick={handleCloseModal}
          alt="close-icon"
          className="routes__close"
        />
      </div>
      <div className="routes__wrap">
        <h3 className="routes__title">Saved Routes</h3>
      </div>
      {!routes && (
        <div>
          <p className="routes__message">No saved route</p>
          <Lottie className="routes__image" animationData={emptyBox} />
        </div>
      )}

      {routes && (
        <Grid container className="routes__card">
          {routes.map((route, index) => (
            <Grid item key={index} xs={12}>
              <Card elevation={3} id={`route-${routes.id}`}>
                <CardContent className="routes__content" key={index}>
                  {editingId === route.id ? (
                    <input
                      type="text"
                      value={routeNames[route.id]}
                      onChange={(e) =>
                        handleNameChange(route.id, e.target.value)
                      }
                      autoFocus
                      onBlur={handleBlur}
                      onKeyDown={(e) => handleKeyDown(e, route.id)}
                    />
                  ) : (
                    <h3>{routeNames[route.id]}</h3>
                  )}
                  <div className="routes__icons">
                    <Pencil
                      onClick={() => handleEditClick(route.id)}
                      className="routes__edit"
                    />
                    <Trash2 />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Modal>
  );
}

export default SavedRoutes;
