import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useClients } from "./ClientsContext";
import { useMembers } from "./MembersContext";

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const { token } = useAuth()
  const { clients } = useClients()
  const { members } = useMembers()
  const [projects, setProjects] = useState([])
  const [statuses, setStatuses] = useState(null)

  useEffect(() => {
    if (token) {
      getProjects()
      getStatuses()
    }
  }, [token])

  const addProject = async (formData) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await res.json();

    if (!res.ok)
      return { success: false, message: data.message || "Coult not create project." }

    await getProjects();
    return { success: true }
  }

  const editProject = async (formData) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await res.json();

    if (!res.ok)
      return { success: false, message: data.message || "Coult not edit project." }

    await getProjects();
    return { success: true }
  }

  const getProjects = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })

    if (res.ok) {
      const data = await res.json()
      setProjects(data)
      return true
    }
    else
      return false
  }

  const getStatuses = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/statuses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })

    if (res.ok) {
      const data = await res.json()
      setStatuses(data)
      return true
    }
    else
      return false
  }

  const deleteProject = async (projectId) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      await getProjects()
      return true
    }
    else
      return false
  }

  return (
    <ProjectsContext.Provider value={{ projects, clients, members, statuses, getProjects, addProject, editProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export const useProjects = () => useContext(ProjectsContext)