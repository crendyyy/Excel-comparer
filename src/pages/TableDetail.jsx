import { useContext, useEffect, useRef, useState } from 'react'
import FilterIcon from '../component/icons/FilterIcon'
import useDialog from '../hooks/useDialog'
import FilterDialog from '../component/dialog/FilterDialog'
import TableResult from '../component/Table/TableResults'
import { Select } from 'antd'
import { FormContext } from '../context/FormContext'
import { columns, operators } from '../libs/enum'
import { useSubmitExcel, useSubmitMissingSKU } from '../services/compare/useSubmitExcel'

const TableDetail = () => {
  const {
    formData,
    setFormData,
    typeColumn,
    setTypeColumn,
    typeOperator,
    setTypeOperator,
    typeTable,
    setTypeTable,
    mainFileName,
    filterCriteria,
    setMainFileName,
    secondaryFileNames,
    setSecondaryFileNames,
    filteredResults,
    setFilteredResults,
    isSubmited,
    setIsSubmited,
    hideOperator,
    setHideOperator,
    setFilterCriteria,
  } = useContext(FormContext)

  const { isDialogOpen, openDialog, closeDialog } = useDialog()
  const mainFileRef = useRef(null)
  const secondaryFilesRef = useRef(null)

  const submitExcelMutation = useSubmitExcel()
  const submitMissingMutation = useSubmitMissingSKU()

  const types = [
    { id: 0, tableType: 'Pilih E-comm' },
    { id: 'shopee_product', tableType: 'shopee' },
    { id: 'tiktok_product', tableType: 'tiktok' },
    { id: 'tokopedia_product', tableType: 'tokopedia' },
  ]

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      targetColumn: typeColumn,
      type: typeColumn === 'berat' ? 'shopee_weight' : 'shopee_product',
    }))
    setTypeTable(typeColumn === 'berat' ? 'shopee_weight' : 'shopee_product')
    setHideOperator(!['harga', 'stok', 'berat'].includes(typeColumn))
    if (hideOperator) setTypeOperator('Pilih Operator')
  }, [typeColumn, hideOperator, setFormData, setHideOperator, setTypeOperator])

  useEffect(() => {
    if (mainFileRef.current && formData.mainFile) {
      mainFileRef.current.files = createFileList([formData.mainFile])
    }
    if (secondaryFilesRef.current && formData.secondaryFiles.length > 0) {
      secondaryFilesRef.current.files = createFileList(formData.secondaryFiles)
    }
  }, [formData.mainFile, formData.secondaryFiles])

  const createFileList = (files) => {
    const dataTransfer = new DataTransfer()
    files.forEach((file) => dataTransfer.items.add(file))
    return dataTransfer.files
  }

  const truncateFileName = (name, maxLength = 12) =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (name === 'main-file') {
      setFormData((prev) => ({ ...prev, mainFile: files[0] }))
      const truncatedName = files[0] ? truncateFileName(files[0].name) : 'File Utama'
      setMainFileName(truncatedName)
    } else if (name === 'compares-file') {
      setFormData((prev) => ({ ...prev, secondaryFiles: Array.from(files) }))
      const truncatedNames =
        files.length > 1
          ? `${files.length} Files Selected`
          : files[0]
            ? truncateFileName(files[0].name)
            : 'File Turunan'
      setSecondaryFileNames(truncatedNames)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('mainFile', formData.mainFile)
    formData.secondaryFiles.forEach((file) => data.append('secondaryFiles', file))
    data.append('type', formData.type)
    data.append('targetColumn', formData.targetColumn)

    const mutation = typeColumn === 'sku_produk' ? submitMissingMutation : submitExcelMutation

    const response = await mutation.mutateAsync({ data: data })

    const result = response.data
    console.log(result)
    if (!result || !result.payload || !result.payload.results) {
      throw new Error('Invalid response structure')
    }

    const filteredData =
      typeColumn === 'sku_produk' ? result.payload.results : filterResults(result.payload.results, typeOperator)

    setFilteredResults(filteredData)
    setIsSubmited(true)
    console.log('Filtered Results:', filteredData)
  }

  const filterResults = (results, operator) => {
    return results.map((fileResult) => {
      const filteredRows = fileResult.rows.filter((row) => {
        switch (operator) {
          case 'less_than':
            return row.selisih < 0
          case 'greater_than':
            return row.selisih > 0
          case 'not_equal':
            return row.selisih !== 0
          default:
            return true
        }
      })
      return { ...fileResult, rows: filteredRows }
    })
  }

  return (
    <div className='flex flex-col gap-8 p-10'>
      <h1 className='font-bold'>Table Detail</h1>
      <form onSubmit={handleSubmit} className='flex w-full justify-between rounded-lg bg-white p-6'>
        <div className='flex gap-6'>
          <label
            htmlFor='main-file'
            className='flex gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-base font-semibold text-gray-600'
          >
            {mainFileName}
          </label>
          <input
            name='main-file'
            type='file'
            id='main-file'
            className='hidden'
            onChange={handleFileChange}
            required
            ref={mainFileRef}
          />
          <label
            htmlFor='compares-file'
            className='flex gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-base font-semibold text-gray-600'
          >
            {secondaryFileNames}
          </label>
          <input
            name='compares-file'
            type='file'
            id='compares-file'
            className='hidden'
            multiple
            onChange={handleFileChange}
            required
            ref={secondaryFilesRef}
          />
          <div className='w-40'>
            <Select
              allowClear
              size='large'
              showSearch
              style={{ width: '100%', height: '100%' }}
              placeholder='Pilih Column'
              value={typeColumn}
              onChange={(value) => setTypeColumn(value)}
              options={Object.values(columns).map((col) => ({
                label: col.label,
                value: col.value,
              }))}
            />
          </div>
          {!hideOperator && (
            <div className='w-40'>
              <Select
                allowClear
                size='large'
                showSearch
                style={{ width: '100%', height: '100%' }}
                placeholder='Pilih Column'
                value={typeOperator}
                onChange={(value) => setTypeOperator(value)}
                options={Object.values(operators).map((col) => ({
                  label: col.label,
                  value: col.value,
                }))}
              />
            </div>
          )}
        </div>
        <div className='flex gap-4'>
          <button type='button' onClick={openDialog} className='flex h-full items-center rounded-lg bg-[#110F45] px-4'>
            <FilterIcon />
          </button>
          <button
            type='submit'
            className='flex h-full items-center rounded-lg bg-[#110F45] px-4 text-base font-bold text-white'
          >
            Proses
          </button>
        </div>
      </form>
      {isSubmited && (
        <TableResult
          results={filteredResults}
          previousState={{
            typeTable,
            typeColumn,
            typeOperator,
            filterCriteria,
          }}
        />
      )}
      {isDialogOpen && (
        <FilterDialog
          onClose={closeDialog}
          onSubmit={(filters) => {
            setFilterCriteria(filters)
            closeDialog()
            console.log('Filter Criteria:', filters)
          }}
        />
      )}
    </div>
  )
}

export default TableDetail
