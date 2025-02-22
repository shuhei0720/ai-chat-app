import React from 'react'
import BotAvatar from './BotAvatar'

const Sidebar = () => {
  return (
    <div>
        {/* タイトル&ロゴエリア */}
        <div className='flex items-center'>
            <BotAvatar />
            <h1>AI Chat App</h1>
        </div>

        {/* チャットタイプエリア */}
        <div>チャットタイプエリア</div>

        {/* チャットルームエリア */}
        <div>チャットルームエリア</div>
    </div>
  )
}

export default Sidebar