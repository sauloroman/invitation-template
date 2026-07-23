import React from 'react'
import { Provider } from 'react-redux'

import { RouterApp } from '@/router'
import { store } from '@/store/store'

import { ModalMaster } from '@/common/components/modal/ModalMaster'
import { ToastContainer } from '@/common/components/toast/ToastContainer'
import { Menu } from '@/common/components/menu/Menu'
import { MusicPlayer } from '@/common/components/music-player/MusicPlayer'

export const InvitationApp: React.FC = () => {
  return (
    <Provider store={store}>
      <RouterApp />

      <ModalMaster />
      <ToastContainer />
      <Menu />
      <MusicPlayer />
    </Provider>
  )
}
