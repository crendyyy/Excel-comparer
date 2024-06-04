import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Title from 'antd/es/typography/Title'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Flex, message, Upload } from 'antd'

import TaskSheet from '../component/task/TaskSheet'
import TaskResult from '../component/task/TaskResult'

import { xlsxMimeType } from '../libs/const'

import useSubmitTask from '../services/tasks/useSubmitTask'
import { useGetOneTask } from '../services/tasks/useGetTask'

const TaskDetail = () => {
  const { taskId } = useParams()

  const { data: task, isPending } = useGetOneTask(taskId)
  const { mutateAsync: submitTask } = useSubmitTask()

  const [result, setResult] = useState()

  const [showResult, setShowResult] = useState(false)
  const [uploadedFile, setUploadedFile] = useState()

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
      {showResult && <TaskResult task={result} isLoading={isPending} onHide={() => setShowResult(false)} />}

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

        {!showResult && <TaskSheet task={task?.payload || {}} columns={task?.payload.columns} isLoading={isPending} />}
      </Flex>
    </Flex>
  )
}

export default TaskDetail
