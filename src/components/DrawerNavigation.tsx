import React, { useState } from "react";
import { Drawer, Button, Box } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { Link, useNavigate } from "react-router-dom";

const DrawerNavigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, padding: "20px", backgroundColor: "#333", height: "100%", color: "white" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <div className="navigation-container__elements">
        <div className="login-component__heading-icon-container">
          <h2>Pawtners</h2>
          <PetsIcon className="login-component__heading-icon-container__paw-icon" sx={{ color: "#FBA919", height: "30px", width: "30px" }} />
        </div>
        <div className="navigation-container__elements-links">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <a>Feed</a>
          </Link>
          <Link to="/favorites" style={{ textDecoration: "none", color: "white" }}>
            <a>Favorites</a>
          </Link>
        </div>
      </div>
      <Button
        type="button"
        fullWidth
        variant="contained"
        className="login-component__login-card__button"
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: "#FFA900",
          color: "black",
          fontFamily: '"Bree Serif", serif',
          "&:hover": {
            backgroundColor: "#FF5733",
            color: "white",
          },
        }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </Box>
  );

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          top: "16px",
          left: "16px",
          backgroundColor: "#FBA919",
          color: "black",
          fontSize: "24px",
          padding: "10px",
          borderRadius: "50%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "#FF5733",
            color: "white",
          },
        }}
      >
        ☰
      </Button>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default DrawerNavigation;
