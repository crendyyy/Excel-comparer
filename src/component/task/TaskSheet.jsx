import { Table } from 'antd'
import PropTypes from 'prop-types'
import { columnSorter, findMatchCondition } from '../../libs/utils'

const TaskSheet = ({ task, columns, isLoading }) => {
  const taskRow = task.rows || []
  const taskConfig = task.config || []

  const dataSource = taskRow.map((row, index) => ({
    ...row,
    key: index,
  }))

  const columnConfig = (columns || []).map((column) => {
    const isNumericColumn = !['kode_produk', 'kode_variasi'].includes(column.key)

    const renderCell = (text, record) => {
      const shouldFormatNumber = isNumericColumn && text !== '' && !isNaN(text)

      const renderContent = () => {
        if (column.key === 'persentase') {
          const { color } = findMatchCondition(taskConfig, text)
          return (
            <span className='rounded-full px-3 py-1' style={{ backgroundColor: color }}>
              {new Intl.NumberFormat('id-ID').format(text)}%
            </span>
          )
        } else if (shouldFormatNumber) {
          return new Intl.NumberFormat('id-ID').format(text)
        } else {
          return text
        }
      }

      let style = {}

      if (column.key === task.targetColumn) {
        if (record.isModified) {
          style = { background: '#8be78d', color: '#006644' }
        } else {
          style = { background: '#e5e7eb' }
        }
      } else if (column.key === 'sebelumnya') {
        style = { background: '#fecaca', color: '#dc2626' }
      } else if (record.isDuplicated) {
        style = { background: '#fed7aa', color: '#c2410c' }
      }

      return {
        props: { style },
        children: renderContent(),
      }
    }

    return {
      key: column.label,
      title: column.label,
      dataIndex: column.key,
      sorter: columnSorter(column.label),
      render: renderCell,
    }
  })

  return <Table pagination={true} loading={isLoading} bordered columns={columnConfig} dataSource={dataSource} />
}

TaskSheet.propTypes = {
  task: PropTypes.object,
  columns: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
}

export default TaskSheet
