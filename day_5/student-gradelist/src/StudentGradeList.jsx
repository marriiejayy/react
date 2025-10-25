import { useState } from 'react';
import './StudentGradeList.css';

function StudentGradeList() {
  const [filter, setFilter] = useState('all');
  
  const students = [
    { id: 1, name: 'Chidi Okafor', score: 75, subject: 'Mathematics' },
    { id: 2, name: 'Amaka Johnson', score: 45, subject: 'Mathematics' },
    { id: 3, name: 'Tunde Adeyemi', score: 88, subject: 'Mathematics' }
  ];

  
  const filteredStudents = students.filter(student => {
    if (filter === 'passed') return student.score >= 50;
    if (filter === 'failed') return student.score < 50;
    return true;
  });

  const totalStudents = students.length;
  const passedStudents = students.filter(s => s.score >= 50).length;
  const failedStudents = students.filter(s => s.score < 50).length;

  return (
    <div className="student-grades">
      <h1> Student Grades</h1>
      
      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({totalStudents})
        </button>
        <button 
          className={filter === 'passed' ? 'active' : ''}
          onClick={() => setFilter('passed')}
        >
          Passed ({passedStudents})
        </button>
        <button 
          className={filter === 'failed' ? 'active' : ''}
          onClick={() => setFilter('failed')}
        >
          Failed ({failedStudents})
        </button>
      </div>

   
      <div className="student-list">
        {filteredStudents.map(student => (
          <div key={student.id} className="student-item">
            <div className="student-info">
              <span className="student-name">{student.name}</span>
              <span className="student-subject"> - {student.subject}: {student.score}</span>
            </div>
            <span className={`status ${student.score >= 50 ? 'pass' : 'fail'}`}>
              {student.score >= 50 ? '✅ PASS' : '❌ FAIL'}
            </span>
          </div>
        ))}
      </div>

      
      <div className="statistics">
        <p><strong>Total Students: {totalStudents} | Passed: {passedStudents} | Failed: {failedStudents}</strong></p>
      </div>
    </div>
  );
}

export default StudentGradeList;