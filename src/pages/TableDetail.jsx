import { useContext, useEffect, useRef, useState } from 'react'
import FilterIcon from '../component/icons/FilterIcon'
import useDialog from '../hooks/useDialog'
import FilterDialog from '../component/dialog/FilterDialog'
import TableResult from '../component/Table/TableResults'
import { Select } from 'antd'
import { FormContext } from '../context/FormContext'
import { columns, operators, ExcelType } from '../libs/enum'
import { useCompareExcel } from '../services/excels/useCompareExcel'
import { useCompareSKUExcel } from '../services/excels/useGetMissingSku'
import Title from 'antd/es/typography/Title'
import { xlsxMimeType } from '../libs/const'
import InputMainFileDialog from '../component/dialog/InputMainFile'
import InputSecondaryFileDialog from '../component/dialog/InputSecondaryFiles'

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
    setFilterCriteria,
    setMainFileName,
    secondaryFileNames,
    setSecondaryFileNames,
    tableColumns,
    setTableColumns,
    excelColumns,
    setExcelColumns,
    filteredResults,
    setFilteredResults,
    isSubmited,
    setIsSubmited,
    hideOperator,
    setHideOperator,
    resultsDuplicate,
    setResultsDuplicate,
    resultsDuplicatesSecond,
    setResultsDuplicatesSecond,
    savedInputsMain,
    setSavedInputsMain,
    savedInputsSecondary,
    setSavedInputsSecondary,
    savedResultsSecondary,
    setSavedResultsSecondary,
  } = useContext(FormContext)

  const { isDialogOpen, openDialog, closeDialog } = useDialog()
  const mainFileRef = useRef(null)
  const secondaryFilesRef = useRef(null)

  const submitExcelMutation = useCompareExcel()
  const submitMissingMutation = useCompareSKUExcel()

  const [dialogContent, setDialogContent] = useState(null)
  const prevTypeTableRef = useRef(typeTable)

  useEffect(() => {
    if (typeTable !== prevTypeTableRef.current) {
      setFormData({
        mainFile: typeTable === 'shopee_product' ? savedInputsMain : null,
        secondaryFiles: [],
        type: typeTable,
        targetColumn: typeColumn,
      })
      prevTypeTableRef.current = typeTable
      setSavedInputsMain([])
      setSavedInputsSecondary([])
      setSavedResultsSecondary([])
      setMainFileName("File Utama")
      setSecondaryFileNames("File Turunan")
    }
  }, [typeTable, savedInputsMain, setFormData, typeColumn])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      targetColumn: typeColumn,
      type: typeTable,
    }))
    setHideOperator(!['harga', 'stok', 'berat'].includes(typeColumn))
    if (hideOperator) setTypeOperator('Pilih Operator')
  }, [typeColumn, hideOperator, setFormData, setHideOperator, setTypeOperator, typeTable])

  useEffect(() => {
    if (mainFileRef.current && formData.mainFile) {
      mainFileRef.current.files = createFileList([formData.mainFile])
    }
    if (secondaryFilesRef.current && formData.secondaryFiles.length > 0) {
      secondaryFilesRef.current.files = createFileList(formData.secondaryFiles)
    }
  }, [formData.mainFile, formData.secondaryFiles])

  useEffect(() => {
    if (typeTable === 'shopee_product') {
      if (typeTable === 'shopee_product' && savedInputsMain) {
        setFormData((prev) => ({
          ...prev,
          mainFile: savedInputsMain, // Menggunakan savedInputsMain secara langsung
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          mainFile: null,
        }))
      }
      if (savedResultsSecondary && savedResultsSecondary.length > 0) {
        setFormData((prev) => ({
          ...prev,
          secondaryFiles: savedResultsSecondary, // Simpan savedResultsSecondary sebagai array
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          secondaryFiles: [], // Kosongkan secondaryFiles jika savedResultsSecondary kosong
        }))
      }
    }
  }, [typeTable, savedInputsMain, savedResultsSecondary, setFormData])

  const createFileList = (files) => {
    const dataTransfer = new DataTransfer()
    files.forEach((file) => dataTransfer.items.add(file))
    return dataTransfer.files
  }

  const truncateFileName = (name, maxLength = 12) =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (typeTable === 'shopee_product') {
      if (name === 'main-file') {
        setFormData((prev) => ({ ...prev, mainFile: savedInputsMain }))
        setMainFileName(truncateFileName(files[0].name))
      } else if (name === 'compares-file') {
        const fileObjects = Array.from(files).map((file) => ({
          filename: file.name,
          path: URL.createObjectURL(file),
        }))
        setFormData((prev) => ({ ...prev, secondaryFiles: fileObjects }))
        const truncatedNames = files.length > 1 ? `${files.length} Files Selected` : truncateFileName(files[0].name)
        setSecondaryFileNames(truncatedNames)
      }
    } else {
      if (name === 'main-file') {
        setFormData((prev) => ({ ...prev, mainFile: files[0] }))
        setMainFileName(truncateFileName(files[0].name))
      } else if (name === 'compares-file') {
        setFormData((prev) => ({ ...prev, secondaryFiles: Array.from(files) }))
        const truncatedNames = files.length > 1 ? `${files.length} Files Selected` : truncateFileName(files[0].name)
        setSecondaryFileNames(truncatedNames)
      }
    }
    setResultsDuplicatesSecond([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    let data
  
    if (typeTable === 'shopee_product') {
      data = {
        mainFile: formData.mainFile,
        secondaryFiles: formData.secondaryFiles,
        type: formData.type,
        targetColumn: formData.targetColumn,
      }
    } else {
      data = new FormData()
      data.append('mainFile', formData.mainFile)
      formData.secondaryFiles.forEach((file) => {
        data.append('secondaryFiles', file)
      })
      data.append('type', formData.type)
      data.append('targetColumn', formData.targetColumn)
    }
    console.log(data);
  
    const mutation = typeColumn === 'sku_produk' ? submitMissingMutation : submitExcelMutation
  
    const response = typeTable === 'shopee_product'
      ? await mutation.mutateAsync({ data: JSON.stringify(data) })
      : await mutation.mutateAsync({ data: data })
  
    const result = response.data
    if (!result || !result.payload) {
      throw new Error('Invalid response structure')
    }
  
    const allDuplicates = result.payload.duplicated
    const mainFileDuplicates = allDuplicates.filter((dup) => dup.filename === formData.mainFile.filename)
    const secondaryFilesDuplicates = allDuplicates.filter((dup) =>
      formData.secondaryFiles.some((file) => file.filename === dup.filename),
    )
    const tableColumns = result.payload.excel.columns
    const primaryColumn = result.payload.excel
  
    const filteredData =
      typeColumn === 'sku_produk' ? result.payload.results : filterResults(result.payload.results, typeOperator)
  
    setFilteredResults(filteredData)
    setResultsDuplicate(mainFileDuplicates)
    setExcelColumns(primaryColumn)
    setResultsDuplicatesSecond(secondaryFilesDuplicates)
    setTableColumns(tableColumns)
    setIsSubmited(true)
  }

  const filterResults = (results, operator) => {
    return results.map((fileResult) => {
      const filteredRows = fileResult.rows.filter((row) => {
        switch (operator) {
          case 'lesser_than':
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

  const inputMainFileDialog = () => {
    return <InputMainFileDialog onClose={closeDialog} />
  }
  const inputSecondaryFileDialog = () => {
    return <InputSecondaryFileDialog onClose={closeDialog} />
  }

  const filterDialog = () => {
    return (
      <FilterDialog
        onClose={closeDialog}
        onSubmit={(filters) => {
          setFilterCriteria(filters)
          closeDialog()
        }}
      />
    )
  }

  const openDialogWithContent = (content) => {
    setDialogContent(content)
    openDialog()
  }

  console.log(savedInputsMain)
  console.log(savedResultsSecondary)
  console.log(formData)

  return (
    <div className='flex flex-col gap-8 p-10'>
      <Title level={2}>Daftar Tugas</Title>
      <form onSubmit={handleSubmit} className='flex justify-between w-full p-6 bg-white rounded-lg'>
        <div className='flex gap-6'>
          <div className='w-fit'>
            <Select
              allowClear
              size='large'
              showSearch
              style={{ width: '100%', height: '100%' }}
              placeholder='Pilih E-comm'
              value={typeTable}
              onChange={(value) => setTypeTable(value)}
              options={Object.values(ExcelType).map((col) => ({
                label: col.label,
                value: col.value,
              }))}
            />
          </div>
          {typeTable === 'shopee_product' ? (
            <button
              type='button'
              onClick={() => openDialogWithContent(inputMainFileDialog)}
              className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
            >
              {savedInputsMain.length === 0 ? 'File Utama' : `1 Toko Utama`}
            </button>
          ) : (
            <>
              <label
                htmlFor='main-file'
                className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
              >
                {mainFileName}
              </label>
              <input
                name='main-file'
                type='file'
                id='main-file'
                accept={xlsxMimeType}
                className='hidden'
                onChange={handleFileChange}
                required
                ref={mainFileRef}
              />
            </>
          )}
          {typeTable === 'shopee_product' ? (
            <button
              type='button'
              onClick={() => openDialogWithContent(inputSecondaryFileDialog)}
              className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
            >
              {savedInputsSecondary.length === 0 ? 'File Turunan' : `${savedInputsSecondary.length} Toko Cabang`}
            </button>
          ) : (
            <>
              <label
                htmlFor='compares-file'
                className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
              >
                {secondaryFileNames}
              </label>
              <input
                name='compares-file'
                type='file'
                id='compares-file'
                accept={xlsxMimeType}
                className='hidden'
                onChange={handleFileChange}
                required
                multiple
                ref={secondaryFilesRef}
              />
            </>
          )}
          <div className='w-fit'>
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
            <div className='w-fit'>
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
          <button
            type='button'
            onClick={() => openDialogWithContent(filterDialog)}
            className='flex h-full items-center rounded-lg bg-[#110F45] px-4'
          >
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
          duplicate={resultsDuplicate}
          secondaryDuplicates={resultsDuplicatesSecond}
          excelColumns={excelColumns}
          previousState={{
            typeTable,
            typeColumn,
            typeOperator,
            filterCriteria,
            resultsDuplicatesSecond,
            tableColumns,
          }}
        />
      )}
      {isDialogOpen && dialogContent}
    </div>
  )
}

export default TableDetail
