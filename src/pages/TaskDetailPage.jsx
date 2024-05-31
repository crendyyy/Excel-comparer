import slugify from 'slugify'
import { useParams } from 'react-router-dom'
import Title from 'antd/es/typography/Title'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Flex, message, Table, Upload } from 'antd'
import { useGetOneTask } from '../services/tasks/useGetTask'
import { useState } from 'react'
import useSubmitTask from '../services/tasks/useSubmitTask'
import { columnSorter, findMatchCondition } from '../libs/utils'

const TaskDetailPage = () => {
  const { taskId } = useParams()

  const task = useGetOneTask(taskId)
  const submitTaskMutation = useSubmitTask()

  const [uploadedFile, setUploadedFile] = useState()

  const handleBeforeUpload = (file) => {
    const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (!isXlsx) {
      message.error(`${file.name} bukan file excel`)
      return Upload.LIST_IGNORE
    }

    message.success(`${file.name} uploaded successfully.`)
    return isXlsx
  }

  const handleUploadOnChange = (info) => {
    setUploadedFile(info.file)
  }

  const handleOnSubmit = async () => {
    if (!uploadedFile?.originFileObj) return

    const response = await submitTaskMutation.mutateAsync({
      id: task.data.payload.id,
      data: { file: uploadedFile.originFileObj },
    })
  }

  const columns = (task.data?.payload.columns || []).map((column) => {
    const columnTemplate = {
      key: column,
      title: column,
      dataIndex: slugify(column, { replacement: '_', lower: true }),
      sorter: columnSorter(column),
    }

    if (column === 'Persentase') {
      columnTemplate.render = (_, record) => {
        const chosenConfig = findMatchCondition(task.data?.payload.config, record)

        return (
          <span className='rounded-xl px-2 py-1' style={{ backgroundColor: chosenConfig?.color }}>
            {record.persentase}%
          </span>
        )
      }
    }

    return columnTemplate
  })

  const data = task.data?.payload.rows.map((row, index) => {
    return { ...row, key: index }
  })

  return (
    <Flex vertical={true} gap={32} style={{ padding: 40 }}>
      <Flex justify='space-between'>
        <Title level={3}>Tugas Toko-1</Title>

        <Flex gap={16}>
          <Upload
            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            action='/'
            maxCount={1}
            multiple={false}
            showUploadList={false}
            onChange={handleUploadOnChange}
            beforeUpload={handleBeforeUpload}
          >
            <Button style={{ height: 40 }} icon={<UploadOutlined />} size='middle'>
              Upload
            </Button>
          </Upload>

          <Button style={{ height: 40 }} onClick={handleOnSubmit} type='primary' size='middle'>
            Submit
          </Button>
        </Flex>
      </Flex>

      <Table pagination={false} loading={task.isPending} bordered={true} columns={columns} dataSource={data} />
    </Flex>
  )
}

export default TaskDetailPage
