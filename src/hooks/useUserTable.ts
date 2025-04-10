// useUserTable.ts

import { DataItem } from "@/components/ui/table"
import { convertToDataItem } from "@/utils/helper"
import { useState } from "react"

const toDataItems = (users: UserData[]): DataItem[] =>
    convertToDataItem(users, user => ({ ...user }))


export const useUserTable = (initialUsers: UserData[]) => {
    const [userDataList, setUserDataList] = useState<DataItem[]>(toDataItems(initialUsers))
    const [editMode, setEditMode] = useState<Set<string>>(new Set())
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const updateUserField = (id: string, field: keyof UserData, value: string) => {
        setUserDataList(prev =>
            prev.map(user => user.id === id ? { ...user, [field]: value } : user)
        )
    }

    const filteredData = (term: string) => {
        const lower = term.toLowerCase()
        const filtered = initialUsers.filter(
            u => u.name.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower) ||
                u.role.toLowerCase().includes(lower)
        )
        setUserDataList(() => toDataItems(filtered))
    }

    const enterEditMode = (id: string) => setEditMode(prev => new Set(prev).add(id))
    const exitEditMode = (id: string) => setEditMode(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
    })

    const deleteUser = (id: string) => setUserDataList(prev => prev.filter(u => u.id !== id))

    return {
        userDataList,
        setUserDataList,
        editMode,
        enterEditMode,
        exitEditMode,
        updateUserField,
        filteredData,
        selectedUser,
        setSelectedUser,
        deleteUser
    }
}
