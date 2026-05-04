import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDF5EC] text-[#0F1E1D] px-6">
      <div className="text-center max-w-md">
        <p className="text-[11px] uppercase tracking-[0.32em] font-semibold text-[#A8923A] mb-6">
          404 / Off the map
        </p>
        <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-5">
          This page isn't in the playbook.
        </h1>
        <p className="text-base text-[#225351] mb-8">
          The link is either retired, mistyped, or somewhere we haven't built yet.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0F1E1D] text-[#EDF5EC] text-sm uppercase tracking-[0.18em] font-semibold hover:bg-[#225351] transition-colors"
          >
            Return home
          </Link>
          <Link
            to="/assess"
            className="text-sm uppercase tracking-[0.18em] font-semibold text-[#A8923A] border-b border-[#A8923A]/40 hover:border-[#A8923A] pb-0.5 transition-colors"
          >
            Run the assessment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
