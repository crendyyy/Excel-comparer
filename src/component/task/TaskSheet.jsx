import { Table } from 'antd'
import slugify from 'slugify'
import PropTypes from 'prop-types'
import { columnSorter, findMatchCondition } from '../../libs/utils'

const TaskSheet = ({ task, columns, isLoading }) => {
  const rows = task.rows || []

  const dataSource = rows.map((row, index) => ({
    ...row,
    key: index,
  }))

  const columnConfig = (columns || []).map((label) => {
    const slug = slugify(label, { replacement: '_', lower: true })
    const isNumericColumn = !['kode_produk', 'kode_variasi'].includes(slug)

    const renderCell = (text, record) => {
      const shouldFormatNumber = isNumericColumn && text !== '' && !isNaN(text)

      const renderContent = () => {
        if (slug === 'persentase') {
          const { color } = findMatchCondition(task.config, text)
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

      const style =
        slug === task.targetColumn
          ? record.isModified
            ? { background: '#8be78d', color: '#006644' }
            : { background: '#e5e7eb' }
          : slug === 'sebelumnya'
            ? { background: '#fee7e7', color: '#ad1f1f' }
            : {}

      return {
        props: { style },
        children: renderContent(),
      }
    }

    return {
      key: label,
      title: label,
      dataIndex: slug,
      sorter: columnSorter(label),
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
