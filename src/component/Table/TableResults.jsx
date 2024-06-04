import React from "react";
import { Flex, Table } from "antd";
import { Link } from "react-router-dom";

const TableResult = ({ results, previousState, duplicate }) => {
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
      render: (text, record) => (
        <div className='flex justify-end w-full'>
          <Link
            to={`/table/${encodeURIComponent(record.filename)}`}
            state={{ result: record, previousState }}
            className='px-2 py-1 text-sm font-semibold text-white rounded-lg bg-blue-950'
          >
            Detail
          </Link>
        </div>
      ),
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
      title: "SKU",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Columns",
      dataIndex: "numbers",
      key: "numbers",
      render: (text, record) => (
        <span className="text-sm font-normal">{record.numbers.join(", ")}</span>
      ),
    },
  ];

  // Data untuk tabel duplikat
  const dataDuplicate = duplicate.flatMap((dup, index) =>
    dup.rows.map((row, rowIndex) => ({
      key: `${index}-${rowIndex}`,
      value: row.value,
      numbers: row.numbers,
    }))
  );

  return(
    <Flex vertical gap='middle'>
      <Table columns={columnsDuplicate} dataSource={dataDuplicate} pagination={false}/>
     <Table columns={columns} dataSource={data} pagination={false} />
    </Flex>
     );
};

export default TableResult
