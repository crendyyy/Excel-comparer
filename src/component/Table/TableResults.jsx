import React from 'react'
import { Collapse, Flex, Table } from 'antd'
import { Link } from 'react-router-dom'
import Text from 'antd/es/typography/Text'

const TableResult = ({ results, previousState, duplicate, secondaryDuplicates, excelColumns }) => {
  const targetColumn = excelColumns.primaryColumn === 'sku_produk' ? 'SKU' : 'Kode Produk'

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      width: 12,
      render: (text, record, index) => <span className='text-sm font-normal'>{index + 1}</span>,
    },
    {
      title: 'Nama File',
      dataIndex: 'name',
      render: (text, record) => <span className='text-sm font-normal'>{record.filename}</span>,
    },
    {
      title: 'Perbedaan',
      dataIndex: 'different',
      render: (text, record) => <span className='text-sm font-normal'>{record.rows.length}</span>,
    },
    {
      dataIndex: '',
      key: 'x',
      render: (text, record) => {
        // Temukan duplikat yang relevan dengan file ini
        const relevantSecondaryDuplicates = secondaryDuplicates.filter((dup) => dup.filename === record.filename)

        return (
          <div className='flex justify-end w-full'>
            <Link
              to={`/table/${encodeURIComponent(record.filename)}`}
              state={{
                result: record,
                previousState: {
                  ...previousState,
                  secondaryDuplicates: relevantSecondaryDuplicates,
                  excelColumns: targetColumn,
                },
              }}
              className='px-2 py-1 text-sm font-semibold text-white rounded-lg bg-blue-950'
            >
              Detail
            </Link>
          </div>
        )
      },
    },
  ]

  const data = results.map((result, index) => ({
    key: index,
    no: index + 1,
    filename: result.filename,
    rows: result.rows,
  }))

  const columnsDuplicate = [
    {
      title: targetColumn,
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Columns',
      dataIndex: 'rowNumbers',
      key: 'rowNumbers',
      render: (text, record) => <span className='text-sm font-normal'>{record.rowNumbers.join(', ')}</span>,
    },
  ]

  // Data untuk tabel duplikat
  const dataDuplicate = duplicate.flatMap((dup, index) =>
    dup.rows.map((row, rowIndex) => ({
      key: `${index}-${rowIndex}`,
      value: row.value,
      rowNumbers: row.rowNumbers,
    })),
  )

  const hasDuplicate = duplicate && duplicate.length > 0

  const fileDuplicate = duplicate.map((dup) => dup.filename)

  return (
    <Flex vertical gap='middle'>
      {hasDuplicate && (
        <Flex vertical={true} gap={24} className='pb-10'>
          <Collapse
            items={[
              {
                key: 1,
                label: (
                  <Text className='text-red-600'>
                    Duplikasi <strong>{targetColumn}</strong> terdeteksi pada file <strong>{fileDuplicate}</strong> yang
                    diberikan
                  </Text>
                ),
                children: <Table columns={columnsDuplicate} dataSource={dataDuplicate} pagination={true} />,
              },
            ]}
          />
        </Flex>
      )}

      <Table columns={columns} dataSource={data} pagination={false} />
    </Flex>
  )
}

export default TableResult
