import invitationConfig from '../../../invitation.config.json'
import type { ThemeConfig, SectionsConfig } from '@/common/types'

export const useInvitationConfig = () => {
    const theme = invitationConfig.theme as ThemeConfig
    const config = invitationConfig.config as Record<string, boolean>
    const sections = invitationConfig.sections as SectionsConfig

    return {
        theme,
        config,
        sections,
        getSection: <K extends keyof SectionsConfig>(sectionKey: K) => {
            return sections[sectionKey]
        },
    }
}
