import React, { useState } from 'react';
import { toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ApplyForService.css';

const CustomerApplyForService = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    residentialWasteType: '',
    recyclingService: '',
    hazardWasteDetails: '',
  });

  // State to track if the form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.serviceType) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.serviceType === 'Residential Waste' && !formData.residentialWasteType) {
      toast.error('Please select a residential waste type.');
      return;
    }

    if (formData.serviceType === 'Recycling' && !formData.recyclingService) {
      toast.error('Please select a recycling service.');
      return;
    }

    if (formData.serviceType === 'Hazard Waste Disposal' && !formData.hazardWasteDetails) {
      toast.error('Please provide details for hazardous waste disposal.');
      return;
    }

    setIsSubmitting(true);

    // Simulate a form submission (e.g., calling an API)
    setTimeout(() => {
      toast.success('Your service application has been submitted successfully!');
      setFormData({
        name: '',
        email: '',
        serviceType: '',
        residentialWasteType: '',
        recyclingService: '',
        hazardWasteDetails: '',
      });
      setIsSubmitting(false);
    }, 2000); // Simulating a 2-second delay for the request
  };

  return (
    <div className="customer-apply-for-service">
      <h2>Apply for a Service</h2>

      <form onSubmit={handleSubmit} className="apply-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="serviceType">Service Type</label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            <option value="Residential Waste">Residential Waste</option>
            <option value="Recycling">Recycling</option>
            <option value="Hazard Waste Disposal">Hazard Waste Disposal</option>
          </select>
        </div>

        {/* Residential Waste Options */}
        {formData.serviceType === 'Residential Waste' && (
          <div className="form-group">
            <label htmlFor="residentialWasteType">Residential Waste Type</label>
            <select
              id="residentialWasteType"
              name="residentialWasteType"
              value={formData.residentialWasteType}
              onChange={handleChange}
              required
            >
              <option value="">Select a waste type</option>
              <option value="General Trash">General Trash</option>
              <option value="Organic Waste">Organic Waste</option>
              <option value="E-waste">E-waste</option>
              <option value="Construction Waste">Construction Waste</option>
            </select>
          </div>
        )}

        {/* Recycling Service Options */}
        {formData.serviceType === 'Recycling' && (
          <div className="form-group">
            <label htmlFor="recyclingService">Recycling Service</label>
            <select
              id="recyclingService"
              name="recyclingService"
              value={formData.recyclingService}
              onChange={handleChange}
              required
            >
              <option value="">Select a recycling service</option>
              <option value="Paper Recycling">Paper Recycling</option>
              <option value="Plastic Recycling">Plastic Recycling</option>
              <option value="Metal Recycling">Metal Recycling</option>
              <option value="Glass Recycling">Glass Recycling</option>
            </select>
          </div>
        )}

        {/* Hazard Waste Disposal Details */}
        {formData.serviceType === 'Hazard Waste Disposal' && (
          <div className="form-group">
            <label htmlFor="hazardWasteDetails">Hazardous Waste Details</label>
            <textarea
              id="hazardWasteDetails"
              name="hazardWasteDetails"
              value={formData.hazardWasteDetails}
              onChange={handleChange}
              required
              placeholder="Describe the hazardous waste you need disposed of."
              rows="4"
            />
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default CustomerApplyForService;
