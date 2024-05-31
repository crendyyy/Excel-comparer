import dayjs from 'dayjs'
import { Flex } from 'antd'
import { useState } from 'react'
import Title from 'antd/es/typography/Title'

import { useGetAllTask } from '../services/tasks/useGetTask'
import TaskListTable from '../component/task/TaskListTable'

const TaskListPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()))
  const formattedDate = selectedDate?.format('YYYY-MM-DD')

  const tasks = useGetAllTask({ startDate: formattedDate })

  return (
    <Flex vertical={true} gap={32} style={{ padding: 40 }}>
      <Title level={2}>Daftar Tugas</Title>
      <TaskListTable
        data={tasks.data?.payload}
        isLoading={tasks.isPending}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </Flex>
  )
}
export default TaskListPage
