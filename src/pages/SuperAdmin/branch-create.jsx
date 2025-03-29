import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { FiSave, FiX } from 'react-icons/fi';

const BranchCreate = () => {
  const { id } = useParams();
  
  return (
    <>
      <PageHeader>
        <h4 className="mb-0">Create New Branch</h4>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Branch Information</h5>
                  <Link to="/branch/list" className="btn btn-outline-secondary">
                    Back to List
                  </Link>
                </div>
                
                <form>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="name" className="form-label">Branch Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter branch name"
                      />
                    </div>
                    
                    <div className="col-md-12 mb-3">
                      <label htmlFor="address" className="form-label">Address*</label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        rows="3"
                        placeholder="Enter branch address"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <Link to="/branch/list" className="btn btn-secondary me-2">
                      <FiX className="me-1" /> Cancel
                    </Link>
                    <button type="button" className="btn btn-primary">
                      <FiSave className="me-1" /> Create Branch
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchCreate;