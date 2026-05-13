import React from "react";

const SizeGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Size Guide (Inches)
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Size</th>
                <th className="px-6 py-3">Chest</th>
                <th className="px-6 py-3">Waist</th>
                <th className="px-6 py-3">Length</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">
                  S (Small)
                </td>
                <td className="px-6 py-4">36"</td>
                <td className="px-6 py-4">34"</td>
                <td className="px-6 py-4">27"</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">
                  M (Medium)
                </td>
                <td className="px-6 py-4">38"</td>
                <td className="px-6 py-4">36"</td>
                <td className="px-6 py-4">28"</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">
                  L (Large)
                </td>
                <td className="px-6 py-4">40"</td>
                <td className="px-6 py-4">38"</td>
                <td className="px-6 py-4">29"</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">
                  XL (Extra Large)
                </td>
                <td className="px-6 py-4">42"</td>
                <td className="px-6 py-4">40"</td>
                <td className="px-6 py-4">30"</td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-4 font-medium text-gray-900">
                  XXL (Double XL)
                </td>
                <td className="px-6 py-4">44"</td>
                <td className="px-6 py-4">42"</td>
                <td className="px-6 py-4">31"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          * Measurements may vary slightly by style.
        </p>
      </div>
    </div>
  );
};

export default SizeGuide;
