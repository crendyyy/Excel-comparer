import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Table, Checkbox, Button } from "antd";
import ArrowLeft from "../icons/ArrowLeft";
import FilterIcon from "../icons/FilterIcon";
import FilterDialog from "../dialog/FilterDialog";
import { FormContext } from "../../context/FormContext";
import useCreateTask from "../../services/tasks/useCreateTask";
import useDialog from "../../hooks/useDialog";
import { color } from "framer-motion";

const TableResultsDetail = () => {
  const { filename } = useParams();
  const location = useLocation();
  const { result, previousState } = location.state || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { savedFilters, setFilterCriteria } = useContext(FormContext);
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const navigate = useNavigate()

  const saveTaskMutation = useCreateTask()

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
    setSelectedRows(newSelectedRows)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const applyFilters = (record) => {
    for (const filter of savedFilters) {
      if (
        filter.operator === "greater_than" &&
        record.persentase > filter.value
      ) {
        return filter.color;
      } else if (
        filter.operator === "lesser_than" &&
        record.persentase < filter.value
      ) {
        return filter.color;
      } else if (
        filter.operator === "equal" &&
        record.persentase === filter.value
      ) {
        return filter.color ;
      }
    }
    return "transparent";
  };
  console.log(savedFilters);

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
      dataIndex: 'harga',
      key: 'harga_produk',
    },
    {
      title: 'Stok',
      dataIndex: 'stok',
      key: 'stok_produk',
    },
    {
      title: 'Persentase',
      dataIndex: 'persentase',
      key: 'persentase',
      render: (text, record) => {
        const formattedPercent = text ? parseFloat(text).toString() : "0";
        return (
          <span
            style={{
              backgroundColor: applyFilters(record),
              padding: "0.5em",
              borderRadius: "0.25em",
            }}
          >
            {formattedPercent.includes('.') ? parseFloat(formattedPercent).toFixed(1) : formattedPercent}%
          </span>
        )
      },
    },
    {
      title: 'Selisih',
      dataIndex: 'selisih',
      key: 'selisih',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.selisih - b.selisih,
      render: (text, record) => {
        return (
          <span
            style={{
              backgroundColor: applyFilters(record),
              padding: "0.5em",
              borderRadius: "0.25em",
            }}
          >
            {text ? text : "0"}
          </span>
        )
      },
    },
  ]

  const columnsWeight = [
    {
      title: 'Kode Produk',
      dataIndex: 'kode_produk',
      key: 'kode_produk',
    },
    {
      title: 'SKU Induk',
      dataIndex: 'sku_induk',
      key: 'sku_induk',
    },
    {
      title: 'Nama Produk',
      dataIndex: 'nama_produk',
      key: 'nama_produk',
    },
    {
      title: 'Berat',
      dataIndex: 'berat',
      key: 'berat',
    },
    {
      title: 'Panjang',
      dataIndex: 'panjang',
      key: 'panjang',
    },
    {
      title: 'Lebar',
      dataIndex: 'lebar',
      key: 'lebar',
    },
    {
      title: 'Tinggi',
      dataIndex: 'tinggi',
      key: 'tinggi',
    },
    {
      title: 'Selisih',
      dataIndex: 'selisih',
      key: 'selisih',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.selisih - b.selisih,
      render: (text, record) => {
        return (
          <span
            style={{
              backgroundColor: applyFilters(record),
              padding: "0.5em",
              borderRadius: "0.25em",
            }}
          >
            {text ? text : "0"}
          </span>
        )
      },
    },
    {
      title: 'Persentase',
      dataIndex: 'persentase',
      key: 'persentase',
      render: (text, record) => {
        const formattedPercent = text ? parseFloat(text).toString() : "0";
        return (
          <span
            style={{
              backgroundColor: applyFilters(record),
              padding: "0.5em",
              borderRadius: "0.25em",
            }}
          >
            {formattedPercent.includes('.') ? parseFloat(formattedPercent).toFixed(1) : formattedPercent}%
          </span>
        )
      },
    },
  ]

  let setColumns = previousState.typeTable === 'shopee_product' ? columns : columnsWeight

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra)
  }

  const data =
    result?.rows.map((row, index) => ({
      key: index,
      ...row,
    })) || []

  const handleSaveTask = async () => {
    const taskData = {
      name: filename,
      type: previousState.typeTable,
      targetColumn: previousState.typeColumn,
      config: savedFilters.map((filter) => ({
        type: filter.operator,
        color: filter.color,
        value: filter.value,
      })),
      rows: selectedRows.map((row) => ({
        kode_produk: row.kode_produk,
        nama_produk: row.nama_produk,
        kode_variasi: row.kode_variasi,
        nama_variasi: row.nama_variasi,
        sku_induk: row.sku_induk,
        sku_produk: row.sku_produk,
        harga: row.harga,
        stok: row.stok,
        selisih: row.selisih,
        persentase: row.persentase,
      })),
    }
    navigate('/tugas')
    const response = await saveTaskMutation.mutateAsync({ data: taskData })
    console.log('Task saved successfully:', response.data)
  }

  const handleSaveTaskWeight = async () => {
    const taskData = {
      name: filename,
      type: previousState.typeTable,
      targetColumn: previousState.typeColumn,
      config: savedFilters.map((filter) => ({
        type: filter.operator,
        color: filter.color,
        value: filter.value,
      })),
      rows: selectedRows.map((row) => ({
        kode_produk: row.kode_produk,
        nama_produk: row.nama_produk,
        sku_induk: row.sku_induk,
        berat: row.berat,
        panjang: row.panjang,
        lebar: row.lebar,
        tinggi: row.tinggi,
        selisih: row.selisih,
        persentase: row.persentase,
      })),
    }
    navigate('/tugas')
    const response = await saveTaskMutation.mutateAsync({ data: taskData })
    console.log('Task saved successfully:', response.data)
  }
  console.log(previousState.typeTable)
  let saveTask = previousState.typeTable === 'shopee_product' ? handleSaveTask : handleSaveTaskWeight

  return (
    <div className="flex flex-col gap-8 p-10">
      {isDialogOpen && (
        <FilterDialog
          onClose={closeDialog}
          onSubmit={(filters) => {
            setFilterCriteria(filters);
            closeDialog();
            console.log("Filter Criteria:", filters);
          }}
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-6">
        <Link to='/' className='flex items-center justify-center px-3 py-3 bg-white rounded-lg'><ArrowLeft/></Link>
        <h1 className="font-bold">{filename}</h1>
        </div>
        <button
            type="button"
            onClick={openDialog}
            className="py-3 px-3 rounded-lg bg-[#110F45] flex items-center"
          >
            <FilterIcon />
          </button>
      </div>
      <Table
        className='custom-table-header'
        onChange={onChange}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={setColumns}
        dataSource={data}
        pagination={false}
      />
      <div className='flex justify-end w-full'>
        <Button
          className="h-12 px-4 text-sm font-bold text-white w-fit rounded-primary bg-blue-950"
          onClick={saveTask}
        >
          Simpan Tugas
        </Button>
      </div>
    </div>
  )
}

export default TableResultsDetail
