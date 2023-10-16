import React, { useState } from "react";
import { Amplify, Auth } from "aws-amplify";
import awsconfig from "../aws-exports";
import { Nav, Tab, Navbar } from "react-bootstrap";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { IconButton, Tooltip } from "@mui/material";
import { ExitToAppOutlined, HomeOutlined } from "@mui/icons-material";
import InventoryForm from "./InventoryPages/InventoryPage";
import { useNavigate } from "react-router-dom";
import PetForm from "./PetPages/PetAddPage";
Amplify.configure(awsconfig);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const navigate = useNavigate();

  const tabClick = (eventKey) => {
    setActiveTab(eventKey);
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <div className="d-flex align-items-center justify-content-between w-100 m-3">
          <Navbar.Brand>Admin Page</Navbar.Brand>
          <div>
            <Tooltip title="Home">
              <IconButton aria-label="home" onClick={() => navigate("/")}>
                <HomeOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton aria-label="delete" onClick={signOut}>
                <ExitToAppOutlined />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Navbar>

      <Tab.Container activeKey={activeTab}>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="tab1" onClick={() => tabClick("tab1")}>
              Pet
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="tab2" onClick={() => tabClick("tab2")}>
              Inventory
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="tab1">
            <br></br>
            <PetForm />
          </Tab.Pane>
          <Tab.Pane eventKey="tab2">
            <br></br>
            <InventoryForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default withAuthenticator(AdminPage);
