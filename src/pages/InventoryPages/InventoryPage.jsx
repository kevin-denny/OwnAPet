import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  Card,
  Button,
  Alert,
  Table,
  Spinner,
  Col,
} from "react-bootstrap";
import { Amplify, API } from "aws-amplify";

import awsconfig from "../../aws-exports";
import "bootstrap/dist/css/bootstrap.min.css";
import Label from "../../components/labels/Label";
import { useDropzone } from "react-dropzone";
import InventoryUpdatePage from "./InventoryUpdatePage.";
import CommonModal from "../../components/modals/Modal";

Amplify.configure(awsconfig);

const initialFormData = {
  itemName: "",
  quantity: "",
  remarks: "",
  photo: "",
};

const InventoryForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [emptyFields, setEmptyFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inventoryData, setInventoryData] = useState([]); // To store inventory data
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch inventory data from the API
  const getData = async () => {
    try {
      const response = await API.get("PetApi", "/items");
      setInventoryData(response.data.Items);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  /**
   * @showUpdateModal to open Update modal and send Data when update a record
   */
  const [showUpdateModal, setShowUpdateModal] = useState({
    show: false,
    data: {},
  });

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["itemName", "quantity", "remarks"];

    // Check for empty fields
    const emptyFieldsArray = requiredFields.filter(
      (field) => formData[field] === ""
    );

    setEmptyFields(emptyFieldsArray);

    if (emptyFieldsArray.length > 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    // Prepare the request data
    const requestData = {
      itemName: formData.itemName,
      quantity: parseInt(formData.quantity),
      remarks: formData.remarks,
      photo: formData.photo,
    };

    try {
      await API.post("PetApi", "/items", {
        body: requestData,
      });

      setFormData(initialFormData);
      setEmptyFields([]);
      setSuccessMessage("Inventory item added successfully!");

      // Fetch updated inventory data
      getData();
    } catch (error) {
      console.error("Error creating inventory item:", error);
      setErrorMessage("Error creating inventory item. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = (data) => {
    setShowUpdateModal({ show: true, data: data });
  };

  const handleDelete = async (code) => {
    try {
      await API.del("PetApi", `/items/${code}`);
      getData();

      setSuccessMessage("Inventory item deleted successfully!");
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      setErrorMessage("Error deleting inventory item. Please try again.");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          photo: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const sendEmail = async () => {
    try {
      await API.post("PetApi", "/items/report");
      setSuccessMessage("Report sent successfully! Check your email");
    } catch (error) {
      console.error("Error sending test email:", error);
      setErrorMessage("Error sending test email. Please try again.");
    }
  };

  return (
    <>
      <Card>
        <div className="row px-3 pt-2 justify-content-between align-items-center">
          <div className="col-4">
            <Card.Title>Add an Inventory Item</Card.Title>
          </div>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="col-6" controlId="itemName">
                <Label value={"Item Name"} required></Label>
                <Form.Control
                  type="text"
                  name="itemName"
                  placeholder="Enter Item Name"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange(e)}
                  className={
                    emptyFields.includes("itemName") ? "empty-field" : ""
                  }
                />
              </Form.Group>

              <Form.Group className="col-6" controlId="quantity">
                <Label value={"Quantity"} required></Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  placeholder="Enter Quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange(e)}
                  className={
                    emptyFields.includes("quantity") ? "empty-field" : ""
                  }
                />
              </Form.Group>

              <Form.Group className="col-6" controlId="remarks">
                <Label value={"Remarks"} required></Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="remarks"
                  placeholder="Enter Remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange(e)}
                  className={
                    emptyFields.includes("remarks") ? "empty-field" : ""
                  }
                />
              </Form.Group>
              <Form.Group className="col-6" controlId="photo">
                <Label value={"Photo (Upload Image)"} required></Label>
                <fieldset className="custom-form">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop a file here, or click to select a file</p>
                  </div>
                </fieldset>
                {formData.photo && (
                  <div>
                    <h5>Uploaded Photo:</h5>
                    <div className="d-flex">
                      <div className="m-2">
                        <img
                          src={formData.photo}
                          alt="Item Photo"
                          width="100"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Form.Group>

              <br></br>
              <Button variant="primary" type="submit">
                Add
              </Button>
              <Button
                variant="secondary"
                type="reset"
                className="m-2"
                onClick={() => setFormData(initialFormData)}
              >
                Reset
              </Button>
              <Button variant="primary" type="button" onClick={sendEmail}>
                Generate Report
              </Button>
            </Form>
            <br></br>
            {/* Success Alert */}
            {successMessage && !errorMessage && (
              <Alert
                variant="success"
                onClose={() => setSuccessMessage("")}
                dismissible
              >
                {successMessage}
              </Alert>
            )}

            {/* Error Alert */}
            {errorMessage && !successMessage && (
              <Alert
                variant="danger"
                onClose={() => setErrorMessage("")}
                dismissible
              >
                {errorMessage}
              </Alert>
            )}
            {isLoading ? (
              <Col xs={12} className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading...</p>
              </Col>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Remarks</th>
                    <th>Photo</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.code.S}</td>
                      <td>{item.itemName.S}</td>
                      <td>{item.quantity.N}</td>
                      <td>{item.remarks.S}</td>
                      <td>
                        <img src={item.photo.S} alt="Item Photo" width="100" />
                      </td>
                      <td>
                        <Button
                          className="m-2"
                          variant="primary"
                          onClick={() => handleUpdate(item)}
                        >
                          Update
                        </Button>
                        <Button
                          className="m-2"
                          variant="danger"
                          onClick={() => handleDelete(item.code.S)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </div>
      </Card>
      <CommonModal
        size="xl"
        showModal={showUpdateModal.show}
        onClose={() => {
          getData();
          setIsLoading(true);
        }}
        handleClose={() => {
          setShowUpdateModal({
            show: false,
            data: {},
          });
        }}
        title="Update Inventory Items"
      >
        <InventoryUpdatePage
          data={showUpdateModal.data}
          close={() => {
            setShowUpdateModal({
              show: false,
              data: {},
            });
            getData();
          }}
        />
      </CommonModal>
    </>
  );
};

export default InventoryForm;
