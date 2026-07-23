import type { ButtonVariant } from './button.types'
import type { MenuVariant } from './menu.types'
import type { MusicPlayerVariant } from './music-player.types'

export interface ThemeConfig {
    fontPack: number
    palette: number
    buttonVariant?: ButtonVariant
    menu?: {
        show?: boolean
        variant?: MenuVariant
        title?: string
        buttonVariant?: ButtonVariant
    }
    music?: {
        show?: boolean
        variant?: MusicPlayerVariant
        buttonVariant?: ButtonVariant
        songTitle?: string
        artistName?: string
    }
}

export interface SectionItemConfig {
    title?: string
    [key: string]: unknown
}

export interface SectionsConfig {
    hero?: SectionItemConfig & { showHero?: boolean; names?: string; subtitle?: string; date?: string }
    countdown?: SectionItemConfig & { showCountdown?: boolean; targetDate?: string }
    places?: SectionItemConfig & { showPlaces?: boolean }
    itinerary?: SectionItemConfig & { showItinerary?: boolean }
    dressCode?: SectionItemConfig & { showDressCode?: boolean }
    gallery?: SectionItemConfig & { showGallery?: boolean }
    presents?: SectionItemConfig & { showPresents?: boolean }
    confirmation?: SectionItemConfig & { showConfirmation?: boolean }
    [key: string]: unknown
}

export interface InvitationConfigState {
    theme: ThemeConfig
    config: Record<string, boolean>
    sections: SectionsConfig
}
