import React from 'react';
import { FiCalendar, FiCamera } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import TextArea from '@/components/shared/TextArea';
import SelectDropdown from '@/components/shared/SelectDropdown';
import Input from '@/components/shared/Input';

const ProfileTab = ({ 
    startDate, 
    setStartDate, 
    renderFooter, 
    selectedOption, 
    setSelectedOption,
    countries,
    states,
    cities,
    fetchStates,
    fetchCities
}) => {
    return (
        <div className="card-body personal-info">
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 me-4">
                    <span className="d-block mb-2">Faculty Information:</span>
                    <span className="fs-12 fw-normal text-muted text-truncate-1-line">Basic information about the faculty member</span>
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
                            <div className="fs-11 text-gray-500 mt-2"># Upload faculty profile picture</div>
                            <div className="fs-11 text-gray-500"># Image size 150x150</div>
                            <div className="fs-11 text-gray-500"># Max upload size 2mb</div>
                            <div className="fs-11 text-gray-500"># Allowed file types: png, jpg, jpeg</div>
                        </div>
                    </div>
                </div>
            </div>
            <Input
                icon='feather-credit-card'
                label={"Faculty ID"}
                labelId={"facultyIdInput"}
                placeholder={"Faculty ID"}
                name={"facultyId"}
            />
            <Input
                icon='feather-user'
                label={"Faculty Name"}
                labelId={"facultyNameInput"}
                placeholder={"Faculty Name"}
                name={"facultyName"}
            />
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
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Designation: </label>
                </div>
                <div className="col-lg-8">
                    <SelectDropdown
                        options={[
                            { value: 'registrar', label: 'REGISTRAR' },
                            { value: 'dean', label: 'DEAN' },
                            { value: 'professor', label: 'PROFESSOR' },
                            { value: 'lecturer', label: 'LECTURER' }
                        ]}
                        selectedOption={selectedOption}
                        defaultSelect="registrar"
                        onSelectOption={(option) => setSelectedOption(option)}
                    />
                </div>
            </div>
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Grade: </label>
                </div>
                <div className="col-lg-8">
                    <SelectDropdown
                        options={[
                            { value: 'bps18', label: 'BPS 18' },
                            { value: 'bps19', label: 'BPS 19' },
                            { value: 'bps20', label: 'BPS 20' },
                            { value: 'bps21', label: 'BPS 21' }
                        ]}
                        selectedOption={selectedOption}
                        defaultSelect="bps18"
                        onSelectOption={(option) => setSelectedOption(option)}
                    />
                </div>
            </div>
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="joiningDate" className="fw-semibold">Joining Date: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group flex-nowrap">
                        <div className="input-group-text"><FiCalendar size={16} /></div>
                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                            <DatePicker
                                placeholderText='Pick joining date'
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
                    <label className="fw-semibold">Marital Status: </label>
                </div>
                <div className="col-lg-8">
                    <SelectDropdown
                        options={[
                            { value: 'married', label: 'MARRIED' },
                            { value: 'single', label: 'SINGLE' },
                            { value: 'divorced', label: 'DIVORCED' },
                            { value: 'widowed', label: 'WIDOWED' }
                        ]}
                        selectedOption={selectedOption}
                        defaultSelect="married"
                        onSelectOption={(option) => setSelectedOption(option)}
                    />
                </div>
            </div>
            <Input
                icon='feather-flag'
                label={"Nationality"}
                labelId={"nationalityInput"}
                placeholder={"PAKISTAN"}
                name={"nationality"}
            />
            <Input
                icon='feather-bookmark'
                label={"Religion"}
                labelId={"religionInput"}
                placeholder={"ISLAM"}
                name={"religion"}
            />
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Blood Group: </label>
                </div>
                <div className="col-lg-8">
                    <SelectDropdown
                        options={[
                            { value: 'a-positive', label: 'A POSITIVE' },
                            { value: 'a-negative', label: 'A NEGATIVE' },
                            { value: 'b-positive', label: 'B POSITIVE' },
                            { value: 'b-negative', label: 'B NEGATIVE' },
                            { value: 'ab-positive', label: 'AB POSITIVE' },
                            { value: 'ab-negative', label: 'AB NEGATIVE' },
                            { value: 'o-positive', label: 'O POSITIVE' },
                            { value: 'o-negative', label: 'O NEGATIVE' }
                        ]}
                        selectedOption={selectedOption}
                        defaultSelect="b-positive"
                        onSelectOption={(option) => setSelectedOption(option)}
                    />
                </div>
            </div>
            <Input
                icon='feather-bookmark'
                label={"Identity Mark"}
                labelId={"identityMarkInput"}
                placeholder={"N/A"}
                name={"identityMark"}
            />
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Domicile: </label>
                </div>
                <div className="col-lg-8">
                    <SelectDropdown
                        options={[
                            { value: 'khairpur', label: 'KHAIRPUR' },
                            { value: 'karachi', label: 'KARACHI' },
                            { value: 'lahore', label: 'LAHORE' },
                            { value: 'islamabad', label: 'ISLAMABAD' }
                        ]}
                        selectedOption={selectedOption}
                        defaultSelect="khairpur"
                        onSelectOption={(option) => setSelectedOption(option)}
                    />
                </div>
            </div>
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Province: </label>
                </div>
                <div className="col-lg-8">
                    <SelectDropdown
                        options={[
                            { value: 'sindh', label: 'SINDH' },
                            { value: 'punjab', label: 'PUNJAB' },
                            { value: 'kpk', label: 'KHYBER PAKHTUNKHWA' },
                            { value: 'balochistan', label: 'BALOCHISTAN' }
                        ]}
                        selectedOption={selectedOption}
                        defaultSelect="sindh"
                        onSelectOption={(option) => setSelectedOption(option)}
                    />
                </div>
            </div>
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
            <Input
                icon='feather-credit-card'
                label={"PMDC No"}
                labelId={"pmdcInput"}
                placeholder={"123"}
                name={"pmdc"}
            />
            <Input
                icon='feather-credit-card'
                label={"C.N.I.C No"}
                labelId={"cnicInput"}
                placeholder={"___-_______-_"}
                name={"cnic"}
            />
            <Input
                icon='feather-credit-card'
                label={"Passport No"}
                labelId={"passportInput"}
                placeholder={"Passport No."}
                name={"passport"}
            />
            <Input
                icon='feather-map-pin'
                label={"Birth Place"}
                labelId={"birthPlaceInput"}
                placeholder={"GAMBAT"}
                name={"birthPlace"}
            />
            <Input
                icon='feather-user'
                label={"Father Name"}
                labelId={"fatherNameInput"}
                placeholder={"Father's Name"}
                name={"fatherName"}
            />
            <Input
                icon='feather-user'
                label={"Surname"}
                labelId={"surnameInput"}
                placeholder={"BHATTI"}
                name={"surname"}
            />
            <TextArea
                icon="feather-map-pin"
                label={"Present Address"}
                labelId={"presentAddressInput"}
                placeholder={"GAMBAT, SINDH"}
                name={"presentAddress"}
            />
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold"> </label>
                </div>
                <div className="col-lg-8">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="sameAsPresent" />
                        <label className="form-check-label" htmlFor="sameAsPresent">Same as Present Address</label>
                    </div>
                </div>
            </div>
            <TextArea
                icon="feather-map-pin"
                label={"Permanent Address"}
                labelId={"permanentAddressInput"}
                placeholder={"GAMBAT, SINDH"}
                name={"permanentAddress"}
            />
            <Input
                icon='feather-phone'
                label={"Phone"}
                labelId={"phoneInput"}
                placeholder={"___-_______"}
                name={"phone"}
            />
            <Input
                icon='feather-smartphone'
                label={"Mobile No"}
                labelId={"mobileInput"}
                placeholder={"0303-0589819"}
                name={"mobile"}
            />
            <Input
                icon='feather-phone-call'
                label={"Emergency No"}
                labelId={"emergencyNoInput"}
                placeholder={"0323-2650961"}
                name={"emergencyNo"}
            />
            <Input
                icon='feather-mail'
                label={"Official Email"}
                labelId={"officialEmailInput"}
                placeholder={"registrar@pjims.edu.pk"}
                name={"officialEmail"}
                type={"email"}
            />
            <Input
                icon='feather-mail'
                label={"Personal Email"}
                labelId={"personalEmailInput"}
                placeholder={"shamim_bhtti@yahoo.com"}
                name={"personalEmail"}
                type={"email"}
            />
            <TextArea
                icon="feather-file-text"
                label={"Remarks"}
                labelId={"remarksInput"}
                placeholder={"Any additional notes or remarks"}
                name={"remarks"}
            />
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Status: </label>
                </div>
                <div className="col-lg-8">
                    <SelectDropdown
                        options={[
                            { value: 'permanent', label: 'PERMANENT' },
                            { value: 'contract', label: 'CONTRACT' },
                            { value: 'visiting', label: 'VISITING' },
                            { value: 'temporary', label: 'TEMPORARY' }
                        ]}
                        selectedOption={selectedOption}
                        defaultSelect="permanent"
                        onSelectOption={(option) => setSelectedOption(option)}
                    />
                </div>
            </div>
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label className="fw-semibold">Currently: </label>
                </div>
                <div className="col-lg-8">
                    <div className="d-flex gap-4">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="currently" id="present" value="present" checked />
                            <label className="form-check-label" htmlFor="present">Present</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="currently" id="relieved" value="relieved" />
                            <label className="form-check-label" htmlFor="relieved">Relieved</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-4 align-items-center">
                <div className="col-lg-4">
                    <label htmlFor="dateOfRelieving" className="fw-semibold">Date of Relieving: </label>
                </div>
                <div className="col-lg-8">
                    <div className="input-group flex-nowrap">
                        <div className="input-group-text"><FiCalendar size={16} /></div>
                        <div className='w-100 d-flex date rounded-0' style={{ flexBasis: "95%" }}>
                            <DatePicker
                                placeholderText='Pick date of relieving'
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
            <TextArea
                icon="feather-file-text"
                label={"Reason for Leaving"}
                labelId={"reasonForLeavingInput"}
                placeholder={"Reason for leaving"}
                name={"reasonForLeaving"}
            />
        </div>
    );
};

export default ProfileTab;
