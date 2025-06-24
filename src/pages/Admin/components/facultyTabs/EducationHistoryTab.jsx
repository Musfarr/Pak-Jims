import React from 'react';
import { FiCalendar, FiPlus, FiTrash } from 'react-icons/fi';
import { useFieldArray } from 'react-hook-form';
import Input from '@/components/shared/Input';
import SelectDropdown from '@/components/shared/SelectDropdown';

const EducationHistoryTab = ({ register, errors, watch, setValue, control }) => {
    // Use useFieldArray to handle dynamic form fields
    const { fields, append, remove } = useFieldArray({
        name: "education",
        control: control
    });

    const handleAddEducation = () => {
        append({ 
            nameOfInstitute: '', 
            degree: '', 
            start_date: null, 
            end_date: null, 
            grade: '', 
            city: '', 
            country: '',
            subject: '' 
        });
    };

    // Country options for dropdown
    const countryOptions = [
        { value: 'pakistan', label: 'Pakistan' },
        { value: 'usa', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'canada', label: 'Canada' },
        { value: 'australia', label: 'Australia' },
        { value: 'germany', label: 'Germany' },
        { value: 'france', label: 'France' },
        { value: 'japan', label: 'Japan' },
        { value: 'china', label: 'China' },
        { value: 'uae', label: 'United Arab Emirates' },
        { value: 'saudi-arabia', label: 'Saudi Arabia' }
    ];

    return (
        <div className="card-body education-tab">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Education History:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">List your degrees and certifications</span>
                </h5>
                {/* <button type="button" className="btn btn-sm btn-primary">Save</button> */}
            </div>

            {fields.map((item, index) => (
                <div key={item.id} className="education-item mb-4 pb-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-semibold mb-0">Education {index + 1}</h6>
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
                            <label htmlFor={`education-${index}-institute`} className="form-label">Name of Institute</label>
                            <div className="input-group">
                                <div className="input-group-text"><i className="feather-home"></i></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.education?.[index]?.institute_name ? 'is-invalid' : ''}`}
                                    id={`education-${index}-institute`}
                                    placeholder="e.g., University of Health Sciences"
                                    {...register(`education.${index}.institute_name`, { required: 'Institute name is required' })}
                                />
                                {errors?.education?.[index]?.institute_name && (
                                    <div className="invalid-feedback">{errors.education[index].institute_name.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`education-${index}-degree`} className="form-label">Degree</label>
                            <div className="input-group">
                                <div className="input-group-text"><i className="feather-award"></i></div>
                                <select
                                    className={`form-select ${errors?.education?.[index]?.degree ? 'is-invalid' : ''}`}
                                    id={`education-${index}-degree`}
                                    {...register(`education.${index}.degree`, { required: 'Degree is required' })}
                                >
                                    <option value="">Select Degree</option>
                                    <option value="phd">Ph.D</option>
                                    <option value="masters">Masters</option>
                                    <option value="bachelors">Bachelors</option>
                                    <option value="associate">Associate</option>
                                    <option value="diploma">Diploma</option>
                                    <option value="certificate">Certificate</option>
                                </select>
                                {errors?.education?.[index]?.degree && (
                                    <div className="invalid-feedback">{errors.education[index].degree.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`education-${index}-subject`} className="form-label">Subject</label>
                            <div className="input-group">
                                <div className="input-group-text"><i className="feather-book"></i></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.education?.[index]?.subject ? 'is-invalid' : ''}`}
                                    id={`education-${index}-subject`}
                                    placeholder="e.g., Medicine, Computer Science"
                                    {...register(`education.${index}.subject`, { required: 'Subject is required' })}
                                />
                                {errors?.education?.[index]?.subject && (
                                    <div className="invalid-feedback">{errors.education[index].subject.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`education-${index}-gpaGradeDiv`} className="form-label">Grade</label>
                            <div className="input-group">
                                <div className="input-group-text"><i className="feather-star"></i></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.education?.[index]?.grade ? 'is-invalid' : ''}`}
                                    id={`education-${index}-grade`}
                                    placeholder="e.g., A+"
                                    {...register(`education.${index}.grade`, { required: 'Grade is required' ,
                                        pattern: {
                                            value: /^[A-F][+-]?$|^[0-9](\.\d{1,2})?$/i,
                                            message: 'Please enter a valid grade (e.g., A, B+, C-, 3.5)'
                                        }
                                     })}
                                />
                                {errors?.education?.[index]?.grade && (
                                    <div className="invalid-feedback">{errors.education[index].grade.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`education-${index}-city`} className="form-label">City</label>
                            <div className="input-group">
                                <div className="input-group-text"><i className="feather-map-pin"></i></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.education?.[index]?.city ? 'is-invalid' : ''}`}
                                    id={`education-${index}-city`}
                                    placeholder="e.g., Lahore, Karachi"
                                    {...register(`education.${index}.city`, { required: 'City is required' })}
                                />
                                {errors?.education?.[index]?.city && (
                                    <div className="invalid-feedback">{errors.education[index].city.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`education-${index}-country`} className="form-label">Country</label>
                            <div className="input-group">
                                <div className="input-group-text"><i className="feather-flag"></i></div>
                                <select
                                    className={`form-select ${errors?.education?.[index]?.country ? 'is-invalid' : ''}`}
                                    id={`education-${index}-country`}
                                    {...register(`education.${index}.country`, { required: 'Country is required' })}
                                >
                                    <option value="">Select Country</option>
                                    {countryOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {errors?.education?.[index]?.country && (
                                    <div className="invalid-feedback">{errors.education[index].country.message}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`education-${index}-fromDate`} className="form-label">From Date</label>
                            <div className="input-group flex-nowrap">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.education?.[index]?.start_date ? 'is-invalid' : ''}`}
                                    id={`education-${index}-start_date`}
                                    {...register(`education.${index}.start_date`, { required: 'Start date is required' })}
                                />
                                {errors?.education?.[index]?.start_date && (
                                    <div className="invalid-feedback">{errors.education[index].start_date.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`education-${index}-toDate`} className="form-label">To Date</label>
                            <div className="input-group flex-nowrap">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.education?.[index]?.end_date ? 'is-invalid' : ''}`}
                                    id={`education-${index}-end_date`}
                                    {...register(`education.${index}.end_date`, { required: 'End date is required' })}
                                />
                                {errors?.education?.[index]?.end_date && (
                                    <div className="invalid-feedback">{errors.education[index].end_date.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button 
                type="button" 
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={handleAddEducation}
            >
                <FiPlus size={16} /> Add Education
            </button>
        </div>
    );
};

export default EducationHistoryTab;
