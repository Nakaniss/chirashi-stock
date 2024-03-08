import React from "react";

function LoadingButton() {
  return (
    <button
      disabled
      aria-label="読込中"
      className="mt-4 px-4 py-2 bg-slate-400 text-white rounded-md"
    >
      <div className="animate-spin border-4 border-white-500 rounded-full border-t-transparent h-6 w-6"></div>
    </button>
  );
}

export default LoadingButton;
