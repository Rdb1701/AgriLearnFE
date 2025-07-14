import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../utils/axios-client";
import swal from "sweetalert";
import StudentsHeader from "../../components/Instructor/Students/StudentsHeader";
import StudentsTable from "../../components/Instructor/Students/StudentsTable";
import FormModal from "../../components/Instructor/Students/FormModal";
import { useParams } from "react-router-dom";

export default function Students() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [isEditting, setIsEditting] = useState(null);

  const closeRef = useRef();
  const onEditRef = useRef();

  //fetch users
  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/users?page=${page}`);
      setData(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
      });
    } catch (error) {
      console.log("Error fetching Users: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //ADDING AND UPDATING DATA USERS
  const handleAddSubmit = async (payload) => {
    console.log(payload.id);
    try {
      //IF NO USER ID ADD THE USER
      if (payload.id === "") {
        const response = await axiosClient.post("/users", payload);
        closeRef.current.click();
        fetchUsers(pagination.current_page);
        swal("Successfully Added!", "", "success");
      } else {
        //IF THERE IS USER UPDATE THE USER
        console.log("naa ni id");

        const response = await axiosClient.put(`/users/${payload.id}`, payload);
        closeRef.current.click();
        fetchUsers(pagination.current_page);
        swal("Successfully Updated!", "", "success");
      }
    } catch (error) {
      console.log("Error Adding Data: ", error);
      if (error.response) {
        return error.response.data.errors;
      }
    }
  };

  //Handling Edit
  const handleEdit = (user) => {
    if (user) {
      setIsEditting(user);
      onEditRef.current.click();
    }
  };
  //Handling Delete
  const handleDelete = async (user) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure you want to delete this user? All data associated with this user will also be deleted.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (willDelete) {
      const response = await axiosClient.delete(`/users/${user.id}`);

      // Check if current page becomes empty after deletion
      const remainingItemsOnPage = data.length - 1;
      let pageToFetch = pagination.current_page;
      
      // If this was the last item on the page and we're not on page 1, go to previous page
      if (remainingItemsOnPage === 0 && pagination.current_page > 1) {
        pageToFetch = pagination.current_page - 1;
      }
      
      fetchUsers(pageToFetch);

      await swal(
        "Deleted!",
        "The user and associated information have been deleted.",
        "success"
      );
    } else {
      console.log("Deletion cancelled for user:", user);
    }
  };

  return (
    <>
      <FormModal
        onSubmit={handleAddSubmit}
        closeRef={closeRef}
        editingUser={isEditting}
      />
      <div className="container-fluid px-4 py-4">
        <StudentsHeader onEditRef={onEditRef} />
        <StudentsTable
          data={data}
          isLoading={isLoading}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={fetchUsers}
        />
      </div>
    </>
  );
}
