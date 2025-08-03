import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import DigioService from '../../services/DigioService';
import { Button } from '@/components/ui/button';

const IdCardUploader: React.FC = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        DigioService.validateFile(file);
        if (side === 'front') {
          setFrontImage(file);
        } else {
          setBackImage(file);
        }
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      setError('Please upload both front and back images');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await DigioService.analyzeIdCard(frontImage, backImage, {
        expected_ids: ["PAN"], // As per user request for PAN card
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze ID card');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFrontImage(null);
    setBackImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6" />
        ID Card OCR & Verification
      </h2>

      {!result && (
        <div className="space-y-6">
          {/* Front Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Front Side of ID Card *
            </label>
            <div className="flex items-center justify-center">
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {frontImage ? frontImage.name : 'Click to upload front image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Back Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Back Side of ID Card *
            </label>
            <div className="flex items-center justify-center">
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {backImage ? backImage.name : 'Click to upload back image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || !frontImage || !backImage}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              'Analyze ID Card'
            )}
          </Button>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className={`flex items-center gap-2 p-4 border rounded-lg ${result.details?.status ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {result.details?.status ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
            <span className={`font-medium ${result.details?.status ? 'text-green-700' : 'text-red-700'}`}>
              {result.details?.status ? 'ID Card Analyzed Successfully!' : 'Verification Failed'}
            </span>
          </div>

          {result.detections && result.detections.map((detection: any, index: number) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Detected ID: {detection.id_type}
              </h3>

              {detection.id_attributes && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(detection.id_attributes).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-800">{String(value)}</span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}

          <Button onClick={resetForm} className="w-full" variant="outline">
            Upload Another ID Card
          </Button>
        </div>
      )}
    </div>
  );
};

export default IdCardUploader;
