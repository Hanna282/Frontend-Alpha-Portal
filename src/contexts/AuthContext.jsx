import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [adminApiKey, setAdminApiKey] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken')
        const storedIsAdmin = localStorage.getItem('isAdmin')
        const storedApiKey = localStorage.getItem('adminApiKey')

        if (storedToken)
            setToken(storedToken);

        if (storedIsAdmin === "true")
            setIsAdmin(storedIsAdmin)

        if (storedApiKey)
            setAdminApiKey(storedApiKey)

        setLoading(false)
    }, [])

    const signIn = async (email, password) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (!res.ok)
            return { success: false, message: data || "Invalid email or password" }

        setToken(data.result.accessToken)
        localStorage.setItem('accessToken', data.result.accessToken)

        if (data.result.isAdmin) {
            setIsAdmin(data.result.isAdmin)
            localStorage.setItem('isAdmin', data.result.isAdmin)
        }

        if (data.result.apiKey) {
            setAdminApiKey(data.result.apiKey)
            localStorage.setItem('adminApiKey', data.result.apiKey)
        }

        return { success: true }
    }

    const signUp = async (formData) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        const data = await res.json()
        if (!res.ok)
            return { success: false, message: data || "Something went wrong" }

        return { success: true }
    }

    const signOut = async () => {
        setToken(null)
        setIsAdmin(false)
        setAdminApiKey(null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('adminApiKey')
        navigate('/aut/signin')
    }

    return (
        <AuthContext.Provider value={{ loading, token, isAdmin, adminApiKey, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);