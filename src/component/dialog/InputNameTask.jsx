import Dialog from '../shared/Dialog'
import React, { useState, useContext } from 'react'
import { Input, InputNumber } from 'antd'

const InputNameTask = ({ onClose, onSubmit }) => {
  const [taskName, setTaskName] = useState('')

  const handleConfirm = () => {
    onSubmit(taskName)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  return (
    <Dialog onCancel={onClose}>
      <div className='flex flex-col gap-10 p-6 bg-white border border-gray-100 border-solid w-96 rounded-primary'>
        <div className='flex flex-col gap-2'>
          <span className='text-base font-bold'>Input Nama Tugas</span>
          <Input
            autoFocus
            placeholder='Masukan Nama Tugas'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ borderColor: '#110F45' }}
          />
        </div>
        <div className='flex h-12 gap-6'>
          <button
            onClick={onClose}
            className='flex items-center justify-center w-full h-full text-base font-bold border border-solid rounded-lg border-blue-950 text-blue-950'
          >
            Batalkan
          </button>
          <button
            onClick={handleConfirm}
            className='flex items-center justify-center w-full h-full text-base font-bold text-white rounded-lg bg-blue-950'
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default InputNameTask
