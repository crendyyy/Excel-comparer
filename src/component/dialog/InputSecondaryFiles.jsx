import Dialog from '../shared/Dialog'
import React, { useState, useContext, useRef, useEffect } from 'react'
import { FormContext } from '../../context/FormContext'
import { xlsxMimeType } from '../../libs/const'
import PencilIcon from '../icons/Edit'
import TrashIcon from '../icons/TrashIcon'

const InputSecondaryFileDialog = ({ onClose }) => {
  const {
    setFormData,
    mainFileName,
    setMainFileName,
    mainFileDiscount,
    setMainFileDiscount,
    savedInputs,
    setSavedInputs,
  } = useContext(FormContext)

  const [tempMainFileName, setTempMainFileName] = useState(mainFileName)
  const [tempMainFileDiscount, setTempMainFileDiscount] = useState(mainFileDiscount)
  const [tempMainFilePrice, setTempMainFilePrice] = useState(null)
  const [tempMainFileDiscountFile, setTempMainFileDiscountFile] = useState(null)
  const [additionalInputs, setAdditionalInputs] = useState([])
  const [isMainFilesSaved, setIsMainFilesSaved] = useState(false)

  const mainFilePriceRef = useRef(null)
  const mainFileDiscountRef = useRef(null)

  useEffect(() => {
    setTempMainFileName(mainFileName)
    setTempMainFileDiscount(mainFileDiscount)
  }, [mainFileName, mainFileDiscount])

  const truncateFileName = (name, maxLength = 40) =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name

  const handleFileChange = (e, index) => {
    const { name, files } = e.target
    if (index === undefined) {
      if (name === 'main-file-price') {
        setTempMainFilePrice(files[0])
        setTempMainFileName(truncateFileName(files[0].name))
      } else if (name === 'main-file-discount') {
        setTempMainFileDiscountFile(files[0])
        setTempMainFileDiscount(truncateFileName(files[0].name))
      }
    } else {
      const newAdditionalInputs = [...additionalInputs]
      if (name === `additional-file-price-${index}`) {
        newAdditionalInputs[index].price = files[0]
        newAdditionalInputs[index].priceName = truncateFileName(files[0].name)
      } else if (name === `additional-file-discount-${index}`) {
        newAdditionalInputs[index].discount = files[0]
        newAdditionalInputs[index].discountName = truncateFileName(files[0].name)
      }
      setAdditionalInputs(newAdditionalInputs)
    }
  }

  const handleAddInput = () => {
    setAdditionalInputs([
      ...additionalInputs,
      { price: null, priceName: 'Harga Mati', discount: null, discountName: 'Harga Coret' },
    ])
  }

  const handleConfirm = () => {
    const validInputs = additionalInputs.filter((input) => input.price !== null && input.discount !== null)
    const combinedFiles = [
      ...(tempMainFilePrice && tempMainFileDiscountFile
        ? [
            {
              price: tempMainFilePrice,
              discount: tempMainFileDiscountFile,
              priceName: tempMainFileName,
              discountName: tempMainFileDiscount,
            },
          ]
        : []),
      ...validInputs,
    ]

    if (combinedFiles.length > 0) {
      setFormData((prev) => ({ ...prev, files: combinedFiles }))
      if (tempMainFilePrice) setMainFileName(tempMainFileName)
      if (tempMainFileDiscountFile) setMainFileDiscount(tempMainFileDiscount)
      setSavedInputs((prev) => [...prev, ...combinedFiles])
      setIsMainFilesSaved(false)
    }
    setAdditionalInputs([])
    setTempMainFilePrice(null)
    setTempMainFileDiscountFile(null)

    onClose()
  }

  const handleCancel = () => {
    setTempMainFileName(mainFileName || 'Harga Mati')
    setTempMainFileDiscount(mainFileDiscount || 'Harga Coret')
    setTempMainFilePrice(null)
    setTempMainFileDiscountFile(null)
    setAdditionalInputs([])

    onClose()
  }

  const handleEditInput = (index) => {
    const inputToEdit = savedInputs[index]
    setAdditionalInputs((prev) => [
      ...prev,
      {
        price: inputToEdit.price,
        priceName: inputToEdit.priceName,
        discount: inputToEdit.discount,
        discountName: inputToEdit.discountName,
      },
    ])
    handleDeleteInput(index)
  }

  const handleDeleteInput = (index) => {
    const newSavedInputs = savedInputs.filter((_, i) => i !== index)
    setSavedInputs(newSavedInputs)
    if (newSavedInputs.length === 0) {
      setIsMainFilesSaved(true)
    }
  }
  console.log(savedInputs)

  return (
    <Dialog onCancel={handleCancel}>
      <div className='flex w-96 flex-col gap-10 rounded-primary border border-solid border-gray-100 bg-white p-6'>
        <div className='flex flex-col gap-4'>
          <span className='text-base font-bold'>File Utama</span>
          {isMainFilesSaved && (
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
          )}
          {savedInputs.map((input, index) => (
            <div className='flex gap-4' key={index}>
              <label
                htmlFor='results-file'
                className='flex w-full gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-base font-semibold text-gray-600'
              >
                {`Cabang ${index + 1}`}
              </label>
              <div className='flex gap-2'>
                <button
                  className='flex h-full w-12 items-center justify-center rounded-lg border border-solid border-gray-200'
                  onClick={() => handleEditInput(index)}
                >
                  <PencilIcon className='h-5 w-5 text-red-500' />
                </button>
                <button
                  className='flex h-full w-12 items-center justify-center rounded-lg border border-solid border-gray-200'
                  onClick={() => handleDeleteInput(index)}
                >
                  <TrashIcon className='h-5 w-5 text-red-500' />
                </button>
              </div>
            </div>
          ))}
          {additionalInputs.map((input, index) => (
            <div className='flex flex-col gap-4' key={index}>
              <label
                htmlFor={`additional-file-price-${index}`}
                className='flex gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-base font-semibold text-gray-600'
              >
                {input.priceName}
              </label>
              <input
                name={`additional-file-price-${index}`}
                type='file'
                id={`additional-file-price-${index}`}
                accept={xlsxMimeType}
                className='hidden'
                onChange={(e) => handleFileChange(e, index)}
              />
              <label
                htmlFor={`additional-file-discount-${index}`}
                className='flex gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-base font-semibold text-gray-600'
              >
                {input.discountName}
              </label>
              <input
                name={`additional-file-discount-${index}`}
                type='file'
                id={`additional-file-discount-${index}`}
                accept={xlsxMimeType}
                className='hidden'
                onChange={(e) => handleFileChange(e, index)}
              />
            </div>
          ))}
          <button
            className='flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-solid border-blue-950 text-base font-bold text-blue-950'
            onClick={handleAddInput}
          >
            Tambah
          </button>
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

export default InputSecondaryFileDialog
