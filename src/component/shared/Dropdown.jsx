import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ChevronIcon from '../icons/ChevronIcon'

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(props.value || 'Silahkan Pilih')
  const dropdownRef = useRef(null)

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const handleSelectOption = (id, columnType) => {
    setSelectedValue(columnType)
    props.setValue(columnType || id)
    closeDropdown()
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className='relative w-40 max-w-sm max-md:max-w-none' ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-1 rounded-3xl border  border-gray-200 bg-gray-50 px-6 py-3 ${
          isOpen ? '!border-primary !bg-primary-lighten shadow-input outline-none' : ''
        } ${selectedValue ? 'font-semibold text-base text-black' : ''}`}
      >
        {selectedValue}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronIcon />
        </motion.div>
      </div>

      {isOpen && (
        <ul className='absolute top-14 z-10 w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white drop-shadow-sm'>
          {props.options?.map((option) => (
            <li
              key={option.id}
              onClick={() => handleSelectOption(option.id, option.columnType)}
              className={`flex cursor-pointer justify-between px-4 py-3 ${
                option.id === props.value ? 'text-primary' : ''
              }`}
            >
              <p
                className={`rounded-md px-2 py-1 ${option.columnType === 'Done' ? 'text-[#16A34A]' : ''}${option.columnType === 'Pending' ? 'text-yellow-600' : ''}`}
              >
                {option.columnType}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
