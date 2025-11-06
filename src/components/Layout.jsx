import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebar } from '../context/SidebarContext';

export default function Layout() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      <Header />
      <Sidebar />
      {isOpen && <div className="sidebar-overlay" onClick={close} />}
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}