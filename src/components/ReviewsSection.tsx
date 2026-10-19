import React, { useState } from 'react';
import { Star, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { ReviewItem, SiteConfig } from '../types';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  config: SiteConfig;
  onOpenQuote: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  config,
  onOpenQuote
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '일반 필터 청소와 전문 분해 세척은 무엇이 다른가요?',
      a: '일반 필터 청소는 겉면의 큰 먼지만 털어내는 수준입니다. 반면 도지클린시스템의 정밀 분해 청소는 곰팡이와 악취의 온상인 송풍팬(블로워팬), 물받이 드레인판을 모터에서 안전하게 탈거하여 내부 틈새의 찌든 곰팡이 포자를 에어컨 전용 고압 제트로 깨끗하게 씻어냅니다. 제빙기의 경우 130℃ 초고온 스팀으로 배관과 에바포레이터 냉판을 집중 살균합니다.'
    },
    {
      q: '카페 제빙기는 얼마나 자주 분해 살균 청소를 해야 하나요?',
      a: '제빙기 내부는 항상 습기가 차 있고 어두워 곰팡이와 물때, 석회질 스케일이 매우 빠르게 번식합니다. 식약처 식품위생 권장 기준에 따라 최소 분기 1회(3개월), 여름 성수기 전후로는 130℃ 고온 스팀과 스케일링을 통한 필수 정기 케어를 권장드립니다.'
    },
    {
      q: '작업할 때 벽지나 가구, 바닥에 물이나 약품이 튀지 않나요?',
      a: '시공 시작 전 작업 공간에 전용 방수 비닐 보양 가대와 특수 드레인 워터백을 꼼꼼히 설치하여 안전하게 세척을 진행합니다. 모든 오염수는 전용 호스를 통해 집수통으로 안전하게 모입니다.\n\n※ 경고: 현장 상황에 따라 상이할 수 있습니다.'
    },
    {
      q: '청소 후 이상이 생기면 어떻게 처리되나요?',
      a: '도지클린시스템은 시공 후 30일간 품질 안심 무상 A/S 보증을 제공합니다. 시공 후 30일 이내에 작동 이상이나 불편 사항이 발생할 경우 최우선 순위로 무상 재방문 및 점검 조치를 약속드립니다.'
    },
    {
      q: '당일 또는 야간/주말 작업도 가능한가요?',
      a: '네, 가능합니다. 일반 가정의 주말 시공은 물론, 카페 및 식당의 경우 영업에 방해가 되지 않도록 마감 후 심야(22시 이후) 또는 오픈 전 이른 아침 시간대 맞춤 스케줄링을 지원하고 있습니다.'
    }
  ];

  return (
    <section id="reviews" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
            <span>Verified Customer Testimonials</span>
            <span aria-hidden="true">·</span>
            <span>평점 5.0 만족도 99.4%</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            도지클린을 경험한 고객님들의 생생한 후기
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            가정집 비염 개선부터 대형 카페 위생 점검 통과까지, 실제 고객님들이 남겨주신 솔직한 평가입니다.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-50/80 rounded-2xl p-7 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Stars & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-1.5 font-mono">5.0</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{review.date}</span>
                </div>

                {/* Review Body */}
                <p className="text-sm text-slate-700 leading-relaxed font-normal mb-6">
                  "{review.content}"
                </p>
              </div>

              {/* Author & Service Info (Zero-pill metadata) */}
              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{review.author}</span>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        시공 완료 인증
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">{review.role}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-slate-400 block">시공 내역</span>
                  <span className="text-xs font-semibold text-slate-800 max-w-[180px] truncate block">
                    {review.serviceType}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div id="faq" className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              자주 묻는 질문 (FAQ)
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              에어컨 & 제빙기 청소 전 고객님들께서 가장 궁금해하시는 점을 정리했습니다.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-blue-600 font-mono">Q.</span>
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a.includes('※ 경고:') ? (
                        <div className="space-y-3">
                          <p>{faq.a.split('\n\n※ 경고:')[0]}</p>
                          <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs font-semibold text-amber-800 flex items-center gap-2">
                            <span className="font-bold text-amber-600">※ 경고 :</span>
                            <span>{faq.a.split('\n\n※ 경고:')[1]?.trim() || '현장 상황에 따라 상이할 수 있습니다.'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line">{faq.a}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick CTA */}
          <div className="mt-12 text-center p-8 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              더 궁금하신 내용이나 견적 상담이 필요하신가요?
            </h4>
            <p className="text-xs text-slate-500 mb-5">
              전문 상담원이 고객님의 가전 모델과 오염 상태에 맞춰 가장 경제적인 플랜을 안내해 드립니다.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${config.primaryPhone.replace(/-/g, '')}`}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                고객센터 전화상담 ({config.primaryPhone})
              </a>
              <button
                onClick={onOpenQuote}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow hover:brightness-110 active:scale-95 transition-all"
                style={{ backgroundColor: config.primaryColor }}
              >
                온라인 실시간 견적 접수
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
