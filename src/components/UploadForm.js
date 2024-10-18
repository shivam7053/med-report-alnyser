// src/components/UploadForm.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
    const [file, setFile] = useState(null); // To store the uploaded file
    const [response, setResponse] = useState(null); // To store the server response
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(null); // To store any error

    // Handle file input change
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append('report', file);

        try {
            setLoading(true);
            setError(null);
            setResponse(null);

            // Post the image file to the backend
            const res = await axios.post('http://localhost:5000/upload-report', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Set the response received from the server
            setResponse(res.data);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-form">
            <h1>Upload Medical Report for Analysis</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit" disabled={loading || !file}>
                    {loading ? 'Uploading...' : 'Upload and Analyze'}
                </button>
            </form>

            {/* Display errors */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display response from server */}
            {response && (
                <div className="analysis-result">
                    <h3>Analysis Result:</h3>
                    <p><strong>Extracted Text:</strong> {response.extractedText}</p>
                    <h4>Feedback:</h4>
                    <ul>
                        {response.analysis.feedback.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadForm;
