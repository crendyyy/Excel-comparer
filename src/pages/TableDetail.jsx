import { useContext, useEffect, useRef, useState } from 'react'
import FilterIcon from '../component/icons/FilterIcon'
import useDialog from '../hooks/useDialog'
import FilterDialog from '../component/dialog/FilterDialog'
import TableResult from '../component/Table/TableResults'
import { Select } from 'antd'
import { FormContext } from '../context/FormContext'
import { operators } from '../libs/enum'
import { useCompareExcel } from '../services/excels/useCompareExcel'
import Title from 'antd/es/typography/Title'
import { xlsxMimeType } from '../libs/const'
import InputMainFileDialog from '../component/dialog/InputMainFile'
import InputSecondaryFileDialog from '../component/dialog/InputSecondaryFiles'
import { useGetExcel } from '../services/excels/useGetExcel'
import { toast } from 'react-toastify'

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
    originalResults,
    setOriginalResults,
    setMainFilePrice,
    setMainFileDiscount,
    setMainFileCustom,
    setFormInputMain,
    setFormInputSecondary,
    filterColumns,
    setFilterColumns,
  } = useContext(FormContext)

  const { isDialogOpen, openDialog, closeDialog } = useDialog()
  const mainFileRef = useRef(null)
  const secondaryFilesRef = useRef(null)

  const { data: excels, isPending, isError } = useGetExcel()

  const submitExcelMutation = useCompareExcel()

  const [dialogContent, setDialogContent] = useState(null)
  const prevTypeTableRef = useRef(typeTable)

  useEffect(() => {
    if (isError) {
      toast.error('Gagal, silahkan coba lagi', { autoClose: false })
    }
  }, [isError])

  useEffect(() => {
    if (typeTable && excels?.payload) {
      const selectedTable = excels.payload.find((table) => table.type === typeTable)
      if (selectedTable) {
        setFilterColumns(selectedTable.filterableColumns)
      }
    }
  }, [typeTable, excels?.payload])

  useEffect(() => {
    if (originalResults.length > 0) {
      const filteredData = filterResults(originalResults, typeOperator)
      setFilteredResults(filteredData)
    }
  }, [typeOperator, originalResults])

  useEffect(() => {
    if (typeTable !== prevTypeTableRef.current) {
      setFormData({
        mainFile: typeTable === 'shopee_product' ? savedInputsMain : null,
        secondaryFiles: [],
        type: typeTable,
        targetColumn: '',
      })
      prevTypeTableRef.current = typeTable
      setSavedInputsMain([])
      setFormInputMain({})
      setFormInputSecondary([])
      setSavedInputsSecondary([])
      setSavedResultsSecondary([])
      setOriginalResults([])
      setFilteredResults([])
      setResultsDuplicate([])
      setResultsDuplicatesSecond([])
      setIsSubmited(false)
      setTypeColumn()
      setTypeOperator()
      setMainFileName('File Utama')
      setSecondaryFileNames('File Turunan')
      setMainFilePrice('Harga Mati')
      setMainFileDiscount('Harga Coret')
      setMainFileCustom('Harga Khusus')
    }
  }, [typeTable, savedInputsMain, setFormData, typeColumn])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      targetColumn: typeColumn,
      type: typeTable,
    }))
  }, [typeColumn, typeTable, setFormData])

  useEffect(() => {
    if (filteredResults && filteredResults.length > 0) {
      const shouldHideOperator = !['harga', 'stok', 'berat'].includes(typeColumn)
      setHideOperator(shouldHideOperator)
      if (shouldHideOperator) {
        setTypeOperator('Pilih Operator')
      }
    }
  }, [filteredResults, typeColumn, setHideOperator, setTypeOperator])

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

    const response =
      typeTable === 'shopee_product'
        ? await submitExcelMutation.mutateAsync({ data: JSON.stringify(data) })
        : await submitExcelMutation.mutateAsync({ data })

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

    setOriginalResults(result.payload.results) // Simpan hasil asli

    setFilteredResults(result.payload.results)
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

  return (
    <div className='flex flex-col gap-8 p-10'>
      <Title level={2}>Daftar Excel</Title>
      <form onSubmit={handleSubmit} className='flex w-full justify-between rounded-lg bg-white p-6'>
        <div className='flex gap-6'>
          <div className='w-fit'>
            <Select
              allowClear
              size='large'
              showSearch
              style={{ width: '100%', height: '100%' }}
              loading={isPending ? true : false}
              placeholder={'Pilih E-comm'}
              value={typeTable}
              onChange={(value) => setTypeTable(value)}
              options={
                excels?.payload.map((col) => ({
                  label: col.name,
                  value: col.type,
                })) || []
              }
            />
          </div>
          {typeTable && (
            <div className='w-fit'>
              <Select
                allowClear
                size='large'
                showSearch
                style={{ width: '100%', height: '100%' }}
                placeholder='Pilih Column'
                value={typeColumn}
                onChange={(value) => setTypeColumn(value)}
                options={filterColumns.map((col) => ({
                  label: col.label,
                  value: col.key,
                }))}
              />
            </div>
          )}
          {typeColumn && (
            <>
              {typeTable === 'shopee_product' ? (
                <button
                  type='button'
                  onClick={() => openDialogWithContent(inputMainFileDialog)}
                  className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
                >
                  {savedInputsMain.length === 0 ? 'File Utama' : `1 Toko Utama`}
                </button>
              ) : (
                <>
                  <label
                    htmlFor='main-file'
                    className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
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
                  className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
                >
                  {savedInputsSecondary.length === 0 ? 'File Turunan' : `${savedInputsSecondary.length} Toko Cabang`}
                </button>
              ) : (
                <>
                  <label
                    htmlFor='compares-file'
                    className='flex gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-base font-semibold text-gray-600'
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
            </>
          )}
          {filteredResults.length > 0 && !hideOperator && (
            <div className='w-fit'>
              <Select
                allowClear
                size='large'
                showSearch
                style={{ width: '100%', height: '100%' }}
                placeholder='Pilih Operator'
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
