import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Table, Checkbox, Button } from 'antd';
import ArrowLeft from '../icons/ArrowLeft';
import axios from 'axios';

const TableResultsDetail = ({ filters = [] }) => {
  const { filename } = useParams();
  const location = useLocation();
  const { result, previousState } = location.state || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getBackgroundColor = (differencePercent) => {
    for (const filter of filters) {
      const threshold = parseFloat(filter.threshold);
      if (isNaN(threshold)) continue;

      if (filter.operator === "=" && differencePercent === threshold) {
        return filter.color;
      } else if (filter.operator === ">" && differencePercent > threshold) {
        return filter.color;
      } else if (filter.operator === "<" && differencePercent < threshold) {
        return filter.color;
      }
    }
    return 'transparent';
  };

  const columns = [
    {
      title: 'Nama Produk',
      dataIndex: 'nama_produk',
      key: 'nama_produk',
    },
    {
      title: 'Kode Produk',
      dataIndex: 'kode_produk',
      key: 'kode_produk',
    },
    {
      title: 'Nama Variasi',
      dataIndex: 'nama_variasi',
      key: 'nama_variasi',
    },
    {
      title: 'SKU Induk',
      dataIndex: 'sku_induk',
      key: 'sku_induk',
    },
    {
      title: 'SKU',
      dataIndex: 'sku_produk',
      key: 'sku_produk',
    },
    {
      title: 'Harga',
      dataIndex: 'harga_produk',
      key: 'harga_produk',
    },
    {
      title: 'Stok',
      dataIndex: 'stok_produk',
      key: 'stok_produk',
    },
    {
      title: 'Selisih',
      dataIndex: 'difference',
      key: 'difference',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.difference - b.difference,
      render: (text, record) => (
        <span
          style={{
            backgroundColor: getBackgroundColor(record.differencePercent),
            padding: '0.5em',
            borderRadius: '0.25em',
          }}
        >
          {text ? text : '-'}
        </span>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const data = result?.rows.map((row, index) => ({
    key: index,
    ...row,
  })) || [];

  const handleSaveTask = async () => {
    const taskData = {
      name: "toko-1",
      type: "shopee_product",
      targetColumn: "harga_produk",
      config: [
        {
          type: "greater_than",
          color: "#bbaabb",
          value: "5"
        }
      ],
      rows: selectedRows.map(row => ({
        kode_produk: row.kode_produk,
        nama_produk: row.nama_produk,
        kode_variasi: row.kode_variasi,
        nama_variasi: row.nama_variasi,
        sku_induk: row.sku_induk,
        sku_produk: row.sku_produk,
        harga_produk: row.harga_produk,
        stok_produk: row.stok_produk
      }))
    };

    try {
      const response = await axios.post('http://localhost:3000/api/v1/tasks', taskData);
      console.log('Task saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-10">
      <div className="flex gap-6">
        <Link
          to="/"
          state={previousState}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-lg"
        >
          <ArrowLeft />
        </Link>
        <h1 className="font-bold">{filename}</h1>
      </div>
      <Table
        className="custom-table-header"
        onChange={onChange}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <div className='flex justify-end w-full'>
        <Button
          className='h-12 px-4 font-bold text-white w-fit text-smSS rounded-primary bg-primary'
          onClick={handleSaveTask}
        >
          Simpan Tugas
        </Button>
      </div>
    </div>
  );
};

export default TableResultsDetail;
