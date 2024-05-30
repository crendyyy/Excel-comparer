import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Table, Checkbox, Button } from "antd";
import ArrowLeft from "../icons/ArrowLeft";
import axios from "axios";
import { FormContext } from "../../context/FormContext";

const TableResultsDetail = () => {
  const { filename } = useParams();
  const location = useLocation();
  const { result, previousState } = location.state || {};
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { savedFilters } = useContext(FormContext);

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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
        return filter.color;
      }
    }
    return "transparent";
  };
  console.log(savedFilters);

  const columns = [
    {
      title: "Nama Produk",
      dataIndex: "nama_produk",
      key: "nama_produk",
    },
    {
      title: "Kode Produk",
      dataIndex: "kode_produk",
      key: "kode_produk",
    },
    {
      title: "Nama Variasi",
      dataIndex: "nama_variasi",
      key: "nama_variasi",
    },
    {
      title: "SKU Induk",
      dataIndex: "sku_induk",
      key: "sku_induk",
    },
    {
      title: "SKU",
      dataIndex: "sku_produk",
      key: "sku_produk",
    },
    {
      title: "Harga",
      dataIndex: "harga",
      key: "harga_produk",
    },
    {
      title: "Stok",
      dataIndex: "stok",
      key: "stok_produk",
    },
    {
      title: "Selisih",
      dataIndex: "selisih",
      key: "selisih",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.selisih - b.selisih,
      render: (text, record) => (
        <span
          style={{
            backgroundColor: applyFilters(record),
            padding: "0.5em",
            borderRadius: "0.25em",
          }}
        >
          {text ? text : "-"}
        </span>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const data =
    result?.rows.map((row, index) => ({
      key: index,
      ...row,
    })) || [];

  const handleSaveTask = async () => {
    const taskData = {
      name: filename,
      type: previousState.typeTable,
      targetColumn: previousState.typeColumn,
      config: [
        {
          type: savedFilters.operator,
          color: savedFilters.color,
          value: savedFilters.value,
        },
      ],
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
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/tasks",
        taskData
      );
      console.log("Task saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving task:", error);
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
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <div className="flex justify-end w-full">
        <Button
          className="h-12 px-4 font-bold text-white w-fit text-smSS rounded-primary bg-primary"
          onClick={handleSaveTask}
        >
          Simpan Tugas
        </Button>
      </div>
    </div>
  );
};

export default TableResultsDetail;
