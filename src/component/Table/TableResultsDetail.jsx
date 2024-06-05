import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Table, Checkbox, Button, Flex } from "antd";
import Text from 'antd/es/typography/Text'
import ArrowLeft from "../icons/ArrowLeft";
import FilterIcon from "../icons/FilterIcon";
import FilterDialog from "../dialog/FilterDialog";
import { FormContext } from "../../context/FormContext";
import useCreateTask from "../../services/tasks/useCreateTask";
import useDialog from "../../hooks/useDialog";

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

  const processedTypeColumn = previousState.typeColumn;

  const isDuplicateSKU = ['stok', 'harga', 'sku_produk'].includes(processedTypeColumn);

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
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
        return filter.color ;
      } else if (
        filter.operator === "equal" &&
        record.persentase === filter.value
      ) {
        return filter.color ;
      }
    }
    return "transparent";
  };


  const formatNumber = (number) => {
    if (!number) return '0';
    return parseInt(number, 10).toLocaleString('id-ID');
  };

  const renderCell = (text, record, slug) => {
    const isTargetColumn = slug === processedTypeColumn;
    const isNumericColumn = !['kode_produk', 'kode_variasi'].includes(slug);

    const style = isTargetColumn
      ? { backgroundColor: '#e5e7eb' }
      : {};

    const content = isNumericColumn && text !== '' && !isNaN(text)
      ? formatNumber(text)
      : text;

    return {
      props: { style },
      children: content,
    };
  };

  const generateColumns = (tableColumns) => {
    return tableColumns.map((col) => {
      const key = col.toLowerCase().replace(' ', '_');
      if (key === 'persentase' || key === 'selisih') {
        return {
          title: col,
          dataIndex: key,
          key: key,
          render: (text, record) => {
            const formattedValue = key === 'persentase' 
              ? (text ? parseFloat(text).toFixed(1) : "0") + "%"
              : (text ? previousState.typeColumn === "berat" ? text : formatNumber(text) : "0");
            return (
              <span
                style={{
                  backgroundColor: applyFilters(record),
                  padding: "0.5em",
                  borderRadius: "0.25em",
                }}
              >
                {formattedValue}
              </span>
            );
          },
          sorter: key === 'selisih' ? (a, b) => a.selisih - b.selisih : undefined,
          defaultSortOrder: key === 'selisih' ? 'descend' : undefined
        };
      } else {
        return {
          title: col,
          dataIndex: key,
          key: key,
          render: (text, record) => renderCell(text, record, key)
        };
      }
    });
  };

  const columns = generateColumns(previousState.tableColumns);

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
  let saveTask = previousState.typeTable === 'shopee_product' ? handleSaveTask : handleSaveTaskWeight

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


  const dataDuplicateSecondary = previousState.secondaryDuplicates?.flatMap((dup, index) =>
    dup.rows.map((row, rowIndex) => ({
      key: `${index}-${rowIndex}`,
      value: row.value,
      numbers: row.numbers,
    }))
  ) || [];


  const hasSecondaryDuplicates = 
    previousState.secondaryDuplicates && 
    previousState.secondaryDuplicates.length > 0 && 
    previousState.secondaryDuplicates.some(dup => dup.filename === filename);

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
      {hasSecondaryDuplicates && (
        <Flex vertical gap='middle'>
        <Text className='text-red-600'>
            Duplikasi <strong>{isDuplicateSKU ? 'SKU' : 'Kode Produk'}</strong> terdeteksi pada file yang diberikan. Baris berikut
            tidak dapat diproses.
          </Text>
      <Table columns={columnsDuplicate} dataSource={dataDuplicateSecondary} pagination={false}/>
        </Flex>
        )}
      <Table
        className='custom-table-header'
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
