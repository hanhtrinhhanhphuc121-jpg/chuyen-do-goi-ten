import React, { useState } from 'react';
import { X, Trash2, Copy, Check, Download, History, Search } from 'lucide-react';
import { CallHistoryItem } from '../types/game';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CallHistoryItem[];
  onClearHistory: () => void;
  className: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) =>
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    const text = history
      .map((item, index) => `${index + 1}. ${item.studentName} (${item.calledAt}) - ${item.className}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = [
      `LỊCH SỬ GỌI TÊN - CHUYẾN ĐÒ TRI THỨC`,
      `Lớp: ${className}`,
      `Thời gian xuất: ${new Date().toLocaleString('vi-VN')}`,
      `----------------------------------------`,
      ...history.map(
        (item, index) =>
          `${index + 1}. ${item.studentName} | Lượt: ${item.roundNumber} | Thời gian: ${item.calledAt}`
      ),
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lich-su-goi-ten-${className.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 rounded-3xl border-2 border-amber-400/50 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-900 to-emerald-900 border-b border-amber-400/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Lịch Sử Gọi Tên</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {history.length} lượt
                </span>
              </h2>
              <p className="text-xs text-emerald-200/80">{className}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Copy, Download, Clear */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/60">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên học sinh trong lịch sử..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              disabled={history.length === 0}
              className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
              title="Sao chép toàn bộ danh sách"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={history.length === 0}
              className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-sky-600/30 hover:bg-sky-600/40 text-sky-200 border border-sky-400/30 flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
              title="Tải về file văn bản TXT"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Thầy/Cô có chắc chắn muốn xóa toàn bộ lịch sử gọi tên không?')) {
                  onClearHistory();
                }
              }}
              disabled={history.length === 0}
              className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
              title="Xóa toàn bộ lịch sử"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        {/* List Table Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-medium">Chưa có lượt gọi tên nào được ghi lại.</p>
              <p className="text-xs text-slate-500">
                Hãy nhấn "BẮT ĐẦU" trên Chuyến Đò để ghi nhận những học sinh đầu tiên!
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Không tìm thấy học sinh phù hợp với từ khóa "{searchTerm}".
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredHistory.map((item, index) => {
                const globalIndex = history.length - index;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/30">
                        #{globalIndex}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{item.studentName}</div>
                        <div className="text-[11px] text-slate-400">
                          Lượt quay {item.roundNumber} • {item.calledAt}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Đã gọi
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900 border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
