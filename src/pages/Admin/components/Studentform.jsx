import React, { useState } from 'react'
import { FiCalendar, FiCamera } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import TextArea from '@/components/shared/TextArea'
import SelectDropdown from '@/components/shared/SelectDropdown'
import Input from '@/components/shared/Input'
import MultiSelectTags from '@/components/shared/MultiSelectTags'
import useLocationData from '@/hooks/useLocationData'
import useDatePicker from '@/hooks/useDatePicker'

const Studentform = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const { countries, states, cities, loading, error, fetchStates, fetchCities, } = useLocationData();
    
    // Define student status options
    const studentStatusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' }
    ];

    // Define student program/course options
    const programOptions = [
        { value: 'computer-science', label: 'Computer Science' },
        { value: 'business-admin', label: 'Business Administration' },
        { value: 'engineering', label: 'Engineering' },
        { value: 'medicine', label: 'Medicine' }
    ];

    return (
        <div className="col-lg-12">
            <div className="card border-top-0">
                <div className="card-header p-0">
                    <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link active" data-bs-toggle="tab" data-bs-target="#profileTab" role="tab">Profile</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#academicTab" role="tab">Academic</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#emergencyTab" role="tab">Emergency Contact</a>
                        </li>
                        <li className="nav-item flex-fill border-top" role="presentation">
                            <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#passwordTab" role="tab">Password</a>
                        </li>
                    </ul>
                </div>
                <div className="tab-content">
                    {/* Profile Tab */}
                    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
                        <div className="card-body personal-info">
                            <div className="mb-4 d-flex align-items-center justify-content-between">
                                <h5 className="fw-bold mb-0 me-4">
                                    <span className="d-block mb-2">Student Information:</span>
                                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Basic information about the student</span>
                                </h5>
                                <button type="button" className="btn btn-sm btn-primary">Save</button>
                            </div>
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Profile Picture: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="mb-4 mb-md-0 d-flex gap-4 your-brand">
                                        <label htmlFor='img' className="wd-100 ht-100 position-relative overflow-hidden border border-gray-2 rounded">
                                            <img src="/images/avatar/1.png" className="upload-pic img-fluid rounded h-100 w-100" alt="" />
                                            <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button">
                                                <i aria-hidden="true" className='camera-icon'><FiCamera /></i>
                                            </div>
                                            <input className="file-upload" type="file" accept="image/*" id='img' hidden />
                                        </label>
                                        <div className="d-flex flex-column gap-1">
                                            <div className="fs-11 text-gray-500 mt-2"># Upload student profile picture</div>
                                            <div className="fs-11 text-gray-500"># Image size 150x150</div>
                                            <div className="fs-11 text-gray-500"># Max upload size 2mb</div>
                                            <div className="fs-11 text-gray-500"># Allowed file types: png, jpg, jpeg</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Input
                                icon='feather-user'
                                label={"First Name"}
                                labelId={"firstNameInput"}
                                placeholder={"First Name"}
                                name={"firstName"}
                            />
                            <Input
                                icon='feather-user'
                                label={"Last Name"}
                                labelId={"lastNameInput"}
                                placeholder={"Last Name"}
                                name={"lastName"}
                            />
                            <Input
                                icon='feather-credit-card'
                                label={"Student ID"}
                                labelId={"studentIdInput"}
                                placeholder={"Student ID"}
                                name={"studentId"}
                            />
                            <Input
                                icon='feather-mail'
                                label={"Email"}
                                labelId={"emailInput"}
                                placeholder={"Email"}
                                name={"email"}
                                type={"email"}
                            />
                            <Input
                                icon='feather-phone'
                                label={"Phone"}
                                labelId={"phoneInput"}
                                placeholder={"Phone"}
                                name={"phone"}
                            />
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label htmlFor="dateofBirth" className="fw-semibold">Date of Birth: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="input-group flex-nowrap">
                                        <div className="input-group-text"><FiCalendar size={16} /></div>
                                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                                            <DatePicker
                                                placeholderText='Pick date of birth'
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
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Gender: </label>
                                </div>
                                <div className="col-lg-8">
                                    <div className="d-flex gap-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" id="male" value="male" />
                                            <label className="form-check-label" htmlFor="male">Male</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" id="female" value="female" />
                                            <label className="form-check-label" htmlFor="female">Female</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" id="other" value="other" />
                                            <label className="form-check-label" htmlFor="other">Other</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <TextArea
                                icon="feather-map-pin"
                                label={"Address"}
                                labelId={"addressInput"}
                                placeholder={"Address"}
                            />
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Country: </label>
                                </div>
                                <div className="col-lg-8">
                                    <SelectDropdown
                                        options={countries}
                                        selectedOption={selectedOption}
                                        defaultSelect="usa"
                                        onSelectOption={(option) => {
                                            fetchStates(option.label);
                                            fetchCities(option.label);
                                            setSelectedOption(option)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">State: </label>
                                </div>
                                <div className="col-lg-8">
                                    <SelectDropdown
                                        options={states}
                                        selectedOption={selectedOption}
                                        defaultSelect={"new-york"}
                                        onSelectOption={(option) => setSelectedOption(option)}
                                    />
                                </div>
                            </div>
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">City: </label>
                                </div>
                                <div className="col-lg-8">
                                    <SelectDropdown
                                        options={cities}
                                        selectedOption={selectedOption}
                                        defaultSelect={"new-york-city"}
                                        onSelectOption={(option) => setSelectedOption(option)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Tab */}
                    <div className="tab-pane fade" id="academicTab" role="tabpanel">
                        <div className="card-body academic-info">
                            <div className="mb-4 d-flex align-items-center justify-content-between">
                                <h5 className="fw-bold mb-0 me-4">
                                    <span className="d-block mb-2">Academic Information:</span>
                                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Student's academic details and program information</span>
                                </h5>
                                <button type="button" className="btn btn-sm btn-primary">Save</button>
                            </div>
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Program/Course: </label>
                                </div>
                                <div className="col-lg-8">
                                    <SelectDropdown
                                        options={programOptions}
                                        selectedOption={selectedOption}
                                        defaultSelect="computer-science"
                                        onSelectOption={(option) => setSelectedOption(option)}
                                    />
                                </div>
                            </div>
                            <Input
                                icon='feather-calendar'
                                label={"Enrollment Date"}
                                labelId={"enrollmentDateInput"}
                                placeholder={"YYYY-MM-DD"}
                                name={"enrollmentDate"}
                            />
                            <Input
                                icon='feather-calendar'
                                label={"Expected Graduation Date"}
                                labelId={"graduationDateInput"}
                                placeholder={"YYYY-MM-DD"}
                                name={"graduationDate"}
                            />
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Status: </label>
                                </div>
                                <div className="col-lg-8">
                                    <SelectDropdown
                                        options={studentStatusOptions}
                                        selectedOption={selectedOption}
                                        defaultSelect="active"
                                        onSelectOption={(option) => setSelectedOption(option)}
                                    />
                                </div>
                            </div>
                            <TextArea
                                icon="feather-file-text"
                                label={"Academic Notes"}
                                labelId={"academicNotesInput"}
                                placeholder={"Any additional notes about the student's academic performance or requirements"}
                                row='4'
                            />
                        </div>
                    </div>

                    {/* Emergency Contact Tab */}
                    <div className="tab-pane fade" id="emergencyTab" role="tabpanel">
                        <div className="card-body emergency-info">
                            <div className="mb-4 d-flex align-items-center justify-content-between">
                                <h5 className="fw-bold mb-0 me-4">
                                    <span className="d-block mb-2">Emergency Contact Information:</span>
                                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Contact details in case of emergency</span>
                                </h5>
                                <button type="button" className="btn btn-sm btn-primary">Save</button>
                            </div>
                            <Input
                                icon='feather-user'
                                label={"Contact Name"}
                                labelId={"emergencyNameInput"}
                                placeholder={"Emergency Contact Name"}
                                name={"emergencyName"}
                            />
                            <Input
                                icon='feather-phone'
                                label={"Contact Phone"}
                                labelId={"emergencyPhoneInput"}
                                placeholder={"Emergency Contact Phone"}
                                name={"emergencyPhone"}
                            />
                            <Input
                                icon='feather-mail'
                                label={"Contact Email"}
                                labelId={"emergencyEmailInput"}
                                placeholder={"Emergency Contact Email"}
                                name={"emergencyEmail"}
                                type={"email"}
                            />
                            <div className="row mb-4 align-items-center">
                                <div className="col-lg-4">
                                    <label className="fw-semibold">Relationship: </label>
                                </div>
                                <div className="col-lg-8">
                                    <SelectDropdown
                                        options={[
                                            { value: 'parent', label: 'Parent' },
                                            { value: 'guardian', label: 'Guardian' },
                                            { value: 'sibling', label: 'Sibling' },
                                            { value: 'relative', label: 'Other Relative' },
                                            { value: 'other', label: 'Other' }
                                        ]}
                                        selectedOption={selectedOption}
                                        defaultSelect="parent"
                                        onSelectOption={(option) => setSelectedOption(option)}
                                    />
                                </div>
                            </div>
                            <TextArea
                                icon="feather-map-pin"
                                label={"Contact Address"}
                                labelId={"emergencyAddressInput"}
                                placeholder={"Emergency Contact Address"}
                                row='3'
                            />
                        </div>
                    </div>

                    {/* Password Tab */}
                    <div className="tab-pane fade" id="passwordTab" role="tabpanel">
                        <div className="card-body password-info">
                            <div className="mb-4 d-flex align-items-center justify-content-between">
                                <h5 className="fw-bold mb-0 me-4">
                                    <span className="d-block mb-2">Login Credentials:</span>
                                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Set student login credentials</span>
                                </h5>
                                <button type="button" className="btn btn-sm btn-primary">Save</button>
                            </div>
                            <Input
                                icon='feather-user'
                                label={"Username"}
                                labelId={"usernameInput"}
                                placeholder={"Username"}
                                name={"username"}
                            />
                            <Input
                                icon='feather-lock'
                                label={"Password"}
                                labelId={"passwordInput"}
                                placeholder={"Password"}
                                name={"password"}
                                type={"password"}
                            />
                            <Input
                                icon='feather-lock'
                                label={"Confirm Password"}
                                labelId={"confirmPasswordInput"}
                                placeholder={"Confirm Password"}
                                name={"confirmPassword"}
                                type={"password"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Studentform