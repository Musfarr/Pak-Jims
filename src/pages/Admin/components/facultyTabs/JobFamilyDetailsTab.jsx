import React from 'react';
import { FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import Input from '@/components/shared/Input';

const JobFamilyDetailsTab = ({ 
    startDate, 
    setStartDate, 
    renderFooter, 
    selectedOption, 
    setSelectedOption 
}) => {
    return (
        <div className="card-body job-family-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Job / Family Details:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Employment and family information</span>
                </h5>
                <button type="button" className="btn btn-sm btn-primary">Save</button>
            </div>
            
            <Input
                icon='feather-briefcase'
                label={"Working In"}
                labelId={"workingInInput"}
                placeholder={"Working In"}
                name={"workingIn"}
            />
            
            <Input
                icon='feather-briefcase'
                label={"Current Post"}
                labelId={"currentPostInput"}
                placeholder={"Current Post"}
                name={"currentPost"}
            />
            
            <Input
                icon='feather-award'
                label={"Scale/Grade"}
                labelId={"scaleGradeInput"}
                placeholder={"Scale/Grade"}
                name={"scaleGrade"}
            />
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="dateOfJoiningCurrentPost" className="fw-semibold">Date of Joining Current Post: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group flex-nowrap">
                        <div className="input-group-text"><FiCalendar size={16} /></div>
                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                            <DatePicker
                                placeholderText='03/02/2025'
                                selected={startDate}
                                showPopperArrow={false}
                                onChange={(date) => setStartDate(date)}
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
            
            <Input
                icon='feather-grid'
                label={"Department"}
                labelId={"departmentInput"}
                placeholder={"Department"}
                name={"department"}
            />
            
            <Input
                icon='feather-user'
                label={"Name of Supervisory Officer"}
                labelId={"supervisorNameInput"}
                placeholder={"Name of Supervisory Officer"}
                name={"supervisorName"}
            />
            
            <Input
                icon='feather-user'
                label={"Designation of Supervisory Officer"}
                labelId={"supervisorDesignationInput"}
                placeholder={"Designation of Supervisory Officer"}
                name={"supervisorDesignation"}
            />
            
            <Input
                icon='feather-phone'
                label={"Mobile (Officer)"}
                labelId={"supervisorMobileInput"}
                placeholder={"___-_______"}
                name={"supervisorMobile"}
            />
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Is spouse in PSAQSJIMS? </label>
                </div>
                <div className="col-lg-8">
                    <div className="d-flex gap-4">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="isSpouseInPsaqsjims" id="spouseNo" value="no" checked />
                            <label className="form-check-label" htmlFor="spouseNo">NO</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="isSpouseInPsaqsjims" id="spouseYes" value="yes" />
                            <label className="form-check-label" htmlFor="spouseYes">IF Yes, Name:</label>
                            <input type="text" className="form-control form-control-sm ms-2" style={{ width: '200px' }} />
                        </div>
                    </div>
                </div>
            </div>
            
            <Input
                icon='feather-user'
                label={"Designation of Spouse"}
                labelId={"spouseDesignationInput"}
                placeholder={"Designation of Spouse"}
                name={"spouseDesignation"}
            />
            
            <Input
                icon='feather-map-pin'
                label={"Place of Posting"}
                labelId={"placeOfPostingInput"}
                placeholder={"Place of Posting"}
                name={"placeOfPosting"}
            />
            
            <Input
                icon='feather-users'
                label={"Size of Family"}
                labelId={"familySizeInput"}
                placeholder={"Self, Spouse, Sons, Daughters"}
                name={"familySize"}
            />
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">No. of Son(s): </label>
                </div>
                <div className="col-lg-8">
                    <input type="number" className="form-control" min="0" name="numberOfSons" />
                </div>
            </div>
            
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">No. of Daughter(s): </label>
                </div>
                <div className="col-lg-8">
                    <input type="number" className="form-control" min="0" name="numberOfDaughters" />
                </div>
            </div>
        </div>
    );
};

export default JobFamilyDetailsTab;
