import React, { useState } from 'react';
import { timeZones, samOverview } from '../utils/constant';
import { useAtomValue } from 'jotai';
import { userDataAtom, usersDataAtom } from '../utils/atom';

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  timezone: string;
  location: string;
}

const ProfileForm: React.FC = () => {
  const user = useAtomValue(userDataAtom);
  const users = useAtomValue(usersDataAtom);
  const [overview, setOverview] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    timezone: '',
    location: ''
  });

  const genOverview = async () => {
    // try {
    const response = await fetch('http://localhost:5001/api/ai_overview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dayDetails: {
          YearPillar: "Yin Metal Rooster",
          MonthPillar: "Yang Fire Rooster",
          DayPillar: "Yin Earth Snake",
          HourPillar: "Yin Fire Rooster"
        },
        aiProvider: "OpenAI"
      }),
    });
    // if (!response.ok) {
      // throw new Error('Network response was not ok');
    // }
    // const result = await response.json();
    setOverview(samOverview);

    // } catch (error) {
    // console.error('Error:', error);
    // }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const NatalBazi = (user: string) => {
    const userData = users.find((value) => value.id == user);
    return userData;
  }

  return (
    <div className="min-h-[100%] bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
      <div className="max-w-md mx-auto">
        {NatalBazi(user) && <>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {NatalBazi(user).name}'s Profile
          </h2>
          <form className="space-y-6">
            {/* Birth Date Input */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Birth Date : {NatalBazi(user).birth_date}
              </label>
            </div>
            {/* Birth Time Input */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Birth Time : {NatalBazi(user).birth_time}
              </label>
            </div>
            {/* Timezone Select */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Timezone : {NatalBazi(user).timezone}
              </label>
            </div>
            {/* Birth Location Input */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Birth Location : {NatalBazi(user).location}
              </label>
            </div>
            <h2 className="text-xl font-bold mb-6 text-left text-gray-800">
              - Natal Bazi Chart
            </h2>
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Year Pillar : {NatalBazi(user).year_pillar_stem + " " + NatalBazi(user).year_pillar_branch}
              </label>
            </div>
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Month Pillar : {NatalBazi(user).month_pillar_stem + " " + NatalBazi(user).month_pillar_branch}
              </label>
            </div>
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Day Pillar : {NatalBazi(user).day_pillar_stem + " " + NatalBazi(user).day_pillar_branch}
              </label>
            </div>
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Hour Pillar : {NatalBazi(user).hour_pillar_stem + " " + NatalBazi(user).hour_pillar_branch}
              </label>
            </div>

          </form>
          <button
            onClick={() => {
              genOverview()
            }}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            Get Profile Overview
          </button>
          <label className="mt-2 block text-md font-medium text-gray-700">
            {overview}
          </label>
        </>}
      </div>
    </div>
  );
};

export default ProfileForm;