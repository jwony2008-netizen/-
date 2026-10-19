import React, { useState } from 'react';
import { Eye, CheckCircle2, AlertTriangle, Sparkles, SlidersHorizontal, MapPin, Calendar } from 'lucide-react';
import { PortfolioItem, SiteConfig } from '../types';

interface BeforeAfterGalleryProps {
  portfolio: PortfolioItem[];
  config: SiteConfig;
  onOpenQuote: (caseTitle: string) => void;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  portfolio,
  config,
  onOpenQuote
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [activeItem, setActiveItem] = useState<PortfolioItem>(portfolio[0] || {} as PortfolioItem);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const categories = ['전체', '에어컨 정밀세척', '업소용 제빙기', '가정용 토탈케어'];

  const filteredItems = portfolio.filter((item) => {
    if (selectedCategory === '전체') return true;
    return item.category === selectedCategory;
  });

  const currentItem = portfolio.find(p => p.id === activeItem.id) || filteredItems[0] || portfolio[0];

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

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const firstInCat = portfolio.find(p => cat === '전체' || p.category === cat);
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
                      alt={`${currentItem.title} 세척 후`}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Before Image (Clipped Overlay with simulated dirty filter if same source image) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img
                        src={currentItem.beforeImage}
                        alt={`${currentItem.title} 세척 전`}
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.72] contrast-[1.15] sepia-[0.35]"
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
                        alt="세척 전"
                        className="w-full h-full object-cover brightness-[0.72] sepia-[0.35]"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 bg-red-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                        세척 전
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src={currentItem.afterImage}
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
                <div className="w-full bg-slate-950/90 border-t border-slate-800 px-5 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                    <span>가운데 핸들을 좌우로 드래그하여 비교해보세요</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setViewMode('slider')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        viewMode === 'slider' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      슬라이더
                    </button>
                    <button
                      onClick={() => setViewMode('side-by-side')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        viewMode === 'side-by-side' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
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
                  {/* Quiet unboxed location and date */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
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
                      <div key={hIdx} className="flex items-center gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">이 시공과 동일한 케어</span>
                    <span className="text-xs font-semibold text-blue-400">당일 방문 스케줄 확인 가능</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                setSliderPosition(50);
              }}
              className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group ${
                currentItem.id === item.id
                  ? 'bg-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                <img
                  src={item.afterImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span>{item.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
