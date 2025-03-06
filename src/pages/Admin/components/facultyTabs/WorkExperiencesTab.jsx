import React, { useState } from 'react';
import { FiCalendar, FiPlus, FiTrash } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import Input from '@/components/shared/Input';
import TextArea from '@/components/shared/TextArea';

const WorkExperiencesTab = ({ startDate, setStartDate, renderFooter }) => {
    const [workExperiences, setWorkExperiences] = useState([
        { id: 1, nameOfPost: '', joiningDate: null, scaleGrade: '', nameOfInstitute: '', leavingDate: null }
    ]);

    const handleAddExperience = () => {
        const newId = workExperiences.length > 0 
            ? Math.max(...workExperiences.map(item => item.id)) + 1 
            : 1;
        setWorkExperiences([...workExperiences, { id: newId, nameOfPost: '', joiningDate: null, scaleGrade: '', nameOfInstitute: '', leavingDate: null }]);
    };

    const handleRemoveExperience = (id) => {
        if (workExperiences.length > 1) {
            setWorkExperiences(workExperiences.filter(item => item.id !== id));
        }
    };

    const handleExperienceChange = (id, field, value) => {
        setWorkExperiences(workExperiences.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    return (
        <div className="card-body work-experiences-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Work Experiences:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Previous employment history and professional experience</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>

            {workExperiences.map((experience, index) => (
                <div key={experience.id} className="experience-entry border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between mb-3">
                        <h6 className="fw-bold">Experience #{index + 1}</h6>
                        {workExperiences.length > 1 && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveExperience(experience.id)}
                            >
                                <FiTrash size={16} />
                            </button>
                        )}
                    </div>

                    <Input
                        icon='feather-briefcase'
                        label={"Name of Post"}
                        labelId={`nameOfPost-${experience.id}`}
                        placeholder={"e.g., Medical Officer"}
                        name={`nameOfPost-${experience.id}`}
                        value={experience.nameOfPost}
                        onChange={(e) => handleExperienceChange(experience.id, 'nameOfPost', e.target.value)}
                    />

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor={`joiningDate-${experience.id}`} className="fw-semibold">Joining Date: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group flex-nowrap">
                                        <div className="input-group-text"><FiCalendar size={16} /></div>
                                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                            <DatePicker
                                                placeholderText='Joining Date'
                                                selected={experience.joiningDate}
                                                showPopperArrow={false}
                                                onChange={(date) => handleExperienceChange(experience.id, 'joiningDate', date)}
                                                className='form-control rounded-0'
                                                popperPlacement="bottom-start"
                                                calendarContainer={({ children }) => (
                                                    <div className='bg-white react-datepicker'>
                                                        {children}
                                                        {renderFooter("start")}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <Input
                                icon='feather-award'
                                label={"Scale/Grade"}
                                labelId={`scaleGrade-${experience.id}`}
                                placeholder={"e.g., BPS-17, Grade 5"}
                                name={`scaleGrade-${experience.id}`}
                                value={experience.scaleGrade}
                                onChange={(e) => handleExperienceChange(experience.id, 'scaleGrade', e.target.value)}
                            />
                        </div>
                    </div>

                    <Input
                        icon='feather-home'
                        label={"Name of Institute/Organization"}
                        labelId={`nameOfInstitute-${experience.id}`}
                        placeholder={"e.g., City Hospital, Medical College"}
                        name={`nameOfInstitute-${experience.id}`}
                        value={experience.nameOfInstitute}
                        onChange={(e) => handleExperienceChange(experience.id, 'nameOfInstitute', e.target.value)}
                    />

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label htmlFor={`leavingDate-${experience.id}`} className="fw-semibold">Leaving Date: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group flex-nowrap">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                    <DatePicker
                                        placeholderText='Leaving Date (or Present)'
                                        selected={experience.leavingDate}
                                        showPopperArrow={false}
                                        onChange={(date) => handleExperienceChange(experience.id, 'leavingDate', date)}
                                        className='form-control rounded-0'
                                        popperPlacement="bottom-start"
                                        calendarContainer={({ children }) => (
                                            <div className='bg-white react-datepicker'>
                                                {children}
                                                {renderFooter("end")}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="d-flex justify-content-center mt-3">
                <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={handleAddExperience}
                >
                    <FiPlus size={16} className="me-2" /> Add Work Experience
                </button>
            </div>
        </div>
    );
};

export default WorkExperiencesTab;
