import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  tone?: "gold" | "ink";
  style?: React.CSSProperties;
}

const DropCap = ({ children, className = "", tone = "gold", style }: Props) => (
  <p
    className={`drop-cap ${className}`}
    style={{
      fontFamily: "'Instrument Sans', sans-serif",
      ...style,
      ["--drop-cap-color" as never]: tone === "gold" ? "#B8933A" : "#2D2A26",
    }}
  >
    {children}
  </p>
);

export default DropCap;
