import React from "react";
import { Navbar } from "react-bootstrap";
import {
  ExitToAppOutlined,
  HomeOutlined,
  InfoOutlined,
  StoreMallDirectoryOutlined,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./NavBar.scss";

const CommonNavbar = ({ title, handleLoginClick }) => {
  const navigate = useNavigate();
  return (
    <Navbar expand="lg" className="navbar-container">
      <div className="d-flex align-items-center justify-content-between w-100 m-3">
        <div className="col-8">
          <Navbar.Brand>{title}</Navbar.Brand>
        </div>
        <div className="d-flex align-items-center col-2">
          <Tooltip title="Home">
            <IconButton aria-label="home" onClick={() => navigate("/")}>
              <HomeOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Information">
            <IconButton aria-label="info" onClick={() => navigate("/info")}>
              <InfoOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Store">
            <IconButton aria-label="store" onClick={() => navigate("/view")}>
              <StoreMallDirectoryOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Login">
            <IconButton aria-label="delete" onClick={handleLoginClick}>
              <ExitToAppOutlined />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Navbar>
  );
};

export default CommonNavbar;
