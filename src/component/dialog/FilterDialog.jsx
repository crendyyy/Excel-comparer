import Dialog from '../shared/Dialog'
import React, { useState, useContext } from 'react'
import { FormContext } from '../../context/FormContext'
import { InputNumber } from 'antd'
import TrashIcon from '../icons/TrashIcon'

const FilterDialog = ({ onClose, onSubmit }) => {
  const [filters, setFilters] = useState([])
  const [color, setColor] = useState('#ffffff')
  const [valueStart, setValueStart] = useState('')
  const [valueEnd, setValueEnd] = useState('')
  const { savedFilters, setSavedFilters } = useContext(FormContext)

  const sortFilter = savedFilters.sort((a, b) => b.valueEnd - a.valueEnd)

  const handleColorPicker = (e) => {
    setColor(e.target.value)
  }

  const handleAddFilter = () => {
    const newFilter = {
      valueStart: valueStart !== '' ? parseFloat(valueStart) : '',
      valueEnd: valueEnd !== '' ? parseFloat(valueEnd) : '',
      color,
    }

    setFilters([...filters, newFilter])
    setValueStart('')
    setValueEnd('')
    setColor('#ffffff')
  }

  const handleConfirm = () => {
    let combinedFilters = [...savedFilters]
    const validNewFilters = filters.filter((filter) => filter.valueStart !== '' && filter.valueEnd !== '')

    if (valueStart !== '' && valueEnd !== '') {
      const newFilter = {
        valueStart: parseFloat(valueStart),
        valueEnd: parseFloat(valueEnd),
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
      <div className='flex flex-col gap-10 p-6 bg-white border border-gray-100 border-solid w-96 rounded-primary'>
        <div className='flex flex-col gap-2'>
          <span className='text-base font-bold'>Filter Warna</span>
          {sortFilter.map((filter, index) => (
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
              <InputNumber
                placeholder='End'
                value={filter.valueEnd}
                onChange={(value) => {
                  const updatedFilters = [...savedFilters]
                  updatedFilters[index].valueEnd = value
                  setSavedFilters(updatedFilters)
                }}
                style={{ width: '50%' }}
              />
              <input
                type='color'
                className='h-full border border-solid rounded-lg w-11 border-blue-950'
                value={filter.color}
                onChange={(e) => {
                  const updatedFilters = [...savedFilters]
                  updatedFilters[index].color = e.target.value
                  setSavedFilters(updatedFilters)
                }}
              />
              <button
                className='flex items-center justify-center w-12 h-full border border-gray-200 border-solid rounded-lg'
                onClick={() => handleDeleteFilter(index, 'saved')}
              >
                <TrashIcon className='w-5 h-5 text-red-500' />
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
              <InputNumber
                placeholder='End'
                value={filter.valueEnd}
                onChange={(value) => {
                  const updatedFilters = [...filters]
                  updatedFilters[index].valueEnd = value
                  setFilters(updatedFilters)
                }}
                style={{ width: '50%' }}
              />
              <input
                type='color'
                className='h-full border border-solid rounded-lg w-11 border-blue-950'
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
                style={{ width: '50%' }}
              />
              <span className='flex items-center'>-</span>
              <InputNumber
                placeholder='End'
                value={valueEnd}
                onChange={(value) => setValueEnd(value)}
                style={{ width: '50%' }}
              />
              <input
                type='color'
                className='h-full border border-solid rounded-lg w-11 border-blue-950'
                value={color}
                onChange={handleColorPicker}
              />
            </div>
          )}
          <button
            className='flex items-center justify-center w-full h-8 gap-1 text-base font-bold border border-solid rounded-lg border-blue-950 text-blue-950'
            onClick={handleAddFilter}
          >
            Tambah
          </button>
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

export default FilterDialog
