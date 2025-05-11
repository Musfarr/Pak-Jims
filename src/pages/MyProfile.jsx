import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiUserCheck, FiCalendar, FiClock } from 'react-icons/fi';

const MyProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="container py-5"><h2>Loading profile...</h2></div>;
  }

  return (
    <div className="container py-5">
      <div className="card mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-header bg-primary text-white text-center">
          <FiUser size={48} className="mb-2" />
          <h3 className="mb-0">{user?.name}</h3>
          <span className="badge bg-success text-uppercase mt-2">{user?.user_type}</span>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><FiMail className="me-2" />Email: <b>{user?.email}</b></li>
            <li className="list-group-item"><FiPhone className="me-2" />Phone: <b>{user?.phone}</b></li>
            <li className="list-group-item"><FiUserCheck className="me-2" />Username: <b>{user?.username}</b></li>
            <li className="list-group-item"><FiUser className="me-2" />Institute ID: <b>{user?.institute_id}</b></li>
            <li className="list-group-item"><FiUser className="me-2" />Branch ID: <b>{user?.branch_id}</b></li>
            <li className="list-group-item"><FiClock className="me-2" />Last Login: <b>{new Date(user?.last_login_at).toLocaleString()}</b></li>
            {/* <li className="list-group-item"><FiCalendar className="me-2" />Created At: <b>{user.created_at}</b></li> */}
            {/* <li className="list-group-item"><FiCalendar className="me-2" />Updated At: <b>{user.updated_at}</b></li> */}
            {/* <li className="list-group-item"><FiUser className="me-2" />Status: <b>{user.status === '1' ? 'Active' : 'Inactive'}</b></li> */}
            {/* <li className="list-group-item"><FiUser className="me-2" />Login Status: <b>{user.login_status}</b></li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
