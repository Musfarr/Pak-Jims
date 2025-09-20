import React, { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import html2pdf from 'html2pdf.js';

// Labels mapping (mirrors StudentSimpleView)
const FIELD_LABELS = {
  name: 'Name',
  surname: 'Surname',
  father_name: 'Father Name',
  gender: 'Gender',
  dob: 'Date of Birth',
  cnic: 'CNIC',
  mobile_1: 'Mobile 1',
  mobile_2: 'Mobile 2',
  father_mobile: "Father's Mobile",
  email: 'Email',
  religion: 'Religion',
  nationality: 'Nationality',
  domicile: 'Domicile',
  category: 'Category',
  current_address: 'Current Address',
  permanent_address: 'Permanent Address',
  remarks: 'Remarks',
  enrollment_type: 'Enrollment Type',
  migrated_from: 'Migrated From',
  last_examication: 'Last Examination',
  devision: 'Division/Grade',
  university: 'University/Board',
  certificate_no: 'Eligibility Certificate No.',
  seat_no: 'Seat No.',
  year: 'Year',
  result_status: 'Result Status',
  enrollment_no: 'Enrollment No',
  admission_date: 'Admission Date',
  rf_id: 'RF ID',
  enroll_no_ii: 'Enroll No II',
  shift: 'Shift',
  course: 'Course',
  department: 'Department',
  batch: 'Batch',
  emergency_contact_name: 'Emergency Contact Name',
  emergency_contact_phone: 'Emergency Contact Phone',
  emergency_contact_email: 'Emergency Contact Email',
  emergency_contact_relationship: 'Emergency Contact Relationship',
};

const PERSONAL_INFO = [
  'name', 'surname', 'father_name', 'gender', 'dob', 'cnic', 'religion', 'nationality'
];
const CONTACT_INFO = [
  'mobile_1', 'mobile_2', 'father_mobile', 'email', 'current_address', 'permanent_address'
];
const ACADEMIC_INFO = [
  'enrollment_no', 'admission_date', 'rf_id', 'enroll_no_ii', 'shift', 'course', 'department', 'batch'
];
const EDUCATION_INFO = [
  'enrollment_type', 'migrated_from', 'last_examication', 'devision', 'university', 'certificate_no', 'seat_no', 'year', 'result_status'
];
const EMERGENCY_INFO = [
  'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_email', 'emergency_contact_relationship'
];

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

const StudentPrintView = () => {
  const { id } = useParams();
  const printRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['student', id],
    queryFn: () => GetApi(`/students/${id}`),
    enabled: !!id,
  });

  const student = data?.data || {};

  // Flatten nested objects similar to StudentSimpleView
  const viewData = useMemo(() => ({
    ...student,
    domicile: student?.domicile?.name || '',
    category: student?.category?.name || '',
    shift: student?.shift?.name || '',
    course: student?.course?.name || '',
    department: student?.department?.name || '',
    batch: student?.batch?.name || '',
    dob: formatDate(student?.dob),
    admission_date: formatDate(student?.admission_date),
  }), [student]);

  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim() !== '' && val !== '-';
    return true;
  };

  const renderField = (key) => {
    const value = viewData[key];
    if (!hasValue(value)) return null;
    return (
      <div className="col-6 mb-2" key={key}>
        <div className="d-flex">
          <div className="fw-semibold me-2" style={{ minWidth: 180 }}>{FIELD_LABELS[key]}:</div>
          <div className="flex-grow-1">{value}</div>
        </div>
      </div>
    );
  };

  const Section = ({ title, fields }) => {
    const visible = fields.filter((k) => hasValue(viewData[k]));
    if (visible.length === 0) return null;
    return (
      <div className="mb-3">
        <div className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ fontSize: 13 }}>{title}</div>
        <div className="row">
          {visible.map((f) => renderField(f))}
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const opt = {
      margin: [8, 8, 8, 8],
      filename: `${viewData.name || 'student'}-${viewData.enrollment_no || id}.pdf`,
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
            <h2 className="mb-1">Student Print Preview</h2>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>Preview the student form and click Print to generate A4 PDF</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/student-list" className="btn btn-secondary btn-sm">Back to List</Link>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">Print / Save PDF</button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading student data...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-danger" role="alert">
            Error loading student: {error?.message || 'Unknown error'}
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              {/* Printable content */}
              <div ref={printRef} className="print-a4">
                {/* Header with logos */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <img src={'/images/logo1.jpg'} alt="Institute Logo" style={{ height: 50 }} onError={(e)=>{ e.currentTarget.style.visibility='hidden'; }} />
                    <div>
                      <div className="fw-bold" style={{ fontSize: 16 }}>Institute</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>Student Information Form</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <img src={viewData.photo || '/images/avatar/default.png'} alt="Student" style={{ height: 64, width: 64, objectFit: 'cover', borderRadius: 4 }} onError={(e)=>{ e.currentTarget.src='/images/avatar/default.png'; }} />
                    <div className="small mt-1">#{viewData.enrollment_no || id}</div>
                  </div>
                </div>

                <div className="border-top pt-2" />

                {/* Sections */}
                <Section title="Personal Information" fields={PERSONAL_INFO} />
                <Section title="Contact Information" fields={CONTACT_INFO} />
                <Section title="Academic Information" fields={ACADEMIC_INFO} />
                <Section title="Educational Background" fields={EDUCATION_INFO} />
                <Section title="Emergency Contact" fields={EMERGENCY_INFO} />

                {/* Footer note */}
                <div className="mt-2 text-muted" style={{ fontSize: 10 }}>
                  Generated on {new Date().toLocaleDateString()} • Powered by PAQ
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-a4, .print-a4 * { visibility: visible; }
          .print-a4 { position: absolute; left: 0; top: 0; width: 210mm; min-height: 297mm; padding: 8mm; }
        }
        .print-a4 { background: #fff; }
      `}</style>
    </div>
  );
};

export default StudentPrintView;
