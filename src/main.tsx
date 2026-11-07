import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lỗi ứng dụng được bắt bởi ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen min-h-[100dvh] w-full bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-950">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
              🛶
            </div>
            <h2 className="text-xl font-black text-amber-300 tracking-wide">
              CHUYẾN ĐÒ GỌI TÊN
            </h2>
            <p className="text-xs text-amber-200/80 font-semibold">
              Trường THCS & THPT Long Hiệp • Lớp 12.2
            </p>
            <p className="text-sm text-slate-300">
              Ứng dụng phát hiện sự cố hiển thị trên thiết bị của thầy/cô.
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-red-500/30 text-red-300 text-xs text-left font-mono overflow-auto max-h-32">
              {this.state.error?.message || 'Lỗi không xác định'}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition cursor-pointer"
              >
                Tải lại trang
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                className="py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-95 transition cursor-pointer"
              >
                Đặt lại bộ nhớ
              </button>
            </div>
            <p className="text-[11px] text-amber-200/60 pt-3 border-t border-slate-800/80">
              Bản quyền: Trầm Thanh Tuấn - GV trường THCS và THPT Long Hiệp
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.dataset.mounted = 'true';
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
