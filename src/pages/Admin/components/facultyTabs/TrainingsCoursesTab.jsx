import React, { useState } from 'react';
import { FiCalendar, FiPlus, FiTrash } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import Input from '@/components/shared/Input';
import SelectDropdown from '@/components/shared/SelectDropdown';

const TrainingsCoursesTab = ({ startDate, setStartDate, renderFooter }) => {
    const [trainings, setTrainings] = useState([
        { 
            id: 1, 
            trainingDetail: '', 
            grade: '', 
            countryStation: '', 
            dateFrom: null, 
            dateTo: null, 
            year: null,
            institute: '' 
        }
    ]);

    const handleAddTraining = () => {
        const newId = trainings.length > 0 
            ? Math.max(...trainings.map(item => item.id)) + 1 
            : 1;
        setTrainings([...trainings, { 
            id: newId, 
            trainingDetail: '', 
            grade: '', 
            countryStation: '', 
            dateFrom: null, 
            dateTo: null, 
            year: null,
            institute: '' 
        }]);
    };

    const handleRemoveTraining = (id) => {
        if (trainings.length > 1) {
            setTrainings(trainings.filter(item => item.id !== id));
        }
    };

    const handleTrainingChange = (id, field, value) => {
        setTrainings(trainings.map(item => 
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
        <div className="card-body trainings-courses-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Trainings & Courses:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Professional development and specialized training</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>

            {trainings.map((training, index) => (
                <div key={training.id} className="training-entry border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between mb-3">
                        <h6 className="fw-bold">Training/Course #{index + 1}</h6>
                        {trainings.length > 1 && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveTraining(training.id)}
                            >
                                <FiTrash size={16} />
                            </button>
                        )}
                    </div>

                    <Input
                        icon='feather-award'
                        label={"Training/Course Detail"}
                        labelId={`trainingDetail-${training.id}`}
                        placeholder={"e.g., Advanced Cardiac Life Support"}
                        name={`trainingDetail-${training.id}`}
                        value={training.trainingDetail}
                        onChange={(e) => handleTrainingChange(training.id, 'trainingDetail', e.target.value)}
                    />

                    <Input
                        icon='feather-star'
                        label={"Grade"}
                        labelId={`grade-${training.id}`}
                        placeholder={"e.g., A, B+, Distinction"}
                        name={`grade-${training.id}`}
                        value={training.grade}
                        onChange={(e) => handleTrainingChange(training.id, 'grade', e.target.value)}
                    />

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label className="fw-semibold">Country/Station: </label>
                        </div>
                        <div className="col-lg-8">
                            <SelectDropdown
                                options={countryOptions}
                                selectedOption={training.countryStation ? { value: training.countryStation, label: countryOptions.find(c => c.value === training.countryStation)?.label || training.countryStation } : null}
                                defaultSelect=""
                                onSelectOption={(option) => handleTrainingChange(training.id, 'countryStation', option.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor={`dateFrom-${training.id}`} className="fw-semibold">Date From: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group flex-nowrap">
                                        <div className="input-group-text"><FiCalendar size={16} /></div>
                                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                            <DatePicker
                                                placeholderText='Start Date'
                                                selected={training.dateFrom}
                                                showPopperArrow={false}
                                                onChange={(date) => handleTrainingChange(training.id, 'dateFrom', date)}
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
                                    <label htmlFor={`dateTo-${training.id}`} className="fw-semibold">Date To: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group flex-nowrap">
                                        <div className="input-group-text"><FiCalendar size={16} /></div>
                                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                            <DatePicker
                                                placeholderText='End Date'
                                                selected={training.dateTo}
                                                showPopperArrow={false}
                                                onChange={(date) => handleTrainingChange(training.id, 'dateTo', date)}
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

                    <div className="row mb-4 align-items-center">
                        <div className="col-lg-4">
                            <label htmlFor={`year-${training.id}`} className="fw-semibold">Year: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="input-group flex-nowrap">
                                <div className="input-group-text"><FiCalendar size={16} /></div>
                                <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                    <DatePicker
                                        placeholderText='Year'
                                        selected={training.year}
                                        showPopperArrow={false}
                                        onChange={(date) => handleTrainingChange(training.id, 'year', date)}
                                        className='form-control rounded-0'
                                        popperPlacement="bottom-start"
                                        showYearPicker
                                        dateFormat="yyyy"
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

                    <Input
                        icon='feather-home'
                        label={"Name of Institute/Organization"}
                        labelId={`institute-${training.id}`}
                        placeholder={"e.g., American Heart Association"}
                        name={`institute-${training.id}`}
                        value={training.institute}
                        onChange={(e) => handleTrainingChange(training.id, 'institute', e.target.value)}
                    />
                </div>
            ))}

            <div className="d-flex justify-content-center mt-3">
                <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={handleAddTraining}
                >
                    <FiPlus size={16} className="me-2" /> Add Training/Course
                </button>
            </div>
        </div>
    );
};

export default TrainingsCoursesTab;
