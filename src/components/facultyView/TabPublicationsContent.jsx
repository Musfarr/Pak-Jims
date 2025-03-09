import React from 'react';
import { FiFileText, FiExternalLink, FiCalendar, FiUsers } from 'react-icons/fi';

const TabPublicationsContent = ({ faculty }) => {
    // Sample publications data - in a real app, this would be part of the faculty data
    const publicationsData = {
        journals: [
            { 
                id: 1, 
                title: 'Advances in Cardiology Treatment: A Comprehensive Review', 
                journal: 'International Journal of Medical Sciences', 
                year: '2024',
                authors: 'Muhammad Ali, Ahmed Khan, Fatima Shah',
                doi: '10.1234/ijms.2024.1234',
                url: 'https://example.com/publication1',
                citations: 12
            },
            { 
                id: 2, 
                title: 'Comparative Analysis of Heart Disease Risk Factors in Pakistan', 
                journal: 'Pakistan Journal of Medical Research', 
                year: '2023',
                authors: 'Muhammad Ali, Saima Malik',
                doi: '10.1234/pjmr.2023.5678',
                url: 'https://example.com/publication2',
                citations: 8
            },
            { 
                id: 3, 
                title: 'Impact of Lifestyle Modifications on Cardiovascular Health', 
                journal: 'Journal of Preventive Cardiology', 
                year: '2022',
                authors: 'Muhammad Ali, Zainab Ahmed, Omar Farooq',
                doi: '10.1234/jpc.2022.9012',
                url: 'https://example.com/publication3',
                citations: 15
            }
        ],
        conferences: [
            { 
                id: 1, 
                title: 'Modern Approaches to Cardiac Surgery', 
                conference: 'International Conference on Medical Advancements', 
                location: 'Dubai, UAE',
                year: '2024',
                authors: 'Muhammad Ali, Fatima Shah',
                url: 'https://example.com/conference1'
            },
            { 
                id: 2, 
                title: 'Telemedicine in Cardiology: Opportunities and Challenges', 
                conference: 'Pakistan Medical Conference', 
                location: 'Islamabad, Pakistan',
                year: '2023',
                authors: 'Muhammad Ali, Ahmed Khan',
                url: 'https://example.com/conference2'
            }
        ],
        books: [
            { 
                id: 1, 
                title: 'Fundamentals of Cardiology: A Practical Guide', 
                publisher: 'Medical Press',
                year: '2023',
                authors: 'Muhammad Ali, Saima Malik',
                isbn: '978-1-234567-89-0',
                url: 'https://example.com/book1'
            }
        ],
        researchProjects: [
            { 
                id: 1, 
                title: 'Genetic Factors in Early-Onset Heart Disease', 
                status: 'Ongoing',
                funding: 'National Research Foundation',
                year: '2023-2025',
                collaborators: 'University of Health Sciences, Lahore'
            },
            { 
                id: 2, 
                title: 'Effectiveness of Mobile Health Interventions in Cardiac Rehabilitation', 
                status: 'Completed',
                funding: 'Ministry of Health',
                year: '2021-2023',
                collaborators: 'Aga Khan University Hospital'
            }
        ]
    };

    return (
        <div className="card-body">
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-0">
                            <FiFileText className="me-2" />
                            Journal Publications
                        </h6>
                        <span className="badge bg-primary">{publicationsData.journals.length} Publications</span>
                    </div>
                    
                    <div className="accordion" id="journalAccordion">
                        {publicationsData.journals.map((pub, index) => (
                            <div key={pub.id} className="accordion-item">
                                <h2 className="accordion-header">
                                    <button 
                                        className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} 
                                        type="button" 
                                        data-bs-toggle="collapse" 
                                        data-bs-target={`#journal${pub.id}`} 
                                        aria-expanded={index === 0 ? 'true' : 'false'} 
                                        aria-controls={`journal${pub.id}`}
                                    >
                                        <div>
                                            <div className="fw-semibold">{pub.title}</div>
                                            <div className="text-muted fs-12">{pub.journal} ({pub.year})</div>
                                        </div>
                                    </button>
                                </h2>
                                <div 
                                    id={`journal${pub.id}`} 
                                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
                                    data-bs-parent="#journalAccordion"
                                >
                                    <div className="accordion-body">
                                        <div className="row">
                                            <div className="col-md-12 mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                                        <FiUsers className="text-primary" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <p className="mb-0 text-muted fs-12">Authors</p>
                                                        <p className="mb-0">{pub.authors}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                                        <FiCalendar className="text-primary" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <p className="mb-0 text-muted fs-12">Year</p>
                                                        <p className="mb-0">{pub.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                                        <FiFileText className="text-primary" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <p className="mb-0 text-muted fs-12">DOI</p>
                                                        <p className="mb-0">{pub.doi}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-icon avatar-xs me-2 flex-shrink-0 bg-light-primary">
                                                        <FiUsers className="text-primary" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <p className="mb-0 text-muted fs-12">Citations</p>
                                                        <p className="mb-0">{pub.citations}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <a href={pub.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                    <FiExternalLink className="me-1" /> View Publication
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-12 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-0">
                            <FiFileText className="me-2" />
                            Conference Papers
                        </h6>
                        <span className="badge bg-primary">{publicationsData.conferences.length} Papers</span>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Title</th>
                                    <th>Conference</th>
                                    <th>Year</th>
                                    <th>Location</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publicationsData.conferences.map(conf => (
                                    <tr key={conf.id}>
                                        <td>
                                            <div className="fw-semibold">{conf.title}</div>
                                            <div className="text-muted fs-12">{conf.authors}</div>
                                        </td>
                                        <td>{conf.conference}</td>
                                        <td>{conf.year}</td>
                                        <td>{conf.location}</td>
                                        <td>
                                            <a href={conf.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                <FiExternalLink className="me-1" /> View
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-0">
                            <FiFileText className="me-2" />
                            Books & Book Chapters
                        </h6>
                        <span className="badge bg-primary">{publicationsData.books.length}</span>
                    </div>
                    
                    <div className="list-group">
                        {publicationsData.books.map(book => (
                            <div key={book.id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">{book.title}</h6>
                                    <span className="badge bg-light text-dark">{book.year}</span>
                                </div>
                                <p className="text-muted mb-2 fs-12">Authors: {book.authors}</p>
                                <p className="text-muted mb-2 fs-12">Publisher: {book.publisher}</p>
                                <p className="text-muted mb-3 fs-12">ISBN: {book.isbn}</p>
                                <a href={book.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                    <FiExternalLink className="me-1" /> View Details
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-0">
                            <FiFileText className="me-2" />
                            Research Projects
                        </h6>
                        <span className="badge bg-primary">{publicationsData.researchProjects.length}</span>
                    </div>
                    
                    <div className="list-group">
                        {publicationsData.researchProjects.map(project => (
                            <div key={project.id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">{project.title}</h6>
                                    <span className={`badge ${project.status === 'Ongoing' ? 'bg-success' : 'bg-secondary'}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-muted mb-2 fs-12">Period: {project.year}</p>
                                <p className="text-muted mb-2 fs-12">Funding: {project.funding}</p>
                                <p className="text-muted mb-0 fs-12">Collaborators: {project.collaborators}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabPublicationsContent;
