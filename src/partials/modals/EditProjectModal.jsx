import { useEffect, useRef, useState } from "react"
import { useProjects } from "../../contexts/ProjectsContext"

const EditProjectModal = ({ onClose, project, clients, members, statuses }) => {
    const [imagePreview, setImagePreview] = useState(null)
    const fileUploadRef = useRef(null)
    const { editProject } = useProjects()
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState()
    const [form, setForm] = useState({
        id: '',
        existingImageFileName: null,
        newImageFileName: null,
        projectName: '',
        clientId: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        userId: '',
        statusId: ''
    })

    useEffect(() => {
        if (project) {
            const existingImageFileName = project.imageFileName || '';

            setForm({
                id: project.id,
                existingImageFileName: existingImageFileName,
                newImageFileName: null,
                projectName: project.projectName,
                clientId: project.client.id,
                description: project.description || '',
                startDate: project.startDate.split('T')[0],
                endDate: project.endDate.split('T')[0],
                budget: project.budget || '0',
                userId: project.user.id,
                statusId: project.status.id
            })

            if (existingImageFileName)
                setImagePreview(existingImageFileName)
        }
    }, [project])

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "projectName":
                if (!value)
                    error = "Project name is required.";
                else if (value.length < 2)
                    error = "Must be at least 2 characters.";
                break;
            case "clientId":
                if (!value)
                    error = "Client is required.";
                break;
            case "userId":
                if (!value)
                    error = "Project owner is required.";
                break;
            case "startDate":
                if (!value)
                    error = "Start date is required.";
                break;
            case "endDate":
                if (!value)
                    error = "End date is required.";
                break;
            case "budget":
                if (value && !/^\d+(\.\d{1,2})?$/.test(value))
                    error = "Must be a valid number.";
                else if (parseFloat(value) < 0)
                    error = "Cannot be negative.";
                break;
            case "statusId":
                if (!value)
                    error = "Status is required.";
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: error }))
    }

    const validateForm = () => {
        const newErrors = {};

        if (!form.projectName)
            newErrors.projectName = "Project name is required.";
        else if (form.projectName.length < 2)
            newErrors.projectName = "Must be at least 2 characters.";

        if (!form.clientId)
            newErrors.clientId = "Client is required.";

        if (!form.userId)
            newErrors.userId = "Project owner is required.";

        if (!form.startDate)
            newErrors.startDate = "Start date is required.";

        if (!form.endDate)
            newErrors.endDate = "End date is required.";

        if (form.budget && !/^\d+(\.\d{1,2})?$/.test(form.budget))
            newErrors.budget = "Must be a valid number.";
        else if (parseFloat(form.budget) < 0)
            newErrors.budget = "Cannot be negative.";

        if (!form.statusId)
            newErrors.statusId = "Status is required.";

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            setForm(prev => ({ ...prev, newImageFileName: files[0] }))
            setImagePreview(URL.createObjectURL(files[0]))
        }
        else {
            setForm(prev => ({ ...prev, [name]: value }))
        }

        validateField(name, value)
    }

    const handleFileClick = (e) => {
        e.preventDefault()
        fileUploadRef.current.click()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm())
            return

        const formData = new FormData()
        if (form.newImageFileName)
            formData.append("NewImageFileName", form.newImageFileName)
        formData.append("ExistingImageFileName", form.existingImageFileName || '')
        formData.append("Id", form.id)
        formData.append("ProjectName", form.projectName)
        formData.append("ClientId", form.clientId)
        formData.append("Description", form.description || '')
        formData.append("StartDate", form.startDate)
        formData.append("EndDate", form.endDate)
        formData.append("Budget", form.budget)
        formData.append("UserId", form.userId)
        formData.append("StatusId", form.statusId)

        const result = await editProject(formData)
        if (!result.success) {
            setErrorMessage(result.message?.message)
            return
        }
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="form" noValidate encType="multipart/form-data">
            <div className="form-group">
                <div className="image-preview-container project-image" onClick={handleFileClick}>
                    {imagePreview ? (
                        <img id="image-preview" src={imagePreview} alt="Image preview" />
                    ) : (
                        <div id="image-preview-icon" className="circle circle-gray">
                            <i className="fa-duotone fa-solid fa-camera"></i>
                        </div>
                    )}
                </div>
                <input type="file" accept="image/*" name="newImageFileName" className="hide" ref={fileUploadRef} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                    name="projectName"
                    type="text"
                    value={form.projectName}
                    className={`form-input ${errors.projectName ? 'input-validation-error' : ''}`}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                />
                {errors.projectName && <span className="field-validation-error">{errors.projectName}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Client Name</label>
                <div className="form-select">
                    <select
                        name="clientId"
                        value={form.clientId}
                        className={`form-input ${errors.clientId ? 'input-validation-error' : ''}`}
                        onChange={(handleChange)}
                        required>
                        <option value="" >Select client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id} className="form-select-option">
                                {client.clientName}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.clientId && <span className="field-validation-error">{errors.clientId}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    className="form-input"
                    onChange={handleChange}
                    placeholder="Type something"
                />
            </div>
            <div className="form-horizontal-group">
                <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                        name="startDate"
                        value={form.startDate}
                        type="date"
                        onChange={handleChange}
                        required
                        className={`form-input ${errors.startDate ? 'input-validation-error' : ''}`}
                    />
                    {errors.startDate && <span className="field-validation-error">{errors.startDate}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                        name="endDate"
                        value={form.endDate}
                        type="date"
                        onChange={handleChange}
                        required
                        className={`form-input ${errors.endDate ? 'input-validation-error' : ''}`}
                    />
                    {errors.endDate && <span className="field-validation-error">{errors.endDate}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Project Owner</label>
                <div className="form-select">
                    <select
                        name="userId"
                        value={form.userId}
                        className={`form-input ${errors.clientId ? 'input-validation-error' : ''}`}
                        onChange={(handleChange)}
                        required >
                        <option value="">Select project owner</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id} className="form-select-option">
                                {member.information.firstName} {member.information.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.userId && <span className="field-validation-error">{errors.userId}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Budget</label>
                <div className="form-input-extendend">
                    <i className="fa-duotone fa-solid fa-dollar-sign"></i>
                    <input
                        name="budget"
                        value={form.budget}
                        type="text"
                        placeholder="0"
                        onChange={handleChange}
                        className={`form-input ${errors.budget ? 'input-validation-error' : ''}`}
                    />
                    {errors.budget && <span className="field-validation-error">{errors.budget}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Project Status</label>
                <div className="form-select">
                    <select
                        name="statusId"
                        value={form.statusId}
                        className={`form-input ${errors.statusId ? 'input-validation-error' : ''}`}
                        onChange={(handleChange)}
                        required >
                        <option value="">Select status</option>
                        {statuses.map(status => (
                            <option key={status.id} value={status.id} className="form-select-option">
                                {status.statusName}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.statusId && <span className="field-validation-error">{errors.statusId}</span>}
            </div>
            {errorMessage && (<div className="error-message-portal">{errorMessage}</div>)}
            <button type="submit" className="btn btn-submit">Save</button>
        </form>
    )
}

export default EditProjectModal