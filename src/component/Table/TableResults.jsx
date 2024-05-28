import { Table, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../shared/Table";
import { Link } from 'react-router-dom';

const TableResult = ({ results }) => {
  return (
    <Table>
      <TableHead>
        <TableColumn className='w-7'>No</TableColumn>
        <TableColumn>Nama File</TableColumn>
        <TableColumn>Perbedaan</TableColumn>
        <TableColumn />
      </TableHead>
      <TableBody>
        {results.map((result, index) => (
          <TableRow key={index}>
            <TableCell className='w-7 font-normal text-sm'>{index + 1}</TableCell>
            <TableCell className='text-sm font-normal'>{result.filename}</TableCell>
            <TableCell className='text-sm font-normal'>{result.rows.length}</TableCell>
            <TableCell className='justify-end'>
              <Link to={`/table/${encodeURIComponent(result.filename)}`} state={{ result }} className="py-1 px-2 rounded-lg bg-primary text-sm font-semibold text-white">
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
