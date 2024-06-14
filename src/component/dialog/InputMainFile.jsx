import Dialog from '../shared/Dialog'
import React, { useState, useContext, useRef, useEffect } from 'react'
import { FormContext } from '../../context/FormContext'
import { xlsxMimeType } from '../../libs/const'
import useFindActualPrice from '../../services/excels/useFindActualPrice'

const InputMainFileDialog = ({ onClose }) => {
  const {
    formInputMain,
    setFormInputMain,
    mainFilePrice,
    setMainFilePrice,
    mainFileDiscount,
    setMainFileDiscount,
    savedInputsMain,
    setSavedInputsMain,
  } = useContext(FormContext)

  const [tempMainFileName, setTempMainFileName] = useState('Harga Mati')
  const [tempMainFileDiscount, setTempMainFileDiscount] = useState('Harga Coret')
  const [tempMainFilePrice, setTempMainFilePrice] = useState(null)
  const [tempMainFileDiscountFile, setTempMainFileDiscountFile] = useState(null)

  const mainFilePriceRef = useRef(null)
  const mainFileDiscountRef = useRef(null)

  const submitCombinedFiles = useFindActualPrice()
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
    e.preventDefault()
    if (tempMainFilePrice || tempMainFileDiscountFile) {
      const formInputMainData = new FormData()
      formInputMainData.append('mainFile', tempMainFilePrice || formInputMain.mainFile)
      formInputMainData.append('discountFile', tempMainFileDiscountFile || formInputMain.discountFile)

      setFormInputMain({
        mainFile: tempMainFilePrice || formInputMain.mainFile,
        discountFile: tempMainFileDiscountFile || formInputMain.discountFile,
      })
      setMainFilePrice(tempMainFileName)
      setMainFileDiscount(tempMainFileDiscount)

      const response = await submitCombinedFiles.mutateAsync({ data: formInputMainData })

      const result = response.data
      if (!result || !result.payload) {
        throw new Error('Invalid response structure')
      }

      const combinedFiles = result.payload
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
      <div className='flex w-96 flex-col gap-10 rounded-primary border border-solid border-gray-100 bg-white p-6'>
        <div className='flex flex-col gap-4'>
          <span className='text-base font-bold'>File Utama</span>
          <div className='flex flex-col gap-4'>
            <label
              htmlFor='main-file-price'
              className='flex gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-base font-semibold text-gray-600'
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
              className='flex gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-base font-semibold text-gray-600'
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

export default InputMainFileDialog
