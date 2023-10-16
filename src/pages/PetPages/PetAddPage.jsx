import React, { useState, useCallback, useEffect } from "react";
import {
  Col,
  Form,
  Card,
  Button,
  Alert,
  Table,
  Spinner,
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { Amplify, API } from "aws-amplify";

import awsconfig from "../../aws-exports";
import "bootstrap/dist/css/bootstrap.min.css";
import Label from "../../components/labels/Label";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CommonModal from "../../components/modals/Modal";
import PetUpdatePage from "./PetUpdatePage";
import SearchFilter from "../../components/filter/SearchFilter";
Amplify.configure(awsconfig);

const initialFormData = {
  petName: "",
  color: "",
  characteristics: "",
  age: "",
  petPhoto: null,
  caringTips: "",
};

const PetForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [emptyFields, setEmptyFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [petsData, setPetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const MySwal = withReactContent(Swal);

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

  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await API.get("PetApi", "/pet");
      setPetsData(result.data.Items);
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting pets data:", error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          petPhoto: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "petName",
      "color",
      "characteristics",
      "age",
      "caringTips",
    ];

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
      id: formData.petCode,
      name: formData.petName,
      Color: formData.color,
      Characteristics: formData.characteristics,
      Age: parseInt(formData.age),
      PetPhoto: formData.petPhoto,
      CaringTips: formData.caringTips,
    };

    try {
      await API.post("PetApi", "/pet", {
        body: requestData,
      });
      setFormData(initialFormData);
      setEmptyFields([]);
      getData();
      setSuccessMessage("Pet added successfully!");
    } catch (error) {
      console.error("Error creating pet:", error);
      setErrorMessage("Error creating pet. Please try again.");
    }
  };

  const handleDelete = async (petId) => {
    MySwal.fire({
      title: "Do you want to Delete Pet?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.del("PetApi", `/pet/${petId}`);
          getData();
          setSuccessMessage("Pet deleted successfully");
        } catch (error) {
          console.error("Error deleting pet:", error);
          setErrorMessage("Error deleting pet. Please try again.");
        }
      }
    });
  };

  const handleUpdate = (data) => {
    setShowUpdateModal({ show: true, data: data });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: String(value),
    }));
  };

  return (
    <>
      <Card>
        <div className="row px-3 pt-2 justify-content-between align-items-center">
          <div className="col-4">
            <Card.Title>Add a Pet</Card.Title>
          </div>
          <Card.Body>
            <SearchFilter />
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <Form.Group className="col-6" controlId="petName">
                  <Label value={"Pet Breed"} required></Label>
                  <Form.Control
                    type="text"
                    name="petName"
                    placeholder="Enter Pet Breed"
                    value={formData.petName}
                    onChange={(e) => handleInputChange(e)}
                    className={
                      emptyFields.includes("petName") ? "empty-field" : ""
                    }
                  />
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group className="col-6" controlId="color">
                  <Label value={"Colour"} required></Label>
                  <Form.Control
                    type="text"
                    name="color"
                    placeholder="Enter Colour"
                    value={formData.color}
                    onChange={(e) => handleInputChange(e)}
                    className={
                      emptyFields.includes("color") ? "empty-field" : ""
                    }
                  />
                </Form.Group>

                <Form.Group className="col-6" controlId="characteristics">
                  <Label value={"Characteristics"} required></Label>
                  <Form.Control
                    type="text"
                    name="characteristics"
                    placeholder="Enter Characteristics"
                    value={formData.characteristics}
                    onChange={(e) => handleInputChange(e)}
                    className={
                      emptyFields.includes("characteristics")
                        ? "empty-field"
                        : ""
                    }
                  />
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group className="col-6" controlId="age">
                  <Label value={"Age"} required></Label>
                  <Form.Control
                    type="number"
                    name="age"
                    placeholder="Enter Age"
                    value={formData.age}
                    onChange={(e) => handleInputChange(e)}
                    className={emptyFields.includes("age") ? "empty-field" : ""}
                  />
                </Form.Group>

                <Form.Group className="col-6" controlId="caringTips">
                  <Label value={"Caring Tips"} required></Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="caringTips"
                    placeholder="Enter Caring Tips"
                    value={formData.caringTips}
                    onChange={(e) => handleInputChange(e)}
                    className={
                      emptyFields.includes("caringTips") ? "empty-field" : ""
                    }
                  />
                </Form.Group>
              </div>
              <Form.Group className="col-6" controlId="petPhotos">
                <Label value={"Pet Photo (Upload Image)"} required></Label>
                <fieldset className="custom-form">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop a file here, or click to select a file</p>
                  </div>
                </fieldset>
                {formData.petPhoto && (
                  <div>
                    <h5>Uploaded Photo:</h5>
                    <div className="d-flex">
                      <div className="m-2">
                        <img
                          src={formData.petPhoto}
                          alt="Pet Photo"
                          width="100"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Form.Group>

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
                    <th>ID</th>
                    <th>Breed</th>
                    <th>Picture</th>
                    <th>Age</th>
                    <th>Colour</th>
                    <th>Characteristics</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {petsData.map((pet, index) => (
                    <tr key={index}>
                      <td>{pet.id.S}</td>
                      <td>{pet.name.S}</td>
                      <td>
                        <img src={pet.PetPhoto.S} alt="Pet Photo" width="100" />
                      </td>
                      <td>{pet.Age.N}</td>
                      <td>{pet.Color.S}</td>
                      <td>{pet.Characteristics.S}</td>
                      <td>
                        <Button
                          className="m-2"
                          variant="primary"
                          onClick={() => handleUpdate(pet)}
                        >
                          Update
                        </Button>
                        <Button
                          className="m-2"
                          variant="danger"
                          onClick={() => handleDelete(pet.id.S)}
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
        title="Update Pet Details"
      >
        <PetUpdatePage
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

export default PetForm;
