import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { redFlagApi } from "@/api/red-flag-api";
import { uploadFile } from "@/api/files-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Plus, Trash2 } from "lucide-react";
import { RED_FLAG_QUESTIONS, type RedFlagQuestionKey } from "@/config/redFlagQuestions";
// Remove unused ConfirmationModal and modal-store imports, matching WebinarManagement.tsx approach

const getQuestionLabel = (key: string) =>
  (RED_FLAG_QUESTIONS as Partial<Record<RedFlagQuestionKey, { name: string }>>)[
    key as RedFlagQuestionKey
  ]?.name ?? key;

const RedFlagAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<RedFlagCompanyStats[]>([]);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    id: string | null;
    name: string | null;
  }>({ open: false, id: null, name: null });

  const load = async () => {
    setLoading(true);
    try {
      const data = await redFlagApi.admin.getStats();
      setStats(data);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    const name = newCompanyName.trim();
    if (!name) return;
    try {
      let logoUrl: string | undefined;
      if (logoFile) {
        setUploadingLogo(true);
        const formData = new FormData();
        formData.append("file", logoFile);
        formData.append("category", "image");
        formData.append("dir", "red-flag-companies");
        const res = await uploadFile(formData);
        const url = res.data?.url as string | undefined;
        if (!url) {
          toast.error("Upload did not return a URL");
          return;
        }
        logoUrl = url;
      }
      await redFlagApi.admin.createCompany({
        name,
        ...(logoUrl ? { logo_url: logoUrl } : {}),
      });
      toast.success("Company created");
      setNewCompanyName("");
      setLogoFile(null);
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
      }
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to create company");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleConfirmDelete = (id: string, name: string) => {
    setConfirmState({ open: true, id, name });
  };

  const handleDelete = async () => {
    if (!confirmState.id || !confirmState.name) return;
    setDeletingId(confirmState.id);
    try {
      await redFlagApi.admin.deleteCompany(confirmState.id);
      toast.success("Company deleted");
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to delete company");
    } finally {
      setDeletingId(null);
      setConfirmState({ open: false, id: null, name: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmState({ open: false, id: null, name: null });
  };

  const rows = useMemo(() => {
    return [...stats].sort((a, b) =>
      a.company.name.localeCompare(b.company.name)
    );
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Confirmation Modal, matching WebinarManagement style */}
      {confirmState.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">
              Delete {confirmState.name}?
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the company "{confirmState.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={handleCancelDelete}
                disabled={deletingId === confirmState.id}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deletingId === confirmState.id}
                className="hover:bg-red-600 hover:text-white"
              >
                {deletingId === confirmState.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Red Flag Analytics</h1>
          <p className="text-muted-foreground">
            Company-wise flagged questions and unique user frequency
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={load}
          disabled={loading}
          className="text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4 text-white" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Company</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="flex gap-2 flex-wrap items-end">
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label htmlFor="red-flag-company-name">Company name</Label>
                <Input
                  id="red-flag-company-name"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. PB Fintech"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="red-flag-company-logo">Logo (optional)</Label>
                <Input
                  id="red-flag-company-logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="cursor-pointer max-w-[240px]"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setLogoFile(f);
                    setLogoPreview((prev) => {
                      if (prev) URL.revokeObjectURL(prev);
                      return f ? URL.createObjectURL(f) : null;
                    });
                  }}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={
                  !newCompanyName.trim() || uploadingLogo || loading
                }
              >
                <Plus className="mr-2 h-4 w-4" />{" "}
                {uploadingLogo ? "Uploading…" : "Add"}
              </Button>
            </div>
            {logoPreview ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Preview:</span>
                <img
                  src={logoPreview}
                  alt=""
                  className="h-10 w-10 rounded object-contain border bg-muted"
                />
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Flagged Questions</TableHead>
                <TableHead className="text-right">Users Frequency</TableHead>
                <TableHead className="text-center" style={{ width: 80 }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    {loading ? "Loading..." : "No companies found"}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.company.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {r.company.logo_url ? (
                          <img
                            src={r.company.logo_url}
                            alt=""
                            className="h-9 w-9 rounded object-contain border bg-muted shrink-0"
                          />
                        ) : null}
                        <span>{r.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {r.flaggedQuestions.length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <div className="space-y-1">
                          {r.flaggedQuestions.map((fq) => (
                            <div key={fq.key} className="flex items-start gap-2">
                              <span className="text-sm">{getQuestionLabel(fq.key)}</span>
                              <span className="text-sm text-muted-foreground">
                                — {fq.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{r.usersFrequency}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={deletingId === r.company.id || loading}
                        onClick={() => handleConfirmDelete(r.company.id, r.company.name)}
                        aria-label="Delete company"
                        className=""
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedFlagAnalytics;
