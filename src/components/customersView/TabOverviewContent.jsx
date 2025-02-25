import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { projectsData } from '@/utils/fackData/projectsData'
import ImageGroup from '@/components/shared/ImageGroup'
import HorizontalProgress from '@/components/shared/HorizontalProgress';

const informationData = [
    { label: 'Full Name', value: 'Alexandra Della' },
    { label: 'Surname', value: 'Della' },
    { label: 'Company', value: 'Theme Ocean' },
    { label: 'Date of Birth', value: '26 May, 2000' },
    { label: 'Mobile Number', value: '+01 (375) 5896 3214' },
    { label: 'Email Address', value: 'alex.della@outlook.com' },
    { label: 'Location', value: 'California, United States' },
    { label: 'Joining Date', value: '20 Dec, 2023' },
    { label: 'Country', value: 'United States' },
];
const TabOverviewContent = () => {
    return (
        <div
            className="tab-pane fade show active p-4"
            id="overviewTab"
            role="tabpanel"
        >
            <div className="about-section mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Profile About:</h5>
                    {/* <a href="#" className="btn btn-sm btn-light-brand">
                        Updates
                    </a> */}
                </div>
                
                
                <p>
                    Throughout his career, John has worked on a wide range of projects for
                    clients in various industries, including e-commerce, healthcare, and
                    education. He takes a collaborative approach to development and enjoys
                    working closely with clients and other developers to bring their ideas to
                    life.
                </p>
            </div>
            <div className="profile-details mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Profile Details:</h5>
                    <a href="#" className="btn btn-sm btn-light-brand">
                        Edit Details
                    </a>
                </div>
                {informationData.map((item, index) => (
                    <div key={index}  className={`row g-0 ${index === informationData.length - 1 ? 'mb-0' : 'mb-4'}`}>
                        <div className="col-sm-6 text-muted">{item.label}:</div>
                        <div className="col-sm-6 fw-semibold">{item.value}</div>
                    </div>
                ))}
            </div>
            {/* <div
                className="alert alert-dismissible mb-4 p-4 d-flex alert-soft-warning-message profile-overview-alert"
                role="alert"
            >
                <div className="me-4 d-none d-md-block">
                    <FiAlertTriangle className='fs-1' />
                </div>
            </div> */}
            
        </div>

    )
}

export default TabOverviewContent