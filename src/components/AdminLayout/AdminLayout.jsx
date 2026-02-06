import './AdminLayout.css';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../PageLayout/PageLayout';
import { Footer } from '../Footer/Footer';

const AdminLayout = ({ 
  title, 
  searchBar, 
  filterControls, 
  alphabetFilter, 
  children, 
  onAddClick, 
  dashboardRef, 
  onLayoutClick 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('/admin-dogs') ? 'dogs' : 'products';

  const tabs = (
    <div className="admin-tabs">
      <button 
        className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} 
        onClick={(e) => { e.stopPropagation(); navigate('/admin-products'); }}
      >Products</button>
      <button 
        className={`admin-tab ${activeTab === 'dogs' ? 'active' : ''}`} 
        onClick={(e) => { e.stopPropagation(); navigate('/admin-dogs'); }}
      >Dogs</button>
    </div>
  );

  return (
    <div 
      className="admin-wrapper" 
      ref={dashboardRef} 
      onClick={onLayoutClick}
      style={{ outline: 'none' }}
      tabIndex="-1"
    >
      <PageLayout 
        title={title} 
        topContent={tabs} 
        searchBar={searchBar} 
        filterControls={filterControls}
      >
        {alphabetFilter}
      </PageLayout>

      <div className='card-list'>
        {children}
      </div>

      <Footer openModal={onAddClick} />
    </div>
  );
};

export default AdminLayout;