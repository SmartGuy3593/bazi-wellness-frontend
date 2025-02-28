import React, { useState } from 'react';
import { timeZones } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { userDataAtom, usersDataAtom } from '../utils/atom';

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  timezone: string;
  location: string;
}

const ProfileForm: React.FC = () => {
  const setUser = useSetAtom(userDataAtom);
  const setUsers = useSetAtom(usersDataAtom);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    timezone: '',
    location: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5001/api/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
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
      setUsers(result);
      console.log(result[result.length - 1]);
      setUser(result[result.length - 1].id);

    } catch (error) {
      console.error('Error:', error);
    }
    navigate('/get-user');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-[100%] bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
      <div className="max-w-md mx-auto ">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Birth Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Birth Date Input */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              required
              value={formData.birthDate}
              onChange={handleChange}
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Birth Time Input */}
          <div>
            <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700">
              Birth Time
            </label>
            <input
              type="time"
              id="birthTime"
              name="birthTime"
              required
              value={formData.birthTime}
              onChange={handleChange}
              step="1"
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Timezone Select */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              required
              value={formData.timezone}
              onChange={handleChange}
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {timeZones.map((tz, i) => (
                <option key={tz + i} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          {/* Birth Location Input */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Birth Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;