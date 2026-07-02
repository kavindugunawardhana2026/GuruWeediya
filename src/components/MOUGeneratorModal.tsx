"use client";

import React, { useState, useRef } from "react";
import { X, FileText, Printer, Copy, Edit2 } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
}

export default function MOUGeneratorModal({ isOpen, onClose, teacherName }: Props) {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [split, setSplit] = useState("70/30");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = contentRef.current;
    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    if (windowPrint && printContent) {
      windowPrint.document.write(`
        <html>
          <head>
            <title>Memorandum of Understanding - ${teacherName}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; }
              h1 { text-align: center; border-bottom: 2px solid #111; padding-bottom: 10px; font-size: 24px; text-transform: uppercase; }
              h2 { margin-top: 30px; font-size: 18px; }
              p { margin-bottom: 15px; }
              .section { margin-bottom: 25px; }
              .footer { margin-top: 80px; display: flex; justify-content: space-between; gap: 40px; }
              .sig-box { flex: 1; }
              .sig-line { border-top: 1px solid #111; width: 100%; margin-top: 60px; padding-top: 10px; font-weight: bold; }
              .date { font-weight: bold; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      windowPrint.document.close();
      windowPrint.focus();
      // Use setTimeout to ensure styles are applied before print dialog opens
      setTimeout(() => {
        windowPrint.print();
        windowPrint.close();
      }, 250);
    }
  };

  const handleCopy = () => {
    if (contentRef.current) {
      navigator.clipboard.writeText(contentRef.current.innerText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            Tuition Agreement / MOU Generator
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {step === "form" ? (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <p className="text-sm text-slate-400">
                Fill out the basic terms to automatically generate a formalized Memorandum of Understanding for hiring <strong className="text-white">{teacherName}</strong>.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Revenue Split (Teacher / Institute)
                </label>
                <Input 
                  value={split} 
                  onChange={(e) => setSplit(e.target.value)} 
                  placeholder="e.g. 70/30, 80/20, 50/50" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Hall Location / Branch
                </label>
                <Input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="e.g. Nugegoda Main Hall, Online via Zoom" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Target Start Date
                </label>
                <Input 
                  type="date"
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-left-4 duration-300">
              {/* Preview Container - Looks like a document */}
              <div className="bg-white text-black p-8 rounded-lg shadow-inner max-w-full overflow-x-auto text-sm sm:text-base">
                <div ref={contentRef} className="document-content">
                  <h1>Memorandum of Understanding</h1>
                  <p className="date">Date: {new Date().toLocaleDateString()}</p>
                  
                  <div className="section">
                    <p>This Memorandum of Understanding (MOU) is made between the <strong>Educational Institute</strong> (hereinafter referred to as the "Institute") and <strong>{teacherName}</strong> (hereinafter referred to as the "Teacher").</p>
                  </div>

                  <div className="section">
                    <h2>1. Purpose</h2>
                    <p>The purpose of this MOU is to establish the terms and conditions under which the Teacher will conduct educational classes at the Institute.</p>
                  </div>

                  <div className="section">
                    <h2>2. Location & Schedule</h2>
                    <p>The classes will be primarily conducted at: <strong>{location || "[Location Not Specified]"}</strong>.</p>
                    <p>The agreed target start date for the classes is: <strong>{startDate ? new Date(startDate).toLocaleDateString() : "[Date Not Specified]"}</strong>.</p>
                  </div>

                  <div className="section">
                    <h2>3. Revenue Sharing</h2>
                    <p>Both parties agree to a revenue-sharing model for the tuition fees collected from students. The split will be <strong>{split}</strong> (Teacher / Institute respectively).</p>
                    <p>Payments will be settled at the end of each month unless otherwise agreed in writing.</p>
                  </div>

                  <div className="section">
                    <h2>4. Responsibilities</h2>
                    <p><strong>The Teacher</strong> agrees to provide high-quality education, arrive on time for scheduled classes, and prepare necessary study materials.</p>
                    <p><strong>The Institute</strong> agrees to provide the necessary facilities, manage student registrations, and handle fee collections.</p>
                  </div>

                  <div className="footer">
                    <div className="sig-box">
                      <div className="sig-line">Signature of Teacher</div>
                      <p>{teacherName}</p>
                    </div>
                    <div className="sig-box">
                      <div className="sig-line">Signature of Authorized Officer</div>
                      <p>For the Institute</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 flex justify-between items-center shrink-0 bg-slate-900/50">
          {step === "preview" ? (
            <>
              <Button variant="ghost" onClick={() => setStep("form")} leftIcon={<Edit2 className="h-4 w-4" />}>
                Edit Terms
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCopy} leftIcon={<Copy className="h-4 w-4" />}>
                  Copy Text
                </Button>
                <Button onClick={handlePrint} leftIcon={<Printer className="h-4 w-4" />}>
                  Print / Save PDF
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep("preview")} disabled={!location || !split || !startDate}>
                Generate Preview
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
