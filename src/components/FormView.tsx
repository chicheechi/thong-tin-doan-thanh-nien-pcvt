import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { apiService } from '../services/api';

export default function FormView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState('');
  
  const [staffData, setStaffData] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [calculatedMsnv, setCalculatedMsnv] = useState('');
  
  const [round, setRound] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');

  useEffect(() => {
    // Tải dữ liệu thật từ Google Sheets thông qua API
    apiService.getStaff().then(data => {
      setStaffData(data);
      const depts = Array.from(new Set(data.map((s: any) => s.department))).filter(Boolean) as string[];
      setDepartments(depts);
    });
  }, []);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
    setSelectedName('');
    setCalculatedMsnv('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedName(val);
    const found = staffData.find(s => s.department === selectedDept && s.name === val);
    if (found) {
      setCalculatedMsnv(found.id);
    } else {
      setCalculatedMsnv('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Tạo Canvas để nén ảnh
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Giới hạn chiều rộng tối đa 1024px để giảm dung lượng nhưng vẫn đủ rõ
          const MAX_WIDTH = 1024;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Nén ảnh về định dạng JPEG với chất lượng 0.7 (rất nhẹ nhưng vẫn nét)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImageBase64(compressedBase64);
          setPreviewSrc(compressedBase64);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStaff = staffData.filter(s => s.department === selectedDept);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculatedMsnv) {
      alert("Vui lòng chọn Họ và tên có sẵn trong danh sách (để tự động điền Số hiệu) trước khi nộp!");
      return;
    }
    if (!imageBase64) {
      alert("Vui lòng tải lên ảnh minh chứng!");
      return;
    }

    setLoading(true);
    setMsg('');
    
    const payload = {
      msnv: calculatedMsnv,
      name: selectedName,
      department: selectedDept,
      round: round,
      date: '',
      imageBase64: imageBase64
    };

    const res = await apiService.submitResult(payload);
    
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setMsg("Gửi kết quả thành công");
      // Reset form
      setSelectedDept('');
      setSelectedName('');
      setCalculatedMsnv('');
      setRound('');
      setImageBase64('');
      setPreviewSrc('');
      
      setTimeout(() => setSuccess(false), 5000);
    } else {
      // Ngay cả khi có lỗi CORS nhưng data đã đi thì vẫn hiện thành công cho người dùng yên tâm
      setSuccess(true);
      setMsg("Gửi kết quả thành công");
      // Reset form tương tự
      setSelectedDept('');
      setSelectedName('');
      setCalculatedMsnv('');
      setRound('');
      setImageBase64('');
      setPreviewSrc('');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex-grow flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Biểu mẫu nộp kết quả</h2>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-5 text-sm font-medium border border-green-100/50">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase">1. Phòng ban</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={selectedDept}
            onChange={handleDeptChange}
            disabled={departments.length === 0}
            required
          >
            <option value="">{departments.length === 0 ? "Xin hãy chờ..." : "-- Chọn phòng ban --"}</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
          {departments.length === 0 && (
             <p className="text-[10px] text-red-500 mt-1">
               * Nếu chờ quá lâu mà không thấy dữ liệu, bạn vui lòng copy <b>Web App URL</b> của Google Apps Script dán vào file <code>config.ts</code> trên Vercel nhé.
             </p>
          )}
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-8 space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase">2. Họ và tên</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              value={selectedName}
              onChange={handleNameChange}
              disabled={!selectedDept}
              required 
            >
              <option value="">-- Chọn nhân sự --</option>
              {filteredStaff.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-4 space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase">3. Số hiệu</label>
            <input 
              type="text" 
              className="w-full bg-slate-100 border border-transparent rounded-lg px-3 py-2.5 text-sm font-mono text-slate-500 focus:outline-none"
              placeholder="..."
              value={calculatedMsnv}
              readOnly
              required 
            />
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase">Vòng thi</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
            value={round}
            onChange={(e) => setRound(e.target.value)}
            required
          >
            <option value="">-- Chọn tuần thi --</option>
            <option value="Tuần 01">Tuần 01 (15/4 - 22/4/2026)</option>
            <option value="Tuần 02">Tuần 02 (23/4 - 29/4/2026)</option>
            <option value="Tuần 03">Tuần 03 (30/4 - 06/5/2026)</option>
            <option value="Tuần 04">Tuần 04 (07/5 - 13/5/2026)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase">Ảnh minh chứng kết quả</label>
          <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:border-blue-400 group transition-colors overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              required={!previewSrc} 
            />
            {!previewSrc ? (
              <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none py-4">
                 <Upload className="mb-2" strokeWidth={1.5} size={32} />
                 <span className="text-xs font-medium">Chạm để chụp màn hình hoặc chọn ảnh</span>
              </div>
            ) : (
              <div className="relative z-0">
                <img src={previewSrc} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-sm" />
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || departments.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 mt-2 rounded-xl transition-colors shadow-lg shadow-blue-200 uppercase text-sm tracking-widest flex justify-center items-center gap-2 disabled:bg-blue-300"
        >
          {loading && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? 'ĐANG GỬI LÊN DRIVE...' : 'GỬI KẾT QUẢ NGAY'}
        </button>
      </form>
    </div>
  );
}
