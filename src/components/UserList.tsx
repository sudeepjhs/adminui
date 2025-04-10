"use client"
import { useUserTable } from "@/hooks/useUserTable"
import { pickPalette } from "@/utils/helper"
import {
    Avatar,
    Button,
    Flex,
    Group,
    HStack,
    IconButton,
    Input,
    Stack
} from "@chakra-ui/react"
import React, { FC, use, useCallback, useMemo, useState } from "react"
import { FaEdit, FaSave, FaSearch, FaTrashAlt } from "react-icons/fa"
import ConfirmationDialog from "./ConfirmationDialog"
import { useColorModeValue } from "./ui/color-mode"
import SelectableTable, { Action, Column } from "./ui/table"

interface UserListProps {
    users: Promise<UserData[]>
}

const UserList: FC<UserListProps> = ({ users }) => {
    const initialUsers: UserData[] = use(users)
    const [open, setOpen] = useState(false)
    const { deleteUser, editMode, enterEditMode, exitEditMode, filteredData, selectedUser, setSelectedUser, userDataList, updateUserField } = useUserTable(initialUsers)

    const handleInputChange = useCallback((id: string, field: keyof UserData, value: string) => {
        updateUserField(id, field, value)
    }, [])

    const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
        e.stopPropagation();
        const button = e.target as HTMLButtonElement
        const tr = button.closest("tr")
        if (!tr) return
        enterEditMode(userId)
        tr.querySelectorAll("input")[1].focus();
    }, [])

    const handleSave = useCallback((userId: string) => {
        exitEditMode(userId)
    }, [])

    const handleDelete = useCallback((user: UserData) => {
        setSelectedUser(user)
        setOpen(() => true)
    }, [])

    const handleSearch = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            filteredData(e.currentTarget.value)
        }
    }, [filteredData])

    const handleSearchClick = useCallback(() => {
        const input = document.getElementById("search-input") as HTMLInputElement
        if (input) filteredData(input.value)
    }, [filteredData])

    const handleConfirmDelete = () => {
        if (!selectedUser) return
        deleteUser(selectedUser.id)
        setSelectedUser(() => null)
        setOpen(() => false)
    }

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
                    onChange={(e) => handleInputChange(user.id, 'name', e.target.value)}
                    variant="flushed"
                    readOnly={!isEditing}
                    fontWeight="medium"
                />
            </HStack>
        )
    }, [editMode, handleInputChange])

    const renderInputCell = (field: keyof UserData) => (item: unknown) => {
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
    }

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
                        _hover={{ bg: useColorModeValue("blackAlpha.300", "gray.800") }}
                    ><FaSave /></IconButton>
                ) : (
                    <>
                        <IconButton
                            onClick={(e) => handleEdit(e, user.id)}
                            aria-label="Edit"
                            size="xs"
                            color="inherit"
                            bg="transparent"
                            _hover={{ bg: useColorModeValue("blackAlpha.300", "gray.800") }}
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
    }, [editMode, handleEdit, handleDelete, handleSave])

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
                selected.forEach((id) => {
                    deleteUser(id)
                })
            },
        }
    ], [deleteUser])

    return (
        <Stack gap={4} borderRadius="md" boxShadow="md" py={4} px={6}>
            <Group attached w="full" maxW="full" p={4}>
                <Input id="search-input" placeholder="Search" onKeyUp={handleSearch} />
                <Button onClick={handleSearchClick} variant="outline" bg="bg.subtle">
                    <FaSearch />
                </Button>
            </Group>

            <SelectableTable actions={actions} tablecolumns={columns} pageSize={10} data={userDataList} />

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
