import React, { useState } from 'react'
import CardHeader from '@/components/shared/CardHeader'
import Pagination from '@/components/shared/Pagination'
import CardLoader from '@/components/shared/CardLoader'
import useCardTitleActions from '@/hooks/useCardTitleActions'
// import { taskAssigneeOptions, taskPriorityOptions, taskStatusOptions } from '@/utils/options'
import SelectDropdown from '@/components/shared/SelectDropdown'


const Tasks = ({ title ,tasksData }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }

    const defaultStatusList = ["inprogress", "completed", "upcoming", "completed", "upcoming"]
    const defaultPriorityList = ["high", "urgent", "medium", "urgent", "medium"]
    const defaultAssigneeList = ["arcie.tones@gmail.com", "jon.tones@gmail.com", "lanie.nveyn@gmail.com", "nneth.une@gmail.com", "erna.serpa@outlook.com"]
    return (
        <div className="col-xxl-12">
            <div className={`card stretch stretch-full widget-tasks-content ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body p-0">
                    <div className="table-responsive tasks-items-wrapper">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Institute Branches</th>
                                    {/* <th className="wd-250">Status</th>
                                    <th className="wd-250">Priority</th> */}
                                    <th className="wd-300">Assigned Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasksData.map(({ taskDate, taskDescription, taskName, taskNumber, assignee, priority, status }, index) => {
                                    const assigneeValue = assignee.find((v) => v.value === defaultAssigneeList[index])
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="avatar-text bg-gray-200">{taskNumber}</div>
                                            </td>
                                            <td>
                                                <a href="#">{taskName} <span className="fs-12 fw-normal text-muted">({taskDate})</span> </a>
                                                {/* <p className="fs-12 text-muted mt-2 text-truncate-1-line tasks-sort-desc">{taskDescription}</p> */}
                                                <div className="tasks-list-action d-flex align-items-center gap-3">
                                                    {/* <a href="#">Start</a> */}
                                                    {/* <span>|</span> */}
                                                    <a href="#">Edit</a>
                                                    <span>|</span>
                                                    <a href="#" className="text-danger">Delete</a>
                                                </div>
                                            </td>
                                            {/* <td>
                                                <SelectDropdown
                                                    options={status}
                                                    selectedOption={selectedOption}
                                                    defaultSelect={statusValue?.value}
                                                    onSelectOption={(option) => setSelectedOption(option)}
                                                />
                                            </td>
                                            <td>
                                                <SelectDropdown
                                                    options={priority}
                                                    selectedOption={selectedOption}
                                                    defaultSelect={priorityValue?.value}
                                                    onSelectOption={(option) => setSelectedOption(option)}
                                                />
                                            </td> */}
                                            <td>
                                                <SelectDropdown
                                                    options={assignee}
                                                    selectedOption={selectedOption}
                                                    defaultSelect={assigneeValue?.value}
                                                    onSelectOption={(option) => setSelectedOption(option)}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
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

export default Tasks
