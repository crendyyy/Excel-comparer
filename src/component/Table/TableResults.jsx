import React from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";

const TableResult = ({ results, previousState }) => {
  const columns = [
    {
      title: "No",
      dataIndex: "no",
      width: 12,
      render: (text, record, index) => (
        <span className="text-sm font-normal">{index + 1}</span>
      ),
    },
    {
      title: "Nama File",
      dataIndex: "name",
      render: (text, record) => (
        <span className="text-sm font-normal">{record.filename}</span>
      ),
    },
    {
      title: "Perbedaan",
      dataIndex: "different",
      render: (text, record) => (
        <span className="text-sm font-normal">{record.rows.length}</span>
      ),
    },
    {
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <div className="flex justify-end w-full">
          <Link
            to={`/table/${encodeURIComponent(record.filename)}`}
            state={{ result: record, previousState }}
            className="px-2 py-1 text-sm font-semibold text-white rounded-lg bg-primary"
          >
            Detail
          </Link>
        </div>
      ),
    },
  ];

  const data = results.map((result, index) => ({
    key: index,
    no: index + 1,
    filename: result.filename,
    rows: result.rows,
  }));

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default TableResult;
