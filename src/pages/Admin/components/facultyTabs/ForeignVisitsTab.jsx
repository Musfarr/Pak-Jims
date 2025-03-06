import React, { useState } from 'react';
import { FiCalendar, FiPlus, FiTrash } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import Input from '@/components/shared/Input';
import TextArea from '@/components/shared/TextArea';
import SelectDropdown from '@/components/shared/SelectDropdown';

const ForeignVisitsTab = ({ startDate, setStartDate, renderFooter, selectedOption, setSelectedOption }) => {
    const [foreignVisits, setForeignVisits] = useState([
        { id: 1, country: '', purpose: '', startDate: null, endDate: null, sponsor: '' }
    ]);

    const handleAddVisit = () => {
        const newId = foreignVisits.length > 0 
            ? Math.max(...foreignVisits.map(item => item.id)) + 1 
            : 1;
        setForeignVisits([...foreignVisits, { id: newId, country: '', purpose: '', startDate: null, endDate: null, sponsor: '' }]);
    };

    const handleRemoveVisit = (id) => {
        if (foreignVisits.length > 1) {
            setForeignVisits(foreignVisits.filter(item => item.id !== id));
        }
    };

    const handleVisitChange = (id, field, value) => {
        setForeignVisits(foreignVisits.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const countries = [
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

    const purposeOptions = [
        { value: 'conference', label: 'Conference/Seminar' },
        { value: 'training', label: 'Training/Workshop' },
        { value: 'research', label: 'Research Collaboration' },
        { value: 'fellowship', label: 'Fellowship' },
        { value: 'official', label: 'Official Visit' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <div className="card-body foreign-visits-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Foreign Visits:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">International travel for professional purposes</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>

            {foreignVisits.map((visit, index) => (
                <div key={visit.id} className="visit-entry border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between mb-3">
                        <h6 className="fw-bold">Foreign Visit #{index + 1}</h6>
                        {foreignVisits.length > 1 && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveVisit(visit.id)}
                            >
                                <FiTrash size={16} />
                            </button>
                        )}
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Country: </label>
                                </div>
                                <div className="col-lg-8">
                                    <SelectDropdown
                                        options={countries}
                                        selectedOption={visit.country ? { value: visit.country, label: countries.find(c => c.value === visit.country)?.label || visit.country } : null}
                                        defaultSelect=""
                                        onSelectOption={(option) => handleVisitChange(visit.id, 'country', option.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Purpose: </label>
                                </div>
                                <div className="col-lg-8">
                                    <SelectDropdown
                                        options={purposeOptions}
                                        selectedOption={visit.purpose ? { value: visit.purpose, label: purposeOptions.find(p => p.value === visit.purpose)?.label || visit.purpose } : null}
                                        defaultSelect=""
                                        onSelectOption={(option) => handleVisitChange(visit.id, 'purpose', option.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor={`startDate-${visit.id}`} className="fw-semibold">Start Date: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group flex-nowrap">
                                        <div className="input-group-text"><FiCalendar size={16} /></div>
                                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                            <DatePicker
                                                placeholderText='Start Date'
                                                selected={visit.startDate}
                                                showPopperArrow={false}
                                                onChange={(date) => handleVisitChange(visit.id, 'startDate', date)}
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
                                    <label htmlFor={`endDate-${visit.id}`} className="fw-semibold">End Date: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group flex-nowrap">
                                        <div className="input-group-text"><FiCalendar size={16} /></div>
                                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                            <DatePicker
                                                placeholderText='End Date'
                                                selected={visit.endDate}
                                                showPopperArrow={false}
                                                onChange={(date) => handleVisitChange(visit.id, 'endDate', date)}
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
                        icon='feather-user'
                        label={"Sponsor/Funding Agency"}
                        labelId={`sponsor-${visit.id}`}
                        placeholder={"e.g., WHO, Self, University"}
                        name={`sponsor-${visit.id}`}
                        value={visit.sponsor}
                        onChange={(e) => handleVisitChange(visit.id, 'sponsor', e.target.value)}
                    />
                </div>
            ))}

            <div className="d-flex justify-content-center mt-3">
                <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={handleAddVisit}
                >
                    <FiPlus size={16} className="me-2" /> Add Foreign Visit
                </button>
            </div>
        </div>
    );
};

export default ForeignVisitsTab;
