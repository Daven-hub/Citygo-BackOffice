import { Settings } from "lucide-react";
import Breadcrumb from "../Breadcrumb";

function LayoutSetting() {
  return (
    <div className="flex flex-col gap-6 max-md:gap-5">
      <div className="flex rounded-[6px] max-md:flex-col gap-2 px-5 py-4 bg-white justify-between max-md:items-start items-center">
        <h1 className="flex items-center leading-[1.3] text-gray-700 md:text-[1.25rem] font-medium gap-1.5">
          <Settings size={22} />
          Parametre{" "}
        </h1>
        <Breadcrumb />
      </div>
      <div className="grid grid-cols-4 gap-7">
        <div className="col-span-1 p-8 bg-red-500"></div>
        <div className="col-span-3 p-8 bg-green-400"></div>
      </div>
    </div>
  );
}

export default LayoutSetting;
