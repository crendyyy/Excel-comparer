import Dialog from '../shared/Dialog'
import React, { useState, useContext } from 'react'
import { FormContext } from '../../context/FormContext'
import { Input, InputNumber } from 'antd'

const InputNameTask = ({ onClose, onSubmit }) => {
    const [taskName, setTaskName] = useState('')

    const handleConfirm = () => {
        onSubmit(taskName)
    }
  return (
    <Dialog onCancel={onClose}>
      <div className='flex w-96 flex-col gap-10 rounded-primary border border-solid border-gray-100 bg-white p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-base font-bold'>Input Nama Tugas</span>
          <Input
            placeholder='Masukan Nama Tugas'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={{ borderColor: '#110F45' }}
          />
        </div>
        <div className='flex h-12 gap-6'>
          <button
            onClick={onClose}
            className='flex h-full w-full items-center justify-center rounded-lg border border-solid border-blue-950 text-base font-bold text-blue-950'
          >
            Batalkan
          </button>
          <button
            onClick={handleConfirm}
            className='flex h-full w-full items-center justify-center rounded-lg bg-blue-950 text-base font-bold text-white'
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default InputNameTask
