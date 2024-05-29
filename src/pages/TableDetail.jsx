import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../component/shared/Dropdown";
import FilterIcon from "../component/icons/FilterIcon";
import useDialog from "../hooks/useDialog";
import FilterDialog from "../component/dialog/FilterDialog";
import TableResult from "../component/Table/TableResults";
import { FormContext } from "../context/FormContext"; // Sesuaikan path dengan struktur proyek Anda

const TableDetail = () => {
  const {
    formData,
    setFormData,
    typeColumn,
    setTypeColumn,
    typeOperator,
    setTypeOperator,
    typeTable,
    setTypeTable,
    mainFileName,
    setMainFileName,
    secondaryFileNames,
    setSecondaryFileNames,
    filteredResults,
    setFilteredResults,
    isSubmited,
    setIsSubmited,
    hideOperator,
    setHideOperator,
  } = useContext(FormContext);

  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const mainFileRef = useRef(null);
  const secondaryFilesRef = useRef(null);

  const columns = [
    { id: 0, columnType: "Pilih Kolum" },
    { id: "sku_produk", columnType: "SKU" },
    { id: "harga_produk", columnType: "Harga" },
    { id: "stok_produk", columnType: "Stok" },
  ];

  const types = [
    { id: 0, tableType: "Pilih E-comm" },
    { id: 1, tableType: "shopee_product" },
    { id: 2, tableType: "tiktok_product" },
    { id: 3, tableType: "tokopedia_product" },
  ];

  const operators = [
    { id: 0, operatorType: "Pilih Operator" },
    { id: "not_equal", operatorType: "Tidak Sama" },
    { id: "greater_than", operatorType: "Lebih Dari" },
    { id: "less_than", operatorType: "Kurang Dari" },
  ];

  useEffect(() => {
    setFormData((prev) => ({ ...prev, targetColumn: typeColumn }));
    setHideOperator(!["harga_produk", "stok_produk"].includes(typeColumn));
    if (hideOperator) setTypeOperator("Pilih Operator");
  }, [typeColumn, hideOperator, setFormData, setHideOperator, setTypeOperator]);

  useEffect(() => {
    if (mainFileRef.current && formData.mainFile) {
      mainFileRef.current.files = createFileList([formData.mainFile]);
    }
    if (secondaryFilesRef.current && formData.secondaryFiles.length > 0) {
      secondaryFilesRef.current.files = createFileList(formData.secondaryFiles);
    }
  }, [formData.mainFile, formData.secondaryFiles]);

  const createFileList = (files) => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  const truncateFileName = (name, maxLength = 12) =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "main-file") {
      setFormData((prev) => ({ ...prev, mainFile: files[0] }));
      const truncatedName = files[0]
        ? truncateFileName(files[0].name)
        : "File Utama";
      setMainFileName(truncatedName);
    } else if (name === "compares-file") {
      setFormData((prev) => ({ ...prev, secondaryFiles: Array.from(files) }));
      const truncatedNames =
        files.length > 1
          ? `${files.length} Files Selected`
          : files[0]
          ? truncateFileName(files[0].name)
          : "File Turunan";
      setSecondaryFileNames(truncatedNames);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("mainFile", formData.mainFile);
    formData.secondaryFiles.forEach((file) =>
      data.append("secondaryFiles", file)
    );
    data.append("type", formData.type);
    data.append("targetColumn", formData.targetColumn);

    const url =
      typeColumn === "sku_produk"
        ? "http://localhost:3000/api/v1/excel/missing-sku"
        : "http://localhost:3000/api/v1/excel/compare";

    try {
      const response = await fetch(url, { method: "POST", body: data });
      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      console.log(result);

      const filteredData =
        typeColumn === "sku_produk"
          ? result.payload.results
          : filterResults(result.payload.results, typeOperator);

      setFilteredResults(filteredData);
      setIsSubmited(true);
      console.log("Filtered Results:", filteredData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const filterResults = (results, operator) => {
    return results.map((fileResult) => {
      const filteredRows = fileResult.rows.filter((row) => {
        switch (operator) {
          case "less_than":
            return row.difference < 0;
          case "greater_than":
            return row.difference > 0;
          case "not_equal":
            return row.difference !== 0;
          default:
            return true;
        }
      });
      return { ...fileResult, rows: filteredRows };
    });
  };

  return (
    <div className="flex flex-col gap-8 p-10">
      <h1 className="font-bold">Table Detail</h1>
      <form
        onSubmit={handleSubmit}
        className="flex justify-between w-full p-6 bg-white rounded-primary"
      >
        <div className="flex gap-6">
          <label
            htmlFor="main-file"
            className="flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-primary"
          >
            {mainFileName}
          </label>
          <input
            name="main-file"
            type="file"
            id="main-file"
            className="hidden"
            onChange={handleFileChange}
            required
            ref={mainFileRef}
          />
          <label
            htmlFor="compares-file"
            className="flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-primary"
          >
            {secondaryFileNames}
          </label>
          <input
            name="compares-file"
            type="file"
            id="compares-file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            required
            ref={secondaryFilesRef}
          />
          <div className="w-40">
            <Dropdown
              options={columns}
              value={typeColumn}
              setValue={setTypeColumn}
              px="4"
              py="3"
              rounded="primary"
              border="gray-200"
              justify="between"
            />
          </div>
          {!hideOperator && (
            <div className="w-40">
              <Dropdown
                options={operators}
                value={typeOperator}
                setValue={setTypeOperator}
                px="4"
                py="3"
                rounded="primary"
                border="gray-200"
                justify="between"
              />
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={openDialog}
            className="h-full px-4 rounded-primary bg-[#110F45] flex items-center"
          >
            <FilterIcon />
          </button>
          <button
            type="submit"
            className="h-full px-4 rounded-primary bg-[#110F45] flex items-center text-base font-bold text-white"
          >
            Proses
          </button>
        </div>
      </form>
      {isSubmited && <TableResult results={filteredResults} />}
      {isDialogOpen && <FilterDialog onClose={closeDialog} />}
    </div>
  );
};

export default TableDetail;
