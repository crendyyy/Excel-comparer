import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import Title from 'antd/es/typography/Title'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import { Flex, Input, Table, Select, DatePicker } from 'antd'

import Badge from '../component/shared/Badge'
import { dateFormatter, filterResponse } from '../libs/utils'
import { ExcelType, TaskStatus } from '../libs/enum'
import { useGetAllTask } from '../services/tasks/useGetTask'

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

const TaskListPage = () => {
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()))
  const formattedDate = selectedDate?.format('YYYY-MM-DD')

  const [filters, setFilters] = useState({
    name: { value: '', regex: true },
    type: { value: '' },
    status: { value: '' },
  })

  const handleFiltersChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value: value,
      },
    }))
  }

  const columns = [
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
      dataIndex: 'type',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Kolom',
      dataIndex: 'targetColumn',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => getStatusBadge(record.status),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
  ]

  const tasks = useGetAllTask({ startDate: formattedDate })

  const data = useMemo(() => {
    return filterResponse(tasks.data?.payload, filters).map((task) => {
      return {
        ...task,
        key: task.id,
        createdAt: dateFormatter(task.createdAt),
      }
    })
  }, [tasks.data?.payload, filters])

  return (
    <Flex vertical={true} gap={32} style={{ padding: 40 }}>
      <Title level={2}>Daftar Tugas</Title>

      <Flex vertical={true} gap={24}>
        <Flex gap={24}>
          <Input
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
            onChange={setSelectedDate}
          />
        </Flex>
      </Flex>

      <Table
        pagination={{ pageSize: 8 }}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/tugas/${record.key}`)
            },
          }
        }}
        loading={tasks.isPending}
        bordered={true}
        columns={columns}
        dataSource={data}
      />
    </Flex>
  )
}
export default TaskListPage
