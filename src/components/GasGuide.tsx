import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
// Import raw text files using Vite query parameter ?raw
import codeGsStr from '../../GoogleAppsScript/Code.gs?raw';
import indexHtmlStr from '../../GoogleAppsScript/Index.html?raw';

export default function GasGuide() {
  const [copiedGs, setCopiedGs] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleCopy = (text: string, type: 'gs' | 'html') => {
    navigator.clipboard.writeText(text);
    if (type === 'gs') {
      setCopiedGs(true);
      setTimeout(() => setCopiedGs(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex-grow flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <Terminal size={16} className="text-blue-600" />
        <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Mã nguồn triển khai</h2>
      </div>
      <p className="text-[11px] text-slate-500 mb-5 font-medium leading-relaxed">
        Để hệ thống đồng bộ thẳng kết quả về Sheet <code className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-blue-600 font-mono text-[10px]">17MgncO6...1Qw</code>,
        vui lòng sao chép 2 khối mã nguồn này và dán vào <strong className="text-slate-700">Tiện ích mở rộng &gt; Apps Script</strong> của bảng tính đó.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-w-0">
        
        {/* Code.gs */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0f172a] shadow-lg flex flex-col min-w-0">
          <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50"></div>
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-300 ml-2 uppercase tracking-widest">Code.gs</span>
            </div>
            <button 
              onClick={() => handleCopy(codeGsStr, 'gs')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors px-2.5 py-1 rounded border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider"
            >
              {copiedGs ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copiedGs ? 'ĐÃ COPY' : 'COPY'}
            </button>
          </div>
          <div className="overflow-auto h-72 p-4 bg-[#0f172a]">
            <pre className="font-mono text-[11px] leading-relaxed text-slate-300 m-0 w-full whitespace-pre-wrap break-all">
              <code>{codeGsStr}</code>
            </pre>
          </div>
        </div>

        {/* Index.html */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0f172a] shadow-lg flex flex-col min-w-0">
          <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50"></div>
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-300 ml-2 uppercase tracking-widest">Index.html</span>
            </div>
            <button 
              onClick={() => handleCopy(indexHtmlStr, 'html')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors px-2.5 py-1 rounded border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider"
            >
              {copiedHtml ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copiedHtml ? 'ĐÃ COPY' : 'COPY'}
            </button>
          </div>
          <div className="overflow-auto h-72 p-4 bg-[#0f172a]">
            <pre className="font-mono text-[11px] leading-relaxed text-slate-300 m-0 w-full whitespace-pre-wrap break-all">
              <code>{indexHtmlStr}</code>
            </pre>
          </div>
        </div>
      </div>
      
      <div className="mt-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-3">Các bước cài đặt</h4>
        <ol className="list-decimal pl-5 space-y-2 text-[11px] font-medium text-slate-600">
          <li>Mở Google Sheet của bạn, chọn <strong className="text-slate-800">Tiện ích mở rộng &gt; Apps Script</strong>.</li>
          <li>Xóa nội dung file <code>Code.gs</code> mặc định và dán toàn bộ đoạn mã <strong className="text-slate-800">Code.gs</strong> ở trên vào.</li>
          <li>Nhấn dấu <strong>+</strong> để tạo tệp HTML mới, đặt tên chính xác là <strong className="text-blue-600">Index</strong> (chữ I viết in hoa), sau đó dán mã <strong className="text-slate-800">Index.html</strong> ở trên vào.</li>
          <li>Nhấn <strong className="text-slate-800">Triển khai (Deploy) &gt; Tùy chọn triển khai mới (New deployment)</strong>.</li>
          <li>Chọn loại <strong>Web app</strong>, Cấp quyền truy cập <strong>Bất kỳ ai (Anyone)</strong>, và nhấn Deploy. (Tiếp tục cấp quyền truy cập Drive nếu được hỏi).</li>
        </ol>
      </div>
    </div>
  );
}
