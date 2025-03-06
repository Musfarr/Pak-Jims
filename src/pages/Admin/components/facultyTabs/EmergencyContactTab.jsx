import React from 'react';
import TextArea from '@/components/shared/TextArea';
import SelectDropdown from '@/components/shared/SelectDropdown';
import Input from '@/components/shared/Input';

const EmergencyContactTab = ({ selectedOption, setSelectedOption }) => {
    return (
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
                            { value: 'spouse', label: 'Spouse' },
                            { value: 'parent', label: 'Parent' },
                            { value: 'sibling', label: 'Sibling' },
                            { value: 'child', label: 'Child' },
                            { value: 'relative', label: 'Other Relative' },
                            { value: 'other', label: 'Other' }
                        ]}
                        selectedOption={selectedOption}
                        defaultSelect="spouse"
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
    );
};

export default EmergencyContactTab;
