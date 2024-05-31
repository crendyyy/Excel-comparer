import slugify from 'slugify'
import { useParams } from 'react-router-dom'
import Title from 'antd/es/typography/Title'
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Flex, message, Table, Upload } from 'antd'
import { useGetOneTask } from '../services/tasks/useGetTask'
import { useState } from 'react'
import useSubmitTask from '../services/tasks/useSubmitTask'
import { columnSorter, findMatchCondition } from '../libs/utils'
import useUpdateTask from '../services/tasks/useUpdateTask'

const TaskDetailPage = () => {
  const { taskId } = useParams()

  const task = useGetOneTask(taskId)
  const submitTaskMutation = useSubmitTask()
  const updateTaskMutation = useUpdateTask()

  const [submission, setSubmission] = useState()
  const [uploadedFile, setUploadedFile] = useState()
  const [isTaskTableHidden, setIsTaskTableHidden] = useState(false)

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

    setIsTaskTableHidden(true)
    setSubmission(response.data.payload)
  }

  const handleUpdateStatus = async (status) => {
    const response = await updateTaskMutation.mutateAsync({
      id: task.data.payload.id,
      data: { status },
    })
  }

  const taskExcelColumns = (task.data?.payload.columns || []).map((column) => {
    const dataIndex = slugify(column, { replacement: '_', lower: true })

    const columnTemplate = {
      key: column,
      title: column,
      dataIndex,
      sorter: columnSorter(column),
      render: (text) => {
        return {
          children:
            ['kode_produk', 'kode_variasi'].includes(dataIndex) || text === '' || isNaN(text)
              ? text
              : new Intl.NumberFormat('id-ID').format(text),
        }
      },
    }

    if (dataIndex === task.data.payload.targetColumn) {
      columnTemplate.render = (text) => {
        return {
          props: {
            style: { background: '#e5e7eb' },
          },
          children: isNaN(text) ? text : new Intl.NumberFormat('id-ID').format(text),
        }
      }
    }

    if (column === 'Persentase') {
      columnTemplate.render = (text) => {
        const chosenConfig = findMatchCondition(task.data?.payload.config, text)

        return (
          <span className='rounded-xl px-2 py-1' style={{ backgroundColor: chosenConfig?.color }}>
            {text}%
          </span>
        )
      }
    }

    return columnTemplate
  })

  const taskExcelData = task.data?.payload.rows.map((row, index) => {
    return { ...row, key: index }
  })

  return (
    <Flex vertical={true} gap={32} style={{ padding: 40 }}>
      {isTaskTableHidden && (
        <Flex vertical={true} gap={24}>
          <Flex justify='space-between'>
            <Flex gap={16}>
              <Button
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 }}
                shape='circle'
                onClick={() => setIsTaskTableHidden(false)}
              >
                <ArrowLeftOutlined />
              </Button>

              <Title level={3}>Sisa Tugas</Title>
            </Flex>
          </Flex>

          <Table
            pagination={{ pageSize: 10 }}
            loading={task.isPending}
            bordered={true}
            columns={taskExcelColumns.slice(0, -2)}
            dataSource={submission.rows.filter((row) => !row.isModified)}
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
      )}

      <Flex style={{ display: isTaskTableHidden ? 'none' : 'flex' }} vertical={true} gap={24}>
        <Flex justify='space-between'>
          <Title level={2}>Tugas {task.data?.payload.name}</Title>

          <Flex gap={16}>
            <Upload
              accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              action='/'
              maxCount={1}
              multiple={false}
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

        {!isTaskTableHidden && (
          <Table
            pagination={{ pageSize: 10 }}
            loading={task.isPending}
            bordered={true}
            columns={taskExcelColumns}
            dataSource={taskExcelData}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default TaskDetailPage
