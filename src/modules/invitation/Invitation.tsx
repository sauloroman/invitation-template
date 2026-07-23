import React from 'react'
import { useMenu } from '@/common/hooks'

import { ConfirmationSection } from './confirmation/ConfirmationSection'
import { CountdownSection } from './countdown/CountdownSection'
import { DressCodeSection } from './dress-code/DressCodeSection'
import { GallerySection } from './gallery/GallerySection'
import { HeroSection } from './hero/HeroSection'
import { ItinerarySection } from './itinerary/ItinerarySection'
import { MessageSection } from './message/Message'
import { PlacesSection } from './places/PlacesSection'
import { PresentsSection } from './presents/PresentsSection'

export const Invitation: React.FC = () => {
    const { activeVariant, isMenuVisible } = useMenu()

    const hasMenuBarClass = isMenuVisible && activeVariant === 'bar' ? 'invitation--has-menu-bar' : ''
    const containerClass = `invitation ${hasMenuBarClass}`.trim()

    return (
        <main className={containerClass}>
            <HeroSection />
            <MessageSection />
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
