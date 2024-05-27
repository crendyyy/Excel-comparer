import Dialog from "../shared/Dialog";
import React, { useState } from "react";
import Dropdown from "../shared/Dropdown";

const FilterDialog = ({ onClose }) => {
  const [color, setColor] = useState("#ffffff");
  const [typeOperator, setTypeOperator] = useState("=");

  const Operator = [
    { id: 0, selectOp: "=" },
    { id: 1, selectOp: ">" },
    { id: 2, selectOp: "<" },
  ];

  const handleColorPicker = (e) => {
    setColor(e.target.value);
  };
  return (
    <Dialog onCancel={onClose}>
      <div className="flex flex-col gap-10 p-6 bg-white border border-gray-100 border-solid w-96 rounded-primary">
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold">Filter Warna</span>
          <div className="flex h-8 gap-2">
            <div className="w-8">
              <Dropdown
                options={Operator}
                value={typeOperator}
                setValue={setTypeOperator}
              />
            </div>
            <input
              type="text"
              className="flex items-center w-full h-full px-4 border border-solid rounded-lg border-primary placeholder:text-base placeholder:font-medium placeholder:text-gray-400"
              placeholder={`Pilih angka nya saja "5" %`}
            />
            <label htmlFor="favcolor" className="hidden"></label>
            <input
              type="color"
              id="favcolor"
              name="favcolor"
              className="w-8 h-full border border-solid rounded-lg border-primary"
              value={color}
              onChange={handleColorPicker}
            />
          </div>
          <button className="flex items-center justify-center w-full h-8 gap-1 text-base font-bold border border-solid rounded-lg border-primary text-primary">
            Tambah
          </button>
        </div>
        <div className="flex h-12 gap-6">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-full h-full text-base font-bold border border-solid rounded-lg border-primary text-primary"
          >
            Batalkan
          </button>
          <button className="flex items-center justify-center w-full h-full text-base font-bold text-white rounded-lg bg-primary">
            Konfirmasi
          </button>
        </div>
      </div>
    </Dialog>
  );
};
export default FilterDialog;
