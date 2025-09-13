import React from 'react';
import { FiCalendar, FiPlus, FiTrash, FiHome, FiAward, FiFlag } from 'react-icons/fi';
import { useFieldArray } from 'react-hook-form';

const TrainingsCoursesTab = ({ register, errors, watch, setValue, control }) => {
    // Use useFieldArray to handle dynamic form fields
    const { fields, append, remove } = useFieldArray({
        name: "trainings",
        control: control
    });

    const handleAddTraining = () => {
        append({ 
            trainingDetail: '', 
            grade: '', 
            countryStation: '', 
            start_date: null, 
            end_date: null, 
            year: '',
            institute: '' 
        });
    };

    // Country options for dropdown
    const countryOptions = [
        { value: 'Pakistan', label: 'Pakistan' },
        { value: 'China', label: 'China' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'USA', label: 'United States' },
        { value: 'Germany', label: 'Germany' },
        { value: 'France', label: 'France' },
        { value: 'Japan', label: 'Japan' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Canada', label: 'Canada' },
        { value: 'India', label: 'India' }
    ];

    return (
        <div className="card-body trainings-courses-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Trainings & Courses:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Professional development and special training courses</span>
                </h5>
                {/* <button type="button" className="btn btn-sm btn-primary">Save</button> */}
            </div>

            {fields.map((item, index) => (
                <div key={item.id} className="training-item mb-4 pb-4 border-bottom">
                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`training-${index}-detail`} className="form-label">Training/Course Title</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiAward /></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.trainings?.[index]?.course_detail ? 'is-invalid' : ''}`}
                                    id={`training-${index}-detail`}
                                    placeholder="e.g., Advanced Medical Research Methods"
                                    {...register(`trainings.${index}.course_detail`)}
                                />
                                {errors?.trainings?.[index]?.course_detail && (
                                    <div className="invalid-feedback">{errors.trainings[index].course_detail.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`training-${index}-institute`} className="form-label">Institute</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiHome /></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.trainings?.[index]?.institute_name ? 'is-invalid' : ''}`}
                                    id={`training-${index}-institute`}
                                    placeholder="e.g., Medical Research Institute"
                                    {...register(`trainings.${index}.institute_name`)}
                                />
                                {errors?.trainings?.[index]?.institute_name && (
                                    <div className="invalid-feedback">{errors.trainings[index].institute_name.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`training-${index}-grade`} className="form-label">Grade</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiAward /></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.trainings?.[index]?.grade ? 'is-invalid' : ''}`}
                                    id={`training-${index}-grade`}
                                    placeholder="e.g., A, Distinction"
                                    {...register(`trainings.${index}.grade`)}
                                />
                                {errors?.trainings?.[index]?.grade && (
                                    <div className="invalid-feedback">{errors.trainings[index].grade.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`training-${index}-countryStation`} className="form-label">Country/Station</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiFlag /></div>
                                <select
                                    className={`form-select ${errors?.trainings?.[index]?.country ? 'is-invalid' : ''}`}
                                    id={`training-${index}-country`}
                                    {...register(`trainings.${index}.country`)}
                                >
                                    <option value="">Select Country/Station</option>
                                    {countryOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {errors?.trainings?.[index]?.country && (
                                    <div className="invalid-feedback">{errors.trainings[index].country.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`training-${index}-dateFrom`} className="form-label">Date From</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.trainings?.[index]?.start_date ? 'is-invalid' : ''}`}
                                    id={`training-${index}-start_date`}
                                    {...register(`trainings.${index}.start_date`)}
                                />
                                {errors?.trainings?.[index]?.start_date && (
                                    <div className="invalid-feedback">{errors.trainings[index].start_date.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`training-${index}-dateTo`} className="form-label">Date To</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.trainings?.[index]?.end_date ? 'is-invalid' : ''}`}
                                    id={`training-${index}-end_date`}
                                    {...register(`trainings.${index}.end_date`)}
                                />
                                {errors?.trainings?.[index]?.end_date && (
                                    <div className="invalid-feedback">{errors.trainings[index].end_date.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`training-${index}-year`} className="form-label">Year</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiAward /></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.trainings?.[index]?.year ? 'is-invalid' : ''}`}
                                    id={`training-${index}-year`}
                                    placeholder="Year"
                                    {...register(`trainings.${index}.year`)}
                                />
                                {errors?.trainings?.[index]?.year && (
                                    <div className="invalid-feedback">{errors.trainings[index].year.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button 
                type="button" 
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={handleAddTraining}
            >
                <FiPlus size={16} /> Add Training/Course
            </button>
        </div>
    );
};

export default TrainingsCoursesTab;
