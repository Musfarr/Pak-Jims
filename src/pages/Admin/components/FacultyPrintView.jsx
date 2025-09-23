import React, { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import html2pdf from 'html2pdf.js';

// Labels from FacultySimpleView
const PROFILE_LABELS = {
  id: 'Faculty ID',
  name: 'Name',
  gender: 'Gender',
  designation: 'Designation',
  grade: 'Grade',
  joining_date: 'Joining Date',
  marital_status: 'Marital Status',
  nationality: 'Nationality',
  religion: 'Religion',
  blood_group: 'Blood Group',
  identity_mark: 'Identity Mark',
  domicile_id: 'Domicile ID',
  province: 'Province',
  dob: 'Date of Birth',
  pmdc_no: 'PMDC No.',
  cnic_no: 'CNIC No.',
  passport_no: 'Passport No.',
  birth_place: 'Birth Place',
  father_name: 'Father Name',
  surname: 'Surname',
  persent_address: 'Present Address',
  permanent_address: 'Permanent Address',
  phone: 'Phone',
  mobile_no: 'Mobile No.',
  emergency_no: 'Emergency No.',
  offical_email: 'Official Email',
  personal_email: 'Personal Email',
  emergency_email: 'Emergency Email',
  remarks: 'Remarks',
  status: 'Status',
  currently: 'Currently',
  date_of_relieving: 'Date of Relieving',
  reason_of_relieving: 'Reason of Relieving',
  faculty_type: 'Faculty Type',
};

const EMERGENCY_LABELS = {
  emergency_name: 'Name',
  emergency_relation: 'Relation',
  emergency_phone: 'Phone',
  emergency_address: 'Address',
};

const JOB_FAMILY_LABELS = {
  working_in: 'Working In',
  current_post: 'Current Post',
  scale: 'Scale',
  date_of_joining_current_post: 'Date of Joining Current Post',
  department: 'Department',
  supervisory_officer: 'Supervisory Officer',
  designation_supervisory_officer: 'Designation of Supervisory Officer',
  mobile: 'Mobile',
  spouse_paqsjims: 'Spouse in PAQSJIMS',
  spouse_name_paqsjims: 'Spouse Name',
  designation_of_spouse: 'Designation of Spouse',
  place_of_posting: 'Place of Posting',
  size_of_family: 'Size of Family',
  no_of_sons: 'Number of Sons',
  no_of_daugther: 'Number of Daughters',
};

const formatDate = (dateString) => {
  if (!dateString || dateString === '0000-00-00 00:00:00' || dateString === '0000-00-00') return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString();
  } catch {
    return '';
  }
};

const formatBoolean = (value) => {
  if (value === '0' || value === 0) return 'No';
  if (value === '1' || value === 1) return 'Yes';
  return value || '';
};

const FacultyPrintView = () => {
  const { id } = useParams();
  const printRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['faculty', id],
    queryFn: () => GetApi(`/faculties/${id}`),
    enabled: !!id,
  });

  const facultyData = data?.data || {};
  const profile = facultyData.profile || {};
  const emergency = facultyData.emergency || {};
  const jobFamily = facultyData.jobFamily || {};
  const education = facultyData.education || [];
  const workExperience = facultyData.workExperience || [];
  const trainings = facultyData.trainings || [];
  const foreignVisits = facultyData.foreignVisits || [];

  const viewData = useMemo(() => ({
    ...profile,
    joining_date: formatDate(profile.joining_date),
    dob: formatDate(profile.dob),
    date_of_relieving: formatDate(profile.date_of_relieving),
  }), [profile]);

  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim() !== '' && val !== '-';
    return true;
  };

  const renderKeyValue = (label, value, key) => {
    if (!hasValue(value)) return null;
    return (
      <div className="col-6 mb-2" key={key || label}>
        <div className="d-flex">
          <div className="fw-semibold me-2" style={{ minWidth: 180 }}>{label}:</div>
          <div className="flex-grow-1">{value}</div>
        </div>
      </div>
    );
  };

  const Section = ({ title, entries }) => {
    const visible = entries.filter(Boolean);
    if (visible.length === 0) return null;
    return (
      <div className="mb-3">
        <div className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ fontSize: 13 }}>{title}</div>
        <div className="row">
          {visible}
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const opt = {
      margin: [8, 8, 8, 8],
      filename: `${viewData.name || 'faculty'}-${viewData.id || id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    html2pdf().set(opt).from(printRef.current).save();
  };

  return (
    <div className="main-content">
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">Faculty Print Preview</h2>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>Preview the faculty profile and click Print to generate A4 PDF</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/faculty-list" className="btn btn-secondary btn-sm">Back to List</Link>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">Print / Save PDF</button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading faculty details...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-danger" role="alert">Error: {error?.message || 'Unknown error'}</div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div ref={printRef} className="print-a4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <img src={'/images/logo1.jpg'} alt="Institute Logo" style={{ height: 50 }} onError={(e)=>{ e.currentTarget.style.visibility='hidden'; }} />
                    <div>
                      <div className="fw-bold" style={{ fontSize: 18   }}>{profile?.institute?.name || 'Unknown'}</div>
                      <div className="text-muted" style={{ fontSize: 14 }}>Faculty Profile</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <img src={profile?.avatar || '/images/avatar/default.png'} alt="Faculty" style={{ height: 64, width: 64, objectFit: 'cover', borderRadius: 4 }} onError={(e)=>{ e.currentTarget.src='/images/avatar/default.png'; }} />
                    <div className="small mt-1">#{viewData.id || id}</div>
                  </div>
                </div>

                <div className="border-top pt-2" />

                {/* Sections */}
                <Section
                  title="Personal Information"
                  entries={Object.entries(PROFILE_LABELS).map(([key, label]) => (
                    key in viewData ? renderKeyValue(label, viewData[key], key) : null
                  ))}
                />

                <Section
                  title="Job Information"
                  entries={Object.entries(JOB_FAMILY_LABELS).map(([key, label]) => {
                    const valRaw = jobFamily[key];
                    const val = key === 'spouse_paqsjims' ? formatBoolean(valRaw) : (key.includes('date') ? formatDate(valRaw) : valRaw);
                    return renderKeyValue(label, val, key);
                  })}
                />

                <Section
                  title="Emergency Contact"
                  entries={Object.entries(EMERGENCY_LABELS).map(([key, label]) => renderKeyValue(label, emergency[key], key))}
                />

                {/* Tabular sections compact */}
                {education?.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ fontSize: 13 }}>Education History</div>
                    <table className="table table-bordered table-sm" style={{ fontSize: 11 }}>
                      <thead>
                        <tr>
                          <th>Institute</th>
                          <th>Degree</th>
                          <th>Subject</th>
                          <th>Grade</th>
                          <th>Duration</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {education.map((edu) => (
                          <tr key={edu.id}>
                            <td>{edu.institute_name || ''}</td>
                            <td>{edu.degree || ''}</td>
                            <td>{edu.subject || ''}</td>
                            <td>{edu.grade || ''}</td>
                            <td>{formatDate(edu.start_date)} - {formatDate(edu.end_date)}</td>
                            <td>{[edu.city, edu.country].filter(Boolean).join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {workExperience?.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ fontSize: 13 }}>Work Experience</div>
                    <table className="table table-bordered table-sm" style={{ fontSize: 11 }}>
                      <thead>
                        <tr>
                          <th>Organization</th>
                          <th>Designation</th>
                          <th>Scale</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workExperience.map((exp) => (
                          <tr key={exp.id}>
                            <td>{exp.organization_name || ''}</td>
                            <td>{exp.designation || ''}</td>
                            <td>{exp.scale || ''}</td>
                            <td>{formatDate(exp.joining_date)} - {formatDate(exp.leaving_date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="row">
                  {trainings?.length > 0 && (
                    <div className="col-6 mb-3">
                      <div className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ fontSize: 13 }}>Trainings</div>
                      <table className="table table-bordered table-sm" style={{ fontSize: 11 }}>
                        <thead>
                          <tr>
                            <th>Institute</th>
                            <th>Course</th>
                            <th>Duration</th>
                            <th>Country</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trainings.map((tr) => (
                            <tr key={tr.id}>
                              <td>{tr.institute_name || ''}</td>
                              <td>{tr.course_detail || ''}</td>
                              <td>{formatDate(tr.start_date)} - {formatDate(tr.end_date)}</td>
                              <td>{tr.country || ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {foreignVisits?.length > 0 && (
                    <div className="col-6 mb-3">
                      <div className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ fontSize: 13 }}>Foreign Visits</div>
                      <table className="table table-bordered table-sm" style={{ fontSize: 11 }}>
                        <thead>
                          <tr>
                            <th>Country</th>
                            <th>Purpose</th>
                            <th>Duration</th>
                            <th>Sponsor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {foreignVisits.map((fv) => (
                            <tr key={fv.id}>
                              <td>{fv.country || ''}</td>
                              <td>{fv.purpose || ''}</td>
                              <td>{formatDate(fv.start_date)} - {formatDate(fv.end_date)}</td>
                              <td>{fv.sponsor || ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Footer note */}
                <div className="mt-2 text-muted" style={{ fontSize: 10 }}>
                  Generated on {new Date().toLocaleDateString()} • Powered by <a href="https://www.digilitesolutions.net" target="_blank" rel="noopener noreferrer">www.digilitesolutions.net</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-a4, .print-a4 * { visibility: visible; }
          .print-a4 { position: absolute; left: 0; top: 0; width: 210mm; min-height: 297mm; padding: 8mm; }
          .table { page-break-inside: avoid; }
        }
        .print-a4 { background: #fff; }
      `}</style>
    </div>
  );
};

export default FacultyPrintView;
