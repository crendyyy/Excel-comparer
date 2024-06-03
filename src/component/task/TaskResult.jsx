import PropTypes from 'prop-types'
import { Button, Flex } from 'antd'
import Title from 'antd/es/typography/Title'
import { ArrowLeftOutlined } from '@ant-design/icons'
import TaskSheet from './TaskSheet'
import useUpdateTask from '../../services/tasks/useUpdateTask'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TaskResult = ({ result, isLoading, toggleHide }) => {
  const navigate = useNavigate()
  const updateTaskMutation = useUpdateTask()

  const handleUpdateStatus = async (status) => {
    await updateTaskMutation.mutateAsync({
      id: result.id,
      data: { status },
    })
  }

  useEffect(() => {
    if (updateTaskMutation.isSuccess) navigate('/tugas')
  }, [updateTaskMutation.isSuccess, navigate])

  return (
    <Flex vertical={true} gap={24}>
      <Flex justify='space-between'>
        <Flex gap={16}>
          <Button
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 }}
            shape='circle'
            onClick={() => toggleHide(false)}
          >
            <ArrowLeftOutlined />
          </Button>

          <Title level={3}>Sisa Tugas</Title>
        </Flex>
      </Flex>

      <TaskSheet isLoading={isLoading} task={result} />

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
  )
}

TaskResult.propTypes = {
  result: PropTypes.object,
  toggleHide: PropTypes.func,
  isLoading: PropTypes.bool,
}

export default TaskResult
