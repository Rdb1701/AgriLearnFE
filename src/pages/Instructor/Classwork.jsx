import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import NavigationTabs from '../../components/Instructor/Classroom/ClassroomView/NavigationTabs';
import Dropdown from '../../components/Instructor/Classroom/Classwork/Dropdown';
import EmptyState from '../../components/Instructor/Classroom/Classwork/EmptyState';

export default function Classwork() {
  const [activeTab, setActiveTab] = useState("stream");
  const { id } = useParams();

  return (
    <div>
      <div className="min-vh-100 bg-light">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} paramsId={id}/>
        
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="text-end mb-4">
                <Dropdown />
              </div>
              <EmptyState />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}