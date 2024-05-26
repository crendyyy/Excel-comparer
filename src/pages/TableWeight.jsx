import { useState } from "react"
import Dropdown from "../component/shared/Dropdown"
import FilterIcon from "../component/icons/FilterIcon"

const TableWeight = () => {
    
    return(
        <div className="flex flex-col p-10 gap-8">
            <h1 className="font-bold">Table Berat</h1>
            <div className="flex justify-between p-6 rounded-3xl bg-white w-full">
                <div className="flex gap-6">
                    <label for="main-file" className="py-3 px-4 flex gap-2 border border-dashed rounded-3xl border-gray-100 font-semibold text-base text-gray-600">File Utama</label>
                    <input 
                      name="main-file"
                      type="file"
                      id="main-file"
                      className="hidden"
                      required
                    />
                    <label for="compares-file" className="py-3 px-4 flex gap-2 border border-dashed rounded-3xl border-gray-100 font-semibold text-base text-gray-600">File Turunan</label>
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
                    <button className="h-full px-4 rounded-3xl bg-[#110F45] flex items-center">
                        <FilterIcon/>
                    </button>
                    <button className="h-full px-4 rounded-3xl bg-[#110F45] flex items-center text-base font-bold text-white">
                        Proses
                    </button>
                </div>
            </div>
        </div>
        ) 
}
export default TableWeight