import React from 'react'
import getIcon from '@/utils/getIcon';
import { FiFigma } from 'react-icons/fi';

const statisticsData = [
    { amount: '120', description: 'Students', icon: 'feather-users', bgColor: 'bg-primary' },
    { amount: '23', description: 'Faculties', icon: 'feather-users', bgColor: 'bg-success' },
    { amount: '3', description: 'Admins', icon: 'feather-users', bgColor: 'bg-warning' },
    { amount: '0', description: 'Branches', icon: 'feather-bar-chart-2', bgColor: 'bg-teal' }
];

const EstimateStatistics = () => {
    return (
        <>

            {statisticsData.map(({ amount, description, icon, bgColor }, index) => (
                <div key={index} className="col-xxl-3 col-md-6">
                    <div className="card card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="me-3">
                                <h5 className="fs-4">{amount}</h5>
                                <span className="text-muted">{description}</span>
                            </div>
                            <div className={`avatar-text avatar-lg ${bgColor} text-white rounded`}>
                                <i>{React.cloneElement(getIcon(icon), {size:"16", strokeWidth:"2.4"})}</i>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default EstimateStatistics