import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
// import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '@/api/axios';
import { Edit2, Trash2, Plus, Upload, ChevronDown, Search } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// ActionsCellRenderer as React component outside main component
const ActionsCellRenderer = (props: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => console.log('Edit row:', props.data);
  const handleDelete = () => console.log('Delete row:', props.data);

  return (
    <div
      className="flex items-center justify-end h-full pr-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="group relative p-1 rounded hover:bg-blue-100 transition-colors"
            title="Edit"
          >
            <Edit2 size={16} className="text-blue-600" />
          </button>
          <button
            onClick={handleDelete}
            className="group relative p-1 rounded hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
};

// ToggleRenderer as React component outside main component
const ToggleRenderer = (props: any) => {
  const handleToggle = () => console.log('Toggle active status:', props.data);
  const isActive = props.data.is_active || false;

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isActive ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isActive ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const CouponManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedAction, setSelectedAction] = useState('Bulk Actions');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dummy Data with usage_limit as string for consistency
  const dummyCoupons = [
    {
      coupon_id: 1,
      coupon_label: 'New Year Offer',
      coupon_code: 'NY2025',
      discount_value: 20,
      discount_type: 'percentage',
      start_date: '2025-01-01',
      expiry_date: '2025-12-31',
      is_active: true,
      description: 'Applicable for all products above ₹500',
      used_count: 10,
      usage_limit: '100',
    },
    {
      coupon_id: 2,
      coupon_label: 'Flat Discount',
      coupon_code: 'FLAT100',
      discount_value: 100,
      discount_type: 'fixed',
      start_date: '2025-02-01',
      expiry_date: null,
      is_active: false,
      description: 'Flat ₹100 off on orders above ₹1000',
      used_count: 5,
      usage_limit: 'Unlimited',
    },
    {
      coupon_id: 3,
      coupon_label: 'Summer Sale',
      coupon_code: 'SUMMER50',
      discount_value: 50,
      discount_type: 'percentage',
      start_date: '2025-04-01',
      expiry_date: '2025-06-30',
      is_active: true,
      description: '50% discount on summer collection',
      used_count: 30,
      usage_limit: '50',
    },
  ];

  // API Fetch commented
  /*
  const { data: rowData = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/coupons');
      return Array.isArray(res.data.data) ? res.data.data : res.data;
    },
  });
  */
  const rowData = dummyCoupons;

  // Column Definitions with cellRendererFramework for React components
  const columnDefs: ColDef[] = useMemo(
    () => [
-      { headerName: '', field: 'checkbox', width: 50, cellRendererFramework: CheckboxRenderer },
+      { headerName: '', checkboxSelection: true, width: 50 },
      { headerName: 'Coupon Label', field: 'coupon_label', width: 150 },
      {
        headerName: 'Coupon Code',
        field: 'coupon_code',
        width: 130,
        cellStyle: { color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' },
      },
      {
        headerName: 'Discount',
        field: 'discount_value',
        width: 140,
        valueFormatter: (params) =>
          params.data.discount_type === 'percentage'
            ? `${params.value}%`
            : `${params.value} INR`,
      },
      {
        headerName: 'Start Date',
        field: 'start_date',
        width: 120,
        valueFormatter: (params) =>
          params.value
            ? new Date(params.value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '',
      },
      {
        headerName: 'Expire Date',
        field: 'expiry_date',
        width: 120,
        valueFormatter: (params) =>
          params.value
            ? new Date(params.value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Unlimited',
        cellStyle: (params) => {
          if (params.value && new Date(params.value) < new Date()) {
            return { color: '#ef4444' };
          }
          if (!params.value) {
            // If expiry_date is null, treat as unlimited, no red color
            return null;
          }
          return null;
        },
      },
      { headerName: 'Active', field: 'is_active', width: 80, cellRenderer: ToggleRenderer },
      { headerName: 'Subscription', field: 'description', width: 200 },
      { headerName: 'Used', field: 'used_count', width: 80 },
      { headerName: 'Allowed Uses', field: 'usage_limit', width: 120 },
      { headerName: '', field: 'actions', width: 100, cellRenderer: ActionsCellRenderer },
    ],
    []
  );

  // Filtered Data
  const filteredData = useMemo(() => {
    if (!searchText) return rowData;
    return rowData.filter((row: any) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [rowData, searchText]);

  const handleBulkAction = () => {
    console.log('Bulk action:', selectedAction);
    setIsDropdownOpen(false);
  };

  const handleAddCoupon = () => console.log('Add new coupon');
  const handleBulkCreate = () => console.log('Bulk create coupons');

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
        <div className="flex gap-3">
          <button
            onClick={handleAddCoupon}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Coupon
          </button>
          <button
            onClick={handleBulkCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={16} />
            Bulk Create
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              {selectedAction}
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {['Delete Selected', 'Activate Selected', 'Deactivate Selected'].map((action) => (
                    <button
                      key={action}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedAction(action);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleBulkAction}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* AG-Grid Table */}
      <div className="ag-theme-alpine border border-gray-300 rounded-lg" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          pagination={true}
          paginationPageSize={10}
          domLayout="normal"
          suppressRowClickSelection={true}
          rowSelection="multiple"
          animateRows={true}
          getRowHeight={() => 60}
          getRowId={(params) => params.data.coupon_id.toString()}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          Showing 1 to {Math.min(10, rowData.length)} of {rowData.length} entries
        </div>
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select className="border border-gray-300 rounded px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries</span>
        </div>
      </div>
    </div>
  );
};

export default CouponManagement;
