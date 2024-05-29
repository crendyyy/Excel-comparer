import React, { createContext, useState } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    mainFile: null,
    secondaryFiles: [],
    type: "shopee_product",
    targetColumn: "Pilih Kolum",
  });
  const [typeColumn, setTypeColumn] = useState("Pilih Kolum");
  const [typeOperator, setTypeOperator] = useState("Pilih Operator");
  const [typeTable, setTypeTable] = useState("Pilih E-comm");
  const [mainFileName, setMainFileName] = useState("File Utama");
  const [secondaryFileNames, setSecondaryFileNames] = useState("File Turunan");
  const [filteredResults, setFilteredResults] = useState([]);
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
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
