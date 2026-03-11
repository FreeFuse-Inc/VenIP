import React from 'react';
import '../styles/VendorList.css';

const VendorList = ({ title }) => {
  const vendors = [
    { name: 'BrightEvents', value: 95 },
    { name: 'Catering Pros', value: 72 },
    { name: 'Fresh Floral', value: 68 },
    { name: 'Harmony Music', value: 55 },
    { name: 'StarLighting', value: 48 },
  ];

  return (
    <div className="vendor-list-container">
      <h3 className="vendor-title">{title}</h3>
      <div className="vendor-list">
        {vendors.map((vendor, index) => (
          <div key={index} className="vendor-item">
            <span className="vendor-name">{vendor.name}</span>
            <div className="vendor-bar-wrapper">
              <div
                className="vendor-bar"
                style={{ width: `${vendor.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;
