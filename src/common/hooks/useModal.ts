import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { closeModal, openModal, type ModalName } from "@/store/ui/modal.slice"

export const useModal = () => {

    const dispatch: AppDispatch = useDispatch()
    const { isOpen, modalTitle, modalName } = useSelector((state: RootState) => state.modal)

    const onOpenModal = (modalName: ModalName, modalTitle: string) => {
        dispatch(openModal({ modalName, modalTitle }))
    }

    const onCloseModal = () => {
        dispatch(closeModal())
    }

    return {
        isOpen,
        modalTitle,
        modalName,

        onOpenModal,
        onCloseModal
    }
}