const fs = require('fs');
let code = fs.readFileSync('src/components/AdminModal.tsx', 'utf8');

const target = '{/* Font Style Toggle */}';
const insertion = `              {/* Logo Customization */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    웹사이트 로고 이미지 수정 (파일 첨부 가능)
                  </label>
                  {formConfig.logoUrl && (
                    <button
                      type="button"
                      onClick={() => handleConfigChange('logoUrl', '')}
                      className="text-[11px] text-rose-500 hover:underline"
                    >
                      기본 로고로 초기화
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="w-14 h-14 rounded-xl bg-white overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                    <img 
                      src={formConfig.logoUrl || IMAGES.logo} 
                      alt="Logo preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.src = IMAGES.logo; }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, (url) => handleConfigChange('logoUrl', url))}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="또는 이미지 URL 직접 입력"
                      value={formConfig.logoUrl || ''}
                      onChange={(e) => handleConfigChange('logoUrl', e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Font Style Toggle */}`;

if (code.includes(target) && !code.includes('웹사이트 로고 이미지 수정')) {
  code = code.replace(target, insertion);
  fs.writeFileSync('src/components/AdminModal.tsx', code, 'utf8');
  console.log('Successfully patched AdminModal.tsx');
} else {
  console.log('Target not found or already patched');
}
