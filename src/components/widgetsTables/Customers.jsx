import React from 'react'
import CardHeader from '@/components/shared/CardHeader'
import CardLoader from '@/components/shared/CardLoader'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import Pagination from '@/components/shared/Pagination'
import Dropdown from '@/components/shared/Dropdown'

const actionOptions = [
    { label: "View User" },
    { label: "Delete User" },
]
const customerData = [
    { name: 'Ali Raza', email: 'ali.raza@pakjims.com', phone: '+92 300 1112233', joinedDate: '21 Sep, 2023' },
    { name: 'Hira Khan', email: 'hira.khan@pakjims.com', phone: '+92 301 4455667', joinedDate: '25 Sep, 2023' },
    { name: 'Usman Tariq', email: 'usman.tariq@pakjims.com', phone: '+92 302 7788990', joinedDate: '16 Sep, 2023' },
    { name: 'Areeba Noor', email: 'areeba.noor@pakjims.com', phone: '+92 333 1029384', joinedDate: '20 Sep, 2023' },
    { name: 'Hamza Ahmed', email: 'hamza.ahmed@pakjims.com', phone: '+92 321 5647382', joinedDate: '20 Sep, 2023' },
];

const Customers = ({ title, wrapperClassName = "col-xxl-12" }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }

    return (
        <div className={wrapperClassName}>
            <div className={`card stretch stretch-full widget-tasks-content ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Number</th>
                                    <th>Created Date</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerData.map((customer, index) => (
                                    <tr key={index}>
                                        <td><a href="#">{customer.name}</a></td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.joinedDate}</td>
                                        <td className="text-end">
                                            <Dropdown dropdownItems={actionOptions} triggerClass='avatar-md ms-auto' />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer"> <Pagination /></div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default Customers
