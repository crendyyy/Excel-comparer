import Dialog from '../shared/Dialog'
import React, { useState, useContext, useRef, useEffect } from 'react'
import { FormContext } from '../../context/FormContext'
import { xlsxMimeType } from '../../libs/const'
import useFindActualPrice from '../../services/excels/useFindActualPrice'

const InputMainFileDialog = ({ onClose }) => {
  const {
    setFormData,
    mainFilePrice,
    setMainFilePrice,
    mainFileDiscount,
    setMainFileDiscount,
    savedInputsMain,
    setSavedInputsMain,
  } = useContext(FormContext)

  const [tempMainFileName, setTempMainFileName] = useState(mainFilePrice)
  const [tempMainFileDiscount, setTempMainFileDiscount] = useState(mainFileDiscount)
  const [tempMainFilePrice, setTempMainFilePrice] = useState(null)
  const [tempMainFileDiscountFile, setTempMainFileDiscountFile] = useState(null)

  const mainFilePriceRef = useRef(null)
  const mainFileDiscountRef = useRef(null)

  const submitCombinedFiles = useFindActualPrice()

  useEffect(() => {
    setTempMainFileName(mainFilePrice)
    setTempMainFileDiscount(mainFileDiscount)
  }, [mainFilePrice, mainFileDiscount])

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

  const handleConfirm = async (e) => {
    if (tempMainFilePrice || tempMainFileDiscountFile) {
      const formData = new FormData()
      formData.append('mainFile', tempMainFilePrice)
      formData.append('discountFile', tempMainFileDiscountFile)

      setFormData((prev) => ({ ...prev, mainFilePrice: tempMainFilePrice, mainFileDiscount: tempMainFileDiscountFile }))
      setMainFilePrice(tempMainFileName)
      setMainFileDiscount(tempMainFileDiscount)
      
      const response = await submitCombinedFiles.mutateAsync({ data: formData })
      
      const result = response.data
      if (!result || !result.payload) {
        throw new Error('Invalid response structure')
      }
      
      const combinedFiles = result.payload
      console.log(combinedFiles);
      setSavedInputsMain(combinedFiles)
    }
    onClose()
  }

  const handleCancel = () => {
    if (!mainFilePrice && !mainFileDiscount) {
      setTempMainFileName('Harga Mati')
      setTempMainFileDiscount('Harga Coret')
      setTempMainFilePrice(null)
      setTempMainFileDiscountFile(null)
    }
    onClose()
  }
  console.log(savedInputsMain)

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
