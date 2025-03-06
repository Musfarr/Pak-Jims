import React, { useState } from 'react';
import { FiCalendar, FiPlus, FiTrash } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import Input from '@/components/shared/Input';
import SelectDropdown from '@/components/shared/SelectDropdown';

const EducationHistoryTab = ({ startDate, setStartDate, renderFooter }) => {
    const [educationHistory, setEducationHistory] = useState([
        { 
            id: 1, 
            nameOfInstitute: '', 
            degree: '', 
            fromDate: null, 
            toDate: null, 
            gpaGradeDiv: '', 
            city: '', 
            country: '',
            subject: '' 
        }
    ]);

    const handleAddEducation = () => {
        const newId = educationHistory.length > 0 
            ? Math.max(...educationHistory.map(item => item.id)) + 1 
            : 1;
        setEducationHistory([...educationHistory, { 
            id: newId, 
            nameOfInstitute: '', 
            degree: '', 
            fromDate: null, 
            toDate: null, 
            gpaGradeDiv: '', 
            city: '', 
            country: '',
            subject: '' 
        }]);
    };

    const handleRemoveEducation = (id) => {
        if (educationHistory.length > 1) {
            setEducationHistory(educationHistory.filter(item => item.id !== id));
        }
    };

    const handleEducationChange = (id, field, value) => {
        setEducationHistory(educationHistory.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
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
        <div className="card-body education-history-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Education History:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Academic qualifications and education background</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>

            {educationHistory.map((education, index) => (
                <div key={education.id} className="education-entry border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between mb-3">
                        <h6 className="fw-bold">Education #{index + 1}</h6>
                        {educationHistory.length > 1 && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveEducation(education.id)}
                            >
                                <FiTrash size={16} />
                            </button>
                        )}
                    </div>

                    <Input
                        icon='feather-home'
                        label={"Name of Institute"}
                        labelId={`nameOfInstitute-${education.id}`}
                        placeholder={"e.g., University of Health Sciences"}
                        name={`nameOfInstitute-${education.id}`}
                        value={education.nameOfInstitute}
                        onChange={(e) => handleEducationChange(education.id, 'nameOfInstitute', e.target.value)}
                    />

                    <Input
                        icon='feather-award'
                        label={"Degree"}
                        labelId={`degree-${education.id}`}
                        placeholder={"e.g., MBBS, PhD"}
                        name={`degree-${education.id}`}
                        value={education.degree}
                        onChange={(e) => handleEducationChange(education.id, 'degree', e.target.value)}
                    />

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor={`fromDate-${education.id}`} className="fw-semibold">From: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group flex-nowrap">
                                        <div className="input-group-text"><FiCalendar size={16} /></div>
                                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                            <DatePicker
                                                placeholderText='Start Date'
                                                selected={education.fromDate}
                                                showPopperArrow={false}
                                                onChange={(date) => handleEducationChange(education.id, 'fromDate', date)}
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
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor={`toDate-${education.id}`} className="fw-semibold">To: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group flex-nowrap">
                                        <div className="input-group-text"><FiCalendar size={16} /></div>
                                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                            <DatePicker
                                                placeholderText='End Date'
                                                selected={education.toDate}
                                                showPopperArrow={false}
                                                onChange={(date) => handleEducationChange(education.id, 'toDate', date)}
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
                    </div>

                    <Input
                        icon='feather-star'
                        label={"GPA/Grade/Div"}
                        labelId={`gpaGradeDiv-${education.id}`}
                        placeholder={"e.g., 3.8/4.0, A+, First Division"}
                        name={`gpaGradeDiv-${education.id}`}
                        value={education.gpaGradeDiv}
                        onChange={(e) => handleEducationChange(education.id, 'gpaGradeDiv', e.target.value)}
                    />

                    <Input
                        icon='feather-map-pin'
                        label={"City"}
                        labelId={`city-${education.id}`}
                        placeholder={"e.g., Lahore, Karachi"}
                        name={`city-${education.id}`}
                        value={education.city}
                        onChange={(e) => handleEducationChange(education.id, 'city', e.target.value)}
                    />

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Country: </label>
                        </div>
                        <div className="col-lg-8">
                            <SelectDropdown
                                options={countryOptions}
                                selectedOption={education.country ? { value: education.country, label: countryOptions.find(c => c.value === education.country)?.label || education.country } : null}
                                defaultSelect=""
                                onSelectOption={(option) => handleEducationChange(education.id, 'country', option.value)}
                            />
                        </div>
                    </div>

                    <Input
                        icon='feather-book'
                        label={"Subject"}
                        labelId={`subject-${education.id}`}
                        placeholder={"e.g., Medicine, Computer Science"}
                        name={`subject-${education.id}`}
                        value={education.subject}
                        onChange={(e) => handleEducationChange(education.id, 'subject', e.target.value)}
                    />
                </div>
            ))}

            <div className="d-flex justify-content-center mt-3">
                <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={handleAddEducation}
                >
                    <FiPlus size={16} className="me-2" /> Add Education
                </button>
            </div>
        </div>
    );
};

export default EducationHistoryTab;
