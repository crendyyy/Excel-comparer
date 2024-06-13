import Dialog from '../shared/Dialog'
import React, { useState, useContext, useRef, useEffect } from 'react'
import { FormContext } from '../../context/FormContext'
import { xlsxMimeType } from '../../libs/const'
import PencilIcon from '../icons/Edit'
import TrashIcon from '../icons/TrashIcon'
import useFindActualPrice from '../../services/excels/useFindActualPrice'

const InputSecondaryFileDialog = ({ onClose }) => {
  const {
    formInputSecondary,
    setFormInputSecondary,
    secondaryFilePrice,
    setSecondaryFilePrice,
    secondaryFileDiscount,
    setSecondaryFileDiscount,
    savedInputsSecondary,
    setSavedInputsSecondary,
  } = useContext(FormContext)

  const [tempMainFileName, setTempMainFileName] = useState('Harga Mati')
  const [tempMainFileDiscount, setTempMainFileDiscount] = useState('Harga Coret')
  const [tempMainFilePrice, setTempMainFilePrice] = useState(null)
  const [tempMainFileDiscountFile, setTempMainFileDiscountFile] = useState(null)
  const [additionalInputs, setAdditionalInputs] = useState([])
  const [isMainFilesSaved, setIsMainFilesSaved] = useState(true)
  const [editIndex, setEditIndex] = useState(null)

  const mainFilePriceRef = useRef(null)
  const mainFileDiscountRef = useRef(null)

  const submitCombinedFiles = useFindActualPrice()

  useEffect(() => {
    if (savedInputsSecondary.length > 0) {
      setIsMainFilesSaved(false)
    } else {
      setIsMainFilesSaved(true)
    }
  }, [savedInputsSecondary])

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

  const handleConfirm = async () => {
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
      const newSavedInputs = []

      for (const filePair of combinedFiles) {
        const formInputSecondaryData = new FormData()
        formInputSecondaryData.append('mainFile', filePair.price || formInputSecondary.mainFile)
        formInputSecondaryData.append('discountFile', filePair.discount || formInputSecondary.discountFile)

        try {
          const response = await submitCombinedFiles.mutateAsync({ data: formInputSecondaryData })
          const result = response.data
          if (!result || !result.payload) {
            throw new Error('Invalid response structure')
          }
          const combinedFilesResponse = result.payload
          console.log(combinedFilesResponse)
          newSavedInputs.push(combinedFilesResponse)
        } catch (error) {
          console.error('Error during file submission:', error)
        }
      }

      setSavedInputsSecondary((prev) => [...prev, ...newSavedInputs])

      if (tempMainFilePrice) setSecondaryFilePrice(tempMainFileName)
      if (tempMainFileDiscountFile) setSecondaryFileDiscount(tempMainFileDiscount)
    }

    setAdditionalInputs([])
    setTempMainFilePrice(null)
    setTempMainFileDiscountFile(null)
    setEditIndex(null)

    onClose()
  }

  const handleCancel = () => {
    setTempMainFileName(secondaryFilePrice || 'Harga Mati')
    setTempMainFileDiscount(secondaryFileDiscount || 'Harga Coret')
    setTempMainFilePrice(null)
    setTempMainFileDiscountFile(null)
    setAdditionalInputs([])
    setEditIndex(null)

    onClose()
  }

  const handleEditInput = (index) => {
    if (editIndex === index) {
      setEditIndex(null)
      setAdditionalInputs([])
    } else {
      const inputToEdit = savedInputsSecondary[index]
      setAdditionalInputs([
        {
          price: inputToEdit.price,
          priceName: inputToEdit.priceName,
          discount: inputToEdit.discount,
          discountName: inputToEdit.discountName,
        },
      ])
      setEditIndex(index)
    }
  }

  const handleDeleteInput = (index) => {
    const newSavedInputs = savedInputsSecondary.filter((_, i) => i !== index)
    setSavedInputsSecondary(newSavedInputs)
    setEditIndex(null)
    setTempMainFileName('Harga Mati')
    setTempMainFileDiscount('Harga Coret')
    if (newSavedInputs.length === 0) {
      setIsMainFilesSaved(false)
    }
  }
  console.log(savedInputsSecondary)

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
          {savedInputsSecondary.map((input, index) => (
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
                required
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
                required
              />
            </div>
          ))}
          <button
            onClick={handleAddInput}
            className='flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-base font-semibold text-gray-600'
          >
            + Tambah File Cabang
          </button>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={handleCancel}
            className='flex w-full items-center justify-center rounded-lg border border-solid border-gray-200 bg-white px-4 py-3 text-base font-semibold text-gray-600'
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className='flex w-full items-center justify-center rounded-lg border border-solid border-gray-200 bg-gray-600 px-4 py-3 text-base font-semibold text-white'
          >
            Simpan
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default InputSecondaryFileDialog
