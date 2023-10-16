import React, { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CommonNavbar from "../../components/navbar/NavBar";
import PetViewPage from "./PetViewPage";
import InventoryViewPage from "./InventoryViewPage";

const StoreViewPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab1");

  const handleLoginClick = () => {
    navigate("/admin");
  };

  const tabClick = (eventKey) => {
    setActiveTab(eventKey);
  };

  return (
    <>
      <CommonNavbar title="Store" handleLoginClick={handleLoginClick} />
      <Tab.Container activeKey={activeTab}>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="tab1" onClick={() => tabClick("tab1")}>
              Pets
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
            <PetViewPage />
          </Tab.Pane>
          <Tab.Pane eventKey="tab2">
            <br></br>
            <InventoryViewPage />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default StoreViewPage;
