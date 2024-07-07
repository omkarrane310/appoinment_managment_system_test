import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Get all users
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle user block/unblock
  const handleUserBlockStatus = async (record, isBlocked) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeUserBlockStatus",
        { userId: record._id, isBlocked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getUsers(); // Refresh the list after status change
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // AntD table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Proffesionals",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.isBlocked ? (
            <button
              className="btn btn-success"
              onClick={() => handleUserBlockStatus(record, false)}
            >
              Unblock
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => handleUserBlockStatus(record, true)}
            >
              Block
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2">Users List</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
};


export default Users;
