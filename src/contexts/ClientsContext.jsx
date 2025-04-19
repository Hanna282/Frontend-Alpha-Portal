import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const { token, adminApiKey } = useAuth()
  const [clients, setClients] = useState([])

  useEffect(() => {
    if (token) {
      getClients()
    }
  }, [token])

  const addClient = async (formData) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-ADM-API-KEY': `${adminApiKey}`
      },
      body: formData
    })

    const data = await res.json()

    if (!res.ok)
      return { success: false, message: data || "Coult not create client." }

    await getClients()
    return { success: true }
  }

  const editClient = async (formData) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clients`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-ADM-API-KEY': `${adminApiKey}`
      },
      body: formData
    })

    const data = await res.json()

    if (!res.ok)
      return { success: false, message: data || "Coult not edit client." }

    await getClients()
    return { success: true }
  }

  const getClients = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clients`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      const data = await res.json()
      setClients(data);
      return true
    }
    else
      return false
  }

  const deleteClient = async (clientId) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clients/${clientId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-ADM-API-KEY': `${adminApiKey}`
      }
    })

    if (res.ok) {
      getClients()
      return true
    }
    else
      return false
  }

  return (
    <ClientsContext.Provider value={{ clients, getClients, addClient, editClient, deleteClient }}>
      {children}
    </ClientsContext.Provider>
  )
}

export const useClients = () => useContext(ClientsContext)