import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openMenu, closeMenu } from '@/store/ui/menu.slice'
import type { RootState } from '@/store/store'
import type { MenuProps, MenuItem, MenuVariant, ButtonVariant } from '@/common/types'
import { useInvitationConfig } from './useInvitationConfig'

export const useMenu = (props?: MenuProps) => {
    const dispatch = useDispatch()
    const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen)
    const { theme, sections } = useInvitationConfig()

    const onOpenMenu = () => dispatch(openMenu())
    const onCloseMenu = () => dispatch(closeMenu())
    const onToggleMenu = () => {
        if (isMenuOpen) {
            dispatch(closeMenu())
        } else {
            dispatch(openMenu())
        }
    }

    const activeVariant: MenuVariant = props?.variant || theme.menu?.variant || 'floating'
    const activeTitle = props?.title || theme.menu?.title || 'Menú'
    const activeBtnVariant: ButtonVariant = props?.buttonVariant || theme.menu?.buttonVariant || theme.buttonVariant || 'icon'

    const defaultItems: MenuItem[] = useMemo(() => {
        if (!sections) return []
        const list: MenuItem[] = []

        if (sections.hero?.showHero !== false) {
            list.push({ label: sections.hero?.title || 'Inicio', href: '#hero' })
        }
        if (sections.countdown?.showCountdown !== false) {
            list.push({ label: sections.countdown?.title || 'Cuenta Regresiva', href: '#countdown' })
        }
        if (sections.places?.showPlaces !== false) {
            list.push({ label: sections.places?.title || 'Ubicación', href: '#places' })
        }
        if (sections.itinerary?.showItinerary !== false) {
            list.push({ label: sections.itinerary?.title || 'Itinerario', href: '#itinerary' })
        }
        if (sections.dressCode?.showDressCode !== false) {
            list.push({ label: sections.dressCode?.title || 'Código de Vestimenta', href: '#dress-code' })
        }
        if (sections.gallery?.showGallery !== false) {
            list.push({ label: sections.gallery?.title || 'Galería', href: '#gallery' })
        }
        if (sections.presents?.showPresents !== false) {
            list.push({ label: sections.presents?.title || 'Mesa de Regalos', href: '#presents' })
        }
        if (sections.confirmation?.showConfirmation !== false) {
            list.push({ label: sections.confirmation?.title || 'Confirmar Asistencia', href: '#confirmation' })
        }

        return list
    }, [sections])

    const activeItems = props?.items && props.items.length > 0 ? props.items : defaultItems

    return {
        isMenuOpen,
        activeVariant,
        activeTitle,
        activeBtnVariant,
        activeItems,
        onOpenMenu,
        onCloseMenu,
        onToggleMenu,
    }
}