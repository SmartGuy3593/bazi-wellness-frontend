import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userDataAtom, usersDataAtom } from '../utils/atom'; 


interface SidebarProps {
  onCreateProfile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateProfile }) => {
  const [user, setUser] = useAtom(userDataAtom);
  const [users, setUsers] = useAtom(usersDataAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/get_user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log("result=========", result);
        setUsers(result); // Update the state with the fetched users
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchUsers(); // Call the fetch function
  }, []);

  useEffect(() => {
    console.log("sdfsdf!!!");
  }, [users]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, id } = e.target;
    if (value !== "none") {
      setUser(value);
      navigate("/get-user");
    }
    console.log(value);

  };

  return (
    <div className="bg-gray-800 text-white w-64 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-center">Menu</h3>
      </div>
      <div className="flex-grow p-4">
        <button
          onClick={() => {
            onCreateProfile();
            setUser("none");
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
        >
          Create Profile
        </button>
        <button
          onClick={() => {
            navigate('/dailycalendar');
          }}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
        >
          View Daily Calendar
        </button>
        <label htmlFor="users" className="mt-4 block text-sm font-medium text-white">
          User Name
        </label>
        <select
          id="users"
          name="users"
          value={user}
          onChange={handleUserChange}
          required
          className="mt-1 text-black block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option key="none" value={"none"}>None</option>
          {users.map((user, index) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        
      </div>
      <div className="p-4 border-t border-gray-700 text-center text-gray-400">
        <p>© 2025 Bazi Development.</p>
        <p>All rights reserved.</p>
      </div>
    </div>
  );
};

export default Sidebar;