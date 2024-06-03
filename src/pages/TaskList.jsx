import dayjs from 'dayjs'
import { Flex } from 'antd'
import { useEffect, useState } from 'react'
import Title from 'antd/es/typography/Title'
import TaskTable from '../component/task/TaskTable'
import { useGetAllTask } from '../services/tasks/useGetTask'
import { toast } from 'react-toastify'

const TaskList = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()))
  const formattedDate = selectedDate?.format('YYYY-MM-DD')
  const { data: tasks, isPending, isError } = useGetAllTask({ startDate: formattedDate })

  useEffect(() => {
    if (isError) {
      toast.error('Gagal, silahkan coba lagi', { autoClose: false })
    }
  }, [isError])

  return (
    <Flex vertical={true} gap={32} style={{ padding: 40 }}>
      <Title level={2}>Daftar Tugas</Title>

      <TaskTable
        tasks={tasks?.payload}
        isLoading={isPending}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </Flex>
  )
}
export default TaskList
