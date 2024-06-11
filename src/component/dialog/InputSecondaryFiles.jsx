import Dialog from '../shared/Dialog';
import React, { useState, useContext, useRef, useEffect } from 'react';
import { FormContext } from '../../context/FormContext';
import { xlsxMimeType } from '../../libs/const';
import PencilIcon from '../icons/Edit';
import TrashIcon from '../icons/TrashIcon';

const InputSecondaryFileDialog = ({ onClose }) => {
  const {
    setFormData,
    mainFileName,
    setMainFileName,
    mainFileDiscount,
    setMainFileDiscount,
    savedInputs,
    setSavedInputs
  } = useContext(FormContext);

  const [tempMainFileName, setTempMainFileName] = useState(mainFileName);
  const [tempMainFileDiscount, setTempMainFileDiscount] = useState(mainFileDiscount);
  const [tempMainFilePrice, setTempMainFilePrice] = useState(null);
  const [tempMainFileDiscountFile, setTempMainFileDiscountFile] = useState(null);
  const [additionalInputs, setAdditionalInputs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const mainFilePriceRef = useRef(null);
  const mainFileDiscountRef = useRef(null);

  useEffect(() => {
    setTempMainFileName(mainFileName);
    setTempMainFileDiscount(mainFileDiscount);
  }, [mainFileName, mainFileDiscount]);

  const truncateFileName = (name, maxLength = 40) =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

  const handleFileChange = (e, index) => {
    const { name, files } = e.target;
    if (index === undefined) {
      if (name === 'main-file-price') {
        setTempMainFilePrice(files[0]);
        setTempMainFileName(truncateFileName(files[0].name));
      } else if (name === 'main-file-discount') {
        setTempMainFileDiscountFile(files[0]);
        setTempMainFileDiscount(truncateFileName(files[0].name));
      }
    } else {
      const newAdditionalInputs = [...additionalInputs];
      if (name === `additional-file-price-${index}`) {
        newAdditionalInputs[index].price = files[0];
        newAdditionalInputs[index].priceName = truncateFileName(files[0].name);
      } else if (name === `additional-file-discount-${index}`) {
        newAdditionalInputs[index].discount = files[0];
        newAdditionalInputs[index].discountName = truncateFileName(files[0].name);
      }
      setAdditionalInputs(newAdditionalInputs);
    }
  };

  const handleAddInput = () => {
    setAdditionalInputs([
      ...additionalInputs,
      { price: null, priceName: 'Harga Mati', discount: null, discountName: 'Harga Coret' },
    ]);
  };

  const handleConfirm = () => {
    const validInputs = additionalInputs.filter(input => input.price !== null && input.discount !== null);
    const combinedFiles = [
      ...(tempMainFilePrice && tempMainFileDiscountFile ? [{ price: tempMainFilePrice, discount: tempMainFileDiscountFile }] : []),
      ...validInputs,
    ];

    if (combinedFiles.length > 0) {
      setFormData(prev => ({ ...prev, files: combinedFiles }));
      if (tempMainFilePrice) setMainFileName(tempMainFileName);
      if (tempMainFileDiscountFile) setMainFileDiscount(tempMainFileDiscount);
      setSavedInputs(prev => [...prev, ...validInputs]);
    }
    setAdditionalInputs([]);
    setTempMainFilePrice(null);
    setTempMainFileDiscountFile(null);
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setTempMainFileName(mainFileName || 'Harga Mati');
    setTempMainFileDiscount(mainFileDiscount || 'Harga Coret');
    setTempMainFilePrice(null);
    setTempMainFileDiscountFile(null);
    setAdditionalInputs([]);
    setIsEditing(false);
    onClose();
  };

  const handleEditInput = (index) => {
    const inputToEdit = savedInputs[index];
    setAdditionalInputs([{ price: inputToEdit.price, priceName: inputToEdit.priceName, discount: inputToEdit.discount, discountName: inputToEdit.discountName }]);
    handleDeleteInput(index);
    setIsEditing(true);
  };

  const handleDeleteInput = (index) => {
    const newSavedInputs = savedInputs.filter((_, i) => i !== index);
    setSavedInputs(newSavedInputs);
  };

  return (
    <Dialog onCancel={handleCancel}>
      <div className='flex flex-col gap-10 p-6 bg-white border border-gray-100 border-solid w-96 rounded-primary'>
        <div className='flex flex-col gap-4'>
          <span className='text-base font-bold'>File Utama</span>
          <div className='flex flex-col gap-4'>
            <label
              htmlFor='main-file-price'
              className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
            >
              {tempMainFileName}
            </label>
            <input
              name='main-file-price'
              type='file'
              id='main-file-price'
              accept={xlsxMimeType}
              className='hidden'
              onChange={handleFileChange}
              required
              ref={mainFilePriceRef}
            />
            <label
              htmlFor='main-file-discount'
              className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
            >
              {tempMainFileDiscount}
            </label>
            <input
              name='main-file-discount'
              type='file'
              id='main-file-discount'
              accept={xlsxMimeType}
              className='hidden'
              onChange={handleFileChange}
              required
              ref={mainFileDiscountRef}
            />
          </div>

          {additionalInputs.map((input, index) => (
            <div className='flex flex-col gap-4' key={index}>
              <label
                htmlFor={`additional-file-price-${index}`}
                className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
              >
                {input.priceName}
              </label>
              <input
                name={`additional-file-price-${index}`}
                type='file'
                id={`additional-file-price-${index}`}
                accept={xlsxMimeType}
                className='hidden'
                onChange={(e) => handleFileChange(e, index)}
              />
              <label
                htmlFor={`additional-file-discount-${index}`}
                className='flex gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
              >
                {input.discountName}
              </label>
              <input
                name={`additional-file-discount-${index}`}
                type='file'
                id={`additional-file-discount-${index}`}
                accept={xlsxMimeType}
                className='hidden'
                onChange={(e) => handleFileChange(e, index)}
              />
            </div>
          ))}
           {savedInputs.map((input, index) => (
          <div className='flex gap-4' key={index}>
            <label
              htmlFor='results-file'
              className='flex w-full gap-2 px-4 py-3 text-base font-semibold text-gray-600 border-2 border-gray-200 border-dashed rounded-lg'
            >
              {`Cabang ${index + 1}`}
            </label>
            <div className='flex gap-2'>
              <button
                className='flex items-center justify-center w-12 h-full border border-gray-200 border-solid rounded-lg'
                onClick={() => handleEditInput(index)}
              >
                <PencilIcon className='w-5 h-5 text-red-500' />
              </button>
              <button
                className='flex items-center justify-center w-12 h-full border border-gray-200 border-solid rounded-lg'
                onClick={() => handleDeleteInput(index)}
              >
                <TrashIcon className='w-5 h-5 text-red-500' />
              </button>
            </div>
          </div>
        ))}
          <button
            className='flex items-center justify-center w-full h-8 gap-1 text-base font-bold border border-solid rounded-lg border-blue-950 text-blue-950'
            onClick={handleAddInput}
          >
            Tambah
          </button>
        </div>
        <div className='flex h-12 gap-6'>
          <button
            onClick={handleCancel}
            className='flex items-center justify-center w-full h-full text-base font-bold border border-solid rounded-lg border-blue-950 text-blue-950'
          >
            Batalkan
          </button>
          <button
            onClick={handleConfirm}
            className='flex items-center justify-center w-full h-full text-base font-bold text-white rounded-lg bg-blue-950'
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default InputSecondaryFileDialog;
