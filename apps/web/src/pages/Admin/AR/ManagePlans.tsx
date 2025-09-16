import React, { useState } from "react";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { ColDef } from "ag-grid-community";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModalStore } from "@/stores/modal-store";
import { toast } from "sonner";

const PlanTypeRenderer = (params: any) => {
  const type = params.value || "Subscription";
  const typeColors = {
    Free: "bg-gray-100 text-gray-800",
    Subscription: "bg-blue-100 text-blue-800",
    Premium: "bg-purple-100 text-purple-800",
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || "bg-gray-100 text-gray-800"}`}>
      {type}
    </span>
  );
};

const PriceRenderer = (params: any) => {
  const amount = params.value;
  if (amount === 0 || amount === null || amount === undefined) {
    return <span className="text-green-600 font-medium">Free</span>;
  }
  return (
    <span className="font-medium">
      ₹{amount.toLocaleString()}
    </span>
  );
};

const ManagePlans = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<any[]>([]);
  const [form, setForm] = useState({
    plan_name: "",
    plan_type: "Subscription",
    price_amount: 0,
    currency: "INR",
    duration_months: 12,
    wp_role: "",
  });

  const queryClient = useQueryClient();
  
  const { data: plans } = useQuery({
    queryKey: [queryKeys.membership_plans],
    queryFn: () =>
      axiosInstance.get(endpoints.membershipPlans.base).then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (body: any) =>
      axiosInstance.post(endpoints.membershipPlans.base, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.membership_plans] }),
      toast.success("Plan created successfully");
      setShowForm(false);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to create plan");
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: (payload: { id: number | string; body: any }) =>
      axiosInstance.put(
        endpoints.membershipPlans.byId(payload.id),
        payload.body
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.membership_plans] }),
      toast.success("Plan updated successfully");
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) =>
      axiosInstance.delete(endpoints.membershipPlans.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.membership_plans] }),
      toast.success("Plan deleted successfully");
    },
  });

  const resetForm = () => {
    setForm({
      plan_name: "",
      plan_type: "Subscription",
      price_amount: 0,
      currency: "INR",
      duration_months: 12,
      wp_role: "",
    });
  };

  const columns: ColDef[] = [
    { 
      headerName: "Plan Name", 
      field: "plan_name",
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: "Plan Type",
      field: "plan_type",
      cellRenderer: PlanTypeRenderer,
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: "Price",
      field: "price_amount",
      cellRenderer: PriceRenderer,
      flex: 1,
      minWidth: 100,
    },
    { 
      headerName: "Currency", 
      field: "currency",
      width: 80,
    },
    { 
      headerName: "Duration", 
      field: "duration_months",
      valueFormatter: (params) => params.value ? `${params.value} months` : "",
      flex: 1,
      minWidth: 120,
    },
    { 
      headerName: "Members", 
      field: "members",
      width: 100,
    },
    { 
      headerName: "WP Role", 
      field: "wp_role",
      flex: 1,
      minWidth: 120,
    },
  ];

  const bulkActions = [
    {
      label: "Delete Selected",
      icon: <Trash2 className="h-4 w-4" />,
      action: (selected: any[]) => handleBulkDelete(selected),
      variant: "destructive" as const,
    },
  ];

  const handleEdit = (row: any) => {
    // Implementation for editing plans
    console.log("Edit plan:", row);
  };

  const handleDelete = (row: any) => {
    const setModalOpen = useModalStore.getState().set;
    const setModalProps = useModalStore.getState().setProps;
    
    setModalProps("confirm", {
      title: "Delete plan?",
      description: `This will permanently delete the plan "${row.plan_name}".`,
      confirmText: "Delete",
      cancelText: "Cancel",
      tone: "danger",
      onConfirm: () => {
        deleteMutation.mutate(row.plan_id);
        setModalOpen("confirm", false);
        setModalProps("confirm", undefined);
      },
      onCancel: () => {
        setModalProps("confirm", undefined);
      },
    });
    setModalOpen("confirm", true);
  };

  const handleBulkDelete = (selected: any[]) => {
    const setModalOpen = useModalStore.getState().set;
    const setModalProps = useModalStore.getState().setProps;
    
    setModalProps("confirm", {
      title: `Delete ${selected.length} plans?`,
      description: "This action cannot be undone.",
      confirmText: "Delete All",
      cancelText: "Cancel",
      tone: "danger",
      onConfirm: async () => {
        try {
          await Promise.all(selected.map(plan => 
            axiosInstance.delete(endpoints.membershipPlans.byId(plan.plan_id))
          ));
          queryClient.invalidateQueries({ queryKey: [queryKeys.membership_plans] });
          toast.success(`${selected.length} plans deleted successfully`);
        } catch (error) {
          toast.error("Failed to delete some plans");
        } finally {
          setModalOpen("confirm", false);
          setModalProps("confirm", undefined);
        }
      },
      onCancel: () => {
        setModalProps("confirm", undefined);
      },
    });
    setModalOpen("confirm", true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Membership Plans
          </h1>
          <p className="text-muted-foreground">
            Create and manage subscription plans
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Plan</span>
        </Button>
      </div>

      {/* Add Plan Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Create New Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="plan_name">Plan Name</Label>
                  <Input
                    id="plan_name"
                    value={form.plan_name}
                    onChange={(e) => setForm({ ...form, plan_name: e.target.value })}
                    placeholder="Enter plan name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="plan_type">Plan Type</Label>
                  <select
                    id="plan_type"
                    value={form.plan_type}
                    onChange={(e) => setForm({ ...form, plan_type: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Free">Free</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="price_amount">Price Amount</Label>
                  <Input
                    id="price_amount"
                    type="number"
                    value={form.price_amount}
                    onChange={(e) => setForm({ ...form, price_amount: Number(e.target.value) })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="duration_months">Duration (Months)</Label>
                  <Input
                    id="duration_months"
                    type="number"
                    value={form.duration_months}
                    onChange={(e) => setForm({ ...form, duration_months: Number(e.target.value) })}
                    placeholder="12"
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="wp_role">WP Role</Label>
                  <Input
                    id="wp_role"
                    value={form.wp_role}
                    onChange={(e) => setForm({ ...form, wp_role: e.target.value })}
                    placeholder="subscriber"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <DataTable
        data={plans || []}
        columns={columns}
        loading={loading}
        onSelectionChange={setSelectedPlans}
        onEdit={handleEdit}
        onDelete={handleDelete}
        bulkActions={bulkActions}
        searchPlaceholder="Search plans by name or type..."
        title="Membership Plans"
        description={`${plans?.length || 0} total plans`}
      />
    </div>
  );
};

export default ManagePlans;

            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add New Plan
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-end">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {showForm && (
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Plan Name"
                value={form.plan_name}
                onChange={(e) =>
                  setForm({ ...form, plan_name: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Plan Type"
                value={form.plan_type}
                onChange={(e) =>
                  setForm({ ...form, plan_type: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Price Amount"
                type="number"
                value={form.price_amount}
                onChange={(e) =>
                  setForm({ ...form, price_amount: Number(e.target.value) })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Currency"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
              <input
                className="border p-2 rounded"
                placeholder="Duration (months)"
                type="number"
                value={form.duration_months}
                onChange={(e) =>
                  setForm({ ...form, duration_months: Number(e.target.value) })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="WP Role"
                value={form.wp_role}
                onChange={(e) => setForm({ ...form, wp_role: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={createPlan}
              >
                Save Plan
              </button>
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div
          className="p-1 ag-theme-alpine"
          style={{ height: 400, width: "100%" }}
        >
          <AgGridReact
            theme="legacy"
            ref={gridRef}
            rowData={plans}
            columnDefs={colDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              flex: 1,
            }}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50, 100]}
            onGridReady={onGridReady}
            context={{ openEdit, deletePlan }}
          />
        </div>
        <EditRowModal
          open={editOpen}
          title="Edit Plan"
          fields={[
            { name: "plan_name", label: "Plan Name" },
            { name: "plan_type", label: "Plan Type" },
            { name: "price_amount", label: "Price Amount", type: "number" },
            { name: "currency", label: "Currency" },
            {
              name: "duration_months",
              label: "Duration (months)",
              type: "number",
            },
            { name: "wp_role", label: "WP Role" },
          ]}
          initialValues={editRow}
          onClose={() => setEditOpen(false)}
          onSave={saveEdit}
          saving={updateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default MembershipPlans;
