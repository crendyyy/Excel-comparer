import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../shared/Table";
import { Link } from "react-router-dom";

const TableResult = ({ results, previousState }) => {
  return (
    <Table>
      <TableHead>
        <TableColumn className="w-7">No</TableColumn>
        <TableColumn>Nama File</TableColumn>
        <TableColumn>Perbedaan</TableColumn>
        <TableColumn />
      </TableHead>
      <TableBody>
        {results.map((result, index) => (
          <TableRow key={index}>
            <TableCell className="text-sm font-normal w-7">
              {index + 1}
            </TableCell>
            <TableCell className="text-sm font-normal">
              {result.filename}
            </TableCell>
            <TableCell className="text-sm font-normal">
              {result.rows.length}
            </TableCell>
            <TableCell className="justify-end">
              <Link
                to={`/table/${encodeURIComponent(result.filename)}`}
                state={{ result, previousState }}
                className="px-2 py-1 text-sm font-semibold text-white rounded-lg bg-primary"
              >
                Detail
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableResult;
