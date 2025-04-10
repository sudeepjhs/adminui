"use client"
/* eslint-disable react/display-name */
import React, { FC, use, useCallback, useMemo, useState } from "react"
import {
    Avatar,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Stack
} from "@chakra-ui/react"
import { FaEdit, FaSave, FaSearch, FaTrashAlt } from "react-icons/fa"

import { useUserTable } from "@/hooks/useUserTable"
import { pickPalette } from "@/utils/helper"
import ConfirmationDialog from "./ConfirmationDialog"
import { useColorModeValue } from "./ui/color-mode"
import SelectableTable, { Action, Column } from "./ui/table"

interface UserListProps {
    users: Promise<UserData[]>
}

const UserList: FC<UserListProps> = ({ users }) => {
    const buttonBg = useColorModeValue("blackAlpha.300", "gray.800")
    const initialUsers = use(users)

    const {
        deleteUser,
        editMode,
        enterEditMode,
        exitEditMode,
        filteredData,
        selectedUser,
        setSelectedUser,
        userDataList,
        updateUserField
    } = useUserTable(initialUsers)

    const [open, setOpen] = useState(false)

    const handleInputChange = useCallback((id: string, field: keyof UserData, value: string) => {
        updateUserField(id, field, value)
    }, [updateUserField])

    const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
        e.stopPropagation()
        enterEditMode(userId)
        const tr = (e.target as HTMLElement).closest("tr")
        tr?.querySelectorAll("input")[1]?.focus()
    }, [enterEditMode])

    const handleSave = useCallback((userId: string) => {
        exitEditMode(userId)
    }, [exitEditMode])

    const handleDelete = useCallback((user: UserData) => {
        setSelectedUser(user)
        setOpen(true)
    }, [setSelectedUser])

    const handleSearch = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            filteredData(e.currentTarget.value)
        }
    }, [filteredData])

    const handleSearchClick = useCallback(() => {
        const input = document.getElementById("search-input") as HTMLInputElement | null
        if (input) filteredData(input.value)
    }, [filteredData])

    const handleConfirmDelete = useCallback(() => {
        if (selectedUser) {
            deleteUser(selectedUser.id)
            setSelectedUser(null)
            setOpen(false)
        }
    }, [selectedUser, deleteUser, setSelectedUser])

    const renderNameCell = useCallback((item: unknown) => {
        const user = item as UserData
        const isEditing = editMode.has(user.id)

        return (
            <HStack gap="4">
                <Avatar.Root colorPalette={pickPalette(user.name)} size="sm">
                    <Avatar.Fallback name={user.name} />
                </Avatar.Root>
                <Input
                    name="name"
                    value={user.name}
                    onChange={(e) => handleInputChange(user.id, "name", e.target.value)}
                    variant="flushed"
                    readOnly={!isEditing}
                    fontWeight="medium"
                />
            </HStack>
        )
    }, [editMode, handleInputChange])

    const renderInputCell = useCallback((field: keyof UserData) => (item: unknown) => {
        const user = item as UserData
        const isEditing = editMode.has(user.id)

        return (
            <Input
                name={field}
                value={user[field] as string}
                onChange={(e) => handleInputChange(user.id, field, e.target.value)}
                variant="flushed"
                readOnly={!isEditing}
            />
        )
    }, [editMode, handleInputChange])

    const renderActionCell = useCallback((item: unknown) => {
        const user = item as UserData
        const isEditing = editMode.has(user.id)

        return (
            <Flex gap={2}>
                {isEditing ? (
                    <IconButton
                        onClick={() => handleSave(user.id)}
                        aria-label="Save"
                        size="xs"
                        bg="transparent"
                        color="inherit"
                        _hover={{ bg: buttonBg }}

                    ><FaSave /></IconButton>
                ) : (
                    <>
                        <IconButton
                            onClick={(e) => handleEdit(e, user.id)}
                            aria-label="Edit"
                            size="xs"
                            color="inherit"
                            bg="transparent"
                            _hover={{ bg: buttonBg }}

                        ><FaEdit /></IconButton>
                        <IconButton
                            onClick={() => handleDelete(user)}
                            aria-label="Delete"
                            size="xs"
                            bg="transparent"
                            color="red.500"
                            _hover={{ bg: "red.800" }}

                        ><FaTrashAlt /></IconButton>
                    </>
                )}
            </Flex>
        )
    }, [editMode, handleSave, handleEdit, handleDelete, buttonBg])

    const columns: Column[] = useMemo(() => [
        { key: 'name', label: 'Name', render: renderNameCell },
        { key: 'email', label: 'Email', render: renderInputCell('email') },
        { key: 'role', label: 'Role', render: renderInputCell('role') },
        { key: 'actions', label: 'Actions', render: renderActionCell }
    ], [renderNameCell, renderInputCell, renderActionCell])

    const actions: Action[] = useMemo(() => [
        {
            label: "Delete Selected",
            colorPalette: "red",
            variant: "outline",
            onClick: (selected) => {
                selected.forEach(deleteUser)
            }
        }
    ], [deleteUser])

    return (
        <Stack gap={4} borderRadius="md" boxShadow="md" py={4} px={6}>
            <Flex w="full" gap={2} px={4}>
                <Input id="search-input" placeholder="Search" onKeyUp={handleSearch} />
                <Button onClick={handleSearchClick} variant="outline" bg="bg.subtle">
                    <FaSearch />
                </Button>
            </Flex>

            <SelectableTable
                actions={actions}
                tablecolumns={columns}
                pageSize={10}
                data={userDataList}
            />

            <ConfirmationDialog
                title="Delete User"
                message={`Are you sure you want to delete ${selectedUser?.name}?`}
                cancelText="Cancel"
                confirmText="Delete"
                isOpen={open}
                onClose={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmButtonProps={{
                    colorScheme: "red",
                    variant: "solid"
                }}
            />
        </Stack>
    )
}

export default UserList
