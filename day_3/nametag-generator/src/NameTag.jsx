import { useState } from 'react';
import './NameTag.css';

function NameTag() {
  const [firstName, setFirstName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  
  function handleDownload() {
    const nameTagContent = `
      Hello, my name is
      ${firstName}
      ${jobTitle}
      ${company}
    `;
    alert('Name Tag Content:\n' + nameTagContent);
  }
  
  return (
    <div className="name-tag-generator">
      <h2>Name Tag Generator</h2>
      
      <div className="input-group">
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />
      </div>
      
      <div className="input-group">
        <label>Job Title:</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Enter your job title"
        />
      </div>
      
      <div className="input-group">
        <label>Company:</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter your company"
        />
      </div>
      
      <div className="name-tag-preview">
        <h3>--- NAME TAG ---</h3>
        <p>Hello, my name is</p>
        <h2>{firstName || ' Name'}</h2>
        <p className="job-title">{jobTitle || 'Frontend Developer'}</p>
        <p className="company">{company || 'Paystack'}</p>
      </div>
      
      <button onClick={handleDownload} className="download-btn">
        Download Name Tag
      </button>
    </div>
  );
}

export default NameTag;