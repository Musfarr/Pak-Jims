import React from 'react';
import { FiCalendar, FiPlus, FiTrash } from 'react-icons/fi';
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
                <button type="button" className="btn btn-sm btn-primary">Save</button>
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

                    {/* Name of Post */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`work-${index}-post`} className="fw-semibold">Position / Job Title: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"></div>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors?.workExperiences?.[index]?.nameOfPost ? 'is-invalid' : ''}`}
                                    id={`work-${index}-post`}
                                    placeholder="e.g., Senior Lecturer, Professor"
                                    {...register(`workExperiences.${index}.nameOfPost`, { required: 'Position is required' })}
                                />
                                {errors?.workExperiences?.[index]?.nameOfPost && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].nameOfPost.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name of Institute */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`work-${index}-institute`} className="fw-semibold">Name of Institute/Company: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"></div>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors?.workExperiences?.[index]?.nameOfInstitute ? 'is-invalid' : ''}`}
                                    id={`work-${index}-institute`}
                                    placeholder="e.g., University of Health Sciences"
                                    {...register(`workExperiences.${index}.nameOfInstitute`, { required: 'Institute name is required' })}
                                />
                                {errors?.workExperiences?.[index]?.nameOfInstitute && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].nameOfInstitute.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Scale/Grade */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`work-${index}-scale`} className="fw-semibold">Scale/Grade: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"></div>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors?.workExperiences?.[index]?.scaleGrade ? 'is-invalid' : ''}`}
                                    id={`work-${index}-scale`}
                                    placeholder="e.g., BPS-18, Level 5"
                                    {...register(`workExperiences.${index}.scaleGrade`, { required: 'Scale/Grade is required' })}
                                />
                                {errors?.workExperiences?.[index]?.scaleGrade && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].scaleGrade.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Joining Date */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`work-${index}-joiningDate`} className="fw-semibold">Joining Date: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors?.workExperiences?.[index]?.joiningDate ? 'is-invalid' : ''}`}
                                    id={`work-${index}-joiningDate`}
                                    {...register(`workExperiences.${index}.joiningDate`, { required: 'Joining date is required' })}
                                />
                                {errors?.workExperiences?.[index]?.joiningDate && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].joiningDate.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Leaving Date */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`work-${index}-leavingDate`} className="fw-semibold">Leaving Date: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors?.workExperiences?.[index]?.leavingDate ? 'is-invalid' : ''}`}
                                    id={`work-${index}-leavingDate`}
                                    {...register(`workExperiences.${index}.leavingDate`)}
                                />
                                {errors?.workExperiences?.[index]?.leavingDate && (
                                    <div className="invalid-feedback">{errors.workExperiences[index].leavingDate.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Job Responsibilities */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`work-${index}-responsibilities`} className="fw-semibold">Job Responsibilities: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"></div>
                                <textarea
                                    className={`form-control ${errors?.workExperiences?.[index]?.jobResponsibilities ? 'is-invalid' : ''}`}
                                    id={`work-${index}-responsibilities`}
                                    rows="3"
                                    placeholder="Describe your job responsibilities"
                                    {...register(`workExperiences.${index}.jobResponsibilities`)}
                                ></textarea>
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
