import React, { createContext, useState } from 'react'

export const FormContext = createContext()

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    mainFile: null,
    secondaryFiles: [],
    type: '',
    targetColumn: '',
  })
  const [formInputMain, setFormInputMain] = useState({})
  const [formInputSecondary, setFormInputSecondary] = useState({})
  const [typeColumn, setTypeColumn] = useState()
  const [typeOperator, setTypeOperator] = useState('Pilih Operator')
  const [typeTable, setTypeTable] = useState()
  const [mainFileName, setMainFileName] = useState('File Utama')
  const [mainFilePrice, setMainFilePrice] = useState('Harga Mati')
  const [mainFileDiscount, setMainFileDiscount] = useState('Harga Coret')
  const [secondaryFilePrice, setSecondaryFilePrice] = useState('Harga Mati')
  const [secondaryFileDiscount, setSecondaryFileDiscount] = useState('Harga Coret')
  const [secondaryFileNames, setSecondaryFileNames] = useState('File Turunan')
  const [filteredResults, setFilteredResults] = useState([])
  const [resultsDuplicate, setResultsDuplicate] = useState([])
  const [resultsDuplicatesSecond, setResultsDuplicatesSecond] = useState([])
  const [tableColumns, setTableColumns] = useState([])
  const [excelColumns, setExcelColumns] = useState([])
  const [filterCriteria, setFilterCriteria] = useState([])
  const [savedFilters, setSavedFilters] = useState([])
  const [savedInputsMain, setSavedInputsMain] = useState([])
  const [savedInputsSecondary, setSavedInputsSecondary] = useState([])
  const [savedResultsSecondary, setSavedResultsSecondary] = useState([])
  const [isSubmited, setIsSubmited] = useState(false)
  const [hideOperator, setHideOperator] = useState(false)

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        formInputMain,
        setFormInputMain,
        formInputSecondary,
        setFormInputSecondary,
        typeColumn,
        setTypeColumn,
        typeOperator,
        setTypeOperator,
        typeTable,
        setTypeTable,
        mainFileName,
        setMainFileName,
        mainFilePrice,
        setMainFilePrice,
        mainFileDiscount,
        setMainFileDiscount,
        secondaryFilePrice,
        setSecondaryFilePrice,
        secondaryFileDiscount,
        setSecondaryFileDiscount,
        secondaryFileNames,
        setSecondaryFileNames,
        filteredResults,
        setFilteredResults,
        resultsDuplicate,
        setResultsDuplicate,
        resultsDuplicatesSecond,
        setResultsDuplicatesSecond,
        tableColumns,
        setTableColumns,
        excelColumns,
        setExcelColumns,
        isSubmited,
        setIsSubmited,
        hideOperator,
        setHideOperator,
        filterCriteria,
        setFilterCriteria,
        savedFilters,
        setSavedFilters,
        savedInputsMain,
        setSavedInputsMain,
        savedInputsSecondary,
        setSavedInputsSecondary,
        savedResultsSecondary,
        setSavedResultsSecondary,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}
