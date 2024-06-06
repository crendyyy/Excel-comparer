import Dialog from '../shared/Dialog'
import React, { useState, useContext } from 'react'
import { FormContext } from '../../context/FormContext'
import { Input, InputNumber } from 'antd'
import TrashIcon from '../icons/TrashIcon'

const FilterDialog = ({ onClose, onSubmit }) => {
  const [filters, setFilters] = useState([])
  const [color, setColor] = useState('#ffffff')
  const [valueStart, setValueStart] = useState('')
  const [valueEnd, setValueEnd] = useState('')
  const { savedFilters, setSavedFilters } = useContext(FormContext)

  const handleColorPicker = (e) => {
    setColor(e.target.value)
  }

  const handleAddFilter = () => {
    const newFilter = {
      valueStart: valueStart !== '' ? parseFloat(valueStart) : '',
      valueEnd: valueEnd === '>' || valueEnd === '<' ? valueEnd : valueEnd !== '' ? parseFloat(valueEnd) : '',
      color,
    }

    setFilters([...filters, newFilter])
    setValueStart('')
    setValueEnd('')
    setColor('#ffffff')
  }

  const handleConfirm = () => {
    const sortFilter = savedFilters.sort((a, b) => b.valueEnd - a.valueEnd)
    let combinedFilters = [...sortFilter]
    const validNewFilters = filters.filter((filter) => filter.valueStart !== '' && filter.valueEnd !== '')

    if (valueStart !== '' && valueEnd !== '') {
      const newFilter = {
        valueStart: parseFloat(valueStart),
        valueEnd: valueEnd === '>' || valueEnd === '<' ? valueEnd : parseFloat(valueEnd),
        color,
      }
      validNewFilters.push(newFilter)
    }

    combinedFilters = [...combinedFilters, ...validNewFilters]

    setSavedFilters(combinedFilters)
    onSubmit(combinedFilters)
    onClose()
  }

  const handleDeleteFilter = (index, type) => {
    if (type === 'saved') {
      const updatedFilters = savedFilters.filter((_, i) => i !== index)
      setSavedFilters(updatedFilters)
    } else {
      const updatedFilters = filters.filter((_, i) => i !== index)
      setFilters(updatedFilters)
    }
  }

  return (
    <Dialog onCancel={onClose}>
      <div className='flex w-96 flex-col gap-10 rounded-primary border border-solid border-gray-100 bg-white p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-base font-bold'>Filter Warna</span>
          {savedFilters.map((filter, index) => (
            <div className='flex h-8 gap-2' key={index}>
              <InputNumber
                placeholder='Start'
                value={filter.valueStart}
                onChange={(value) => {
                  const updatedFilters = [...savedFilters]
                  updatedFilters[index].valueStart = value
                  setSavedFilters(updatedFilters)
                }}
                style={{ width: '50%' }}
              />
              <span className='flex items-center'>-</span>
              <Input
                placeholder='End'
                value={filter.valueEnd}
                onChange={(e) => {
                  const updatedFilters = [...savedFilters]
                  updatedFilters[index].valueEnd = e.target.value
                  setSavedFilters(updatedFilters)
                }}
                style={{ width: '50%' }}
              />
              <input
                type='color'
                className='h-full w-11 rounded-lg border border-solid border-blue-950'
                value={filter.color}
                onChange={(e) => {
                  const updatedFilters = [...savedFilters]
                  updatedFilters[index].color = e.target.value
                  setSavedFilters(updatedFilters)
                }}
              />
              <button
                className='flex h-full w-12 items-center justify-center rounded-lg border border-solid border-gray-200'
                onClick={() => handleDeleteFilter(index, 'saved')}
              >
                <TrashIcon className='h-5 w-5 text-red-500' />
              </button>
            </div>
          ))}
          {filters.map((filter, index) => (
            <div className='flex h-8 gap-2' key={index}>
              <InputNumber
                placeholder='Start'
                value={filter.valueStart}
                onChange={(value) => {
                  const updatedFilters = [...filters]
                  updatedFilters[index].valueStart = value
                  setFilters(updatedFilters)
                }}
                style={{ width: '50%' }}
              />
              <span className='flex items-center'>-</span>
              <Input
                placeholder='End'
                value={filter.valueEnd}
                onChange={(e) => {
                  const updatedFilters = [...filters]
                  updatedFilters[index].valueEnd = e.target.value
                  setFilters(updatedFilters)
                }}
                style={{ width: '50%' }}
              />
              <input
                type='color'
                className='h-full w-11 rounded-lg border border-solid border-blue-950'
                value={filter.color}
                onChange={(e) => {
                  const updatedFilters = [...filters]
                  updatedFilters[index].color = e.target.value
                  setFilters(updatedFilters)
                }}
              />
            </div>
          ))}
          {savedFilters.length === 0 && (
            <div className='flex h-8 gap-2'>
              <InputNumber
                placeholder='Start'
                value={valueStart}
                onChange={(value) => setValueStart(value)}
                style={{ width: '50%', borderColor: '#110F45' }}
              />
              <span className='flex items-center'>-</span>
              <Input
                placeholder='End'
                value={valueEnd}
                onChange={(e) => setValueEnd(e.target.value)}
                style={{ width: '50%', borderColor: '#110F45' }}
              />
              <input
                type='color'
                className='h-full w-11 rounded-lg border border-solid border-blue-950'
                value={color}
                onChange={handleColorPicker}
              />
            </div>
          )}
          <button
            className='flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-solid border-blue-950 text-base font-bold text-blue-950'
            onClick={handleAddFilter}
          >
            Tambah
          </button>
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

export default FilterDialog
