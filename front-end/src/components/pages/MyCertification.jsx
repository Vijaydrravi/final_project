import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyCertification = () => {
    const [certificates, setCertificates] = useState([]);
    const [error, setError] = useState(null);
    
    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/certifications/my-certificates/${userId}`);
                console.log(response.data); // Log the entire response to check structure
                const certifiedCertificates = response.data.filter(cert => cert.is_certified);
                setCertificates(certifiedCertificates);
            } catch (err) {
                setError('Failed to fetch certificates');
                console.error(err);
            }
        };

        if (userId) {
            fetchCertificates();
        }
    }, [userId]);

    const handleViewCertificate = (image) => {
        console.log('Image data:', image); // Log the image data
        console.log('Type of image:', typeof image); // Log the type of image

        if (!image) {
            console.error('No image data provided');
            return;
        }

        // Convert Buffer to Base64 string if image is an object
        let imgSrc;
        if (image && typeof image === 'object' && image.type === 'Buffer') {
            imgSrc = `data:image/png;base64,${arrayBufferToBase64(image.data)}`;
        } else if (typeof image === 'string') {
            // Ensure it starts with the correct data URL prefix
            imgSrc = image.startsWith('data:image/png;base64,') ? image : `data:image/png;base64,${image}`;
        } else {
            console.error('Invalid image format:', image);
            return;
        }

        openImageInNewWindow(imgSrc);
    };

    const arrayBufferToBase64 = (buffer) => {
        // Convert the ArrayBuffer to Base64
        return btoa(
            new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    };

    const openImageInNewWindow = (imgSrc) => {
        const newWindow = window.open("", "_blank");
        newWindow.document.write(`
            <html>
                <head>
                    <title>Certificate</title>
                    <style>
                        body {
                            display: flex;
                            justify-content: center; /* Center horizontally */
                            align-items: center; /* Center vertically */
                            height: 100vh; /* Full viewport height */
                            margin: 0; /* Remove default margin */
                            background-color: #f0f0f0; /* Optional background color */
                        }
                        img {
                            max-width: 90%; /* Adjust max width as needed */
                            height: auto; /* Maintain aspect ratio */
                            border: 5px solid #4B0082; /* Optional border around the image */
                            border-radius: 10px; /* Optional rounded corners */
                        }
                    </style>
                </head>
                <body>
                    <img src="${imgSrc}" alt="Certificate"/>
                </body>
            </html>
        `);
        newWindow.document.close(); // Close the document to render the content
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="overflow-x-auto mt-4">
            <h2 className='text-2xl text-center mt-10'>My Certifications</h2>
            <table className="min-w-full table-auto bg-white border border-gray-200 shadow-md rounded-lg mt-10">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Course Title</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.length > 0 ? (
                        certificates.map((cert, index) => (
                            <tr
                                key={cert.assignment_id}
                                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                            >
                                <td className="py-4 px-6 text-sm font-medium text-gray-700 ">
                                    {cert.courseAssignment.course.title}
                                </td>
                                <td className="py-4 px-6 text-sm font-medium ">
                                    <button 
                                        className="text-green-600 hover:text-green-800 font-semibold"
                                        onClick={() => handleViewCertificate(cert.image)}
                                    >
                                        View Certificate
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="py-4 px-6 text-center text-sm text-gray-500">
                                No certificates available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyCertification;


// import React from 'react'

// const MyCertification = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default MyCertification
