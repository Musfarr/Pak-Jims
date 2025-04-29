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
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-semibold mb-0">Training/Course {index + 1}</h6>
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

                    {/* Training Detail */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`training-${index}-detail`} className="fw-semibold">Training/Course Title: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"><FiAward /></div>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors?.trainings?.[index]?.trainingDetail ? 'is-invalid' : ''}`}
                                    id={`training-${index}-detail`}
                                    placeholder="e.g., Advanced Medical Research Methods"
                                    {...register(`trainings.${index}.trainingDetail`, { required: 'Training detail is required' })}
                                />
                                {errors?.trainings?.[index]?.trainingDetail && (
                                    <div className="invalid-feedback">{errors.trainings[index].trainingDetail.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Institute */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`training-${index}-institute`} className="fw-semibold">Institute/Organization: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"><FiHome /></div>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors?.trainings?.[index]?.institute ? 'is-invalid' : ''}`}
                                    id={`training-${index}-institute`}
                                    placeholder="e.g., Medical Research Institute"
                                    {...register(`trainings.${index}.institute`, { required: 'Institute is required' })}
                                />
                                {errors?.trainings?.[index]?.institute && (
                                    <div className="invalid-feedback">{errors.trainings[index].institute.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Country/Station */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`training-${index}-country`} className="fw-semibold">Country/Station: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"><FiFlag /></div>
                                <select
                                    className={`form-select ${errors?.trainings?.[index]?.countryStation ? 'is-invalid' : ''}`}
                                    id={`training-${index}-country`}
                                    {...register(`trainings.${index}.countryStation`, { required: 'Country is required' })}
                                >
                                    <option value="">Select Country</option>
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

                    {/* Date From */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`training-${index}-dateFrom`} className="fw-semibold">From Date: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group flex-nowrap">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors?.trainings?.[index]?.dateFrom ? 'is-invalid' : ''}`}
                                    id={`training-${index}-dateFrom`}
                                    {...register(`trainings.${index}.dateFrom`, { required: 'From date is required' })}
                                />
                                {errors?.trainings?.[index]?.dateFrom && (
                                    <div className="invalid-feedback">{errors.trainings[index].dateFrom.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date To */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`training-${index}-dateTo`} className="fw-semibold">To Date: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group flex-nowrap">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors?.trainings?.[index]?.dateTo ? 'is-invalid' : ''}`}
                                    id={`training-${index}-dateTo`}
                                    {...register(`trainings.${index}.dateTo`, { required: 'To date is required' })}
                                />
                                {errors?.trainings?.[index]?.dateTo && (
                                    <div className="invalid-feedback">{errors.trainings[index].dateTo.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Year */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`training-${index}-year`} className="fw-semibold">Year: </label>
                        </div>
                        <div className="col-lg-8">
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

                    {/* Grade */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`training-${index}-grade`} className="fw-semibold">Grade/Certificate: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"></div>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors?.trainings?.[index]?.grade ? 'is-invalid' : ''}`}
                                    id={`training-${index}-grade`}
                                    placeholder="e.g., Distinction, A+, Pass"
                                    {...register(`trainings.${index}.grade`)}
                                />
                                {errors?.trainings?.[index]?.grade && (
                                    <div className="invalid-feedback">{errors.trainings[index].grade.message}</div>
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
