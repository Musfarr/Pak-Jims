import React from 'react';
import { FiCalendar, FiPlus, FiTrash, FiFlag, FiBookOpen, FiUser } from 'react-icons/fi';
import { useFieldArray } from 'react-hook-form';

const ForeignVisitsTab = ({ register, errors, watch, setValue, control }) => {
    // Use useFieldArray to handle dynamic form fields
    const { fields, append, remove } = useFieldArray({
        name: "foreignVisits",
        control: control
    });

    const handleAddVisit = () => {
        append({ 
            country: '', 
            purpose: '', 
            start_date: null, 
            end_date: null, 
            sponsor: '' 
        });
    };

    const countries = [
        { value: 'USA', label: 'United States' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Germany', label: 'Germany' },
        { value: 'France', label: 'France' },
        { value: 'Japan', label: 'Japan' },
        { value: 'China', label: 'China' },
        { value: 'UAE', label: 'United Arab Emirates' },
        { value: 'Saudi Arabia', label: 'Saudi Arabia' }
    ];

    const purposeOptions = [
        { value: 'Conference', label: 'Conference/Seminar' },
        { value: 'Training', label: 'Training/Workshop' },
        { value: 'Research', label: 'Research Collaboration' },
        { value: 'Fellowship', label: 'Fellowship' },
        { value: 'Official', label: 'Official Visit' },
        { value: 'Other', label: 'Other' }
    ];

    return (
        <div className="card-body foreign-visits-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Foreign Visits:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">International travel for professional purposes</span>
                </h5>
                {/* <button type="button" className="btn btn-sm btn-primary">Save</button> */}
            </div>

            {fields.map((item, index) => (
                <div key={item.id} className="visit-item mb-4 pb-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-semibold mb-0">Visit {index + 1}</h6>
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
                            <label htmlFor={`visit-${index}-country`} className="form-label">Country</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiFlag /></div>
                                <select
                                    className={`form-select ${errors?.foreignVisits?.[index]?.country ? 'is-invalid' : ''}`}
                                    id={`visit-${index}-country`}
                                    {...register(`foreignVisits.${index}.country`, { required: 'Country is required' })}
                                >
                                    <option value="">Select Country</option>
                                    {countries.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {errors?.foreignVisits?.[index]?.country && (
                                    <div className="invalid-feedback">{errors.foreignVisits[index].country.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`visit-${index}-purpose`} className="form-label">Purpose</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiBookOpen /></div>
                                <select
                                    className={`form-select ${errors?.foreignVisits?.[index]?.purpose ? 'is-invalid' : ''}`}
                                    id={`visit-${index}-purpose`}
                                    {...register(`foreignVisits.${index}.purpose`, { required: 'Purpose is required' })}
                                >
                                    <option value="">Select Purpose</option>
                                    {purposeOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {errors?.foreignVisits?.[index]?.purpose && (
                                    <div className="invalid-feedback">{errors.foreignVisits[index].purpose.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`visit-${index}-startDate`} className="form-label">Start Date</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.foreignVisits?.[index]?.start_date ? 'is-invalid' : ''}`}
                                    id={`visit-${index}-start_date`}
                                    {...register(`foreignVisits.${index}.start_date`, { required: 'Start date is required' })}
                                />
                                {errors?.foreignVisits?.[index]?.start_date && (
                                    <div className="invalid-feedback">{errors.foreignVisits[index].start_date.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor={`visit-${index}-endDate`} className="form-label">End Date</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiCalendar /></div>
                                <input
                                    type="date"
                                    className={`form-control ${errors?.foreignVisits?.[index]?.end_date ? 'is-invalid' : ''}`}
                                    id={`visit-${index}-end_date`}
                                    {...register(`foreignVisits.${index}.end_date`, { required: 'End date is required' })}
                                />
                                {errors?.foreignVisits?.[index]?.end_date && (
                                    <div className="invalid-feedback">{errors.foreignVisits[index].end_date.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                            <label htmlFor={`visit-${index}-sponsor`} className="form-label">Sponsor</label>
                            <div className="input-group">
                                <div className="input-group-text"><FiUser /></div>
                                <input
                                    type="text"
                                    className={`form-control ${errors?.foreignVisits?.[index]?.sponsor ? 'is-invalid' : ''}`}
                                    id={`visit-${index}-sponsor`}
                                    placeholder="e.g., HEC, WHO"
                                    {...register(`foreignVisits.${index}.sponsor`, { required: 'Sponsor is required' })}
                                />
                                {errors?.foreignVisits?.[index]?.sponsor && (
                                    <div className="invalid-feedback">{errors.foreignVisits[index].sponsor.message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button 
                type="button" 
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={handleAddVisit}
            >
                <FiPlus size={16} /> Add Foreign Visit
            </button>
        </div>
    );
};

export default ForeignVisitsTab;
