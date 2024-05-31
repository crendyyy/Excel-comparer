import Dialog from "../shared/Dialog";
import React, { useState, useContext } from "react";
import Dropdown from "../shared/Dropdown";
import { FormContext } from "../../context/FormContext";
import TrashIcon from "../icons/TrashIcon"; // pastikan Anda memiliki ikon ini

const FilterDialog = ({ onClose, onSubmit }) => {
  const [filters, setFilters] = useState([]);
  const [color, setColor] = useState("#ffffff");
  const [typeOperator, setTypeOperator] = useState("=");
  const [value, setValue] = useState("");
  const { savedFilters, setSavedFilters } = useContext(FormContext);

  const Operator = [
    { id: "equal", selectOp: "=" },
    { id: "greater_than", selectOp: ">" },
    { id: "lesser_than", selectOp: "<" },
  ];

  const handleColorPicker = (e) => {
    setColor(e.target.value);
  };

  const handleAddFilter = () => {
    const newFilter = {
      operator: typeOperator,
      value: "",
      color: "#ffffff",
    };
    setFilters([...filters, newFilter]);
  };

  const handleConfirm = () => {
    let combinedFilters = [...savedFilters, ...filters];
    if (value !== "") {
      const latestFilter = {
        operator: typeOperator,
        value,
        color,
      };
      combinedFilters = [...combinedFilters, latestFilter];
    }
    setSavedFilters(combinedFilters);
    onSubmit(combinedFilters);
    onClose();
  };

  const handleDeleteFilter = (index, type) => {
    if (type === "saved") {
      const updatedFilters = savedFilters.filter((_, i) => i !== index);
      setSavedFilters(updatedFilters);
    } else {
      const updatedFilters = filters.filter((_, i) => i !== index);
      setFilters(updatedFilters);
    }
  };

  return (
    <Dialog onCancel={onClose}>
      <div className="flex flex-col gap-10 p-6 bg-white border border-gray-100 border-solid w-96 rounded-primary">
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold">Filter Warna</span>
          {savedFilters.map((filter, index) => (
            <div className="flex h-8 gap-2" key={index}>
              <div className="w-fit">
                <Dropdown
                  options={Operator}
                  value={filter.operator}
                  setValue={(newValue) => {
                    const updatedFilters = [...savedFilters];
                    updatedFilters[index].operator = newValue;
                    setSavedFilters(updatedFilters);
                  }}
                  px="2"
                  py="2"
                  rounded="lg"
                  border="primary"
                  justify="center"
                />
              </div>
              <input
                type="text"
                className="flex items-center w-full h-full px-4 border border-solid rounded-lg border-primary placeholder:text-base placeholder:font-medium placeholder:text-gray-400"
                placeholder={`Pilih angka nya saja "5" %`}
                value={filter.value}
                onChange={(e) => {
                  const updatedFilters = [...savedFilters];
                  updatedFilters[index].value = e.target.value;
                  setSavedFilters(updatedFilters);
                }}
              />
              <label htmlFor="favcolor" className="hidden"></label>
              <input
                type="color"
                id="favcolor"
                name="favcolor"
                className="h-full border border-solid rounded-lg w-11 border-primary"
                value={filter.color}
                onChange={(e) => {
                  const updatedFilters = [...savedFilters];
                  updatedFilters[index].color = e.target.value;
                  setSavedFilters(updatedFilters);
                }}
              />
              <button
                className="flex items-center justify-center w-12 h-full border border-gray-200 border-solid rounded-lg"
                onClick={() => handleDeleteFilter(index, "saved")}
              >
                <TrashIcon className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
          {filters.map((filter, index) => (
            <div className="flex h-8 gap-2" key={index}>
              <div className="w-fit">
                <Dropdown
                  options={Operator}
                  value={filter.operator}
                  setValue={(newValue) => {
                    const updatedFilters = [...filters];
                    updatedFilters[index].operator = newValue;
                    setFilters(updatedFilters);
                  }}
                  px="2"
                  py="2"
                  rounded="lg"
                  border="primary"
                  justify="center"
                />
              </div>
              <input
                type="text"
                className="flex items-center w-full h-full px-4 border border-solid rounded-lg border-primary placeholder:text-base placeholder:font-medium placeholder:text-gray-400"
                placeholder={`Pilih angka nya saja "5" %`}
                value={filter.value}
                onChange={(e) => {
                  const updatedFilters = [...filters];
                  updatedFilters[index].value = e.target.value;
                  setFilters(updatedFilters);
                }}
              />
              <label htmlFor="favcolor" className="hidden"></label>
              <input
                type="color"
                id="favcolor"
                name="favcolor"
                className="h-full border border-solid rounded-lg w-11 border-primary"
                value={filter.color}
                onChange={(e) => {
                  const updatedFilters = [...filters];
                  updatedFilters[index].color = e.target.value;
                  setFilters(updatedFilters);
                }}
              />
            </div>
          ))}
          {savedFilters.length === 0 && (
            <div className="flex h-8 gap-2">
              <div className="w-fit">
                <Dropdown
                  options={Operator}
                  value={typeOperator}
                  setValue={setTypeOperator}
                  px="2"
                  py="2"
                  rounded="lg"
                  border="primary"
                  justify="center"
                />
              </div>
              <input
                type="text"
                className="flex items-center w-full h-full px-4 border border-solid rounded-lg border-primary placeholder:text-base placeholder:font-medium placeholder:text-gray-400"
                placeholder={`Pilih angka nya saja "5" %`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <label htmlFor="favcolor" className="hidden"></label>
              <input
                type="color"
                id="favcolor"
                name="favcolor"
                className="h-full border border-solid rounded-lg w-11 border-primary"
                value={color}
                onChange={handleColorPicker}
              />
            </div>
          )}
          <button
            className="flex items-center justify-center w-full h-8 gap-1 text-base font-bold border border-solid rounded-lg border-primary text-primary"
            onClick={handleAddFilter}
          >
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
          <button
            onClick={handleConfirm}
            className="flex items-center justify-center w-full h-full text-base font-bold text-white rounded-lg bg-primary"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterDialog;
