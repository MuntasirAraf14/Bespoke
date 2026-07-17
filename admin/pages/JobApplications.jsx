import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendURL } from "../src/config";

const statusColors = {
  New: "bg-blue-100 text-blue-700",
  Reviewed: "bg-gray-100 text-gray-700",
  Shortlisted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const statuses = ["All", "New", "Reviewed", "Shortlisted", "Rejected"];

const JobApplications = ({ token }) => {
  const [applications, setApplications] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");

  const fetchApplications = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/job-application/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setApplications(response.data.applications);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [token]);

  const filteredApplications = useMemo(() => {
    if (activeStatus === "All") {
      return applications;
    }

    return applications.filter((application) => application.status === activeStatus);
  }, [activeStatus, applications]);

  const statusCounts = useMemo(
    () =>
      applications.reduce(
        (counts, application) => ({
          ...counts,
          [application.status]: (counts[application.status] || 0) + 1,
        }),
        { All: applications.length }
      ),
    [applications]
  );

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/job-application/status`,
        { applicationId, status },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Application updated");
        await fetchApplications();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const removeApplication = async (applicationId) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/job-application/remove`,
        { applicationId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Application removed");
        await fetchApplications();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-sm text-gray-500">
          Review applications submitted from the Explore Jobs page.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              activeStatus === status
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-200 hover:border-black"
            }`}
          >
            {status} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <div className="border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          No applications found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application._id}
              className="border-2 border-gray-200 bg-white p-5 md:p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {application.name}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[application.status] || statusColors.New
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied for {application.role}
                    </p>
                  </div>

                  <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                    <p>Email: {application.email}</p>
                    <p>Phone: {application.phone}</p>
                    <p>
                      Date: {new Date(application.date).toLocaleDateString()}
                    </p>
                    {application.portfolio && (
                      <a
                        href={application.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Portfolio / Profile
                      </a>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 leading-6 max-w-3xl whitespace-pre-wrap">
                    {application.message}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[180px]">
                  <select
                    value={application.status}
                    onChange={(event) =>
                      updateStatus(application._id, event.target.value)
                    }
                    className="px-4 py-2 border-2 border-gray-300 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black cursor-pointer bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeApplication(application._id)}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
