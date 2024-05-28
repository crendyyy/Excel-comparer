import CalendarIcon from "../component/icons/CalendarIcon";

const Tugas = () => {
  return (
    <div className="flex flex-col gap-8 p-10">
      <h1 className="font-bold">Tugas</h1>
      <div className="flex flex-col gap-6">
        <div className="flex w-full h-12 gap-4">
          <input
            className="flex items-center w-full h-full px-4 text-sm font-bold text-black bg-white border border-gray-200 border-solid rounded-primary placeholder:text-gray-400 placeholder:font-bold placeholder:text-sm"
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
