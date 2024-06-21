import React, { useState, useContext } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Table, Button, Collapse, Typography, Flex, Upload } from 'antd'
import ExcelJS from 'exceljs'
import ArrowLeft from '../icons/ArrowLeft'
import FilterIcon from '../icons/FilterIcon'
import FilterDialog from '../dialog/FilterDialog'
import { FormContext } from '../../context/FormContext'
import useCreateTask from '../../services/tasks/useCreateTask'
import useDialog from '../../hooks/useDialog'
import InputNameTask from '../dialog/InputNameTask'
import { saveAs } from 'file-saver'
import { UploadOutlined } from '@ant-design/icons'

const { Text } = Typography

const TableResultsDetail = () => {
  const { filename } = useParams()
  const location = useLocation()
  const { result, previousState } = location.state || {}
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [dialogContent, setDialogContent] = useState()
  const [taskName, setTaskName] = useState('')
  const { savedFilters, setFilterCriteria } = useContext(FormContext)
  const { isDialogOpen, openDialog, closeDialog } = useDialog()
  const navigate = useNavigate()

  const saveTaskMutation = useCreateTask()

  const processedTypeColumn = previousState.typeColumn

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys)
    setSelectedRows(newSelectedRows)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const applyFilters = (record) => {
    for (const filter of savedFilters) {
      const percentage = parseFloat(record.persentase)
      if (filter.valueEnd === '>') {
        if (percentage >= filter.valueStart) {
          return filter.color
        }
      } else if (filter.valueEnd === '<') {
        if (percentage <= filter.valueStart) {
          return filter.color
        }
      } else {
        if (percentage >= filter.valueStart && percentage <= filter.valueEnd) {
          return filter.color
        }
      }
    }
    return 'transparent'
  }

  const formatNumber = (number) => {
    if (!number) return '0'
    return parseInt(number, 10).toLocaleString('id-ID')
  }

  const renderCell = (text, record, slug) => {
    const isTargetColumn = slug === processedTypeColumn
    const isNumericColumn = !['kode_produk', 'kode_variasi'].includes(slug)

    const style = isTargetColumn ? { backgroundColor: '#e5e7eb' } : {}

    const content = isNumericColumn && text !== '' && !isNaN(text) ? formatNumber(text) : text

    return {
      props: { style },
      children: content,
    }
  }

  const generateColumns = (tableColumns) => {
    return tableColumns.map((col) => {
      const key = col.key
      if (key === 'persentase' || key === 'selisih') {
        return {
          title: col.label,
          dataIndex: key,
          key: key,
          sorter: (a, b) => a.selisih - b.selisih,
          render: (text, record) => {
            const formattedValue =
              key === 'persentase'
                ? new Intl.NumberFormat('id-ID').format(text) + '%'
                : text
                  ? previousState.typeColumn === 'berat'
                    ? text
                    : formatNumber(text)
                  : '0'
            return (
              <span
                style={{
                  backgroundColor: applyFilters(record),
                  padding: '0.5em',
                  borderRadius: '99999px',
                }}
              >
                {formattedValue}
              </span>
            )
          },
        }
      } else {
        return {
          title: col.label,
          dataIndex: key,
          key: key,
          render: (text, record) => renderCell(text, record, key),
          sorter: (a, b) => a.selisih - b.selisih,
        }
      }
    })
  }

  const columns = generateColumns(previousState.tableColumns)

  const data =
    result?.rows.map((row, index) => ({
      key: index,
      ...row,
    })) || []

  const generateExcekFile = async (rowToSave) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('My sheet')

    if (previousState.typeTable === 'shopee_product') {
      worksheet.columns = [
        { header: 'Kode Produk', key: 'kode_produk', width: 30 },
        { header: 'Nama Produk', key: 'nama_produk', width: 30 },
        { header: 'Kode Variasi', key: 'kode_variasi', width: 30 },
        { header: 'Nama Variasi', key: 'nama_variasi', width: 30 },
        { header: 'SKU Induk', key: 'sku_induk', width: 30 },
        { header: 'SKU Produk', key: 'sku_produk', width: 30 },
        { header: 'Harga', key: 'harga', width: 30 },
        { header: 'Stok', key: 'stok', width: 30 },
        { header: 'Selisih', key: 'selisih', width: 30 },
        { header: 'Persentase', key: 'persentase', width: 30 },
      ]
    } else {
      worksheet.columns = [
        { header: 'Kode Produk', key: 'kode_produk', width: 30 },
        { header: 'Nama Produk', key: 'nama_produk', width: 30 },
        { header: 'SKU Induk', key: 'sku_induk', width: 30 },
        { header: 'Berat', key: 'berat', width: 30 },
        { header: 'Panjang', key: 'panjang', width: 30 },
        { header: 'Lebar', key: 'lebar', width: 30 },
        { header: 'Tinggi', key: 'tinggi', width: 30 },
        { header: 'Selisih', key: 'selisih', width: 30 },
        { header: 'Persentase', key: 'persentase', width: 30 },
      ]
    }

    rowToSave.forEach((row) => {
      worksheet.addRow(row)
    })
    const buffer = await workbook.xlsx.writeBuffer()
    return buffer
  }

  const handleSaveTask = async (name) => {
    const rowsToSave = selectedRows.length > 0 ? selectedRows : data
    const buffer = await generateExcekFile(rowsToSave)
    saveAs(
      new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      `${name}.xlsx`,
    )

    const formTask = new FormData()
    formTask.append('name', name)
    formTask.append('type', previousState.typeTable)
    formTask.append('targetColumn', previousState.typeColumn)
    const configArray = savedFilters.map((filter) => ({
      start: filter.valueStart,
      end: filter.valueEnd,
      color: filter.color,
    }))
    configArray.forEach((configItem, index) => {
      formTask.append(`config[${index}][start]`, configItem.start)
      formTask.append(`config[${index}][end]`, configItem.end)
      formTask.append(`config[${index}][color]`, configItem.color)
    })
    formTask.append(
      'file',
      new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      `${name}.xlsx`,
    )

    navigate('/tugas')
    saveTaskMutation.mutateAsync({ data: formTask })
  }

  const columnsDuplicate = [
    {
      title: previousState.excelColumns,
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Columns',
      dataIndex: 'rowNumbers',
      key: 'rowNumbers',
      render: (text, record) => <span className='text-sm font-normal'>{record.rowNumbers.join(', ')}</span>,
    },
  ]

  const fileDuplicate = previousState.secondaryDuplicates.map((dup) => dup.filename)

  const dataDuplicateSecondary =
    previousState.secondaryDuplicates?.flatMap((dup, index) =>
      dup.rows.map((row, rowIndex) => ({
        key: `${index}-${rowIndex}`,
        value: row.value,
        rowNumbers: row.rowNumbers,
      })),
    ) || []

  const hasSecondaryDuplicates =
    previousState.secondaryDuplicates &&
    previousState.secondaryDuplicates.length > 0 &&
    previousState.secondaryDuplicates.some((dup) => dup.filename === filename)

  const openDialogContent = (content) => {
    setDialogContent(content)
    openDialog()
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

  const inputNameTask = () => {
    return (
      <InputNameTask
        onClose={closeDialog}
        onSubmit={(name) => {
          setTaskName(name)
          handleSaveTask(name)
        }}
      />
    )
  }

  return (
    <div className='flex flex-col gap-8 p-10'>
      {isDialogOpen && dialogContent}
      <div className='flex items-center justify-between'>
        <div className='flex gap-6'>
          <Link to='/' className='flex items-center justify-center px-3 py-3 bg-white rounded-lg'>
            <ArrowLeft />
          </Link>
          <h1 className='font-bold'>{filename}</h1>
        </div>
        <Flex gap={16}>
          <Upload
            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            action='/'
            maxCount={1}
            multiple={false}
          >
            <Button icon={<UploadOutlined />} size='middle' style={{ height: 40 }}>
              Upload
            </Button>
          </Upload>
          <Button size='middle' style={{ height: 40 }}>
            Submit
          </Button>
          <Button icon={<FilterIcon />} size='large' onClick={openDialog} type='primary' className='bg-blue-950' />
        </Flex>
      </div>

      {hasSecondaryDuplicates && (
        <Collapse
          items={[
            {
              key: 1,
              label: (
                <Text className='text-red-600'>
                  Duplikasi <strong>{previousState.excelColumns}</strong> terdeteksi pada file{' '}
                  <strong>{fileDuplicate}</strong> yang diberikan
                </Text>
              ),
              children: <Table columns={columnsDuplicate} dataSource={dataDuplicateSecondary} pagination={true} />,
            },
          ]}
        />
      )}
      <Table
        className='custom-table-header'
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={true}
      />
      <div className='flex justify-end w-full'>
        <Button
          className='h-12 px-4 text-sm font-bold text-white w-fit rounded-primary bg-blue-950'
          onClick={() => openDialogContent(inputNameTask)}
        >
          {selectedRows.length > 0 ? 'Simpan Tugas' : 'Simpan Semua Tugas'}
        </Button>
      </div>
    </div>
  )
}

export default TableResultsDetail
