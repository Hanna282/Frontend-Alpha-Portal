import { useState } from 'react';
import ModalButton from '../partials/components/ModalButton'
import Modal from '../partials/sections/Modal';
import { useProjects } from '../contexts/ProjectsContext';
import ProjectCard from '../partials/cards/ProjectCard';
import AddProjectModal from '../partials/modals/AddProjectModal';
import EditProjectModal from '../partials/modals/EditProjectModal';

const Projects = () => {
  const { projects, clients, members, statuses, deleteProject } = useProjects()
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [showAddPRojectModal, setShowAddProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeMenuItem, setActiveMenuItem] = useState('ALL')

  const filteredProjects = activeMenuItem === 'COMPLETED' ? projects.filter(p => p.status.statusName === 'COMPLETED') : projects;
  const completedCount = projects.filter(p => p.status.statusName === 'COMPLETED').length;

  const handleEditProjectClick = (project) => {
    setSelectedProject(project)
    setShowEditProjectModal(true)
  }

  return (
    <div id="projects" className="page">
      <div className="page-header">
        <h1 className="h2">Projects</h1>
        <ModalButton type="add" text="Add Project" onClick={() => { setShowAddProjectModal(true) }} />
      </div>
      <div className="projects-horizontal-menu">
        <button
          className={activeMenuItem === 'ALL' ? 'active' : ''}
          onClick={() => setActiveMenuItem('ALL')}
        >
          ALL [{projects.length}]
        </button>
        <button
          className={activeMenuItem === 'COMPLETED' ? 'active' : ''}
          onClick={() => setActiveMenuItem('COMPLETED')}
        >
          COMPLETED [{completedCount}]
        </button>
      </div>
      <div className="projects-divider"></div>
      <div className="project-list"> 
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEditClick={handleEditProjectClick}
              onDeleteClick={deleteProject}
            />
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>
      {showAddPRojectModal && (
        <Modal title="Add Project" onClose={() => setShowAddProjectModal(false)}>
          <AddProjectModal onClose={() => setShowAddProjectModal(false)} clients={clients} members={members} />
        </Modal>
      )}
      {showEditProjectModal && selectedProject && (
        <Modal title="Edit Project" onClose={() => setShowEditProjectModal(false)}>
          <EditProjectModal
            project={selectedProject}
            clients={clients}
            members={members}
            statuses={statuses}
            onClose={() => setShowEditProjectModal(false)} />
        </Modal>
      )}
    </div>
  )
}

export default Projects