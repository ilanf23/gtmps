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
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: "white",
        border: "1px solid rgba(221,213,204,0.6)",
        boxShadow: open
          ? "0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)"
          : "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-7 py-5 text-left transition-colors duration-200 group"
        style={{ background: open ? "rgba(251,248,244,0.5)" : "transparent" }}
      >
        <span
          className="font-semibold text-[#2D2A26] text-[17px] tracking-[-0.01em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#C65D3E]/5"
          style={{
            background: open ? "rgba(198,93,62,0.06)" : "transparent",
          }}
        >
          <ChevronDown
            className="w-4 h-4 transition-transform duration-400"
            style={{
              color: open ? "#C65D3E" : "#A09890",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          maxHeight: open ? "3000px" : "0",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="px-7 pb-7 pt-1">{children}</div>
      </div>
    </div>
  );
}
