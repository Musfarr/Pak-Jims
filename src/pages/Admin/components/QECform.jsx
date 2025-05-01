import React, { useState } from 'react'
import { FiCalendar, FiFile, FiList, FiTarget, FiUser, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const QECform = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questions, setQuestions] = useState([
        { 
            id: 1, 
            text: "Teaching methods and material help to understand the subject matter", 
            type: "rating",
            options: []
        },
        { 
            id: 2, 
            text: "Course objectives and outcomes were clear", 
            type: "rating",
            options: []
        }
    ]);
    const [newQuestion, setNewQuestion] = useState("");
    const [questionType, setQuestionType] = useState("rating");
    const [newOption, setNewOption] = useState("");
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [tempOptions, setTempOptions] = useState([]);

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            target_audience: 'students',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            department: '',
            course: '',
            semester: '',
            instructions: 'Please answer all questions honestly. Your feedback is anonymous and will be used to improve teaching quality.'
        }
    });

    // Add new option to temporary options list
    const addOption = () => {
        if (newOption.trim() !== "") {
            setTempOptions([...tempOptions, newOption]);
            setNewOption("");
        }
    };

    // Remove option from temporary options list
    const removeOption = (index) => {
        setTempOptions(tempOptions.filter((_, i) => i !== index));
    };

    // Start editing a question (for adding options)
    const startEditingQuestion = (question) => {
        setEditingQuestionId(question.id);
        setTempOptions(question.options || []);
    };

    // Save question with options
    const saveQuestion = () => {
        setQuestions(questions.map(q => 
            q.id === editingQuestionId ? { ...q, options: tempOptions } : q
        ));
        setEditingQuestionId(null);
        setTempOptions([]);
    };

    // Add new question
    const addQuestion = () => {
        if (newQuestion.trim() !== "") {
            const needsOptions = ["mcq", "radio", "checkbox"].includes(questionType);
            
            // Validate options for choice-based questions
            if (needsOptions && tempOptions.length < 2) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: `${getQuestionTypeName(questionType)} questions must have at least 2 options`,
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            
            const newQuestionObj = {
                id: Date.now(), // Use timestamp for unique ID
                text: newQuestion,
                type: questionType,
                options: needsOptions ? [...tempOptions] : []
            };
            
            setQuestions([...questions, newQuestionObj]);
            setNewQuestion("");
            
            // Clear options after adding question
            if (needsOptions) {
                setTempOptions([]);
            }
        }
    };

    // Remove question
    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    // Handle form submission
    const onSubmit = (data) => {
        // Validate that MCQ and radio questions have options
        const invalidQuestions = questions.filter(q => 
            ["mcq", "radio", "checkbox"].includes(q.type) && (!q.options || q.options.length < 2)
        );
        
        if (invalidQuestions.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Multiple choice questions must have at least 2 options',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        
        setIsSubmitting(true);
        // Combine form data with questions
        const formData = {
            ...data,
            questions: questions
        };

        console.log("QEC Questionnaire Data:", formData);

        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'QEC Questionnaire created successfully',
            confirmButtonColor: '#3085d6'
        }).then(() => {
            navigate('/qec-list');
        });

        setIsSubmitting(false);
    };

    // Get readable question type name
    const getQuestionTypeName = (type) => {
        switch(type) {
            case 'rating': return 'Rating Scale (1-5)';
            case 'mcq': return 'Multiple Choice';
            case 'radio': return 'Single Choice';
            case 'text': return 'Text Input';
            case 'textarea': return 'Long Answer';
            case 'checkbox': return 'Checkbox (Select Many)';
            default: return type;
        }
    };

    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Create QEC Questionnaire</h5>
                    <p className="card-subtitle text-muted">Create a new quality enhancement questionnaire</p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3 mb-4">
                            <div className="col-lg-6">
                                <label className="form-label" htmlFor="titleInput">Questionnaire Title</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiFile /></div>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        id="titleInput"
                                        placeholder="E.g., Course Evaluation Survey"
                                        {...register('title', { required: 'Title is required' })}
                                    />
                                    {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <label className="form-label" htmlFor="targetAudienceInput">Target Audience</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiTarget /></div>
                                    <select 
                                        className={`form-select ${errors.target_audience ? 'is-invalid' : ''}`}
                                        id="targetAudienceInput"
                                        {...register('target_audience', { required: 'Target audience is required' })}
                                    >
                                        <option value="students">Students</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="staff">Administrative Staff</option>
                                        <option value="all">All</option>
                                    </select>
                                    {errors.target_audience && <div className="invalid-feedback">{errors.target_audience.message}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-lg-12">
                                <label className="form-label" htmlFor="descriptionInput">Description</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiFile /></div>
                                    <textarea 
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        id="descriptionInput"
                                        rows="3"
                                        placeholder="Briefly describe the purpose of this questionnaire"
                                        {...register('description', { required: 'Description is required' })}
                                    ></textarea>
                                    {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                                </div>
                            </div>
                        </div>

                        

                        <div className="row g-3 mb-4">
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="departmentInput">Department (Optional)</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiList /></div>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        id="departmentInput"
                                        placeholder="E.g., Computer Science"
                                        {...register('department')}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="courseInput">Course (Optional)</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiList /></div>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        id="courseInput"
                                        placeholder="E.g., Introduction to Programming"
                                        {...register('course')}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="semesterInput">Semester (Optional)</label>
                                <div className="input-group">
                                    <div className="input-group-text"><FiList /></div>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        id="semesterInput"
                                        placeholder="E.g., Spring 2025"
                                        {...register('semester')}
                                    />
                                </div>
                            </div>
                        </div>

                        

                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Questionnaire Items</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-4">
                                            <div className="row g-2">
                                                <div className="col-lg-5">
                                                    <div className="input-group">
                                                        <div className="input-group-text"><FiList /></div>
                                                        <input 
                                                            type="text" 
                                                            className="form-control"
                                                            placeholder="Enter question text"
                                                            value={newQuestion}
                                                            onChange={(e) => setNewQuestion(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <select 
                                                        className="form-select"
                                                        value={questionType}
                                                        onChange={(e) => setQuestionType(e.target.value)}
                                                    >
                                                        <option value="rating">Rating Scale (1-5)</option>
                                                        <option value="mcq">Multiple Choice</option>
                                                        <option value="radio">Single Choice (Radio)</option>
                                                        <option value="checkbox">Checkboxes (Select Many)</option>
                                                        <option value="text">Short Text Answer</option>
                                                        <option value="textarea">Long Text Answer</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-3">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-primary w-100"
                                                        onClick={addQuestion}
                                                    >
                                                        Add Question
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Show options field when multiple choice type is selected */}
                                            {['mcq', 'radio', 'checkbox'].includes(questionType) && (
                                                <div className="row mt-3">
                                                    <div className="col-12">
                                                        <div className="card border">
                                                            <div className="card-header bg-light">
                                                                <h6 className="mb-0">Add Options for {getQuestionTypeName(questionType)}</h6>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="row mb-3">
                                                                    <div className="col-lg-8">
                                                                        <div className="input-group">
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control"
                                                                                placeholder="Enter option text"
                                                                                value={newOption}
                                                                                onChange={(e) => setNewOption(e.target.value)}
                                                                            />
                                                                            <button 
                                                                                className="btn btn-outline-secondary" 
                                                                                type="button"
                                                                                onClick={addOption}
                                                                            >
                                                                                <FiPlus /> Add Option
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="table-responsive">
                                                                    <table className="table table-sm">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>#</th>
                                                                                <th>Option Text</th>
                                                                                <th width="10%">Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {tempOptions.map((option, idx) => (
                                                                                <tr key={idx}>
                                                                                    <td>{idx + 1}</td>
                                                                                    <td>{option}</td>
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
                                                                            {tempOptions.length === 0 && (
                                                                                <tr>
                                                                                    <td colSpan="3" className="text-center">
                                                                                        No options added yet
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div className="text-muted small mt-2">
                                                                    These options will be saved with your question when you click "Add Question"
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* List of questions */}
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th style={{width: "5%"}}>#</th>
                                                        <th style={{width: "55%"}}>Question</th>
                                                        <th style={{width: "20%"}}>Type</th>
                                                        <th style={{width: "20%"}}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {questions.map((q, index) => (
                                                        <React.Fragment key={q.id}>
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{q.text}</td>
                                                                <td>
                                                                    <span className={`badge ${
                                                                        q.type === 'rating' ? 'bg-primary' : 
                                                                        q.type === 'mcq' ? 'bg-success' : 
                                                                        q.type === 'radio' ? 'bg-info' :
                                                                        q.type === 'checkbox' ? 'bg-warning' :
                                                                        'bg-secondary'
                                                                    }`}>
                                                                        {getQuestionTypeName(q.type)}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        {['mcq', 'radio', 'checkbox'].includes(q.type) && (
                                                                            <button 
                                                                                type="button" 
                                                                                className="btn btn-sm btn-outline-primary"
                                                                                onClick={() => startEditingQuestion(q)}
                                                                                title="Manage Options"
                                                                            >
                                                                                Options ({q.options?.length || 0})
                                                                            </button>
                                                                        )}
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() => removeQuestion(q.id)}
                                                                            title="Delete Question"
                                                                        >
                                                                            <FiTrash2 />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            {/* Options editor when editing this question */}
                                                            {editingQuestionId === q.id && (
                                                                <tr>
                                                                    <td colSpan="4" className="bg-light">
                                                                        <div className="p-3">
                                                                            <h6>Options for: {q.text}</h6>
                                                                            <div className="row mb-3">
                                                                                <div className="col-lg-8">
                                                                                    <div className="input-group">
                                                                                        <input 
                                                                                            type="text" 
                                                                                            className="form-control"
                                                                                            placeholder="Enter option text"
                                                                                            value={newOption}
                                                                                            onChange={(e) => setNewOption(e.target.value)}
                                                                                        />
                                                                                        <button 
                                                                                            className="btn btn-outline-secondary" 
                                                                                            type="button"
                                                                                            onClick={addOption}
                                                                                        >
                                                                                            <FiPlus /> Add
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="table-responsive">
                                                                                <table className="table table-sm">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>#</th>
                                                                                            <th>Option Text</th>
                                                                                            <th width="10%">Action</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {tempOptions.map((option, idx) => (
                                                                                            <tr key={idx}>
                                                                                                <td>{idx + 1}</td>
                                                                                                <td>{option}</td>
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
                                                                                        {tempOptions.length === 0 && (
                                                                                            <tr>
                                                                                                <td colSpan="3" className="text-center">
                                                                                                    No options added yet
                                                                                                </td>
                                                                                            </tr>
                                                                                        )}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            <div className="d-flex justify-content-end mt-3">
                                                                                <button 
                                                                                    type="button" 
                                                                                    className="btn btn-secondary me-2"
                                                                                    onClick={() => setEditingQuestionId(null)}
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button 
                                                                                    type="button" 
                                                                                    className="btn btn-primary"
                                                                                    onClick={saveQuestion}
                                                                                >
                                                                                    Save Options
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                    {questions.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">
                                                                No questions added yet
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12 text-end">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Create Questionnaire'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default QECform
