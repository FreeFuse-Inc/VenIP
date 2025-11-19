import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VendorChecklist.css';

const VendorChecklist = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const checklist = [
    {
      step: 1,
      title: 'Complete Vendor Checklist',
      description: 'Provide necessary documentation and confirm details',
      items: [
        { id: 1, label: 'Business License/Tax ID', completed: true },
        { id: 2, label: 'Insurance Documentation', completed: true },
        { id: 3, label: 'Contact Information Confirmed', completed: false },
        { id: 4, label: 'Equipment/Staffing Details', completed: false },
      ],
    },
    {
      step: 2,
      title: 'Deliver Milestones',
      description: 'Track and complete project milestones',
      milestones: [
        { id: 1, title: 'Initial Consultation', date: 'Dec 1, 2024', completed: true },
        { id: 2, title: 'Menu Planning & Approval', date: 'Dec 8, 2024', completed: true },
        { id: 3, title: 'Final Confirmation', date: 'Dec 14, 2024', completed: false },
        { id: 4, title: 'Event Day Setup & Service', date: 'Dec 15, 2024', completed: false },
      ],
    },
    {
      step: 3,
      title: 'Invoice & Payment',
      description: 'Submit invoice and track payment',
      details: {
        quotedPrice: '$4,500',
        dueDate: '2024-12-20',
        status: 'Pending',
      },
    },
  ];

  const currentStepData = checklist[currentStep - 1];

  const handleToggleItem = (itemId) => {
    // In a real app, this would update the database
    console.log(`Toggled item ${itemId}`);
  };

  return (
    <main className="vendor-checklist">
      <div className="checklist-header">
        <h1>Wedding Celebration - Vendor Checklist</h1>
        <p className="event-info">Accepted Quote: $3,200 • Status: In Progress</p>
      </div>

      <div className="checklist-content">
        <div className="steps-indicator">
          {checklist.map((item) => (
            <button
              key={item.step}
              className={`step ${currentStep === item.step ? 'active' : ''} ${
                currentStep > item.step ? 'completed' : ''
              }`}
              onClick={() => setCurrentStep(item.step)}
            >
              <div className="step-circle">{item.step}</div>
              <span className="step-label">{item.title}</span>
            </button>
          ))}
        </div>

        <div className="checklist-card">
          <h2>{currentStepData.title}</h2>
          <p className="step-description">{currentStepData.description}</p>

          {currentStep === 1 && (
            <div className="items-list">
              {currentStepData.items.map((item) => (
                <div key={item.id} className="checklist-item">
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onChange={() => handleToggleItem(item.id)}
                  />
                  <label htmlFor={`item-${item.id}`} className={item.completed ? 'completed' : ''}>
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="milestones-list">
              {currentStepData.milestones.map((milestone) => (
                <div key={milestone.id} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
                  <div className="milestone-marker"></div>
                  <div className="milestone-content">
                    <h4>{milestone.title}</h4>
                    <p>{milestone.date}</p>
                  </div>
                  <span className="milestone-status">
                    {milestone.completed ? '✓ Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="invoice-section">
              <div className="invoice-details">
                <div className="invoice-row">
                  <span className="label">Quoted Price:</span>
                  <span className="value">{currentStepData.details.quotedPrice}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Payment Due Date:</span>
                  <span className="value">{currentStepData.details.dueDate}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Payment Status:</span>
                  <span className={`value status ${currentStepData.details.status.toLowerCase()}`}>
                    {currentStepData.details.status}
                  </span>
                </div>
              </div>
              <button className="btn-submit-invoice">Submit Invoice</button>
            </div>
          )}

          <div className="action-buttons">
            {currentStep > 1 && (
              <button className="btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
                ← Previous Step
              </button>
            )}
            {currentStep < 3 && (
              <button className="btn-primary" onClick={() => setCurrentStep(currentStep + 1)}>
                Next Step →
              </button>
            )}
            {currentStep === 3 && (
              <button className="btn-complete" onClick={() => navigate('/dashboard/vendor')}>
                Return to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default VendorChecklist;
