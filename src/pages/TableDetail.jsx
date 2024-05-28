import { useEffect, useState } from "react";
import Dropdown from "../component/shared/Dropdown";
import FilterIcon from "../component/icons/FilterIcon";
import useDialog from "../hooks/useDialog";
import FilterDialog from "../component/dialog/FilterDialog";

const TableDetail = () => {
  const [typeColumn, setTypeColumn] = useState("Pilih Kolum");
  const [typeOperator, setTypeOperator] = useState("Pilih Operator");
  const [typeTable, setTypeTable] = useState("Pilih E-comm");
  const [hideOperator, setHideOperator] = useState(false);
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const [formData, setFormData] = useState({
    mainFile: null,
    secondaryFiles: [],
    type: "shopee_product",
    targetColumn: typeColumn,
  });
  const [mainFileName, setMainFileName] = useState("File Utama");
  const [secondaryFileNames, setSecondaryFileNames] = useState("File Turunan");

  const column = [
    { id: 0, columnType: "Pilih Kolum" },
    { id: "sku_produk", columnType: "SKU" },
    { id: "harga_produk", columnType: "Harga" },
    { id: "stok_produk", columnType: "Stok" },
  ];

  const type = [
    { id: 0, tableType: "Pilih E-comm" },
    { id: 1, tableType: "shopee_product" },
    { id: 2, tableType: "tiktok_product" },
    { id: 3, tableType: "tokopedia_product" },
  ];

  const operator = [
    { id: 0, operatorType: "Pilih Operator" },
    { id: "not_equal", operatorType: "Tidak Sama" },
    { id: "greater_then", operatorType: "Lebih Dari" },
    { id: "lesser_then", operatorType: "Kurang Dari" },
  ];

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      targetColumn: typeColumn,
    }));

    if (typeColumn === "harga_produk" || typeColumn === "stok_produk") {
      setHideOperator(false);
    } else {
      setHideOperator(true);
      setTypeOperator("Pilih Operator");
    }
  }, [typeColumn]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "main-file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        mainFile: files[0],
      }));
      setMainFileName(files[0] ? files[0].name : "File Utama");
    } else if (name === "compares-file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        secondaryFiles: Array.from(files),
      }));
      setSecondaryFileNames(
        files.length > 1
          ? `${files.length} Files Selected`
          : files[0]
          ? files[0].name
          : "File Turunan"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("mainFile", formData.mainFile);
    formData.secondaryFiles.forEach((file) => {
      data.append("secondaryFiles", file);
    });
    data.append("type", formData.type);
    data.append("targetColumn", formData.targetColumn);

    let url =
      typeColumn === "sku_produk"
        ? "http://localhost:3000/api/v1/excel/missing-sku"
        : "http://localhost:3000/api/v1/excel/compare";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);

      const filteredResults = filterResults(
        result.payload.results,
        typeOperator
      );
      console.log("Filtered Results:", filteredResults);

      // Display filteredResults as needed in your UI
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const filterResults = (results, operator) => {
    return results.map((fileResult) => {
      const filteredRows = fileResult.rows.filter((row) => {
        switch (operator) {
          case "lesser_then":
            return row.difference < 0;
          case "greater_then":
            return row.difference > 0;
          case "not_equal":
            return row.difference !== 0;
          default:
            return true;
        }
      });
      return {
        ...fileResult,
        rows: filteredRows,
      };
    });
  };

  return (
    <form className="flex flex-col gap-8 p-10" onSubmit={handleSubmit}>
      <h1 className="font-bold">Table Detail</h1>
      <div className="flex justify-between w-full p-6 bg-white rounded-primary">
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
          />
          <div className="w-40">
            <Dropdown
              options={column}
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
                options={operator}
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
      </div>
      {isDialogOpen && <FilterDialog onClose={closeDialog} />}
    </form>
  );
};

export default TableDetail;
