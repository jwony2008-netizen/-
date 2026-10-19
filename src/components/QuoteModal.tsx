import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, Phone, Calendar, MapPin, Building2, Wind, Shield } from 'lucide-react';
import { QuoteRequest, SiteConfig } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  prefillService?: string;
  prefillPhone?: string;
  onAddQuote: (newQuote: QuoteRequest) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  config,
  prefillService,
  prefillPhone,
  onAddQuote
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('벽걸이 에어컨 정밀 분해 세척');
  const [units, setUnits] = useState(1);
  const [spaceType, setSpaceType] = useState('아파트/주택');
  const [region, setRegion] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (prefillService) {
      setServiceType(prefillService);
    }
    if (prefillPhone) {
      setPhone(prefillPhone);
    }
  }, [prefillService, prefillPhone, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('성함 또는 상호명을 입력해 주세요.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('정확한 연락처를 입력해 주세요 (예: 010-1234-5678).');
      return;
    }
    if (!region.trim()) {
      setErrorMsg('시공 희망 지역(시/구/동)을 입력해 주세요.');
      return;
    }

    const newQuote: QuoteRequest = {
      id: `Q-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      serviceType: `${serviceType} (${units}대)`,
      units,
      spaceType,
      region: region.trim(),
      preferredDate: preferredDate || '협의 후 결정',
      notes: notes.trim() || '특이사항 없음',
      status: '신규접수'
    };

    setIsSubmitting(true);
    setErrorMsg('');

    // Send data to Formspree endpoint
    const formspreeUrl = config.formspreeEndpoint || 'https://formspree.io/f/xqpejjvp';
    try {
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          성함_상호명: customerName.trim(),
          연락처: phone.trim(),
          신청서비스: `${serviceType} (${units}대)`,
          수량: `${units}대`,
          공간형태: spaceType,
          시공지역: region.trim(),
          희망일시: preferredDate || '협의 후 결정',
          요청사항: notes.trim() || '특이사항 없음',
          접수번호: newQuote.id,
          접수일시: newQuote.createdAt,
          _subject: `[도지클린 신규견적] ${customerName.trim()}님 (${region.trim()}) - ${serviceType}`
        })
      });
    } catch (err) {
      console.warn('Formspree transmission notice:', err);
    } finally {
      setIsSubmitting(false);
      onAddQuote(newQuote);
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setPhone('');
    setRegion('');
    setPreferredDate('');
    setNotes('');
    setIsSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 transition-all transform animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Submission Success State */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              견적 문의가 정상 접수되었습니다!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
              담당 엔지니어가 접수 내용을 확인 후 15분 이내로 기재해주신 연락처(<span className="font-semibold text-slate-900">{phone}</span>)로 맞춤 견적과 가능한 방문 일정을 안내해 드립니다.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 text-left mb-6 space-y-1.5">
              <div><span className="font-medium text-slate-400">접수 번호:</span> <span className="font-mono font-bold text-slate-800">Q-{Date.now().toString().slice(-6)}</span></div>
              <div><span className="font-medium text-slate-400">신청 서비스:</span> <span className="font-semibold text-slate-800">{serviceType} ({units}대)</span></div>
              <div><span className="font-medium text-slate-400">시공 지역:</span> <span className="font-semibold text-slate-800">{region}</span></div>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:brightness-110 transition-all"
              style={{ backgroundColor: config.primaryColor }}
            >
              확인 완료
            </button>
          </div>
        ) : (
          /* Input Form */
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>무료 방문 견적 & 전문 상담 신청</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                실시간 온라인 견적 신청
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                작업 모델과 지역을 알려주시면 가장 합리적인 견적을 산출해 드립니다.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  클리닝 서비스 항목 선택 *
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="벽걸이 에어컨 정밀 분해 세척">벽걸이 에어컨 정밀 분해 세척</option>
                  <option value="스탠드 에어컨 정밀 분해 세척">스탠드 에어컨 정밀 분해 세척</option>
                  <option value="천장형 시스템 에어컨 (1Way / 4Way)">천장형 시스템 에어컨 (1Way / 4Way)</option>
                  <option value="2in1 에어컨 (스탠드+벽걸이)">2in1 에어컨 (스탠드+벽걸이)</option>
                  <option value="카페/업소용 제빙기 고온스팀 살균 클리닝">카페/업소용 제빙기 고온스팀 살균 클리닝</option>
                  <option value="에어컨 + 제빙기 매장 위생 토탈 패키지">에어컨 + 제빙기 매장 위생 토탈 패키지</option>
                  <option value="기업/기관 대량 다량 시공">기업/기관 대량 다량 시공</option>
                </select>
              </div>

              {/* Units & Space Type Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    수량 (대수) *
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={units}
                      onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    공간 형태 *
                  </label>
                  <select
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="아파트/주택">아파트/주택</option>
                    <option value="카페/식당">카페/식당</option>
                    <option value="사무실/기업">사무실/기업</option>
                    <option value="학원/병원">학원/병원</option>
                    <option value="호텔/숙박업">호텔/숙박업</option>
                    <option value="원룸/오피스텔">원룸/오피스텔</option>
                  </select>
                </div>
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    신청자명 / 상호 *
                  </label>
                  <input
                    type="text"
                    placeholder="홍길동 (또는 상호명)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Region / Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  시공 희망 지역 (시/구/동) *
                </label>
                <input
                  type="text"
                  placeholder="예: 전북 익산시 영등동 / 전주 완산구 효자동 / 군산시"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  희망 시공 일자 / 시간대
                </label>
                <input
                  type="text"
                  placeholder="예: 이번 주 주말 오전 / 10월 25일 오후 등"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  가전 모델명 또는 요청 사항 (선택)
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 호시자키 100kg 제빙기 스팀 살균 / 스탠드 에어컨 냄새 제거 등"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl font-bold text-sm text-white shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.primaryColor }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>견적 문의 전송 중...</span>
                  </span>
                ) : (
                  <span>무료 견적 산출 신청하기</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-1">
                <span>개인정보는 견적 상담 목적으로만 안전하게 사용되며 카드결제 및 현금영수증 발행이 가능합니다. (30일 안심 A/S)</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
