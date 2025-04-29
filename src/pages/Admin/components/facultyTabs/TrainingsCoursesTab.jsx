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
            dateFrom: null, 
            dateTo: null, 
            year: '',
            institute: '' 
        });
    };

    // Country options for dropdown
    const countryOptions = [
        { value: 'pakistan', label: 'Pakistan' },
        { value: 'china', label: 'China' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'usa', label: 'United States' },
        { value: 'germany', label: 'Germany' },
        { value: 'france', label: 'France' },
        { value: 'japan', label: 'Japan' },
        { value: 'australia', label: 'Australia' },
        { value: 'canada', label: 'Canada' },
        { value: 'india', label: 'India' }
    ];

    return (
        <div className="card-body trainings-courses-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Trainings & Courses:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Professional development and special training courses</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
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
                                    {...register(`trainings.${index}.course_detail`, { required: 'Training detail is required' })}
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
                                    {...register(`trainings.${index}.institute_name`, { required: 'Institute is required' })}
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
                                    {...register(`trainings.${index}.grade`, { required: 'Grade is required' })}
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
                                    className={`form-select ${errors?.trainings?.[index]?.countryStation ? 'is-invalid' : ''}`}
                                    id={`training-${index}-countryStation`}
                                    {...register(`trainings.${index}.countryStation`, { required: 'Country/Station is required' })}
                                >
                                    <option value="">Select Country/Station</option>
                                    {countryOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {errors?.trainings?.[index]?.countryStation && (
                                    <div className="invalid-feedback">{errors.trainings[index].countryStation.message}</div>
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
                                    className={`form-control ${errors?.trainings?.[index]?.dateFrom ? 'is-invalid' : ''}`}
                                    id={`training-${index}-dateFrom`}
                                    {...register(`trainings.${index}.dateFrom`, { required: 'Date From is required' })}
                                />
                                {errors?.trainings?.[index]?.dateFrom && (
                                    <div className="invalid-feedback">{errors.trainings[index].dateFrom.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`training-${index}-dateTo`} className="form-label">Date To</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.trainings?.[index]?.dateTo ? 'is-invalid' : ''}`}
                                    id={`training-${index}-dateTo`}
                                    {...register(`trainings.${index}.dateTo`, { required: 'Date To is required' })}
                                />
                                {errors?.trainings?.[index]?.dateTo && (
                                    <div className="invalid-feedback">{errors.trainings[index].dateTo.message}</div>
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
                                    {...register(`trainings.${index}.year`, { required: 'Year is required' })}
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
