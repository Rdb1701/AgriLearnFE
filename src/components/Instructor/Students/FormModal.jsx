import React, { useEffect, useRef, useState } from "react";
import TextInput from "../../TextInput";
import { useParams } from "react-router-dom";

export default function FormModal({ onSubmit, closeRef, editingUser }) {
  const [data, setData] = useState({
    id: "",
    id_number: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState(null);

  //saving the state of inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //pass this submit to props
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors(null);

    const responseErrors = await onSubmit(data);

    if (responseErrors) {
      setErrors(responseErrors);
    } else {
      setData({
        id_number: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    }
  };

  //If edit Button clicks
  useEffect(() => {
    if (editingUser) {
      setData({
        id: editingUser.id || "",
        id_number: editingUser.id_number || "",
        name: editingUser.name || "",
        email: editingUser.email || "",
        password: "",
        password_confirmation: "",
      });
    } else {
      setData({
        id: "",
        id_number: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [editingUser]);

  //clearing the data when clicking close button or X button
  const handleClose = () => {
    setData({
      id: "",
      id_number: "",
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
  };

  return (
    <>
      <div
        className="modal fade"
        id="add_modal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h3 className="modal-title w-100 dark-grey-text font-weight-bold">
                {data.id ? "Edit Student" : "Add New Student"}
              </h3>
              <button
                onClick={handleClose}
                type="button"
                className="close btn btn-sm btn-outline-secondary"
                data-bs-dismiss="modal"
                aria-label="close"
                ref={closeRef}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body mx-4">
                <TextInput
                  label="ID Number"
                  type="text"
                  name="id_number"
                  onChange={handleChange}
                  value={data.id_number}
                />
                {errors?.id_number && (
                  <div className="text-danger mt-1 small">
                    {errors.id_number[0]}
                  </div>
                )}
                <TextInput
                  label="Name"
                  type="name"
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                />
                {errors?.name && (
                  <div className="text-danger mt-1 small">{errors.name[0]}</div>
                )}
                <TextInput
                  label="Email"
                  type="text"
                  name="email"
                  onChange={handleChange}
                  value={data.email}
                />
                {errors?.email && (
                  <div className="text-danger mt-1 small">
                    {errors.email[0]}
                  </div>
                )}
                <TextInput
                  label="Password"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={data.password}
                />
                {errors?.password && (
                  <div className="text-danger mt-1 small">
                    {errors.password[0]}
                  </div>
                )}
                <TextInput
                  label="Password Confirmation"
                  type="password"
                  name="password_confirmation"
                  onChange={handleChange}
                  value={data.password_confirmation}
                />
              </div>
              <div className="text-center mt-3 pb-3">
                <button
                  type="submit"
                  className="btn btn-success btn-block z-depth-1a"
                  id="btn_add"
                >
                  {data.id ? "UPDATE" : "SUBMIT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
