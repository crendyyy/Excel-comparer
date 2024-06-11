import { useContext, useEffect, useRef } from 'react'
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
    setFilterCriteria,
    resultsDuplicate,
    setResultsDuplicate,
    resultsDuplicatesSecond,
    setResultsDuplicatesSecond,
  } = useContext(FormContext)

  const { isDialogOpen, openDialog, closeDialog } = useDialog()
  const mainFileRef = useRef(null)
  const secondaryFilesRef = useRef(null)

  const submitExcelMutation = useCompareExcel()
  const submitMissingMutation = useCompareSKUExcel()

  const [dialogContent, setDialogContent] = useState(null)


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
    setResultsDuplicatesSecond([])
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
    if (!result || !result.payload) {
      throw new Error('Invalid response structure')
    }

    const allDuplicates = result.payload.duplicated
    const mainFileDuplicates = allDuplicates.filter((dup) => dup.filename === formData.mainFile.name)
    const secondaryFilesDuplicates = allDuplicates.filter((dup) =>
      formData.secondaryFiles.some((file) => file.name === dup.filename),
    )
    const tableColumns = result.payload.columns
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
              File Utama
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
              File Turunan
            </button>
          ) : (
            <>
              <label
                htmlFor='compare-file'
                className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
              >
                {secondaryFileNames}
              </label>
              <input
                name='compare-file'
                type='file'
                id='compare-file'
                accept={xlsxMimeType}
                className='hidden'
                onChange={handleFileChange}
                required
                multiple
                ref={mainFileRef}
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
