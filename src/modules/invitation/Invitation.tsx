import React from 'react'
import { useMenu } from '@/common/hooks'

import { HeroSection } from './hero/HeroSection'
import { CountdownSection } from './countdown/CountdownSection'
import { PlacesSection } from './places/PlacesSection'
import { ItinerarySection } from './itinerary/ItinerarySection'
import { DressCodeSection } from './dress-code/DressCodeSection'
import { GallerySection } from './gallery/GallerySection'
import { PresentsSection } from './presents/PresentsSection'
import { ConfirmationSection } from './confirmation/ConfirmationSection'

export const Invitation: React.FC = () => {
    const { activeVariant } = useMenu()

    const hasMenuBarClass = activeVariant === 'bar' ? 'invitation--has-menu-bar' : ''
    const containerClass = `invitation ${hasMenuBarClass}`.trim()

    return (
        <main className={containerClass}>
            <HeroSection />
            <CountdownSection />
            <PlacesSection />
            <ItinerarySection />
            <DressCodeSection />
            <GallerySection />
            <PresentsSection />
            <ConfirmationSection />
        </main>
    )
}
