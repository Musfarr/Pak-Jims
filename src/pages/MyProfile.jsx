import React from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/utils/Api/ApiServices';
import { 
  FiUser, FiMail, FiPhone, FiClock, FiUserCheck, FiBriefcase, 
  FiBook, FiBookOpen, FiCalendar, FiMapPin, FiAward, FiHome, 
  FiPhoneCall, FiInfo, FiUsers, FiBookmark, FiLayers, FiMap, 
  FiCreditCard, FiFileText, FiBookmark as FiGraduation, FiPackage, 
  FiGlobe, FiFlag, FiHeart, FiDollarSign, FiGift, FiTool, FiCpu 
} from 'react-icons/fi';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to capitalize first letter
const capitalize = (str) => {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const MyProfile = () => {
  const { user } = useAuth();
  
  // Fetch profile data based on user type
  const { 
    data: profileResponse, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['profile', user?.id, user?.user_type],
    queryFn: () => {
      if (!user) return null;
      
      let endpoint = '';
      if (user.user_type === 'admin') {
        endpoint = `/users/${user.id}`;
      } else if (user.user_type === 'faculty') {
        endpoint = `/faculties/${user.reference_id}`;
      } else if (user.user_type === 'student') {
        endpoint = `/students/${user.reference_id}`;
      }
      
      if (!endpoint) {
        throw new Error('Invalid user type');
      }
      
      return GetApi(endpoint);
    },
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (response) => response?.data
  });
  
  const profileData = profileResponse?.data || profileResponse;

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Please log in to view your profile</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error Loading Profile</h4>
          <p>{error?.message || 'An error occurred while loading profile data'}</p>
          <button 
            className="btn btn-primary mt-2" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Function to render common user info
  const renderCommonInfo = () => (
    <>
      <li className="list-group-item">
        <FiMail className="me-2" />Email: <b>{user?.email || 'N/A'}</b>
      </li>
      <li className="list-group-item">
        <FiPhone className="me-2" />Phone: <b>{user?.phone || 'N/A'}</b>
      </li>
      <li className="list-group-item">
        <FiUserCheck className="me-2" />Username: <b>{user?.username || 'N/A'}</b>
      </li>
      <li className="list-group-item">
        <FiUser className="me-2" />User Type: <b className="text-capitalize">{user?.user_type || 'N/A'}</b>
      </li>
      <li className="list-group-item">
        <FiClock className="me-2" />Last Login: <b>{user?.last_login_at ? formatDate(user.last_login_at) : 'N/A'}</b>
      </li>
      {profileData?.created_at && (
        <li className="list-group-item">
          <FiCalendar className="me-2" />Member Since: <b>{formatDate(profileData.created_at)}</b>
        </li>
      )}
      {profileData?.institute && (
        <li className="list-group-item">
          <FiHome className="me-2" />Institute: <b>{profileData.institute.name || profileData.institute}</b>
        </li>
      )}
    </>
  );

  // Add missing icon components
  const BloodDropIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>
  );
  const FiHash = () => <span>#</span>;

  // Function to render role-specific information
  const renderRoleSpecificInfo = () => {
    if (!profileData) return null;
  
    const userType = user.user_type?.toLowerCase();
  
    switch (userType) {
      case 'admin':
        return (
          <>
            <li className="list-group-item">
              <FiBriefcase className="me-2" />Role: <b>Administrator</b>
            </li>
            <li className="list-group-item">
              <FiUserCheck className="me-2" />Admin ID: <b>{profileData.id || 'N/A'}</b>
            </li>
            {profileData.institute?.name && (
              <li className="list-group-item">
                <FiCpu className="me-2" />Institute: <b>{profileData.institute.name}</b>
              </li>
            )}
          </>
        );
        
      case 'faculty':
        const faculty = profileData.profile || {};
        const jobFamily = profileData.jobFamily || {};
        const education = profileData.education?.[0];
        
        return (
          <>
            <div className="card-header bg-light">
              <h5 className="mb-0">Professional Information</h5>
            </div>
            <li className="list-group-item">
              <FiUser className="me-2" />Full Name: <b>{`${faculty.name || ''} ${faculty.surname || ''}`.trim() || 'N/A'}</b>
            </li>
            <li className="list-group-item">
              <FiBook className="me-2" />Faculty ID: <b>{faculty.id || 'N/A'}</b>
            </li>
            <li className="list-group-item">
              <FiAward className="me-2" />Designation: <b>{faculty.designation || 'N/A'}</b>
            </li>
            <li className="list-group-item">
              <FiHome className="me-2" />Department: <b>{jobFamily.department || faculty.department || 'N/A'}</b>
            </li>
            {faculty.gender && (
              <li className="list-group-item">
                <FiUser className="me-2" />Gender: <b className="text-capitalize">{faculty.gender}</b>
              </li>
            )}
            {faculty.dob && (
              <li className="list-group-item">
                <FiCalendar className="me-2" />Date of Birth: <b>{formatDate(faculty.dob)}</b>
              </li>
            )}
            {faculty.cnic_no && (
              <li className="list-group-item">
                <FiCreditCard className="me-2" />CNIC: <b>{faculty.cnic_no || 'N/A'}</b>
              </li>
            )}
            {faculty.pmdc_no && (
              <li className="list-group-item">
                <FiFileText className="me-2" />PMDC Number: <b>{faculty.pmdc_no}</b>
              </li>
            )}
            {faculty.blood_group && (
              <li className="list-group-item">
                <span className="me-2"><BloodDropIcon /></span>Blood Group: <b>{faculty.blood_group}</b>
              </li>
            )}
            
            {faculty.education?.length > 0 && (
              <>
                <div className="card-header bg-light mt-3">
                  <h5 className="mb-0">Education</h5>
                </div>
                {faculty.education.map((edu, index) => (
                  <li key={index} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <div>
                        <FiGraduation className="me-2" />
                        <b>{edu.degree} in {edu.subject}</b>
                      </div>
                      <div className="text-muted">{edu.institute_name}</div>
                    </div>
                    <div className="ms-4 text-muted">
                      {edu.start_date && formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                    </div>
                  </li>
                ))}
              </>
            )}
            
            {faculty.workExperience?.length > 0 && (
              <>
                <div className="card-header bg-light mt-3">
                  <h5 className="mb-0">Work Experience</h5>
                </div>
                {faculty.workExperience.map((exp, index) => (
                  <li key={index} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <div>
                        <FiBriefcase className="me-2" />
                        <b>{exp.designation}</b> at {exp.organization_name}
                      </div>
                      <div className="text-muted">
                        {exp.joining_date && formatDate(exp.joining_date)} - {exp.leaving_date ? formatDate(exp.leaving_date) : 'Present'}
                      </div>
                    </div>
                  </li>
                ))}
              </>
            )}
            
            {faculty.trainings?.length > 0 && (
              <>
                <div className="card-header bg-light mt-3">
                  <h5 className="mb-0">Trainings & Certifications</h5>
                </div>
                {faculty.trainings.map((training, index) => (
                  <li key={index} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <div>
                        <FiAward className="me-2" />
                        <b>{training.course_detail}</b> at {training.institute_name}
                      </div>
                      <div className="text-muted">
                        {formatDate(training.start_date)} - {formatDate(training.end_date)}
                      </div>
                    </div>
                  </li>
                ))}
              </>
            )}
          </>
        );
        
      case 'student':
        return (
          <>
            <div className="card-header bg-light">
              <h5 className="mb-0">Academic Information</h5>
            </div>
            <li className="list-group-item">
              <FiBook className="me-2" />Enrollment No: <b>{profileData.enrollment_no || 'N/A'}</b>
            </li>
            <li className="list-group-item">
              <FiAward className="me-2" />Program: <b>{profileData.course?.name || 'N/A'}</b>
            </li>
            <li className="list-group-item">
              <FiCalendar className="me-2" />Admission Date: <b>{formatDate(profileData.admission_date)}</b>
            </li>
            <li className="list-group-item">
              <FiUsers className="me-2" />Batch: <b>{profileData.batch?.name || profileData.batch_id || 'N/A'}</b>
            </li>
            <li className="list-group-item">
              <FiClock className="me-2" />Shift: <b>{profileData.shift?.name || profileData.shift_id || 'N/A'}</b>
            </li>
            {profileData.section && (
              <li className="list-group-item">
                <FiLayers className="me-2" />Section: <b>{profileData.section}</b>
              </li>
            )}
            {profileData.roll_number && (
              <li className="list-group-item">
                <FiHash className="me-2" />Roll Number: <b>{profileData.roll_number}</b>
              </li>
            )}
            
            <div className="card-header bg-light mt-3">
              <h5 className="mb-0">Personal Information</h5>
            </div>
            <li className="list-group-item">
              <FiUser className="me-2" />Full Name: <b>{`${profileData.name || ''} ${profileData.surname || ''}`.trim() || 'N/A'}</b>
            </li>
            {profileData.father_name && (
              <li className="list-group-item">
                <FiUser className="me-2" />Father's Name: <b>{profileData.father_name}</b>
              </li>
            )}
            {profileData.gender && (
              <li className="list-group-item">
                <FiUser className="me-2" />Gender: <b className="text-capitalize">{profileData.gender}</b>
              </li>
            )}
            {profileData.dob && (
              <li className="list-group-item">
                <FiCalendar className="me-2" />Date of Birth: <b>{formatDate(profileData.dob)}</b>
              </li>
            )}
            {profileData.cnic && (
              <li className="list-group-item">
                <FiCreditCard className="me-2" />CNIC: <b>{profileData.cnic}</b>
              </li>
            )}
            {profileData.religion && (
              <li className="list-group-item">
                <FiBookmark className="me-2" />Religion: <b className="text-capitalize">{profileData.religion}</b>
              </li>
            )}
            {profileData.nationality && (
              <li className="list-group-item">
                <FiGlobe className="me-2" />Nationality: <b>{profileData.nationality}</b>
              </li>
            )}
            {profileData.domicile?.name && (
              <li className="list-group-item">
                <FiMapPin className="me-2" />Domicile: <b>{profileData.domicile.name}</b>
              </li>
            )}
            
            <div className="card-header bg-light mt-3">
              <h5 className="mb-0">Contact Information</h5>
            </div>
            {profileData.email && (
              <li className="list-group-item">
                <FiMail className="me-2" />Email: <b>{profileData.email}</b>
              </li>
            )}
            {profileData.mobile_1 && (
              <li className="list-group-item">
                <FiPhone className="me-2" />Mobile: <b>{profileData.mobile_1}</b>
              </li>
            )}
            {profileData.mobile_2 && (
              <li className="list-group-item">
                <FiPhone className="me-2" />Alternate Mobile: <b>{profileData.mobile_2}</b>
              </li>
            )}
            {profileData.current_address && (
              <li className="list-group-item">
                <FiHome className="me-2" />Current Address: <b>{profileData.current_address}</b>
              </li>
            )}
            {profileData.permanent_address && profileData.permanent_address !== profileData.current_address && (
              <li className="list-group-item">
                <FiMapPin className="me-2" />Permanent Address: <b>{profileData.permanent_address}</b>
              </li>
            )}
            
            {(profileData.last_examication || profileData.university || profileData.certificate_no) && (
              <div className="card-header bg-light mt-3">
                <h5 className="mb-0">Previous Education</h5>
              </div>
            )}
            {profileData.last_examication && (
              <li className="list-group-item">
                <FiBookOpen className="me-2" />Last Examination: <b>{profileData.last_examication}</b>
              </li>
            )}
            {profileData.university && (
              <li className="list-group-item">
                <FiBookOpen className="me-2" />University/Board: <b>{profileData.university}</b>
              </li>
            )}
            {profileData.certificate_no && (
              <li className="list-group-item">
                <FiFileText className="me-2" />Certificate No: <b>{profileData.certificate_no}</b>
              </li>
            )}
            {profileData.year && (
              <li className="list-group-item">
                <FiCalendar className="me-2" />Passing Year: <b>{profileData.year}</b>
              </li>
            )}
            {profileData.devision && (
              <li className="list-group-item">
                <FiAward className="me-2" />Division: <b>{profileData.devision}</b>
              </li>
            )}
          </>
        );
        
      default:
        return null;
    }
  };

  // Main render
  return (
    <div className="container py-5">
      <div className="card mx-auto" style={{ maxWidth: 600 }}>
        <div className="card-header bg-primary text-white text-center">
          <FiUser size={48} className="mb-2" />
          <h3 className="mb-0">{user?.name || 'User Profile'}</h3>
          <span className="badge bg-success text-uppercase mt-2">
            {user?.user_type || 'User'}
          </span>
        </div>
        <div className="card-body p-0">
          <ul className="list-group list-group-flush">
            {renderCommonInfo()}
            {renderRoleSpecificInfo()}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
