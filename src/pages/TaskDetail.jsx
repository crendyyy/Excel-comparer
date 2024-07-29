import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Title from 'antd/es/typography/Title'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Flex, message, Upload } from 'antd'

import TaskSheet from '../component/task/TaskSheet'
import TaskResult from '../component/task/TaskResult'

import { xlsxMimeType } from '../libs/const'

import { useGetOneTask } from '../services/tasks/useGetTask'
import useSubmitTask from '../services/tasks/useSubmitTask'
import useUpdateTask from '../services/tasks/useUpdateTask'

const TaskDetail = () => {
  const navigate = useNavigate()
  const updateTaskMutation = useUpdateTask()

  const { taskId } = useParams()

  const { data: task, isPending } = useGetOneTask(taskId)
  const { mutateAsync: submitTask } = useSubmitTask()

  const [result, setResult] = useState()

  const [showResult, setShowResult] = useState(false)
  const [uploadedFile, setUploadedFile] = useState()

  const taskColumn = [
    ...(task?.payload.excel.columns || []),
    {
      label: 'Selisih',
      key: 'selisih',
    },
    {
      label: 'Persentase',
      key: 'persentase',
    },
  ]

  const skuTaskColumn = task?.payload.targetColumn === 'sku_produk' ? task?.payload.excel.columns : taskColumn

  const handleUpdateStatus = async (status) => {
    await updateTaskMutation.mutateAsync(
      {
        id: taskId,
        data: { status },
      },
      {
        onSuccess: () => navigate('/tugas'),
      },
    )
  }

  const handleBeforeUpload = (file) => {
    const isValidFileType = file.type === xlsxMimeType
    const successMessage = `${file.name} uploaded successfully.`
    const errorMessage = `${file.name} is not an excel file.`

    if (isValidFileType) {
      message.success(successMessage)
    } else {
      message.error(errorMessage)
    }

    return isValidFileType
  }

  const handleFileChange = (fileInfo) => {
    const { file } = fileInfo
    setUploadedFile(file.originFileObj)
  }

  const handleSubmit = async () => {
    if (!uploadedFile) return

    const { id } = task.payload
    const data = { file: uploadedFile }

    const { data: response } = await submitTask({ id, data })
    setResult(response.payload)
    setShowResult(true)
  }

  return (
    <Flex vertical={true} gap={32} style={{ padding: 40 }}>
      {showResult && (
        <TaskResult
          task={result}
          filename={uploadedFile?.name}
          isLoading={isPending}
          onHide={() => setShowResult(false)}
        />
      )}

      <Flex className={showResult ? 'hidden' : ''} vertical={true} gap={24}>
        <Flex justify='space-between'>
          <Title level={2}>{task?.payload.name}</Title>

          <Flex gap={16}>
            <Upload
              accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              action='/'
              maxCount={1}
              multiple={false}
              onChange={handleFileChange}
              beforeUpload={handleBeforeUpload}
            >
              <Button icon={<UploadOutlined />} size='middle' style={{ height: 40 }}>
                Upload
              </Button>
            </Upload>
            <Button onClick={handleSubmit} type='primary' size='middle' style={{ height: 40 }}>
              Submit
            </Button>
          </Flex>
        </Flex>

        {!showResult && <TaskSheet task={task?.payload || {}} columns={skuTaskColumn} isLoading={isPending} />}
      </Flex>

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

export default TaskDetail
