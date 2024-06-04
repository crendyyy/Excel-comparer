import React from "react";
import { Flex, Table } from "antd";
import { Link } from "react-router-dom";
import Text from 'antd/es/typography/Text'

const TableResult = ({ results, previousState, duplicate, secondaryDuplicates }) => {
  const processedTypeColumn = previousState.typeColumn;
  const isDuplicateSKU = ['stok', 'harga', 'sku_produk'].includes(processedTypeColumn);

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
        const relevantSecondaryDuplicates = secondaryDuplicates.filter(
          dup => dup.filename === record.filename
        );

        return (
          <div className='flex justify-end w-full'>
            <Link
              to={`/table/${encodeURIComponent(record.filename)}`}
              state={{
                result: record,
                previousState: {
                  ...previousState,
                  secondaryDuplicates: relevantSecondaryDuplicates
                }
              }}
              className='px-2 py-1 text-sm font-semibold text-white rounded-lg bg-blue-950'
            >
              Detail
            </Link>
          </div>
        );
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
      title: isDuplicateSKU ? 'SKU' : 'Kode Produk',
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

  const hasDuplicate = duplicate && duplicate.length > 0;
  
  return(
    <Flex vertical gap='middle'>
      {hasDuplicate && (
        <Flex vertical gap='middle'>
        <Text className='text-red-600'>
            Duplikasi <strong>{isDuplicateSKU ? 'SKU' : 'Kode Produk'}</strong> terdeteksi pada file yang diberikan. Baris berikut
            tidak dapat diproses.
          </Text>
      <Table columns={columnsDuplicate} dataSource={dataDuplicate} pagination={false}/>
        </Flex>
        )}
     <Table columns={columns} dataSource={data} pagination={false} />
    </Flex>
     );
};

export default TableResult
