import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function PepperExpandable({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#DDD5CC] rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#FBF8F4] transition-colors"
      >
        <span className="font-semibold text-[#2D2A26] text-lg">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#A09890] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? "2000px" : "0", opacity: open ? 1 : 0 }}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
