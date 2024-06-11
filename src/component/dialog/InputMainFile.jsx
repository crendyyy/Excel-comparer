import Dialog from '../shared/Dialog'
import React, { useState, useContext, useRef, useEffect } from 'react'
import { FormContext } from '../../context/FormContext'
import { xlsxMimeType } from '../../libs/const'

const InputMainFileDialog = ({ onClose }) => {
  const { setFormData, mainFileName, setMainFileName, mainFileDiscount, setMainFileDiscount } = useContext(FormContext)

  const [tempMainFileName, setTempMainFileName] = useState(mainFileName)
  const [tempMainFileDiscount, setTempMainFileDiscount] = useState(mainFileDiscount)
  const [tempMainFilePrice, setTempMainFilePrice] = useState(null)
  const [tempMainFileDiscountFile, setTempMainFileDiscountFile] = useState(null)

  const mainFilePriceRef = useRef(null)
  const mainFileDiscountRef = useRef(null)

  useEffect(() => {
    setTempMainFileName(mainFileName)
    setTempMainFileDiscount(mainFileDiscount)
  }, [mainFileName, mainFileDiscount])

  const truncateFileName = (name, maxLength = 40) =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (name === 'main-file-price') {
      setTempMainFilePrice(files[0])
      const truncatedName = truncateFileName(files[0].name)
      setTempMainFileName(truncatedName)
    } else if (name === 'main-file-discount') {
      setTempMainFileDiscountFile(files[0])
      const truncatedName = truncateFileName(files[0].name)
      setTempMainFileDiscount(truncatedName)
    }
  }

  const handleConfirm = () => {
    if (tempMainFilePrice || tempMainFileDiscountFile) {
      setFormData((prev) => ({ ...prev, mainFilePrice: tempMainFilePrice, mainFileDiscount: tempMainFileDiscountFile }))
      setMainFileName(tempMainFileName)
      setMainFileDiscount(tempMainFileDiscount)
    }
    onClose()
  }

  const handleCancel = () => {
    if (!mainFileName && !mainFileDiscount) {
      setTempMainFileName('Harga Mati')
      setTempMainFileDiscount('Harga Coret')
      setTempMainFilePrice(null)
      setTempMainFileDiscountFile(null)
    }
    onClose()
  }

  return (
    <Dialog onCancel={handleCancel}>
      <div className='flex flex-col gap-10 p-6 bg-white border border-gray-100 border-solid w-96 rounded-primary'>
        <div className='flex flex-col gap-4'>
          <span className='text-base font-bold'>File Utama</span>
          <div className='flex flex-col gap-4'>
            <label
              htmlFor='main-file-price'
              className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
            >
              {tempMainFileName}
            </label>
            <input
              name='main-file-price'
              type='file'
              id='main-file-price'
              accept={xlsxMimeType}
              className='hidden'
              onChange={handleFileChange}
              required
              ref={mainFilePriceRef}
            />
            <label
              htmlFor='main-file-discount'
              className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
            >
              {tempMainFileDiscount}
            </label>
            <input
              name='main-file-discount'
              type='file'
              id='main-file-discount'
              accept={xlsxMimeType}
              className='hidden'
              onChange={handleFileChange}
              required
              ref={mainFileDiscountRef}
            />
          </div>
        </div>
        <div className='flex h-12 gap-6'>
          <button
            onClick={handleCancel}
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

export default InputMainFileDialog
