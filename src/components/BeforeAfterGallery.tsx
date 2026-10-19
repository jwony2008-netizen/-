import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Save,
  Upload,
  X,
} from 'lucide-react';
import { PortfolioItem, SiteConfig } from '../types';
import { compressImageFile } from '../utils/storage';
import { IMAGES } from '../assets/images';

interface BeforeAfterGalleryProps {
  portfolio: PortfolioItem[];
  config: SiteConfig;
  onOpenQuote: (caseTitle: string) => void;
  isAdminEditing?: boolean;
  onAddPortfolio?: (item: PortfolioItem) => void;
  onUpdatePortfolio?: (item: PortfolioItem) => void;
  onDeletePortfolio?: (id: string) => void;
  onSaveToFirestore?: () => void;
  isSaving?: boolean;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  portfolio,
  config,
  onOpenQuote,
  isAdminEditing = false,
  onAddPortfolio,
  onUpdatePortfolio,
  onDeletePortfolio,
  onSaveToFirestore,
  isSaving = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [activeItem, setActiveItem] = useState<PortfolioItem>(
    portfolio[0] || ({} as PortfolioItem)
  );
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const prevFirstIdRef = useRef<string | undefined>(portfolio[0]?.id);

  // Admin Inline Add/Edit State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<'before' | 'after' | null>(null);

  const [draftForm, setDraftForm] = useState<{
    title: string;
    category: PortfolioItem['category'];
    location: string;
    date: string;
    beforeImage: string;
    afterImage: string;
    description: string;
    highlightsText: string;
  }>({
    title: '',
    category: '에어컨 정밀세척',
    location: '전북 익산시',
    date: new Date().toISOString().slice(0, 7).replace('-', '.'),
    beforeImage: IMAGES.acDetail,
    afterImage: IMAGES.hero,
    description: '',
    highlightsText: '완전 분해 고압 세척, 친환경 약품 살균, 송풍 건조 완료',
  });

  // Sync activeItem when a new portfolio item is added or updated
  useEffect(() => {
    if (portfolio.length === 0) return;
    const firstId = portfolio[0]?.id;
    if (firstId && firstId !== prevFirstIdRef.current) {
      prevFirstIdRef.current = firstId;
      setSelectedCategory('전체');
      setActiveItem(portfolio[0]);
      return;
    }
    const updatedActive = portfolio.find((p) => p.id === activeItem.id);
    if (updatedActive) {
      setActiveItem(updatedActive);
    } else {
      setActiveItem(portfolio[0]);
    }
  }, [portfolio]);

  const categories: Array<'전체' | PortfolioItem['category']> = [
    '전체',
    '에어컨 정밀세척',
    '업소용 제빙기',
    '시스템/기업',
    '가정용 토탈케어',
  ];

  const filteredItems = portfolio.filter((item) => {
    if (selectedCategory === '전체') return true;
    return item.category === selectedCategory;
  });

  const currentItem =
    portfolio.find((p) => p.id === activeItem.id) || filteredItems[0] || portfolio[0];
  const isSameBeforeAfterSource =
    currentItem && currentItem.beforeImage === currentItem.afterImage;

  const handleOpenAddForm = () => {
    setEditingItemId(null);
    setDraftForm({
      title: '',
      category: '에어컨 정밀세척',
      location: '전북 전주시',
      date: new Date().toISOString().slice(0, 7).replace('-', '.'),
      beforeImage: IMAGES.acDetail,
      afterImage: IMAGES.hero,
      description: '',
      highlightsText: '정밀 분해 고압 세척, 130℃ 고온 스팀 살균, 피톤치드 항균 코팅',
    });
    setIsAddingNew(true);
  };

  const handleOpenEditForm = (item: PortfolioItem) => {
    setIsAddingNew(false);
    setEditingItemId(item.id);
    setDraftForm({
      title: item.title,
      category: item.category,
      location: item.location,
      date: item.date,
      beforeImage: item.beforeImage,
      afterImage: item.afterImage,
      description: item.description,
      highlightsText: item.highlights.join(', '),
    });
  };

  const handleImageFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'beforeImage' | 'afterImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field === 'beforeImage' ? 'before' : 'after');
    try {
      // Automatically resize to width <= 800px and compress as WebP/JPEG Base64 for Firestore
      const compressedBase64 = await compressImageFile(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.78,
      });
      setDraftForm((prev) => ({
        ...prev,
        [field]: compressedBase64,
      }));
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftForm.title.trim()) return;

    const parsedHighlights = draftForm.highlightsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (isAddingNew && onAddPortfolio) {
      const newItem: PortfolioItem = {
        id: `case-${Date.now()}`,
        title: draftForm.title.trim(),
        category: draftForm.category,
        location: draftForm.location.trim() || '전북 전 지역',
        date: draftForm.date.trim() || '2026.10',
        beforeImage: draftForm.beforeImage || IMAGES.acDetail,
        afterImage: draftForm.afterImage || IMAGES.hero,
        description:
          draftForm.description.trim() ||
          '전문 엔지니어의 정밀 분해 및 고압 세척 시공 결과입니다.',
        highlights:
          parsedHighlights.length > 0 ? parsedHighlights : ['분해 고압 세척 완료'],
      };
      onAddPortfolio(newItem);
      setActiveItem(newItem);
      setIsAddingNew(false);
    } else if (editingItemId && onUpdatePortfolio) {
      const updatedItem: PortfolioItem = {
        id: editingItemId,
        title: draftForm.title.trim(),
        category: draftForm.category,
        location: draftForm.location.trim() || '전북 전 지역',
        date: draftForm.date.trim() || '2026.10',
        beforeImage: draftForm.beforeImage || IMAGES.acDetail,
        afterImage: draftForm.afterImage || IMAGES.hero,
        description:
          draftForm.description.trim() ||
          '전문 엔지니어의 정밀 분해 및 고압 세척 시공 결과입니다.',
        highlights:
          parsedHighlights.length > 0 ? parsedHighlights : ['분해 고압 세척 완료'],
      };
      onUpdatePortfolio(updatedItem);
      setActiveItem(updatedItem);
      setEditingItemId(null);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
              <span>Interactive Verification Gallery</span>
              <span aria-hidden="true">·</span>
              <span>100% 실제 현장 촬영</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Before & After 시공 결과 갤러리
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl font-normal">
              눈속임 없는 꼼꼼한 분해 세척으로 내부 부품 깊은 곳의 곰팡이와 제빙기 석회 스케일까지 완벽하게 복원합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAdminEditing && (
              <div className="flex items-center gap-2 mr-1">
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>작업 사진 추가</span>
                </button>
                {onSaveToFirestore && (
                  <button
                    type="button"
                    onClick={onSaveToFirestore}
                    disabled={isSaving}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? '저장 중...' : '갤러리 저장하기'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const firstInCat = portfolio.find(
                      (p) => cat === '전체' || p.category === cat
                    );
                    if (firstInCat) setActiveItem(firstInCat);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Inline Add/Edit Portfolio Form */}
        {isAdminEditing && (isAddingNew || editingItemId) && (
          <form
            onSubmit={handleSaveDraft}
            className="mb-10 bg-amber-50/90 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2 text-amber-950 font-extrabold text-sm">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>
                  {isAddingNew
                    ? '새 작업 사진(시공 사례) 등록 (폭 800px 이하 WebP/JPEG 자동 압축)'
                    : '시공 사례 수정'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingItemId(null);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  작업 제목 *
                </label>
                <input
                  type="text"
                  required
                  value={draftForm.title}
                  onChange={(e) =>
                    setDraftForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="예: 전주 에코시티 시스템 에어컨 4대 완전분해 세척"
                  className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  시공 분류
                </label>
                <select
                  value={draftForm.category}
                  onChange={(e) =>
                    setDraftForm((prev) => ({
                      ...prev,
                      category: e.target.value as PortfolioItem['category'],
                    }))
                  }
                  className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900"
                >
                  <option value="에어컨 정밀세척">에어컨 정밀세척</option>
                  <option value="업소용 제빙기">업소용 제빙기</option>
                  <option value="시스템/기업">시스템/기업</option>
                  <option value="가정용 토탈케어">가정용 토탈케어</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    시공 지역
                  </label>
                  <input
                    type="text"
                    value={draftForm.location}
                    onChange={(e) =>
                      setDraftForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="익산시 영등동"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    시공 월/일
                  </label>
                  <input
                    type="text"
                    value={draftForm.date}
                    onChange={(e) =>
                      setDraftForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    placeholder="2026.10"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Image Uploaders (Auto resize <= 800px WebP/JPEG Base64) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-rose-600">
                    세척 전 (Before) 사진
                  </span>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingField === 'before' ? '리사이징 중...' : '사진 파일 선택'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileSelect(e, 'beforeImage')}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                  <img
                    src={draftForm.beforeImage}
                    alt="세척 전 미리보기"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  value={draftForm.beforeImage}
                  onChange={(e) =>
                    setDraftForm((prev) => ({ ...prev, beforeImage: e.target.value }))
                  }
                  placeholder="또는 이미지 URL 입력"
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600"
                />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-emerald-600">
                    세척 후 (After) 사진
                  </span>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingField === 'after' ? '리사이징 중...' : '사진 파일 선택'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileSelect(e, 'afterImage')}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                  <img
                    src={draftForm.afterImage}
                    alt="세척 후 미리보기"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  value={draftForm.afterImage}
                  onChange={(e) =>
                    setDraftForm((prev) => ({ ...prev, afterImage: e.target.value }))
                  }
                  placeholder="또는 이미지 URL 입력"
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  상세 작업 설명
                </label>
                <textarea
                  rows={2}
                  value={draftForm.description}
                  onChange={(e) =>
                    setDraftForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="오염 상태 및 분해 세척 과정을 설명해 주세요."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  시공 핵심 포인트 (쉼표 , 로 구분)
                </label>
                <textarea
                  rows={2}
                  value={draftForm.highlightsText}
                  onChange={(e) =>
                    setDraftForm((prev) => ({
                      ...prev,
                      highlightsText: e.target.value,
                    }))
                  }
                  placeholder="냉각핀 고압 세척, 드레인판 살균, 피톤치드 코팅"
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingItemId(null);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isAddingNew ? '목록에 반영하기' : '수정 내용 반영하기'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Marquee Interactive Comparison Showcase */}
        {currentItem && (
          <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Interactive Visual Comparator (7 Cols) */}
              <div className="lg:col-span-7 relative bg-slate-950 flex flex-col justify-center items-center min-h-[380px] sm:min-h-[460px] select-none overflow-hidden">
                {viewMode === 'slider' ? (
                  <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden">
                    {/* After Image (Background) */}
                    <img
                      src={currentItem.afterImage}
                      onError={(e) => {
                        e.currentTarget.src = '/images/ac_detail.jpg';
                      }}
                      alt={`${currentItem.title} 세척 후`}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Before Image (Clipped Overlay) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img
                        src={currentItem.beforeImage}
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero.jpg';
                        }}
                        alt={`${currentItem.title} 세척 전`}
                        className={`absolute inset-0 w-full h-full object-cover ${
                          isSameBeforeAfterSource
                            ? 'brightness-[0.72] contrast-[1.15] sepia-[0.35]'
                            : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        세척 전 (오염·곰팡이)
                      </div>
                    </div>

                    {/* After Tag */}
                    <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      세척 후 (살균 복원)
                    </div>

                    {/* Divider Line & Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize z-10"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center border-2 border-blue-600 font-bold text-xs pointer-events-none">
                        ↔
                      </div>
                    </div>

                    {/* Hidden Range Input for full touch and mouse dragging */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                      aria-label="Before/After 비교 슬라이더"
                    />
                  </div>
                ) : (
                  /* Side by Side Mode */
                  <div className="grid grid-cols-2 w-full h-[400px] sm:h-[480px]">
                    <div className="relative border-r border-slate-800">
                      <img
                        src={currentItem.beforeImage}
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero.jpg';
                        }}
                        alt="세척 전"
                        className={`w-full h-full object-cover ${
                          isSameBeforeAfterSource ? 'brightness-[0.72] sepia-[0.35]' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 bg-red-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                        세척 전
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src={currentItem.afterImage}
                        onError={(e) => {
                          e.currentTarget.src = '/images/ac_detail.jpg';
                        }}
                        alt="세척 후"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 right-4 bg-emerald-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                        세척 후
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom View Switcher Bar */}
                <div className="w-full bg-slate-950/90 border-t border-slate-800 px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs">핸들을 좌우로 드래그하여 비교해보세요</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
                    <button
                      onClick={() => setViewMode('slider')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        viewMode === 'slider'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      슬라이더
                    </button>
                    <button
                      onClick={() => setViewMode('side-by-side')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        viewMode === 'side-by-side'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      나란히 보기
                    </button>
                  </div>
                </div>
              </div>

              {/* Case Details & Highlights (5 Cols) */}
              <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        {currentItem.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {currentItem.date}
                      </span>
                    </div>

                    {isAdminEditing && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(currentItem)}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-[11px] flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>이 사진 수정</span>
                        </button>
                        {onDeletePortfolio && portfolio.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onDeletePortfolio(currentItem.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold text-[11px] flex items-center gap-1 border border-rose-500/30"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>삭제</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-4">
                    {currentItem.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                    {currentItem.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      시공 핵심 포인트
                    </span>
                    {currentItem.highlights.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-2.5 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      이 시공과 동일한 케어
                    </span>
                    <span className="text-xs font-semibold text-blue-400">
                      당일 방문 스케줄 확인 가능
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenQuote(currentItem.title)}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    동일 견적 문의하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Thumbnails List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                setSliderPosition(50);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveItem(item);
                  setSliderPosition(50);
                }
              }}
              className={`cursor-pointer text-left p-3.5 rounded-2xl border transition-all duration-300 ease-out transform hover:scale-[1.03] hover:-translate-y-1 flex flex-col justify-between group relative ${
                currentItem?.id === item.id
                  ? 'bg-blue-50/60 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20 hover:shadow-xl hover:shadow-blue-500/15'
                  : 'bg-white border-slate-200/90 shadow-sm hover:border-blue-300/80 hover:shadow-xl hover:shadow-slate-900/10'
              }`}
            >
              {isAdminEditing && (
                <div
                  className="absolute top-5 right-5 z-10 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenEditForm(item)}
                    className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md"
                    title="이 작업 사진 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {onDeletePortfolio && portfolio.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeletePortfolio(item.id)}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md"
                      title="이 작업 사진 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3 relative shadow-inner">
                <img
                  src={item.afterImage}
                  onError={(e) => {
                    e.currentTarget.src = '/images/ac_detail.jpg';
                  }}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm shadow-sm">
                  {item.category}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span>{item.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
