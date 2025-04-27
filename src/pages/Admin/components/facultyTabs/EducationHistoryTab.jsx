import React from 'react';
import { FiCalendar, FiPlus, FiTrash } from 'react-icons/fi';
import { useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
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
            fromDate: null, 
            toDate: null, 
            gpaGradeDiv: '', 
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
                <button type="button" className="btn btn-sm btn-primary">Save</button>
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

                    {/* Name of Institute */}
                    <Input
                        icon='feather-home'
                        label={"Name of Institute"}
                        labelId={`education-${index}-institute`}
                        placeholder={"e.g., University of Health Sciences"}
                        name={`education.${index}.nameOfInstitute`}
                        value={watch(`education.${index}.nameOfInstitute`)}
                        onChange={(e) => setValue(`education.${index}.nameOfInstitute`, e.target.value)}
                    />

                    {/* Degree */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`education-${index}-degree`} className="fw-semibold">Degree: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group">
                                <div className="input-group-text"></div>
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

                    {/* Subject */}
                    <Input
                        icon='feather-book'
                        label={"Subject"}
                        labelId={`education-${index}-subject`}
                        placeholder={"e.g., Medicine, Computer Science"}
                        name={`education.${index}.subject`}
                        value={watch(`education.${index}.subject`)}
                        onChange={(e) => setValue(`education.${index}.subject`, e.target.value)}
                    />

                    {/* From Date */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`education-${index}-fromDate`} className="fw-semibold">From Date: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group flex-nowrap">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                    <DatePicker
                                        placeholderText='Start Date'
                                        selected={watch(`education.${index}.fromDate`)}
                                        showPopperArrow={false}
                                        onChange={(date) => setValue(`education.${index}.fromDate`, date)}
                                        className='form-control rounded-0'
                                        popperPlacement="bottom-start"
                                        calendarContainer={({ children }) => (
                                            <div className='bg-white react-datepicker'>
                                                {children}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* To Date */}
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <label htmlFor={`education-${index}-toDate`} className="fw-semibold">To Date: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group flex-nowrap">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                    <DatePicker
                                        placeholderText='End Date'
                                        selected={watch(`education.${index}.toDate`)}
                                        showPopperArrow={false}
                                        onChange={(date) => setValue(`education.${index}.toDate`, date)}
                                        className='form-control rounded-0'
                                        popperPlacement="bottom-start"
                                        calendarContainer={({ children }) => (
                                            <div className='bg-white react-datepicker'>
                                                {children}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* GPA/Grade/Division */}
                    <Input
                        icon='feather-star'
                        label={"GPA/Grade/Div"}
                        labelId={`education-${index}-gpaGradeDiv`}
                        placeholder={"e.g., 3.8/4.0, A+, First Division"}
                        name={`education.${index}.gpaGradeDiv`}
                        value={watch(`education.${index}.gpaGradeDiv`)}
                        onChange={(e) => setValue(`education.${index}.gpaGradeDiv`, e.target.value)}
                    />

                    {/* City */}
                    <Input
                        icon='feather-map-pin'
                        label={"City"}
                        labelId={`education-${index}-city`}
                        placeholder={"e.g., Lahore, Karachi"}
                        name={`education.${index}.city`}
                        value={watch(`education.${index}.city`)}
                        onChange={(e) => setValue(`education.${index}.city`, e.target.value)}
                    />

                    {/* Country */}
                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Country: </label>
                        </div>
                        <div className="col-lg-8">
                            <SelectDropdown
                                options={countryOptions}
                                selectedOption={watch(`education.${index}.country`) ? { value: watch(`education.${index}.country`), label: countryOptions.find(c => c.value === watch(`education.${index}.country`))?.label || watch(`education.${index}.country`) } : null}
                                defaultSelect=""
                                onSelectOption={(option) => setValue(`education.${index}.country`, option.value)}
                            />
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
