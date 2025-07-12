import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { PostApi, GetApi } from '@/utils/Api/ApiServices';
import { FiPlus, FiTrash2, FiFile, FiFileText } from 'react-icons/fi';

const QECform = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([
        // {
        //     id: 1,
        //     title: 'Instructor',
        //     questions: [
        //         {
        //             id: 1,
        //             text: 'The Instructor is prepared for each class',
        //             type: 'radio',
        //             options: [
        //                 { label: 'Agree', text: 'A' },
        //                 { label: 'Neutral', text: 'B' },
        //                 { label: 'Disagree', text: 'C' },
        //                 { label: 'Strongly Disagree', text: 'D' }
        //             ]
        //         }
        //     ]
        // }
    ]);
    const [activeSectionId, setActiveSectionId] = useState(1);
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
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            title: '',
            description: '',
            instructions: '',
            template_id: ''
        }
    });

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
                        label: opt.text,
                        text: opt.text
                    }))
                }))
            }))
        };
        

        PostApi('/surveys', payload)
            .then(() => {
                Swal.fire({ icon: 'success', title: 'Created!' }).then(() => navigate('/qec-list'));
            })
            .catch((error) => {
                console.error('Error creating survey:', error);
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Failed to create QEC',
                    text: error.response?.data?.message || 'An error occurred while creating the survey.'
                });
            })
            .finally(() => setIsSubmitting(false));
    };

    // UI
    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Create QEC Survey</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3 mb-4">
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
                                                                        <tr><td colSpan="4" className="text-center">No questions added to this section yet</td></tr>
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
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Survey'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default QECform;
 
