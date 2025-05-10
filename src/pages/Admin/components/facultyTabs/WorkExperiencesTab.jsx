import React from 'react';
import { FiCalendar, FiPlus, FiTrash, FiBriefcase, FiHome, FiAward, FiEdit } from 'react-icons/fi';
import { useFieldArray } from 'react-hook-form';

const WorkExperiencesTab = ({ register, errors, watch, setValue, control }) => {
    // Use useFieldArray to handle dynamic form fields
    const { fields, append, remove } = useFieldArray({
        name: "workExperiences",
        control: control
    });

    const handleAddExperience = () => {
        append({ 
            nameOfPost: '', 
            joiningDate: null, 
            scaleGrade: '', 
            nameOfInstitute: '', 
            leavingDate: null,
            jobResponsibilities: ''
        });
    };

    return (
        <div className="card-body work-experiences-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Work Experiences:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Previous employment history and professional experience</span>
                </h5>
                {/* <button type="button" className="btn btn-sm btn-primary">Save</button> */}
            </div>

            {fields.map((item, index) => (
                <div key={item.id} className="experience-item mb-4 pb-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-semibold mb-0">Experience {index + 1}</h6>
                        {fields.length > 1 && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => remove(index)}
                            >
                                <FiTrash size={16} />
                            </button>
                        )}
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`work-${index}-post`} className="form-label">Position / Job Title</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiBriefcase /></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.workExperiences?.[index]?.designation ? 'is-invalid' : ''}`}
                                    id={`work-${index}-post`}
                                    placeholder="e.g., Senior Lecturer, Professor"
                                    {...register(`workExperiences.${index}.designation`, { required: 'Position is required' })}
                                />
                                {errors?.workExperiences?.[index]?.designation && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].designation.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`work-${index}-institute`} className="form-label">Institute/Company</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiHome /></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.workExperiences?.[index]?.organization_name ? 'is-invalid' : ''}`}
                                    id={`work-${index}-institute`}
                                    placeholder="e.g., University of Health Sciences"
                                    {...register(`workExperiences.${index}.organization_name`, { required: 'Institute name is required' })}
                                />
                                {errors?.workExperiences?.[index]?.organization_name && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].organization_name.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`work-${index}-scale`} className="form-label">Scale/Grade</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiAward /></div>
                                <input
                                    type="number"
                                    className={`form-control ${errors?.workExperiences?.[index]?.grade ? 'is-invalid' : ''}`}
                                    id={`work-${index}-scale`}
                                    placeholder="e.g., BPS-18, Level 5"
                                    {...register(`workExperiences.${index}.grade`, { required: 'Scale/Grade is required' })}
                                />
                                {errors?.workExperiences?.[index]?.grade && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].grade.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`work-${index}-joiningDate`} className="form-label">Joining Date</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.workExperiences?.[index]?.start_date ? 'is-invalid' : ''}`}
                                    id={`work-${index}-joiningDate`}
                                    {...register(`workExperiences.${index}.start_date`, { required: 'Joining date is required' })}
                                />
                                {errors?.workExperiences?.[index]?.start_date && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].start_date.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`work-${index}-leavingDate`} className="form-label">Leaving Date</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.workExperiences?.[index]?.end_date ? 'is-invalid' : ''}`}
                                    id={`work-${index}-leavingDate`}
                                    {...register(`workExperiences.${index}.end_date`)}
                                />
                                {errors?.workExperiences?.[index]?.end_date && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].end_date.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`work-${index}-responsibilities`} className="form-label">Job Responsibilities</label>
                            <div className="input-group">
                                <textarea
                                    className={`form-control ${errors?.workExperiences?.[index]?.jobResponsibilities ? 'is-invalid' : ''}`}
                                    id={`work-${index}-responsibilities`}
                                    placeholder="Describe responsibilities, e.g., teaching, research, admin"
                                    rows={2}
                                    {...register(`workExperiences.${index}.jobResponsibilities`, { required: 'Job responsibilities are required' })}
                                />
                                {errors?.workExperiences?.[index]?.jobResponsibilities && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].jobResponsibilities.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button 
                type="button" 
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={handleAddExperience}
            >
                <FiPlus size={16} /> Add Work Experience
            </button>
        </div>
    );
};

export default WorkExperiencesTab;
