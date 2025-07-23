import React from "react";

const DeleteModal = ({ onClose, deleteClick }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 font-monsterrat">
      <div className="bg-white w-full max-w-md px-8 py-6 rounded-2xl shadow-2xl relative text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Are you sure?</h2>

        <p className="text-sm text-gray-500 mb-6">
          This action cannot be undone. Please confirm your choice.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={deleteClick}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg font-medium shadow hover:shadow-lg transition duration-300"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3 rounded-lg font-medium shadow hover:shadow-md transition duration-300"
          >
            Cancel
          </button>
        </div>

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
