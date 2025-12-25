import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../firebase/auth";
import toast from "react-hot-toast";


const ArtistDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Default tab = READ ONLY dashboard
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadType, setUploadType] = useState("link");

  const { register, handleSubmit, reset } = useForm();

  /* ---------------- Fetch Artist Content ---------------- */
  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["artist-contents", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/content?artistId=${user.uid}`
      );
      return res.data;
    },
  });

  /* ---------------- Upload Content ---------------- */
 const uploadMutation = useMutation({
  mutationFn: (data) =>
    axiosSecure.post("/api/content", {
      title: data.title,
      description: data.description,
      artistId: user.uid,
      artistName: user.email,
      contentType: uploadType,
      referenceLink: uploadType === "link" ? data.referenceLink : "",
      fileName: uploadType === "file" ? data.file?.[0]?.name : "",
      status: "Pending",
      metrics: [],
      createdAt: new Date(),
    }),
  onSuccess: () => {
    reset();
    queryClient.invalidateQueries({
      queryKey: ["artist-contents", user.uid],
    });
    toast.success("Content submitted successfully for review!");
    setActiveTab("overview");
  },
  onError: (error) => {
    console.error(error);
    toast.error("Failed to submit content: " + error.message);
  },
});

  /* ---------------- Helpers ---------------- */
  const getTotals = (metrics = []) =>
    metrics.reduce(
      (acc, m) => {
        acc.views += m.views || 0;
        acc.revenue += m.revenue || 0;
        return acc;
      },
      { views: 0, revenue: 0 }
    );

  if (isLoading)
    return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ================= Sidebar ================= */}
      <aside className="md:w-64 bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-6">Artist Dashboard</h2>

        <ul className="space-y-2">
          <li>
            <button
              className={`btn btn-sm w-full ${
                activeTab === "overview"
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Dashboard Overview
            </button>
          </li>

          <li>
            <button
              className={`btn btn-sm w-full ${
                activeTab === "upload"
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload Content
            </button>
          </li>
        </ul>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="flex-1 p-4 space-y-6">
        {/* ===== Overview (DEFAULT / READ-ONLY) ===== */}
        {activeTab === "overview" && (
          <section className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">
                My Submitted Content (Read Only)
              </h3>

              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Revenue ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contents.map((item) => {
                      const totals = getTotals(item.metrics);
                      return (
                        <tr key={item._id}>
                          <td>{item.title}</td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === "Pending"
                                  ? "badge-warning"
                                  : item.status === "Approved"
                                  ? "badge-info"
                                  : "badge-success"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td>{totals.views}</td>
                          <td>${totals.revenue}</td>
                        </tr>
                      );
                    })}

                    {contents.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-gray-500">
                          No content submitted yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ===== Upload Content ===== */}
        {activeTab === "upload" && (
          <section className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">
                Upload New Content
              </h3>

              <form
                onSubmit={handleSubmit((data) =>
                  uploadMutation.mutate(data)
                )}
                className="space-y-4"
              >
                <input
                  {...register("title", { required: true })}
                  placeholder="Title"
                  className="input input-bordered w-full"
                />

                <textarea
                  {...register("description", { required: true })}
                  placeholder="Description"
                  className="textarea textarea-bordered w-full"
                />

                {/* Upload Type */}
                <div className="flex gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      checked={uploadType === "link"}
                      onChange={() => setUploadType("link")}
                    />{" "}
                    Reference Link
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      checked={uploadType === "file"}
                      onChange={() => setUploadType("file")}
                    />{" "}
                    Upload File
                  </label>
                </div>

                {/* Reference Link */}
                {uploadType === "link" && (
                  <input
                    {...register("referenceLink", { required: true })}
                    placeholder="https://example.com"
                    className="input input-bordered w-full"
                  />
                )}

                {/* File Upload */}
                {uploadType === "file" && (
                  <input
                    type="file"
                    {...register("file", { required: true })}
                    className="file-input file-input-bordered w-full"
                  />
                )}

                <button
                  className="btn btn-primary w-full"
                  disabled={uploadMutation.isLoading}
                >
                  {uploadMutation.isLoading
                    ? "Submitting..."
                    : "Submit for Review"}
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ArtistDashboard;
