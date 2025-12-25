import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("queue");
  const [editingContent, setEditingContent] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  /* ---------------- Fetch Content ---------------- */
  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["contents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/content");
      return res.data;
    },
  });

  /* ---------------- Update Status ---------------- */
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/api/content/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      toast.success("Status updated successfully!");
    },
    onError: (err) => toast.error("Failed to update status: " + err.message),
  });

  /* ---------------- Edit Metadata ---------------- */
  const editMutation = useMutation({
    mutationFn: (data) =>
      axiosSecure.patch(`/api/content/${data._id}`, {
        title: data.title,
        description: data.description,
      }),
    onSuccess: () => {
      setEditingContent(null);
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      toast.success("Content updated successfully!");
    },
    onError: (err) => toast.error("Failed to update content: " + err.message),
  });

  /* ---------------- Metrics ---------------- */
  const metricsMutation = useMutation({
    mutationFn: (data) =>
      axiosSecure.patch(`/api/content/${data.contentId}/metrics`, {
        platform: data.platform,
        views: Number(data.views),
        revenue: Number(data.revenue),
        date: new Date().toISOString(), // add date for history
      }),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      toast.success("Metrics added successfully!");
    },
    onError: (err) => toast.error("Failed to add metrics: " + err.message),
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

  const revenueSummary = contents.reduce((acc, c) => {
    c.metrics?.forEach((m) => {
      acc[m.platform] = (acc[m.platform] || 0) + m.revenue;
    });
    return acc;
  }, {});

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-2">
          {[
            ["queue", "Approval Queue"],
            ["metrics", "Input Metrics"],
            ["summary", "Revenue Summary"],
          ].map(([key, label]) => (
            <li key={key}>
              <button
                className={`btn btn-sm w-full ${activeTab === key ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 space-y-6">
        {/* Approval Queue */}
        {activeTab === "queue" && (
          <section className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Content Approval Queue</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contents.map((item) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.artistName}</td>
                        <td>
                          <span className={`badge ${item.status === "Pending" ? "badge-warning" : item.status === "Approved" ? "badge-info" : "badge-success"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="space-x-1">
                          <button className="btn btn-xs btn-success" onClick={() => updateStatusMutation.mutate({ id: item._id, status: "Approved" })}>Approve</button>
                          <button className="btn btn-xs btn-info" onClick={() => updateStatusMutation.mutate({ id: item._id, status: "Uploaded" })}>Upload</button>
                          <button className="btn btn-xs btn-warning" onClick={() => setEditingContent(item)}>Edit</button>
                          <button className="btn btn-xs btn-error" onClick={() => updateStatusMutation.mutate({ id: item._id, status: "Archived" })}>Archive</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Edit Form */}
                {editingContent && (
                  <form
                    onSubmit={handleSubmit((data) => editMutation.mutate({ ...editingContent, ...data }))}
                    className="mt-4 space-y-2"
                  >
                    <input defaultValue={editingContent.title} {...register("title", { required: true })} className="input input-bordered w-full" />
                    <textarea defaultValue={editingContent.description} {...register("description", { required: true })} className="textarea textarea-bordered w-full" />
                    <div className="flex space-x-2">
                      <button className="btn btn-primary">Save Changes</button>
                      <button type="button" className="btn btn-ghost" onClick={() => setEditingContent(null)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Metrics Input */}
        {activeTab === "metrics" && (
          <section className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Manual Metrics Entry</h3>
              <form onSubmit={handleSubmit((data) => metricsMutation.mutate(data))} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="select select-bordered" {...register("contentId", { required: true })}>
                  <option value="">Select Content</option>
                  {contents.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
                <select className="select select-bordered" {...register("platform", { required: true })}>
                  <option value="">Platform</option>
                  <option>YouTube</option>
                  <option>Spotify</option>
                  <option>Platform A</option>
                  <option>Platform B</option>
                </select>
                <input type="number" placeholder="Views" className="input input-bordered" {...register("views", { required: true })} />
                <input type="number" placeholder="Revenue ($)" className="input input-bordered" {...register("revenue", { required: true })} />
                <button className="btn btn-primary md:col-span-2">Submit</button>
              </form>
            </div>
          </section>
        )}

        {/* Revenue Summary */}
        {activeTab === "summary" && (
          <section className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Platform Revenue Summary</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(revenueSummary).map(([platform, revenue]) => (
                    <tr key={platform}>
                      <td>{platform}</td>
                      <td>${revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
