import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import { Button, DatePicker, Flex, Input, Select, Table } from 'antd'
import Badge from '../shared/Badge'
import { ExcelType, TaskStatus } from '../../libs/enum'
import { dateFormatter, filterResponse } from '../../libs/utils'
import useDownloadTask from '../../services/tasks/useDownloadTask'
import useDialog from '../../hooks/useDialog'
import InputNameTask from '../dialog/InputNameTask'

const TaskTable = ({ tasks, isLoading, selectedDate, onDateChange }) => {
  const navigate = useNavigate()
  const { isDialogOpen, openDialog, closeDialog } = useDialog()

  const downloadTaskMutation = useDownloadTask()

  const [filters, setFilters] = useState({
    name: { value: '', regex: true },
    type: { value: '', parent: 'excel' },
    status: { value: '' },
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const handleFiltersChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: {
        ...prevFilters[field],
        value,
      },
    }))
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const filteredTasks = useMemo(() => {
    return filterResponse(tasks, filters).map((task) => ({
      ...task,
      key: task.id,
      createdAt: dateFormatter(task.createdAt),
    }))
  }, [tasks, filters])

  const columns = useMemo(
    () => [
      {
        title: 'Tanggal',
        dataIndex: 'createdAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => dateFormatter(a.createdAt, true) - dateFormatter(b.createdAt, true),
      },
      {
        title: 'Tugas',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Tipe',
        dataIndex: ['excel', 'type'],
        sorter: (a, b) => a.type.localeCompare(b.type),
      },
      {
        title: 'Kolom',
        dataIndex: 'targetColumn',
        sorter: (a, b) => a.targetColumn.localeCompare(b.targetColumn),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (_, task) => getStatusBadge(task.status),
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
    ],
    [],
  )
  const downloadTask = async (name) => {
    if (!name) {
      closeDialog()
      return
    }
    const taskId = [...selectedRowKeys]
    const payload = {
      tasks: taskId,
    }
    if (selectedRowKeys.length > 0) {
      const response = await downloadTaskMutation.mutateAsync({ data: payload })
      const data = response.data
      const path = data.payload?.path

      if (response) {
        const basePath = 'http://localhost:3000'
        const filename = name
        const res = await fetch(`${basePath}/${path}`)
        const blob = await res.blob()

        const downloadLink = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = filename
        document.body.appendChild(downloadLink)
        downloadLink.click()

        // Cleanup
        window.URL.revokeObjectURL(url)
        document.body.removeChild(downloadLink)
      }
      closeDialog()
    } else {
      closeDialog()
    }
  }

  return (
    <>
      {isDialogOpen && (
        <InputNameTask
          onClose={closeDialog}
          onSubmit={(name) => {
            downloadTask(name)
          }}
        />
      )}
      <Flex vertical={true} gap={24}>
        <Flex gap={24}>
          <Input
            allowClear
            size='middle'
            style={{ height: 40 }}
            placeholder='Cari Tugas'
            prefix={<SearchOutlined />}
            onChange={(e) => handleFiltersChange('name', e.target.value)}
          />

          <Select
            allowClear
            size='middle'
            showSearch
            style={{ width: 300, height: 40 }}
            placeholder='Pilih Tipe'
            onChange={(value) => handleFiltersChange('type', value)}
            options={Object.values(ExcelType)}
          />

          <Select
            allowClear
            size='middle'
            showSearch
            style={{ width: 300, height: 40 }}
            placeholder='Pilih Status'
            onChange={(value) => handleFiltersChange('status', value)}
            options={Object.values(TaskStatus)}
          />

          <DatePicker
            allowClear={false}
            value={selectedDate}
            placeholder='Pilih Tanggal'
            style={{ width: 300, height: 40 }}
            format='YYYY-MM-DD'
            onChange={onDateChange}
          />
        </Flex>
      </Flex>

      <Table
        rowSelection={rowSelection}
        pagination={false}
        onRow={(record) => ({
          onClick: () => navigate(`/tugas/${record.key}`),
        })}
        loading={isLoading}
        bordered={true}
        columns={columns}
        dataSource={filteredTasks}
      />
      <Flex justify='end' style={{ width: '100%' }}>
        <Button
          className='h-12 w-fit rounded-primary bg-blue-950 px-4 text-sm font-bold text-white'
          onClick={openDialog}
        >
          Download Tugas
        </Button>
      </Flex>
    </>
  )
}

export default TaskTable

const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return <Badge status='warning' text='Berlangsung' />
    case 'done':
      return <Badge status='success' text='Selesai' />
    case 'revision':
      return <Badge status='danger' text='Revisi' />
  }
}
