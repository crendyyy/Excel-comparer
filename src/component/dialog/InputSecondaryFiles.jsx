import Dialog from '../shared/Dialog'
import React, { useState, useContext, useRef, useEffect } from 'react'
import { FormContext } from '../../context/FormContext'
import { xlsxMimeType } from '../../libs/const'
import PencilIcon from '../icons/Edit'
import TrashIcon from '../icons/TrashIcon'
import useFindActualPrice from '../../services/excels/useFindActualPrice'
import DownloadIcon from '../icons/DownlaodIcon'

const InputSecondaryFileDialog = ({ onClose }) => {
  const {
    formInputSecondary,
    setFormInputSecondary,
    secondaryFilePrice,
    setSecondaryFilePrice,
    secondaryFileDiscount,
    setSecondaryFileDiscount,
    secondaryFileCustom,
    setSecondaryFileCustom,
    savedInputsSecondary,
    setSavedInputsSecondary,
    savedResultsSecondary,
    setSavedResultsSecondary,
  } = useContext(FormContext)

  const [tempMainFileName, setTempMainFileName] = useState('Harga Mati')
  const [tempMainFileDiscount, setTempMainFileDiscount] = useState('Harga Coret')
  const [tempMainFileCustom, setTempMainFileCustom] = useState('Harga Khusus')
  const [tempMainFilePrice, setTempMainFilePrice] = useState(null)
  const [tempMainFileDiscountFile, setTempMainFileDiscountFile] = useState(null)
  const [tempMainFileCustomFile, setTempMainFileCustomFile] = useState(null)
  const [additionalInputs, setAdditionalInputs] = useState([])
  const [isMainFilesSaved, setIsMainFilesSaved] = useState(true)
  const [editIndex, setEditIndex] = useState(null)
  const [overflowHide, setOverflowHide] = useState(false)
  const [indicesToDelete, setIndicesToDelete] = useState([])

  const contentHeight = useRef(null)
  const mainFilePriceRef = useRef(null)
  const mainFileDiscountRef = useRef(null)
  const mainFileCustomRef = useRef(null)

  const submitCombinedFiles = useFindActualPrice()

  useEffect(() => {
    const currentHeight = contentHeight.current.scrollHeight
    if (currentHeight >= 384) {
      setOverflowHide(true)
    }

    contentHeight.current.scrollTop = contentHeight.current.scrollHeight
  }, [additionalInputs])

  useEffect(() => {
    setIsMainFilesSaved(savedInputsSecondary.length === 0)
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
      } else if (name === 'main-file-custom') {
        setTempMainFileCustomFile(files[0])
        setTempMainFileCustom(truncateFileName(files[0].name))
      }
    } else {
      const newAdditionalInputs = [...additionalInputs]
      if (name === `additional-file-price-${index}`) {
        newAdditionalInputs[index].price = files[0]
        newAdditionalInputs[index].priceName = truncateFileName(files[0].name)
      } else if (name === `additional-file-discount-${index}`) {
        newAdditionalInputs[index].discount = files[0]
        newAdditionalInputs[index].discountName = truncateFileName(files[0].name)
      } else if (name === `additional-file-custom-${index}`) {
        newAdditionalInputs[index].custom = files[0]
        newAdditionalInputs[index].customName = truncateFileName(files[0].name)
      }
      setAdditionalInputs(newAdditionalInputs)
    }
  }

  const handleAddInput = () => {
    setAdditionalInputs([
      ...additionalInputs,
      {
        price: null,
        priceName: 'Harga Mati',
        discount: null,
        discountName: 'Harga Coret',
        custom: null,
        customName: 'Harga Khusus',
      },
    ])
  }

  const handleConfirm = async () => {
    const inputsAfterDeletion = savedInputsSecondary.filter((_, index) => !indicesToDelete.includes(index))
    const validInputs = additionalInputs.filter((input) => input.price !== null && input.discount !== null && input.custom !== null)
    const combinedFiles = [
      ...(tempMainFilePrice && tempMainFileDiscountFile && tempMainFileCustomFile
        ? [
            {
              price: tempMainFilePrice,
              discount: tempMainFileDiscountFile,
              custom: tempMainFileCustomFile,
              priceName: tempMainFileName,
              discountName: tempMainFileDiscount,
              customName: tempMainFileCustom,
            },
          ]
        : []),
      ...validInputs,
    ]

    let isModified = false
    const newSavedInputs = [...inputsAfterDeletion]

    if (editIndex !== null && combinedFiles.length > 0) {
      newSavedInputs[editIndex] = combinedFiles[0]
      isModified = true
    } else if (combinedFiles.length > 0) {
      newSavedInputs.push(...combinedFiles)
      isModified = true
    }

    if (isModified || indicesToDelete.length > 0) {
      const dataResults = []
      for (const input of newSavedInputs) {
        const formInputSecondaryData = new FormData()
        formInputSecondaryData.append('mainFile', input.price || formInputSecondary.mainFile)
        formInputSecondaryData.append('discountFile', input.discount || formInputSecondary.discountFile)
        formInputSecondaryData.append('customFile', input.custom || formInputSecondary.customFile)

        setFormInputSecondary({
          mainFile: input.price || formInputSecondary.mainFile,
          discountFile: input.discount || formInputSecondary.discountFile,
          customFile: input.custom || formInputSecondary.customFile,
        })

        const response = await submitCombinedFiles.mutateAsync({ data: formInputSecondaryData })
        const result = response.data
        if (!result || !result.payload) {
          throw new Error('Invalid response structure')
        }
        const combinedResult = result.payload
        dataResults.push(combinedResult)
      }

      setSecondaryFilePrice(tempMainFileName)
      setSecondaryFileDiscount(tempMainFileDiscount)
      setSecondaryFileCustom(tempMainFileCustom)
      setSavedInputsSecondary(newSavedInputs)
      setSavedResultsSecondary(dataResults)
      setIsMainFilesSaved(false)

      setAdditionalInputs([])
      setTempMainFilePrice(null)
      setTempMainFileDiscountFile(null)
      setTempMainFileCustomFile(null)
      setEditIndex(null)
      setIndicesToDelete([])
      onClose()
    } else {
      onClose()
    }
  }

  const handleCancel = () => {
    setTempMainFileName(secondaryFilePrice || 'Harga Mati')
    setTempMainFileDiscount(secondaryFileDiscount || 'Harga Coret')
    setTempMainFileCustom(secondaryFileCustom || 'Harga Khusus')
    setTempMainFilePrice(null)
    setTempMainFileDiscountFile(null)
    setTempMainFileCustomFile(null)
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
          custom: inputToEdit.custom,
          customName: inputToEdit.customName,
        },
      ])
      setEditIndex(index)
    }
  }

  const handleDeleteInput = (index) => {
    if (indicesToDelete.includes(index)) {
      setIndicesToDelete(indicesToDelete.filter((i) => i !== index))
    } else {
      setIndicesToDelete([...indicesToDelete, index])
    }
  }

  const handleDownloadInput = (index) => {
    const combinedResult = savedResultsSecondary[index]
    if (combinedResult && combinedResult.path) {
      const basePath = 'http://localhost:3000'
      const filename = combinedResult.path
      const downloadLink = document.createElement('a')
      downloadLink.href = `${basePath}/${filename}`
      downloadLink.download = filename
      downloadLink.click()
    }
  }

  console.log(savedResultsSecondary)
  return (
    <Dialog onCancel={handleCancel}>
      <div className='flex w-96 flex-col gap-10 rounded-primary border border-solid border-gray-100 bg-white p-6'>
        <div className='flex flex-col gap-4'>
          <span className='text-base font-bold'>File Utama</span>
          <div
            ref={contentHeight}
            className={`flex flex-col gap-4 ${overflowHide ? 'overflow-y-scroll' : ''} max-h-96`}
          >
            {isMainFilesSaved && (
              <div className='flex flex-col gap-4'>
                <label
                  htmlFor='main-file-price'
                  className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
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
                  className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
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
                <label
                  htmlFor='main-file-custom'
                  className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
                >
                  {tempMainFileCustom}
                </label>
                <input
                  name='main-file-custom'
                  type='file'
                  id='main-file-custom'
                  accept={xlsxMimeType}
                  className='hidden'
                  onChange={handleFileChange}
                  required
                  ref={mainFileCustomRef}
                />
              </div>
            )}
            {savedInputsSecondary.map((input, index) => (
              <div className='flex gap-4' key={index}>
                <label
                  htmlFor='results-file'
                  className={`flex w-full gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600 ${
                    indicesToDelete.includes(index) ? 'bg-red-100' : ''
                  }`}
                >
                  {`Cabang ${index + 1}`}
                </label>
                <div className='flex gap-2'>
                  <button
                    className='flex h-full w-12 items-center justify-center rounded-lg border border-solid border-gray-300'
                    onClick={() => handleDownloadInput(index)}
                  >
                    <DownloadIcon />
                  </button>
                  <button
                    className='flex h-full w-12 items-center justify-center rounded-lg border border-solid border-gray-300'
                    onClick={() => handleEditInput(index)}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    className='flex h-full w-12 items-center justify-center rounded-lg border border-solid border-gray-300'
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
                  className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
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
                  className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
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
                <label
                  htmlFor={`additional-file-custom-${index}`}
                  className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
                >
                  {input.customName}
                </label>
                <input
                  name={`additional-file-custom-${index}`}
                  type='file'
                  id={`additional-file-custom-${index}`}
                  accept={xlsxMimeType}
                  className='hidden'
                  onChange={(e) => handleFileChange(e, index)}
                />
              </div>
            ))}
          </div>
          {editIndex === null && (
            <button
              className='flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-solid border-blue-950 text-base font-bold text-blue-950'
              onClick={handleAddInput}
            >
              Tambah
            </button>
          )}
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
