import React, { useState, useCallback, useEffect } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Amplify, API } from "aws-amplify";
import awsconfig from "../../aws-exports";
import "bootstrap/dist/css/bootstrap.min.css";
import Label from "../../components/labels/Label";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";

Amplify.configure(awsconfig);

const InventoryUpdatePage = ({ data, close }) => {
  const [formData, setFormData] = useState({
    code: "",
    itemName: "",
    quantity: "",
    remarks: "",
    photo: "",
  });
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      setFormData({
        code: data.code.S,
        itemName: data.itemName.S,
        quantity: data.quantity.N,
        remarks: data.remarks.S,
        photo: data.photo.S,
      });
      setIsLoading(false);
    }
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prevData) => ({
        ...prevData,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleUpdate = async (code) => {
    MySwal.fire({
      title: "Do you want to Update Inventory Item?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const requiredFields = [
            "code",
            "itemName",
            "quantity",
            "remarks",
            "photos",
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

          const updatedInventoryData = {
            code: formData.code,
            itemName: formData.itemName,
            quantity: formData.quantity,
            remarks: formData.remarks,
            photo: formData.photo,
          };

          const result = await API.put("PetApi", `/items/${code}`, {
            body: updatedInventoryData,
          });
          if (result !== null) {
            setSuccessMessage("Inventory Item Updated successfully!");
            setErrorMessage("");
            close();
          }
        } catch (error) {
          console.error("Error updating inventory item:", error);
          setErrorMessage(result.error);
        }
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      {!isLoading && (
        <Card>
          <div className="row px-3 pt-2 justify-content-between align-items-center">
            <Card.Body>
              <Form>
                <div className="row">
                  <Form.Group className="col-6" controlId="code">
                    <Label value={"Item Code"} required></Label>
                    <Form.Control
                      type="text"
                      name="code"
                      placeholder="Enter Item Code"
                      disabled
                      value={formData.code}
                      onChange={(e) => handleInputChange(e)}
                      className={
                        emptyFields.includes("code") ? "empty-field" : ""
                      }
                    />
                  </Form.Group>

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
                </div>
                <div className="row">
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
                </div>
                <div className="row">
                  <Form.Group className="col-6" controlId="photo">
                    <Label value={"Photo (Upload Image)"} required></Label>
                    <fieldset className="custom-form">
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>
                          Drag 'n' drop an image here, or click to select a file
                        </p>
                      </div>
                    </fieldset>
                    {formData.photo && (
                      <div>
                        <h5>Uploaded Photo:</h5>
                        <div className="m-2">
                          <img
                            src={formData.photo}
                            alt="Inventory Item Photo"
                            width="100"
                          />
                        </div>
                      </div>
                    )}
                  </Form.Group>
                </div>

                {/* Success Alert */}
                {successMessage && (
                  <Alert
                    variant="success"
                    onClose={() => setSuccessMessage("")}
                    dismissible
                  >
                    {successMessage}
                  </Alert>
                )}

                {/* Error Alert */}
                {errorMessage && (
                  <Alert
                    variant="danger"
                    onClose={() => setErrorMessage("")}
                    dismissible
                  >
                    {errorMessage}
                  </Alert>
                )}

                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdate(formData.code);
                  }}
                >
                  Update
                </Button>
              </Form>
            </Card.Body>
          </div>
        </Card>
      )}
    </>
  );
};

export default InventoryUpdatePage;
