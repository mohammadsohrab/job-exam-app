import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentNavigation from './StudentNavigation';

interface StudentLayoutProps {
  username: string;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ username }) => {
  return (
    <div className="student-layout">
      <StudentNavigation username={username} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;