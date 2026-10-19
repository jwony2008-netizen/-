import React, { useState } from 'react';
import {
  Clock,
  Check,
  ArrowRight,
  Wind,
  Snowflake,
  Shield,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { ServiceDetail, SiteConfig } from '../types';

interface ServicesSectionProps {
  services: ServiceDetail[];
  config: SiteConfig;
  onSelectService: (serviceTitle: string) => void;
  isAdminEditing?: boolean;
  onUpdateService?: (updated: ServiceDetail) => void;
  onAddService?: (item: ServiceDetail) => void;
  onDeleteService?: (id: string) => void;
  onSaveToFirestore?: () => Promise<void>;
  isSaving?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  config,
  onSelectService,
  isAdminEditing = false,
  onUpdateService,
  onAddService,
  onDeleteService,
  onSaveToFirestore,
  isSaving = false,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'aircon' | 'icemaker'>('all');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Service Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'aircon' | 'icemaker'>('aircon');
  const [newTag, setNewTag] = useState('인기 케어');
  const [newPriceStart, setNewPriceStart] = useState('70,000원~');
  const [newTarget, setNewTarget] = useState('가정집 · 매장 · 사무실');
  const [newDuration, setNewDuration] = useState('약 1시간 소요');
  const [newPeriod, setNewPeriod] = useState('6개월 ~ 1년 주기');
  const [newSummary, setNewSummary] = useState('');
  const [newFeatures, setNewFeatures] = useState(
    '전면 패널 및 필터 완전 분해, 열교환기 고압 세척, 친환경 살균 소독'
  );

  const filteredServices = services.filter((s) => {
    if (activeTab === 'all') return true;
    return s.category === activeTab;
  });

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !onAddService) return;
    const item: ServiceDetail = {
      id: `srv-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      tag: newTag.trim() || '전문 케어',
      target: newTarget.trim() || '가정 및 업소',
      duration: newDuration.trim() || '약 1시간 소요',
      priceStart: newPriceStart.trim() || '상담 문의',
      summary: newSummary.trim() || '전문 엔지니어가 정밀 분해 후 고압 세척 및 살균을 진행합니다.',
      features: newFeatures
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      recommendedPeriod: newPeriod.trim() || '1년 주기 권장',
    };
    onAddService(item);
    setNewTitle('');
    setNewSummary('');
    setIsAddingNew(false);
  };

  return (
    <section id="services" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
              <span>Precision Cleaning & Sanitization</span>
              <span aria-hidden="true">·</span>
              <span>체계적인 맞춤 케어</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              전문 서비스 안내 & 가격 가이드
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl font-normal">
              단순 겉면 청소가 아닌 송풍팬과 냉각핀을 꼼꼼히 분해 세척하며, 제빙기는 130℃ 초고온 스팀으로 유해균을 근본적으로 제거합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdminEditing && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(!isAddingNew)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>가격표 항목 추가</span>
                </button>
                {onSaveToFirestore && (
                  <button
                    type="button"
                    onClick={onSaveToFirestore}
                    disabled={isSaving}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? '저장 중...' : '저장하기'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Filter Segmented Control */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200/90 shadow-sm shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                전체 보기 ({services.length})
              </button>
              <button
                onClick={() => setActiveTab('aircon')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'aircon'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                에어컨 정밀 세척
              </button>
              <button
                onClick={() => setActiveTab('icemaker')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'icemaker'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                제빙기 고온스팀 살균
              </button>
            </div>
          </div>
        </div>

        {/* Add New Service Inline Form */}
        {isAdminEditing && isAddingNew && (
          <form
            onSubmit={handleCreateService}
            className="mb-8 p-6 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-600" />
                새로운 서비스 & 가격표 카드 추가
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">서비스명 *</label>
                <input
                  type="text"
                  placeholder="예: 벽걸이 에어컨 정밀 세척"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">분류 *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as 'aircon' | 'icemaker')}
                  className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs font-semibold"
                >
                  <option value="aircon">에어컨 정밀 세척</option>
                  <option value="icemaker">제빙기 고온스팀 살균</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">예상 시공가 (가격표) *</label>
                <input
                  type="text"
                  placeholder="예: 70,000원~"
                  value={newPriceStart}
                  onChange={(e) => setNewPriceStart(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs font-bold text-blue-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">상단 태그</label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">추천 대상</label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">소요 시간</label>
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">권장 주기</label>
                <input
                  type="text"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">서비스 요약 설명</label>
              <input
                type="text"
                placeholder="서비스 핵심 설명을 입력하세요"
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                시공 핵심 내용 (쉼표 , 로 구분)
              </label>
              <input
                type="text"
                value={newFeatures}
                onChange={(e) => setNewFeatures(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-amber-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow"
                style={{ backgroundColor: config.primaryColor }}
              >
                항목 추가 반영
              </button>
            </div>
          </form>
        )}

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isEditingThis = isAdminEditing && editingServiceId === service.id;

            return (
              <div
                key={service.id}
                className={`bg-white rounded-2xl border p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group ${
                  isAdminEditing ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200/90'
                }`}
              >
                {isEditingThis && onUpdateService ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-extrabold text-amber-800">가격표 항목 수정</span>
                      <button
                        type="button"
                        onClick={() => setEditingServiceId(null)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        편집 닫기
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">서비스명</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => onUpdateService({ ...service, title: e.target.value })}
                        className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">예상 시공가 (가격)</label>
                        <input
                          type="text"
                          value={service.priceStart}
                          onChange={(e) => onUpdateService({ ...service, priceStart: e.target.value })}
                          className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">상단 태그</label>
                        <input
                          type="text"
                          value={service.tag}
                          onChange={(e) => onUpdateService({ ...service, tag: e.target.value })}
                          className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">요약 설명</label>
                      <textarea
                        rows={2}
                        value={service.summary}
                        onChange={(e) => onUpdateService({ ...service, summary: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">추천 대상</label>
                        <input
                          type="text"
                          value={service.target}
                          onChange={(e) => onUpdateService({ ...service, target: e.target.value })}
                          className="w-full h-7 px-2 bg-slate-50 border border-slate-200 rounded text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">소요 시간</label>
                        <input
                          type="text"
                          value={service.duration}
                          onChange={(e) => onUpdateService({ ...service, duration: e.target.value })}
                          className="w-full h-7 px-2 bg-slate-50 border border-slate-200 rounded text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">권장 주기</label>
                        <input
                          type="text"
                          value={service.recommendedPeriod}
                          onChange={(e) =>
                            onUpdateService({ ...service, recommendedPeriod: e.target.value })
                          }
                          className="w-full h-7 px-2 bg-slate-50 border border-slate-200 rounded text-[11px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                        시공 핵심 내용 (쉼표 구분)
                      </label>
                      <textarea
                        rows={2}
                        value={service.features.join(', ')}
                        onChange={(e) =>
                          onUpdateService({
                            ...service,
                            features: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingServiceId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                      >
                        완료
                      </button>
                      {onSaveToFirestore && (
                        <button
                          type="button"
                          onClick={onSaveToFirestore}
                          disabled={isSaving}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1"
                          style={{ backgroundColor: config.primaryColor }}
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>저장하기</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      {/* Admin quick action bar on card */}
                      {isAdminEditing && (
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100">
                          <span className="text-[11px] font-bold text-amber-700">관리자 편집 가능</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingServiceId(service.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>수정</span>
                            </button>
                            {onDeleteService && (
                              <button
                                type="button"
                                onClick={() => onDeleteService(service.id)}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>삭제</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Category icon and quiet unboxed tag */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                          {service.category === 'aircon' ? (
                            <Wind className="w-5 h-5" />
                          ) : (
                            <Snowflake className="w-5 h-5" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{service.tag}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                        {service.summary}
                      </p>

                      {/* Metadata Specs */}
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-medium text-slate-500">추천 대상</span>
                          <span className="font-semibold text-slate-800">{service.target}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-medium text-slate-500">소요 시간</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {service.duration}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-medium text-slate-500">권장 주기</span>
                          <span className="font-semibold text-slate-800">
                            {service.recommendedPeriod}
                          </span>
                        </div>
                      </div>

                      {/* Key Features Bullet List */}
                      <div className="space-y-2 mb-6">
                        <span className="text-xs font-bold text-slate-700 block">시공 핵심 내용</span>
                        {service.features.map((feature, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-start gap-2 text-xs text-slate-600"
                          >
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Price & CTA */}
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-medium text-slate-400 block">예상 시공가</span>
                        <span className="text-lg font-extrabold text-slate-900 tracking-tight font-mono">
                          {service.priceStart}
                        </span>
                      </div>
                      <button
                        onClick={() => onSelectService(service.title)}
                        className="px-4 py-2.5 text-xs font-bold rounded-xl text-white shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        <span>견적 예약</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Corporate / Multi-unit Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold tracking-tight">
                프랜차이즈 본사 · 카페 체인 · 기업 사옥 대량 시공 견적
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                현금영수증 발행 및 카드결제 가능, 야간/주말 비영업시간 분산 작업, 맞춤형 시공 결과보고서 제공
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${config.primaryPhone.replace(/-/g, '')}`}
              className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-colors"
            >
              전화 직통 상담
            </a>
            <button
              onClick={() => onSelectService('기업/대량 시스템 에어컨 & 제빙기')}
              className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-colors shadow-md"
            >
              기업 전용 견적 요청
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
