import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="container">
          {children && React.Children.count(children) > 0 ? children : <Outlet />}
        </div>
      </main>
    </>
  );
}