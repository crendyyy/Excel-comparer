import PropTypes from 'prop-types'
import { Button, Collapse, Flex, Table } from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import TaskSheet from './TaskSheet'
import useUpdateTask from '../../services/tasks/useUpdateTask'
import { columnSorter } from '../../libs/utils'

const TaskResult = ({ task, filename, isLoading, onHide }) => {
  const navigate = useNavigate()
  const updateTaskMutation = useUpdateTask()

  const hasDuplicate = task.duplicated.length > 0

  const handleUpdateStatus = async (status) => {
    await updateTaskMutation.mutateAsync(
      {
        id: task.id,
        data: { status },
      },
      {
        onSuccess: () => navigate('/tugas'),
      },
    )
  }

  return (
    <Flex vertical={true} gap={40}>
      <Flex gap={16}>
        <Button
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 }}
          shape='circle'
          onClick={() => onHide(false)}
        >
          <ArrowLeftOutlined />
        </Button>

        <Title level={3}>Sisa Tugas</Title>
      </Flex>

      {hasDuplicate && (
        <Flex vertical={true} gap={24} className='pb-10'>
          <Collapse
            items={[
              {
                key: 1,
                label: (
                  <Text className='text-red-600'>
                    Duplikasi <strong>{task.excel.primaryColumn}</strong> terdeteksi pada file{' '}
                    <strong>{filename}</strong>
                  </Text>
                ),
                children: (
                  <Table
                    columns={[
                      { title: task.excel.primaryColumn, dataIndex: 'value', sorter: columnSorter('value') },
                      { title: 'Nomor Baris', dataIndex: 'numbers', sorter: columnSorter('numbers') },
                    ]}
                    dataSource={task.duplicated.map((item) => ({ ...item, numbers: item.numbers.join(', ') }))}
                    pagination={true}
                  ></Table>
                ),
              },
            ]}
          />
        </Flex>
      )}

      <Flex vertical={true} gap={24}>
        <Flex justify='space-between'>
          <Flex gap={16}>
            <ul className='flex flex-wrap gap-4'>
              {task.config.map((item) => {
                return (
                  <li key={item.id} className='flex items-center gap-2'>
                    <span className='rounded-full px-3 py-1' style={{ backgroundColor: item.color }}>
                      {item.end === '>' ? (
                        `> ${item.start}%`
                      ) : item.end === '<' ? (
                        `${item.end}% <`
                      ) : (
                        <div className='flex items-center gap-2'>
                          {item.start}%
                          <ArrowRightOutlined />
                          {item.end}%
                        </div>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Flex>

          <ul className='flex gap-4'>
            <li className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-full bg-[#f97316]'></span>Duplikasi
            </li>
            <li className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-full bg-[#b51f3f]'></span>Nilai sebelumnya
            </li>
            <li className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-full bg-[#8be78d]'></span>Sudah berubah
            </li>
            <li className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-full bg-[#a2a8ad]'></span>Belum berubah
            </li>
          </ul>
        </Flex>

        <TaskSheet
          isLoading={isLoading}
          columns={[...task.columns.slice(0, -2), 'Sebelumnya', 'Persentase']}
          task={task}
        />

        <Flex gap={16}>
          <Button
            style={{ height: 40, background: '#17c964' }}
            type='primary'
            size='middle'
            onClick={() => handleUpdateStatus('done')}
          >
            Selesai
          </Button>
          <Button
            style={{ height: 40, background: '#f31260' }}
            type='primary'
            size='middle'
            onClick={() => handleUpdateStatus('revision')}
          >
            Revisi
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

TaskResult.propTypes = {
  task: PropTypes.object,
  filename: PropTypes.string,
  onHide: PropTypes.func,
  isLoading: PropTypes.bool,
}

export default TaskResult
