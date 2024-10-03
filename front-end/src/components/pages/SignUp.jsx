import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

const engineers = [
  "Software Engineer",
  "Front-end Engineer",
  "Back-end Engineer",
  "Full-stack Engineer",
  "DevOps Engineer",
  "QA Engineer",
  "Mobile App Engineer",
  "Cloud Engineer",
  "Security Engineer",
  "Network Engineer",
  "Data Engineer",
];

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, designation, name }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Sign up successful! Redirecting to login...', {
          position: "top-right",
          autoClose: 3000,  // Display for 3 seconds
        });
        setTimeout(() => {
          navigate('/login');  // Redirect to login after 3 seconds
        }, 3000);
      } else {
        toast.error(data.error || 'Signup failed. Please try again.', {
          position: "top-right",
          autoClose: 5000,  // Display for 5 seconds
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
        position: "top-right",
        autoClose: 5000,  // Display for 5 seconds
      });
    }
  };

  return (
    <div className="flex font-poppins items-center justify-center dark:bg-gray-900 min-w-screen min-h-screen">
      <div className="grid gap-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4">
          <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="pt-8 pb-6 font-bold text-5xl dark:text-gray-400 text-center cursor-default">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 dark:text-gray-400 text-lg">Name</label>
                <input
                  id="name"
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 dark:text-gray-400 text-lg">Email</label>
                <input
                  id="email"
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 dark:text-gray-400 text-lg">Password</label>
                <input
                  id="password"
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="designation" className="mb-2 dark:text-gray-400 text-lg">Designation</label>
                <select
                  id="designation"
                  className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                >
                  <option value="" disabled>Select designation</option>
                  {engineers.map((engineer, index) => (
                    <option key={index} value={engineer}>
                      {engineer}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                type="submit"
              >
                SIGN UP
              </button>
            </form>

            <div className="flex flex-col mt-4 items-center justify-center text-sm">
              <h3>
                <span className="cursor-default dark:text-gray-300">Already have an account?</span>
                <button
                  onClick={() => navigate('/login')}
                  className="group text-blue-400 transition-all duration-100 ease-in-out ml-1"
                >
                  <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Login
                  </span>
                </button>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
