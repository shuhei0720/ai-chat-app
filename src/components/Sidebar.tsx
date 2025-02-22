import React from 'react'
import BotAvatar from './BotAvatar'

const Sidebar = () => {
  return (
    <div className='bg-gray-900 text-white p-3 h-full'>
        {/* タイトル&ロゴエリア */}
        <div className='flex items-center'>
            <div className='mr-3'>
                <BotAvatar />
            </div>
            <h1 className='font-bole text-xl'>AI Chat App</h1>
        </div>

        {/* チャットタイプエリア */}
        <div>チャットタイプエリア</div>

        {/* チャットルームエリア */}
        <div>チャットルームエリア</div>
    </div>
  )
}

export default Sidebar