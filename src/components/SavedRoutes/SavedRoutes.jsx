import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import "./SavedRoutes.scss";
import close from "../../assets/icons/close.svg";
import { Card, CardContent, Grid } from "@mui/material";
import axios from "axios";
import emptyBox from "../../assets/images/empty-box.json";
import Lottie from "lottie-react";
import { Trash2, Pencil } from "lucide-react";
import { RoutesContext } from "../../contexts/RoutesContext";
import { motion, AnimatePresence } from "framer-motion";
import { Route } from "lucide-react";

function SavedRoutes({ modalIsOpen, handleCloseModal }) {
  const { routes, setRoutes } = useContext(RoutesContext);
  const [editingId, setEditingId] = useState(null);
  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleDeleteClick = async (id) => {
    try {
      setRoutes((prevRoutes) => prevRoutes.filter((route) => route.id !== id));
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/route/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameChange = (id, newName) => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) =>
        route.id === id ? { ...route, name: newName } : route
      )
    );
  };

  const handleSaveName = async (id) => {
    if (id) {
      try {
        const { name } = routes.find((route) => route.id === id);
        const updatedName = { name: name };
        await axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/route/${id}`,
          updatedName
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleBlur = (id) => {
    setEditingId(null);
    handleSaveName(id);
  };

  const handleKeyDown = async (e, id) => {
    if (e.key === "Enter") {
      handleBlur();
      handleSaveName(id);
    }
  };

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
        <span>
          <Route color="#dc241f" />
        </span>
      </div>
      {!routes && (
        <div>
          <p className="routes__message">No saved route</p>
          <Lottie className="routes__image" animationData={emptyBox} />
        </div>
      )}

      {routes && (
        <Grid container className="routes__card" spacing={2}>
          <AnimatePresence>
            {routes.map((route, index) => (
              <Grid item key={route.id} xs={12}>
                <Card
                  elevation={3}
                  id={`route-${routes.id}`}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? "rgb(3,155,229,0.65)"
                        : "rgb(118,208,189,0.65)",
                    opacity: 1,
                  }}
                  component={motion.div}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  exit={{
                    x: -300,
                    opacity: 0,
                    backgroundColor: "rgba(255, 0, 0, 0.8)",
                  }}
                >
                  <CardContent className="routes__content" key={index}>
                    {editingId === route.id ? (
                      <input
                        type="text"
                        value={route.name || `Untitled-${route.id}`}
                        onChange={(e) =>
                          handleNameChange(route.id, e.target.value)
                        }
                        autoFocus
                        onBlur={() => handleBlur(route.id)}
                        onKeyDown={(e) => handleKeyDown(e, route.id)}
                        className="routes__input"
                      />
                    ) : (
                      <h3 className="routes__name">
                        {route.name || `Untitled-${route.id}`}
                      </h3>
                    )}
                    <div className="routes__icons">
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="routes__edit"
                        onClick={() => handleEditClick(route.id)}
                      >
                        <Pencil />
                      </motion.div>

                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="routes__delete"
                        onClick={() => handleDeleteClick(route.id)}
                      >
                        <Trash2 />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}
    </Modal>
  );
}

export default SavedRoutes;
