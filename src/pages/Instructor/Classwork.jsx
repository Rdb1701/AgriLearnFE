import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import NavigationTabs from '../../components/Instructor/Classroom/ClassroomView/NavigationTabs';

export default function Classwork() {
  const [activeTab, setActiveTab] = useState("stream");
      const { id } = useParams();
  return (
    <div>
      <div className="min-vh-100 bg-light">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} paramsId={id}/>
      </div>
    </div>
  );
}
