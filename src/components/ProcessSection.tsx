import React from 'react';
import { CheckCircle2, Award, Sparkles, Wrench, Thermometer, Layers, SprayCan, Wind, RefreshCw, UserCheck } from 'lucide-react';
import { SiteConfig } from '../types';
import { IMAGES } from '../assets/images';

interface ProcessSectionProps {
  config: SiteConfig;
  onOpenQuote: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ config, onOpenQuote }) => {
  const steps = [
    {
      num: '01',
      title: '방문 사전 점검 및 작동 진단',
      desc: '풍속계 및 적외선 온도계를 사용하여 토출 온도, 냉매 압력, 소음, 냄새를 정밀 측정하고 고객님께 현재 오염 상태를 투명하게 공유합니다.',
      icon: Thermometer,
      detail: '풍속/토출온도 측정 · 전기안전 확인'
    },
    {
      num: '02',
      title: '부품 정밀 분해 및 전면 방수 보양',
      desc: '가구와 벽지를 보호하는 2중 안심 방수 보양 가대를 설치하고, 송풍팬·물받이 드레인판·필터·센서류를 안전하게 정밀 분해합니다.',
      icon: Layers,
      detail: '송풍팬 모터 안전 분리 · 주변 방수 보양'
    },
    {
      num: '03',
      title: '친환경 인증 세정제 침투 도포',
      desc: '미 환경청(EPA) 및 한국화학융합시험연구원(KTR) 인증 친환경 생분해 알루미늄 핀 전용 세제를 열교환기 틈새까지 빈틈없이 침투시킵니다.',
      icon: SprayCan,
      detail: '유해 화학물질 0% · 친환경 인증 세제'
    },
    {
      num: '04',
      title: '에어컨 고압 제트 세척 & 제빙기 130℃ 스팀',
      desc: '에어컨은 핀 손상 없는 맞춤 수압의 고압 제트 건으로 찌든 때를 씻어내며, 제빙기는 130℃ 초고온 스팀으로 에바포레이터와 배관의 세균을 멸균합니다.',
      icon: Wind,
      detail: '에어컨 전용 고압 제트 · 제빙기 130℃ 스팀'
    },
    {
      num: '05',
      title: '부품 및 열교환기 건조 과정',
      desc: '세척 후 부품과 냉각핀에 잔류하는 수분을 전용 송풍 장비를 통해 꼼꼼하게 말려주어 곰팡이와 잡균 재발을 원천 차단하는 집중 건조 과정입니다.',
      icon: Wind,
      detail: '전용 송풍 건조 · 잔류 수분 집중 건조 과정'
    },
    {
      num: '06',
      title: '정밀 재조립 및 정상 가동 테스트',
      desc: '정확한 토크로 부품을 재조립한 후 충분한 시간 시운전하여 풍속 및 냉방 능력 향상을 수치로 확인하고, 30일 안심 A/S 품질보증서를 제공합니다.',
      icon: RefreshCw,
      detail: '풍속 개선 수치 검증 · 30일 무상 A/S'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
            <span>Standard Operating Procedure</span>
            <span aria-hidden="true">·</span>
            <span>도지클린 표준 시공 매뉴얼</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            체계적인 6단계 시공 프로세스
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            타협 없는 기술력과 정직한 시공으로 제품 손상 없이 깨끗하고 쾌적한 컨디션으로 되돌립니다.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-black text-blue-600">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50/60 -mx-7 -mb-7 px-7 py-3 rounded-b-2xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{step.detail}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verified Technician Feature Split Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 relative h-72 lg:h-full min-h-[320px]">
            <img
              src={IMAGES.technicianPortrait}
              onError={(e) => { e.currentTarget.src = '/images/technician.jpg'; }}
              alt="도지클린시스템 전문 클리닝 엔지니어"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none lg:hidden" />
          </div>

          <div className="lg:col-span-7 p-8 sm:p-12">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
              <UserCheck className="w-4 h-4" />
              <span>본사 공인 클리닝 마스터 100% 직영 출동</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              외주·하도급 없는 책임 시공제
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              도지클린시스템은 하청 업체에 일감을 넘기지 않습니다. 정규 전문 교육과정을 수료하고 전문 기술과 노하우를 갖춘 본사 소속 엔지니어가 직접 방문하여 책임 시공합니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">전문 기술자 100% 직접 시공</h4>
                  <p className="text-xs text-slate-500 mt-0.5">정규 자격과 실전 경험을 겸비한 직영 엔지니어 전담 배정</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">시공 후 30일 안심 무상 A/S</h4>
                  <p className="text-xs text-slate-500 mt-0.5">시공 후 30일 이내 이상 발생 시 무상 재방문 및 점검 조치</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white shadow hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                style={{ backgroundColor: config.primaryColor }}
              >
                전문 엔지니어 지정 견적 받기
              </button>
              <a
                href={`tel:${config.primaryPhone.replace(/-/g, '')}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 text-center transition-colors"
              >
                전화 상담 ({config.primaryPhone})
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
