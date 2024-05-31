import React, { createContext, useState } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    mainFile: null,
    secondaryFiles: [],
    type: "",
    targetColumn: "Pilih Kolum",
  });
  const [typeColumn, setTypeColumn] = useState("Pilih Kolum");
  const [typeOperator, setTypeOperator] = useState("Pilih Operator");
  const [typeTable, setTypeTable] = useState("shopee_product");
  const [mainFileName, setMainFileName] = useState("File Utama");
  const [secondaryFileNames, setSecondaryFileNames] = useState("File Turunan");
  const [filteredResults, setFilteredResults] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState([]);
  const [savedFilters, setSavedFilters] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [hideOperator, setHideOperator] = useState(false);

  return (
    <FormContext.Provider
      value={{
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
        filterCriteria,
        setFilterCriteria,
        savedFilters,
        setSavedFilters,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
