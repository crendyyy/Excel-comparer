import { Link, useLocation, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../shared/Table";
import ArrowLeft from '../icons/ArrowLeft';

const TableResultsDetail = () => {
  const { filename } = useParams();
  const location = useLocation();
  const { result } = location.state || {}; // Mengambil data dari state

  return (
    <div className="flex flex-col gap-8 p-10">
      <div className="flex gap-6">
        <Link to='/' className='h-10 w-10 flex justify-center items-center bg-white rounded-lg'><ArrowLeft/></Link>
        <h1 className="font-bold">{filename}</h1>
      </div>
      <Table>
        <TableHead>
          <TableColumn className='gap-3 w-[200%]'><input type='checkbox' /> Nama Produk</TableColumn>
          <TableColumn>Kode Produk</TableColumn>
          <TableColumn>Nama Variasi</TableColumn>
          <TableColumn>SKU Induk</TableColumn>
          <TableColumn>SKU</TableColumn>
          <TableColumn>Harga</TableColumn>
          <TableColumn>Stok</TableColumn>
          <TableColumn>Selisih</TableColumn>
        </TableHead>
        <TableBody>
          {result.rows && result.rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className='gap-3 w-[200%]'><input type='checkbox' />{row.nama_produk}</TableCell>
              <TableCell>{row.kode_produk}</TableCell>
              <TableCell>{row.nama_variasi}</TableCell>
              <TableCell>{row.sku_induk}</TableCell>
              <TableCell>{row.sku_produk}</TableCell>
              <TableCell>{row.harga_produk}</TableCell>
              <TableCell>{row.stok_produk}</TableCell>
              <TableCell>{!row.difference ? '-' : row.difference}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableResultsDetail;
