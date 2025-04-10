import { Button, ButtonProps, CloseButton, Dialog, DialogOpenChangeDetails, Portal } from "@chakra-ui/react"
import { FC } from "react"

interface ConfirmationDialogProps {
    onConfirm: () => void
    onCancel: () => void
    title: string
    message?: string
    confirmText?: string
    cancelText?: string
    confirmButtonProps?: ButtonProps
    cancelButtonProps?: ButtonProps
    trigger?: React.ReactNode
    isOpen?: boolean
    onClose?: (e: DialogOpenChangeDetails) => void
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({ onCancel, onConfirm, title, message, cancelText, confirmText, isOpen, onClose, ...rest }) => {
    const { cancelButtonProps, confirmButtonProps } = rest
    return (
        <Dialog.Root lazyMount open={isOpen} onOpenChange={onClose} role="alertdialog">
            {rest.trigger && <Dialog.Trigger asChild>
                {rest.trigger}
            </Dialog.Trigger>}
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title || "Are you sure?"}</Dialog.Title>
                        </Dialog.Header>
                        {message && <Dialog.Body>{message}</Dialog.Body>}
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button {...cancelButtonProps} variant={cancelButtonProps?.variant || "outline"} onClick={onCancel} >{cancelText || "Cancel"}</Button>
                            </Dialog.ActionTrigger>
                            <Button   {...confirmButtonProps} onClick={onConfirm} >{confirmText || "Confirm"}</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default ConfirmationDialog