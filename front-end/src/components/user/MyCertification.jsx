import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyCertification = () => {
    const [certificates, setCertificates] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [certificatesPerPage] = useState(8); // Number of certificates per page

    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/certifications/my-certificates/${userId}`);
                console.log(response.data); // Log the entire response to check structure

                setCertificates(response.data.data); // Access the 'data' field
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

        let imgSrc;
        if (image && typeof image === 'object' && image.type === 'Buffer') {
            imgSrc = `data:image/png;base64,${arrayBufferToBase64(image.data)}`;
        } else if (typeof image === 'string') {
            imgSrc = image.startsWith('data:image/png;base64,') ? image : `data:image/png;base64,${image}`;
        } else {
            console.error('Invalid image format:', image);
            return;
        }

        openImageInNewWindow(imgSrc);
    };

    const arrayBufferToBase64 = (buffer) => {
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
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f0f0f0;
                        }
                        img {
                            max-width: 90%;
                            height: auto;
                            border: 5px solid #4B0082;
                            border-radius: 10px;
                        }
                    </style>
                </head>
                <body>
                    <img src="${imgSrc}" alt="Certificate"/>
                </body>
            </html>
        `);
        newWindow.document.close();
    };

    // Pagination logic
    const indexOfLastCert = currentPage * certificatesPerPage;
    const indexOfFirstCert = indexOfLastCert - certificatesPerPage;
    const currentCertificates = certificates.slice(indexOfFirstCert, indexOfLastCert);
    const totalPages = Math.ceil(certificates.length / certificatesPerPage);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="overflow-x-auto mt-4">
            <h2 className='text-2xl text-center mt-5 font-bold'>My Certifications</h2>
            <table className="min-w-full table-auto bg-white border border-gray-200 shadow-md rounded-lg mt-5">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Course Title</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCertificates.length > 0 ? (
                        currentCertificates.map((cert, index) => (
                            <tr
                                key={cert.assignment_id}
                                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                            >
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MyCertification;
