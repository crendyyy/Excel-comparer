import { useState } from "react";
import Dropdown from "../component/shared/Dropdown";
import FilterIcon from "../component/icons/FilterIcon";
import useDialog from "../hooks/useDialog";
import FilterDialog from "../component/dialog/FilterDialog";

const TableWeight = () => {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  return (
    <div className="flex flex-col gap-8 p-10">
      <h1 className="font-bold">Table Berat</h1>
      <div className="flex justify-between w-full p-6 bg-white rounded-primary">
        <div className="flex gap-6">
          <label
            htmlFor="main-file"
            className="flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-primary"
          >
            File Utama
          </label>
          <input
            name="main-file"
            type="file"
            id="main-file"
            className="hidden"
            required
          />
          <label
            htmlFor="compares-file"
            className="flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-primary"
          >
            File Turunan
          </label>
          <input
            name="compares-file"
            type="file"
            id="compares-file"
            className="hidden"
            multiple
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={openDialog}
            className="h-full px-4 rounded-primary bg-[#110F45] flex items-center"
          >
            <FilterIcon />
          </button>
          <button className="h-full px-4 rounded-primary bg-[#110F45] flex items-center text-base font-bold text-white">
            Proses
          </button>
        </div>
      </div>
      {isDialogOpen && <FilterDialog onClose={closeDialog} />}
    </div>
  );
};
export default TableWeight;
