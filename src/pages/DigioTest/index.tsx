import React, { useState } from "react";
import { FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import DigioService from "../../services/DigioService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IdCardType =
  | "PAN"
  | "PASSPORT"
  | "VOTER_ID"
  | "DRIVING_LICENSE"
  | "CIN"
  | "DIN"
  | "UAADHAAR"
  | "UDYAMAADHAAR"
  | "FSSAI"
  | "GST"
  | "GST_ADVANCED"
  | "PAN_TO_GST";

const idCardTypes: IdCardType[] = [
  "PAN",
  "PASSPORT",
  "VOTER_ID",
  "DRIVING_LICENSE",
  "CIN",
  "DIN",
  "UAADHAAR",
  "UDYAMAADHAAR",
  "FSSAI",
  "GST",
  "GST_ADVANCED",
  "PAN_TO_GST",
];

const IdCardFetcher: React.FC = () => {
  const [idCardType, setIdCardType] = useState<IdCardType>("PAN");
  const [idNo, setIdNo] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNo) {
      setError("ID Number is required");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params: any = { id_no: idNo };
      if (name) params.name = name;
      if (dob) params.dob = dob;
      // if (fileNo && idCardType === 'PASSPORT') params.file_no = fileNo;

      const response = await DigioService.fetchIdData(idCardType, params);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch ID card data");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIdCardType("PAN");
    setIdNo("");
    setName("");
    setDob("");
    setFileNo("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6" />
        Fetch ID Card Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="idCardType">ID Card Type *</Label>
          <Select
            onValueChange={(value: IdCardType) => setIdCardType(value)}
            defaultValue={idCardType}
          >
            <SelectTrigger id="idCardType">
              <SelectValue placeholder="Select ID Card Type" />
            </SelectTrigger>
            <SelectContent>
              {idCardTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="idNo">ID Number *</Label>
          <Input
            id="idNo"
            value={idNo}
            onChange={(e) => setIdNo(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="name">Name (as per ID Card)</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth (YYYY-MM-DD)</Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        {idCardType === "PASSPORT" && (
          <div>
            <Label htmlFor="fileNo">File Number (for Passport)</Label>
            <Input
              id="fileNo"
              value={fileNo}
              onChange={(e) => setFileNo(e.target.value)}
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Fetching...
            </>
          ) : (
            "Fetch Details"
          )}
        </Button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <div
            className={`flex items-center gap-2 p-4 border rounded-lg bg-green-50 border-green-200`}
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className={`font-medium text-green-700`}>
              Data Fetched Successfully!
            </span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Fetched Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-800">{String(value)}</span>
                    </div>
                  )
              )}
            </div>
          </div>

          <Button onClick={resetForm} className="w-full" variant="outline">
            Fetch Another ID
          </Button>
        </div>
      )}
    </div>
  );
};

export default IdCardFetcher;
