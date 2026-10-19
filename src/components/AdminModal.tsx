import React, { useState } from 'react';
import { 
  X, 
  Inbox, 
  Image as ImageIcon, 
  FileText, 
  Palette, 
  Globe, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save,
  Check
} from 'lucide-react';
import { SiteConfig, PortfolioItem, QuoteRequest } from '../types';
import { IMAGES } from '../assets/images';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onSaveConfig: (updatedConfig: SiteConfig) => void;
  onResetConfig: () => void;
  portfolio: PortfolioItem[];
  onAddPortfolio: (newItem: PortfolioItem) => void;
  onDeletePortfolio: (id: string) => void;
  quotes: QuoteRequest[];
  onUpdateQuoteStatus: (id: string, status: QuoteRequest['status']) => void;
  onDeleteQuote: (id: string) => void;
  onClearQuotes: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetConfig,
  portfolio,
  onAddPortfolio,
  onDeletePortfolio,
  quotes,
  onUpdateQuoteStatus,
  onDeleteQuote,
  onClearQuotes
}) => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'portfolio' | 'content' | 'theme' | 'seo'>('quotes');
  const [formConfig, setFormConfig] = useState<SiteConfig>({ ...config });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Portfolio Form State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PortfolioItem['category']>('에어컨 정밀세척');
  const [newLocation, setNewLocation] = useState('');
  const [newBeforeImg, setNewBeforeImg] = useState(IMAGES.acDetail);
  const [newAfterImg, setNewAfterImg] = useState(IMAGES.hero);
  const [newDesc, setNewDesc] = useState('');
  const [newHighlights, setNewHighlights] = useState('송풍팬 정밀 분해 세척, 고압 제트 세척, 피톤치드 코팅');

  if (!isOpen) return null;

  const handleConfigChange = (key: keyof SiteConfig, value: string) => {
    const updated = { ...formConfig, [key]: value };
    setFormConfig(updated);
  };

  const handleSaveConfig = () => {
    onSaveConfig(formConfig);
    setSaveSuccessMsg('설정이 성공적으로 저장 및 반영되었습니다.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: PortfolioItem = {
      id: `case-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      location: newLocation.trim() || '전북 익산/전주/군산',
      beforeImage: newBeforeImg.trim(),
      afterImage: newAfterImg.trim(),
      description: newDesc.trim() || '도지클린시스템 전문 엔지니어의 정밀 분해 세척 및 제빙기 고온스팀 살균 시공.',
      highlights: newHighlights.split(',').map(s => s.trim()).filter(Boolean),
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    };

    onAddPortfolio(newItem);
    setNewTitle('');
    setNewLocation('');
    setNewDesc('');
    setIsAddingProject(false);
  };

  const colorPresets = [
    { label: '로열 블루 (기본)', value: '#0062FF' },
    { label: '오션 네이비', value: '#0F4C81' },
    { label: '딥 에메랄드', value: '#059669' },
    { label: '인디고 프리미엄', value: '#4F46E5' },
    { label: '클린 시안', value: '#0284C7' },
    { label: '차콜 블랙', value: '#0F172A' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow"
              style={{ backgroundColor: formConfig.primaryColor }}
            >
              D
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                도지클린시스템 관리자 대시보드
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                  LIVE EDIT
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                실시간 콘텐츠 편집, 갤러리 등록, 테마 커스터마이징 및 온라인 견적 관리
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="관리자 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50 gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>견적/예약 접수</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-100 text-blue-700">
              {quotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>시공 갤러리 관리</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-200 text-slate-700">
              {portfolio.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>메인 카피 & 연락처</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>테마 & 포인트 컬러</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>SEO & 소셜 링크</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* TAB 1: QUOTES MANAGEMENT */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    실시간 온라인 접수 견적 목록 ({quotes.length}건)
                  </h3>
                  <p className="text-xs text-slate-500">
                    고객이 웹사이트에서 신청한 견적 내역이 브라우저 로컬 데이터베이스에 실시간 기록됩니다.
                  </p>
                </div>
                {quotes.length > 0 && (
                  <button
                    onClick={onClearQuotes}
                    className="text-xs text-slate-400 hover:text-red-600 transition-colors self-start sm:self-auto"
                  >
                    목록 초기화
                  </button>
                )}
              </div>

              {quotes.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm">
                  접수된 견적 문의가 없습니다. 웹사이트에서 견적을 신청하면 즉시 여기에 표시됩니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {quote.id}
                          </span>
                          <span className="font-bold text-sm text-slate-900">
                            {quote.customerName}
                          </span>
                          <span className="text-xs text-slate-500">· {quote.spaceType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={quote.status}
                            onChange={(e) => onUpdateQuoteStatus(quote.id, e.target.value as QuoteRequest['status'])}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              quote.status === '신규접수'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : quote.status === '상담완료'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : quote.status === '예약확정'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            <option value="신규접수">신규접수</option>
                            <option value="상담완료">상담완료</option>
                            <option value="예약확정">예약확정</option>
                            <option value="시공완료">시공완료</option>
                          </select>
                          <button
                            onClick={() => onDeleteQuote(quote.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-xl">
                        <div>
                          <span className="text-slate-400 font-medium">연락처:</span>{' '}
                          <a href={`tel:${quote.phone}`} className="font-semibold text-blue-600 hover:underline">
                            {quote.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">희망일:</span>{' '}
                          <span className="font-semibold text-slate-800">{quote.preferredDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">시공지역:</span>{' '}
                          <span className="font-semibold text-slate-800">{quote.region}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                        <div>
                          <span className="font-semibold text-slate-800">항목:</span> {quote.serviceType}
                          {quote.notes && (
                            <span className="text-slate-500 ml-2">({quote.notes})</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          접수시간: {quote.createdAt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PORTFOLIO MANAGEMENT */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Before & After 시공 사례 등록/관리
                  </h3>
                  <p className="text-xs text-slate-500">
                    새로운 세척 시공 사례를 등록하면 메인 화면의 인터랙티브 갤러리에 즉시 반영됩니다.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingProject(!isAddingProject)}
                  className="px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                  style={{ backgroundColor: formConfig.primaryColor }}
                >
                  <Plus className="w-4 h-4" />
                  <span>새 시공 사례 등록</span>
                </button>
              </div>

              {/* Add Project Form */}
              {isAddingProject && (
                <form onSubmit={handleCreatePortfolio} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4">
                  <div className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                    신규 시공 포트폴리오 등록
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">제목 *</label>
                      <input
                        type="text"
                        placeholder="예: 마포구 대형 카페 제빙기 200kg 고온스팀 살균"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">카테고리 *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as PortfolioItem['category'])}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="에어컨 정밀세척">에어컨 정밀세척</option>
                        <option value="업소용 제빙기">업소용 제빙기</option>
                        <option value="시스템/기업">시스템/기업</option>
                        <option value="가정용 토탈케어">가정용 토탈케어</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">시공 장소/지역</label>
                      <input
                        type="text"
                        placeholder="예: 전북 익산시 영등동 / 전주시 완산구"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">시공 핵심 포인트 (쉼표 구분)</label>
                      <input
                        type="text"
                        placeholder="송풍팬 분해 세척, 고압 제트 세척, 피톤치드 코팅"
                        value={newHighlights}
                        onChange={(e) => setNewHighlights(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Before 이미지 경로/URL</label>
                      <input
                        type="text"
                        value={newBeforeImg}
                        onChange={(e) => setNewBeforeImg(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">After 이미지 경로/URL</label>
                      <input
                        type="text"
                        value={newAfterImg}
                        onChange={(e) => setNewAfterImg(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">상세 시공 설명</label>
                    <textarea
                      rows={2}
                      placeholder="시공 전 오염 상태와 세척 후 개선된 점을 설명해주세요."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm"
                      style={{ backgroundColor: formConfig.primaryColor }}
                    >
                      사례 등록 완료
                    </button>
                  </div>
                </form>
              )}

              {/* Portfolio Items List */}
              <div className="space-y-3">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={item.afterImage}
                          onError={(e) => { e.currentTarget.src = '/images/ac_detail.jpg'; }}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{item.location}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeletePortfolio(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors shrink-0"
                      title="사례 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT CUSTOMIZATION */}
          {activeTab === 'content' && (
            <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  메인 카피 및 비즈니스 연락처 실시간 수정
                </h3>
                <p className="text-xs text-slate-500">
                  수정 후 '설정 저장' 버튼을 누르면 메인 웹사이트에 실시간으로 즉시 반영됩니다.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">웹사이트 브랜드 상호명</label>
                <input
                  type="text"
                  value={formConfig.brandName}
                  onChange={(e) => handleConfigChange('brandName', e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">히어로 메인 헤드카피</label>
                <input
                  type="text"
                  value={formConfig.heroTitle}
                  onChange={(e) => handleConfigChange('heroTitle', e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">히어로 서브 설명 문구</label>
                <textarea
                  rows={2}
                  value={formConfig.heroSubtitle}
                  onChange={(e) => handleConfigChange('heroSubtitle', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">대표 고객센터 전화번호</label>
                  <input
                    type="text"
                    value={formConfig.primaryPhone}
                    onChange={(e) => handleConfigChange('primaryPhone', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">직통 엔지니어 연락처</label>
                  <input
                    type="text"
                    value={formConfig.secondaryPhone}
                    onChange={(e) => handleConfigChange('secondaryPhone', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">운영 시간 표기</label>
                  <input
                    type="text"
                    value={formConfig.operatingHours}
                    onChange={(e) => handleConfigChange('operatingHours', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">사업장 주소</label>
                  <input
                    type="text"
                    value={formConfig.companyAddress}
                    onChange={(e) => handleConfigChange('companyAddress', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">대표자명</label>
                  <input
                    type="text"
                    value={formConfig.ceoName}
                    onChange={(e) => handleConfigChange('ceoName', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">사업자등록번호</label>
                  <input
                    type="text"
                    value={formConfig.businessNumber}
                    onChange={(e) => handleConfigChange('businessNumber', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: THEME & COLOR PICKER */}
          {activeTab === 'theme' && (
            <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  브랜드 포인트 컬러 & 디자인 테마
                </h3>
                <p className="text-xs text-slate-500">
                  선택한 컬러는 모든 버튼, 하이라이트, 배지 및 키 비주얼 요소에 실시간으로 적용됩니다.
                </p>
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-3">
                  추천 컬러 프리셋
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handleConfigChange('primaryColor', preset.value)}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        formConfig.primaryColor.toLowerCase() === preset.value.toLowerCase()
                          ? 'border-slate-900 bg-slate-50 shadow-sm ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-lg shadow-inner shrink-0"
                        style={{ backgroundColor: preset.value }}
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-slate-800 block">{preset.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{preset.value}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hex Color Picker */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  커스텀 포인트 컬러 직접 선택
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formConfig.primaryColor}
                    onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200 bg-transparent"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formConfig.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Font Style Toggle */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  서체 스타일 모드
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleConfigChange('fontMode', 'pretendard')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formConfig.fontMode === 'pretendard'
                        ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs block font-bold">Pretendard 모던 산세리프 (권장)</span>
                    <span className="text-[11px] text-slate-500 font-normal">신뢰감 있고 또렷한 현대적 클리닝 브랜드 스타일</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfigChange('fontMode', 'clean')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formConfig.fontMode === 'clean'
                        ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs block font-bold">시스템 클린 고딕</span>
                    <span className="text-[11px] text-slate-500 font-normal">간결하고 직관적인 미니멀리스트 텍스트 스타일</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: SEO & SOCIAL LINKS */}
          {activeTab === 'seo' && (
            <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  검색엔진 최적화 (SEO) 및 소셜 채널 링크 관리
                </h3>
                <p className="text-xs text-slate-500">
                  네이버, 다음, 구글 검색 결과에 노출되는 메타 태그와 소셜 바로가기를 설정합니다.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">웹페이지 타이틀 (SEO Title)</label>
                <input
                  type="text"
                  value={formConfig.seoTitle}
                  onChange={(e) => handleConfigChange('seoTitle', e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">메타 설명문 (SEO Description)</label>
                <textarea
                  rows={2}
                  value={formConfig.seoDescription}
                  onChange={(e) => handleConfigChange('seoDescription', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">카카오톡 채널 상담 URL</label>
                  <input
                    type="url"
                    value={formConfig.kakaoUrl}
                    onChange={(e) => handleConfigChange('kakaoUrl', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">네이버 공식 블로그 URL</label>
                  <input
                    type="url"
                    value={formConfig.naverBlogUrl}
                    onChange={(e) => handleConfigChange('naverBlogUrl', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">공식 인스타그램 URL</label>
                  <input
                    type="url"
                    value={formConfig.instagramUrl}
                    onChange={(e) => handleConfigChange('instagramUrl', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">견적 데이터 수집 Formspree 엔드포인트 URL</label>
                  <input
                    type="url"
                    value={formConfig.formspreeEndpoint || 'https://formspree.io/f/xqpejjvp'}
                    onChange={(e) => handleConfigChange('formspreeEndpoint', e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="https://formspree.io/f/xqpejjvp"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">고객 견적 신청 시 해당 Formspree URL로 데이터가 자동 전송됩니다.</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Actions Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('기본 설정 값으로 복원하시겠습니까?')) {
                  onResetConfig();
                  onClose();
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본값으로 복원</span>
            </button>
            {saveSuccessMsg && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 ml-4 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                {saveSuccessMsg}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              창 닫기
            </button>
            <button
              onClick={handleSaveConfig}
              className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              style={{ backgroundColor: formConfig.primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>설정 저장 & 웹사이트 반영</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
