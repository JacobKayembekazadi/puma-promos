
import React, { useCallback, useState } from 'react';
import type { QuoteFormData } from '../../types';
import { PLACEMENT_OPTIONS } from '../../constants';
import Button from '../ui/Button';

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

interface Step3Props {
  data: QuoteFormData; updateData: (data: Partial<QuoteFormData>) => void; nextStep: () => void; prevStep: () => void;
}

const Step3Branding: React.FC<Step3Props> = ({ data, updateData, nextStep, prevStep }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      if (data.logoPreview) URL.revokeObjectURL(data.logoPreview);
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      updateData({ logoFile: file, logoPreview: previewUrl });
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }, [data.logoPreview]);
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, enter: boolean) => { e.preventDefault(); e.stopPropagation(); setIsDragging(enter); };

  const handlePlacementChange = (placement: string) => {
    const newPlacements = data.logoPlacement.includes(placement) ? data.logoPlacement.filter((p) => p !== placement) : [...data.logoPlacement, placement];
    updateData({ logoPlacement: newPlacements });
  };
  
  const removeLogo = () => { if(data.logoPreview) URL.revokeObjectURL(data.logoPreview); updateData({ logoFile: null, logoPreview: '' }); }

  return (
    <div className="space-y-6">
      <div>
        <label className="font-medium text-text-primary block mb-2">Upload Your Logo (Optional)</label>
        <div 
          onDrop={handleDrop} onDragOver={(e) => handleDragEvents(e, false)}
          onDragEnter={(e) => handleDragEvents(e, true)} onDragLeave={(e) => handleDragEvents(e, false)}
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center cursor-pointer bg-background-secondary
          ${isDragging ? 'border-accent' : 'border-border'}`}
        >
          <input type="file" onChange={(e) => handleFileChange(e.target.files)} accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
          {data.logoPreview ? (
            <div className="relative bg-black/20 p-2 rounded">
              <img src={data.logoPreview} alt="Logo preview" className="max-h-24 mx-auto"/>
              <button onClick={removeLogo} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 border border-white hover:bg-white hover:text-black"><TrashIcon /></button>
            </div>
          ) : (
            <>
              <UploadIcon className="text-text-secondary"/>
              <p className="mt-2 font-medium">Upload a file or drag and drop</p>
              <p className="text-sm text-text-secondary">PNG, JPG, PDF up to 10MB</p>
            </>
          )}
        </div>
      </div>
      <div>
        <label className="font-medium text-text-primary block mb-2">Brand Colors (Optional)</label>
        <input
          type="text" placeholder="e.g., Navy Blue, Gold" value={data.brandColors}
          onChange={(e) => updateData({ brandColors: e.target.value })}
          className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent"
        />
      </div>
      <div>
        <label className="font-medium text-text-primary block mb-2">Preferred Logo Placement</label>
        <div className="grid grid-cols-2 gap-4">
          {PLACEMENT_OPTIONS.map(opt => (
             <label key={opt} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${data.logoPlacement.includes(opt) ? 'bg-accent/10 border-accent' : 'border-border bg-background-secondary hover:border-hover'}`}>
              <input type="checkbox" checked={data.logoPlacement.includes(opt)} onChange={() => handlePlacementChange(opt)} className="h-4 w-4 rounded border-border bg-background-secondary text-accent focus:ring-accent" />
              <span className="ml-3 text-sm text-text-primary">{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={prevStep}>← Back</Button>
        <Button onClick={nextStep}>Continue →</Button>
      </div>
    </div>
  );
};

export default Step3Branding;
