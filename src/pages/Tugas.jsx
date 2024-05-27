import CalendarIcon from "../component/icons/CalendarIcon";

const Tugas = () => {
  return (
    <div className="flex flex-col p-10 gap-8">
      <h1 className="font-bold">Tugas</h1>
      <div className="flex gap-6 flex-col">
        <div className="w-full h-12 flex gap-4">
          <input
            className="h-full px-4 flex items-center w-full rounded-primary bg-gray-50 text-black font-bold border border-solid text-sm border-gray-200 placeholder:text-gray-400 placeholder:font-bold placeholder:text-sm"
            placeholder="Cari Nama Tugas"
            type="text"
            name=""
            id=""
          />
          <div className="h-full flex px-4 items-center bg-[#110F45] rounded-primary">
            <CalendarIcon />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Tugas;
