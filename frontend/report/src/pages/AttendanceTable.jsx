import React, { useState, useRef } from "react";

const AttendanceTable = ({ students, attendance, markAttendance, handleSubmit }) => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);

  // Open camera preview
  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  // Capture photo (right now, just fake functionality)
  const capturePhoto = () => {
    alert("📸 Photo captured! (Later this will be sent to Python backend for face recognition)");
  };

  return (
    <div className="p-4">
      {/* Camera Section */}
      <div className="mb-6">
        {!showCamera ? (
          <button
            onClick={openCamera}
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            📸 Take Class Photo
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <video ref={videoRef} autoPlay className="w-80 h-60 rounded-lg border shadow" />
            <button
              onClick={capturePhoto}
              type="button"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Capture & Mark Attendance
            </button>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <form onSubmit={handleSubmit}>
        <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Roll No</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                {/* Student Image + Name */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={
                      s.profilePic
                        ? `http://localhost:5000${s.profilePic}`
                        : "https://via.placeholder.com/40"
                    }
                    alt={s.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span>{s.name}</span>
                </td>

                {/* Roll No */}
                <td className="p-3">{s.rollNo}</td>

                {/* Attendance Radio Buttons */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-6">
                    {/* Present */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`attendance-${s._id}`}
                        value="Present"
                        checked={attendance[s._id] === "Present"}
                        onChange={(e) => markAttendance(s._id, e.target.value)}
                        className="hidden"
                      />
                      <span
                        className={`w-4 h-4 rounded-full border-2 ${
                          attendance[s._id] === "Present"
                            ? "bg-green-500 border-green-600"
                            : "border-gray-400"
                        }`}
                      ></span>
                      <span className="text-sm">Present</span>
                    </label>

                    {/* Absent */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`attendance-${s._id}`}
                        value="Absent"
                        checked={attendance[s._id] === "Absent"}
                        onChange={(e) => markAttendance(s._id, e.target.value)}
                        className="hidden"
                      />
                      <span
                        className={`w-4 h-4 rounded-full border-2 ${
                          attendance[s._id] === "Absent"
                            ? "bg-red-500 border-red-600"
                            : "border-gray-400"
                        }`}
                      ></span>
                      <span className="text-sm">Absent</span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
        >
          Submit Attendance
        </button>
      </form>
    </div>
  );
};

export default AttendanceTable;
