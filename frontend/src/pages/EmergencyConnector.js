import React, { useState } from 'react';
import Navbar2 from "../components/Navbar/Navbar2";
import Navbar1 from "../components/Navbar/Navbar";
import { useAuth } from "../utils/AuthContext";

const emergencyServices = [
  { name: 'Police', phone: '911' },
  { name: 'Fire Department', phone: '911' },
  { name: 'Ambulance', phone: '911' },
  { name: 'Suwasariya', phone: '1990' },
  { name: 'Poison Control', phone: '1-800-222-1222' },
  { name: 'Tourist Information', phone: '1-800-123-4567' },
  { name: 'Roadside Assistance', phone: '1-800-123-4568' },
  { name: 'Embassy', phone: '1-800-123-4569' },
  { name: 'Lost and Found', phone: '1-800-123-4570' },
  { name: 'Weather Emergency', phone: '1-800-123-4571' },
  { name: 'Hospital', phone: '1-800-123-4572' },
  { name: 'Pharmacy', phone: '1-800-123-4573' },
  { name: 'Travel Insurance', phone: '1-800-123-4574' },
  { name: 'Translation Services', phone: '1-800-123-4575' },
  { name: 'Mental Health Helpline', phone: '1-800-123-4576' },
  { name: 'Accommodation Helpline', phone: '1-800-123-4577' },
  { name: 'Transportation Services', phone: '1-800-123-4578' },
];

const EmergencyConnector = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isRinging, setIsRinging] = useState(false);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleCall = () => {
    if (selectedService) {
      setIsRinging(true);
      setTimeout(() => {
        window.location.href = `tel:${selectedService.phone}`;
        setIsRinging(false);
      }, 2000); // Simulate ringing for 2 seconds
    }
  };
  const { isAuthenticated } = useAuth();
  return (
    <div style={{paddingTop:'120px'}}>
    <div className="container mt-4">
      {isAuthenticated ? <Navbar2 /> : <Navbar1 />} 
      <h1>Emergency Connector</h1>
      <ul className="list-group">
        {emergencyServices.map((service, index) => (
          <li
            key={index}
            className={`list-group-item ${selectedService === service ? 'active' : ''}`}
            onClick={() => handleServiceSelect(service)}
          >
            {service.name}
          </li>
        ))}
      </ul>
      <button
        className="btn btn-danger mt-3"
        onClick={handleCall}
        disabled={!selectedService}
      >
        {isRinging && <span className="ringing"></span>}
        Call {selectedService ? selectedService.name : 'Service'}
      </button>
    </div></div>
  );
};

export default EmergencyConnector;