import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { PostApi, GetApi } from '@/utils/Api/ApiServices';
import { FiPlus, FiTrash2, FiFile, FiFileText, FiArrowLeft } from 'react-icons/fi';

const QECEditForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sections, setSections] = useState([]);
    const [activeSectionId, setActiveSectionId] = useState(null);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('radio');
    const [newOptionLabel, setNewOptionLabel] = useState('');
    const [newOptionText, setNewOptionText] = useState('');
    const [tempOptions, setTempOptions] = useState([
        {
            label: 'A',
            text: 'Strongly Agree'
        },
        {
            label: 'B',
            text: 'Agree'
        },
        {
            label: 'C',
            text: 'Uncertain'
        },
        {
            label: 'D',
            text: 'Disagree'
        },
        {
            label: 'E',
            text: 'Strongly Disagree'
        }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch existing QEC data
    const { data: qecData, isLoading: isLoadingQEC, error: qecError } = useQuery({
        queryKey: ['survey', id],
        queryFn: () => GetApi(`/surveys/${id}`),
        enabled: !!id,
        onError: (error) => {
            console.error('Error fetching QEC data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error loading QEC',
                text: 'Failed to load QEC data. Please try again.'
            });
        }
    });

    // Fetch templates
    const { data: templates, isLoading: isLoadingTemplates } = useQuery({
        queryKey: ['templates'],
        queryFn: () => GetApi('/templates'),
        onError: (error) => {
            console.error('Error fetching templates:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error loading templates',
                text: 'Failed to load survey templates. Please try again.'
            });
        }
    });

    // Form
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        defaultValues: {
            name: '',
            title: '',
            description: '',
            instructions: '',
            template_id: ''
        }
    });

    // Load existing data when QEC data is fetched
    useEffect(() => {
        if (qecData?.data) {
            const survey = qecData.data;
            
            // Set form values
            reset({
                name: survey.name || '',
                title: survey.title || '',
                description: survey.description || '',
                instructions: survey.instructions || '',
                template_id: survey.template_id || ''
            });

            // Set sections with proper structure
            if (survey.sections && survey.sections.length > 0) {
                const formattedSections = survey.sections.map((section, sectionIndex) => ({
                    id: section.id || Date.now() + sectionIndex,
                    title: section.title || section.section_title,
                    questions: section.questions ? section.questions.map((question, questionIndex) => ({
                        id: question.id || question.question_id || Date.now() + questionIndex,
                        text: question.text || question.question_text,
                        type: question.type || 'radio',
                        options: question.options ? question.options.map((option, optionIndex) => ({
                            id: option.id || option.option_id || Date.now() + optionIndex,
                            label: option.label,
                            text: option.text
                        })) : []
                    })) : []
                }));
                
                setSections(formattedSections);
                if (formattedSections.length > 0) {
                    setActiveSectionId(formattedSections[0].id);
                }
            }
        }
    }, [qecData, reset]);

    // Section logic
    const addSection = () => {
        if (!newSectionTitle.trim()) {
            Swal.fire({ icon: 'error', title: 'Section title required' });
            return;
        }
        const newSection = { id: Date.now(), title: newSectionTitle, questions: [] };
        setSections([...sections, newSection]);
        setActiveSectionId(newSection.id);
        setNewSectionTitle('');
    };

    const removeSection = (sectionId) => {
        Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true }).then((result) => {
            if (result.isConfirmed) {
                const filtered = sections.filter(s => s.id !== sectionId);
                setSections(filtered);
                if (activeSectionId === sectionId && filtered.length)
                    setActiveSectionId(filtered[0].id);
            }
        });
    };

    // Option logic
    const addOption = () => {
        if (!newOptionLabel.trim() || !newOptionText.trim()) {
            Swal.fire({ icon: 'error', title: 'Option label/text required' });
            return;
        }
        setTempOptions([...tempOptions, { label: newOptionLabel, text: newOptionText }]);
        setNewOptionLabel('');
        setNewOptionText('');
    };

    const removeOption = (idx) => {
        setTempOptions(tempOptions.filter((_, i) => i !== idx));
    };

    // Question logic
    const addQuestion = () => {
        if (!newQuestionText.trim()) {
            Swal.fire({ icon: 'error', title: 'Question text required' });
            return;
        }
        
        if (newQuestionType !== 'text' && tempOptions.length < 2) {
            Swal.fire({ icon: 'error', title: 'At least 2 options required for this question type' });
            return;
        }

        const newQ = { 
            id: Date.now(), 
            text: newQuestionText, 
            type: newQuestionType,
            options: newQuestionType === 'text' ? [] : tempOptions.map(opt => ({
                label: opt.label,
                text: opt.text
            }))
        };
        
        setSections(sections.map(s => 
            s.id === activeSectionId 
                ? { ...s, questions: [...s.questions, newQ] } 
                : s
        ));
        
        setNewQuestionText('');
        setNewQuestionType('radio');
        setTempOptions([
            { label: 'A', text: 'Strongly Agree' },
            { label: 'B', text: 'Agree' },
            { label: 'C', text: 'Uncertain' },
            { label: 'D', text: 'Disagree' },
            { label: 'E', text: 'Strongly Disagree' }
        ]);
    };

    const removeQuestion = (sectionId, questionId) => {
        setSections(sections.map(s => s.id === sectionId ? { ...s, questions: s.questions.filter(q => q.id !== questionId) } : s));
    };

    // Submit
    const onSubmit = (data) => {
        if (!sections.length) {
            Swal.fire({ icon: 'error', title: 'At least one section required' });
            return;
        }
        if (sections.some(s => !s.questions.length)) {
            Swal.fire({ icon: 'error', title: 'Each section needs at least one question' });
            return;
        }
        
        setIsSubmitting(true);
        const payload = {
            name: data.name,
            title: data.title,
            description: data.description,
            instructions: data.instructions || null,
            template_id: data.template_id || null,
            sections: sections.map(section => ({
                title: section.title,
                questions: section.questions.map(question => ({
                    text: question.text,
                    type: question.type,
                    options: question.options.map(opt => ({
                        label: opt.label,
                        text: opt.text
                    }))
                }))
            }))
        };

        PostApi(`/surveys/${id}`, payload)
            .then(() => {
                Swal.fire({ icon: 'success', title: 'Updated!' }).then(() => navigate('/qec-list'));
            })
            .catch((error) => {
                console.error('Error updating survey:', error);
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Failed to update QEC',
                    text: error.response?.data?.message || 'An error occurred while updating the survey.'
                });
            })
            .finally(() => setIsSubmitting(false));
    };

    if (isLoadingQEC) {
        return (
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading QEC data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (qecError) {
        return (
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-body">
                        <div className="alert alert-danger">
                            <h5>Error Loading QEC</h5>
                            <p>Failed to load QEC data. Please try again.</p>
                            <button className="btn btn-secondary" onClick={() => navigate('/qec-list')}>
                                <FiArrowLeft className="me-1" /> Back to QEC List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // UI
    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Edit QEC Survey</h5>
                    <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/qec-list')}
                    >
                        <FiArrowLeft className="me-1" /> Back to List
                    </button>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3 mb-4">
                            <div className="col-lg-6">
                                <label className="form-label">Survey Name</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiFile /></div>
                                    <input type="text" className={`form-control${errors.name ? ' is-invalid' : ''}`} {...register('name', { required: true })} />
                                    {errors.name && <div className="invalid-feedback">Name is required</div>}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <label className="form-label">Survey Title</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiFile /></div>
                                    <input type="text" className={`form-control${errors.title ? ' is-invalid' : ''}`} {...register('title', { required: true })} />
                                    {errors.title && <div className="invalid-feedback">Title is required</div>}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <label className="form-label">Template</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiFileText /></div>
                                    <select 
                                        className={`form-select ${errors.template_id ? 'is-invalid' : ''}`}
                                        {...register('template_id')}
                                        disabled={isLoadingTemplates}
                                    >
                                        <option value="">Select a template (optional)</option>
                                        {templates?.data?.map(template => (
                                            <option key={template.id} value={template.id}>
                                                {template.name}
                                            </option>
                                        ))}
                                    </select>
                                    {isLoadingTemplates && (
                                        <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Description</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiFile /></div>
                                    <input type="text" className={`form-control${errors.description ? ' is-invalid' : ''}`} {...register('description', { required: true })} />
                                    {errors.description && <div className="invalid-feedback">Description is required</div>}
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Instructions</label>
                                <textarea
                                    className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                                    rows="3"
                                    placeholder="Enter survey instructions (optional)"
                                    {...register('instructions')}
                                />
                                {errors.instructions && (
                                    <div className="invalid-feedback d-block">{errors.instructions.message}</div>
                                )}
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card border">
                                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Survey Sections</h5>
                                        <div className="input-group" style={{ maxWidth: 500 }}>
                                            <input type="text" className="form-control" placeholder="Enter section title" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} />
                                            <button type="button" className="btn btn-primary" onClick={addSection}><FiPlus /> Add Section</button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {sections.length === 0 ? (
                                            <div className="alert alert-info">No sections added yet. Add a section to begin creating your survey.</div>
                                        ) : (
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="list-group">
                                                        {sections.map(section => (
                                                            <button key={section.id} type="button" className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${activeSectionId === section.id ? ' active' : ''}`} onClick={() => setActiveSectionId(section.id)}>
                                                                <span className="text-truncate">{section.title}</span>
                                                                <span className="badge bg-primary rounded-pill">{section.questions.length}</span>
                                                                <button type="button" className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); removeSection(section.id); }}><FiTrash2 /></button>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-md-9">
                                                    {activeSectionId && (
                                                        <div>
                                                            <h5>{sections.find(s => s.id === activeSectionId)?.title} - Questions</h5>
                                                            <div className="card border mb-3">
                                                                <div className="card-header bg-light"><h6 className="mb-0">Add New Question</h6></div>
                                                                <div className="card-body">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Question Text</label>
                                                                        <input 
                                                                            type="text" 
                                                                            className="form-control" 
                                                                            placeholder="Enter question text" 
                                                                            value={newQuestionText} 
                                                                            onChange={e => setNewQuestionText(e.target.value)} 
                                                                        />
                                                                    </div>
                                                                    
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Question Type</label>
                                                                        <div className="btn-group w-100" role="group">
                                                                            {['radio', 'checkbox', 'text'].map(type => (
                                                                                <button
                                                                                    key={type}
                                                                                    type="button"
                                                                                    className={`btn ${newQuestionType === type ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                                                    onClick={() => setNewQuestionType(type)}
                                                                                >
                                                                                    {type === 'radio' ? 'Single Choice' : type === 'checkbox' ? 'Multiple Choice' : 'Text Answer'}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    {newQuestionType !== 'text' && (
                                                                        <div className="mb-3">
                                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                                <label className="form-label mb-0">Options</label>
                                                                                <div className="input-group" style={{ maxWidth: 400 }}>
                                                                                    <input 
                                                                                        type="text" 
                                                                                        className="form-control" 
                                                                                        placeholder="Option Label (e.g., A)" 
                                                                                        value={newOptionLabel} 
                                                                                        onChange={e => setNewOptionLabel(e.target.value)} 
                                                                                    />
                                                                                    <input 
                                                                                        type="text" 
                                                                                        className="form-control" 
                                                                                        placeholder="Option Text" 
                                                                                        value={newOptionText} 
                                                                                        onChange={e => setNewOptionText(e.target.value)} 
                                                                                    />
                                                                                    <button 
                                                                                        type="button" 
                                                                                        className="btn btn-outline-secondary" 
                                                                                        onClick={addOption}
                                                                                        disabled={!newOptionLabel.trim() || !newOptionText.trim()}
                                                                                    >
                                                                                        <FiPlus />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {tempOptions.length > 0 && (
                                                                                <div className="table-responsive">
                                                                                    <table className="table table-sm">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th width="15%">Label</th>
                                                                                                <th>Text</th>
                                                                                                <th width="10%">Action</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {tempOptions.map((option, idx) => (
                                                                                                <tr key={idx}>
                                                                                                    <td>{option.label}</td>
                                                                                                    <td>{option.text}</td>
                                                                                                    <td>
                                                                                                        <button 
                                                                                                            type="button" 
                                                                                                            className="btn btn-sm btn-danger" 
                                                                                                            onClick={() => removeOption(idx)}
                                                                                                        >
                                                                                                            <FiTrash2 />
                                                                                                        </button>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    
                                                                    <div className="text-end">
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-primary" 
                                                                            onClick={addQuestion}
                                                                            disabled={!newQuestionText.trim() || (newQuestionType !== 'text' && tempOptions.length < 2)}
                                                                        >
                                                                            Add Question
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="table-responsive">
                                                                <table className="table table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th width="5%">#</th>
                                                                        <th>Question</th>
                                                                        <th width="15%">Type</th>
                                                                        <th width="10%">Options</th>
                                                                        <th width="10%">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {sections.find(s => s.id === activeSectionId)?.questions.map((question, index) => (
                                                                        <tr key={question.id}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{question.text}</td>
                                                                            <td>
                                                                                <span className={`badge ${question.type === 'text' ? 'bg-info' : question.type === 'checkbox' ? 'bg-warning' : 'bg-primary'}`}>
                                                                                    {question.type === 'text' ? 'Text' : question.type === 'checkbox' ? 'Multiple' : 'Single'}
                                                                                </span>
                                                                            </td>
                                                                            <td>{question.options?.length || 'N/A'}</td>
                                                                            <td>
                                                                                <button 
                                                                                    type="button" 
                                                                                    className="btn btn-sm btn-danger" 
                                                                                    onClick={() => removeQuestion(activeSectionId, question.id)}
                                                                                >
                                                                                    <FiTrash2 />
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    {sections.find(s => s.id === activeSectionId)?.questions.length === 0 && (
                                                                        <tr><td colSpan="5" className="text-center">No questions added to this section yet</td></tr>
                                                                    )}
                                                                </tbody></table>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12 text-end">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary me-2"
                                    onClick={() => navigate('/qec-list')}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating...' : 'Update Survey'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default QECEditForm;
