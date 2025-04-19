import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
    const { token, adminApiKey } = useAuth()
    const [members, setMembers] = useState([])
    const [signedInMember, setSignedInMember] = useState([])
    const roles = ["User", "Admin"] // Lägger in roller manuellt precis som i databasen

    useEffect(() => {
        if (token) {
            getMembers()
            getSignedInMember()
        }
    }, [token])

    const addMember = async (formData) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-ADM-API-KEY': `${adminApiKey}`
            },
            body: formData
        })

        const data = await res.json()

        if (!res.ok)
            return { success: false, message: data || "Coult not create member." }

        await getMembers()
        await getSignedInMember()
        return { success: true }
    }

    const editMember = async (formData) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-ADM-API-KEY': `${adminApiKey}`
            },
            body: formData
        })

        const data = await res.json()

        if (!res.ok)
            return { success: false, message: data || "Coult not edit member." }

        await getMembers()
        await getSignedInMember()
        return { success: true }
    }

    const getMembers = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `bearer ${token}`,
            }
        })

        if (res.ok) {
            const data = await res.json()
            setMembers(data)
            return true
        }
        else
            return false
    }

    const getSignedInMember = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.ok) {
            const data = await res.json()
            setSignedInMember(data);
            return true
        }
        else
            return false
    }

    const deleteMember = async (memberId) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${memberId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-ADM-API-KEY': `${adminApiKey}`
            }
        })

        if (res.ok) {
            await getMembers()
            await getSignedInMember()
            return true
        }
        else
            return false
    }

    return (
        <MembersContext.Provider value={{ roles, members, signedInMember, getMembers, getSignedInMember, addMember, editMember, deleteMember }}>
            {children}
        </MembersContext.Provider>
    )
}

export const useMembers = () => useContext(MembersContext)