import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import FacultyProfile from './FacultyProfile';
import TabOverviewContent from './TabOverviewContent';
import TabEducationContent from './TabEducationContent';
import TabCoursesContent from './TabCoursesContent';
import TabPublicationsContent from './TabPublicationsContent';

const FacultyContent = ({ faculty }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="col-12">
            <div className="row">



                <div className="col-xxl-4 col-xl-6">
                    <FacultyProfile faculty={faculty} />
                    <div className="d-grid gap-2 mt-3">
                        <Link to={`/faculty/edit/${faculty.id}`} className="btn btn-warning">
                            <FiEdit className="me-2" /> Edit Faculty
                        </Link>
                    </div>
                </div>



                <div className="col-xxl-8 col-xl-6">
                    <div className="card">
                        <div className="card-header p-0 border-bottom-0">
                            <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs" id="facultyTab" role="tablist">
                                <li className="nav-item flex-fill" role="presentation">
                                    
                                    
                                    <button 
                                        className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('overview')}
                                        id="overview-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#overview"
                                        type="button"
                                        role="tab"
                                        aria-controls="overview"
                                        aria-selected={activeTab === 'overview'}
                                    >
                                        Overview
                                    </button>
                                </li>
                                <li className="nav-item flex-fill" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'education' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('education')}
                                        id="education-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#education"
                                        type="button"
                                        role="tab"
                                        aria-controls="education"
                                        aria-selected={activeTab === 'education'}
                                    >
                                        Education & Experience
                                    </button>
                                </li>
                                <li className="nav-item flex-fill" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('courses')}
                                        id="courses-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#courses"
                                        type="button"
                                        role="tab"
                                        aria-controls="courses"
                                        aria-selected={activeTab === 'courses'}
                                    >
                                        Courses
                                    </button>
                                </li>
                                <li className="nav-item flex-fill" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'publications' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('publications')}
                                        id="publications-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#publications"
                                        type="button"
                                        role="tab"
                                        aria-controls="publications"
                                        aria-selected={activeTab === 'publications'}
                                    >
                                        Publications
                                    </button>
                                </li>
                            </ul>
                        </div>




                        <div className="tab-content" id="facultyTabContent">
                            <div 
                                className={`tab-pane fade ${activeTab === 'overview' ? 'show active' : ''}`}
                                id="overview"
                                role="tabpanel"
                                aria-labelledby="overview-tab"
                            >
                                <TabOverviewContent faculty={faculty} />
                            </div>
                            <div 
                                className={`tab-pane fade ${activeTab === 'education' ? 'show active' : ''}`}
                                id="education"
                                role="tabpanel"
                                aria-labelledby="education-tab"
                            >
                                <TabEducationContent faculty={faculty} />
                            </div>
                            <div 
                                className={`tab-pane fade ${activeTab === 'courses' ? 'show active' : ''}`}
                                id="courses"
                                role="tabpanel"
                                aria-labelledby="courses-tab"
                            >
                                <TabCoursesContent faculty={faculty} />
                            </div>
                            <div 
                                className={`tab-pane fade ${activeTab === 'publications' ? 'show active' : ''}`}
                                id="publications"
                                role="tabpanel"
                                aria-labelledby="publications-tab"
                            >
                                <TabPublicationsContent faculty={faculty} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyContent;
