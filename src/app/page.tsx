"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Clock,
  Lock,
  ChevronDown,
  ArrowRight,
  BrainCircuit,
  Zap,
  Loader2,
  TestTube,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const enterTestMode = async () => {
    try {
      setIsLoading("test");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier: "test", testMode: true }),
      });
      const data = await res.json();
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("credits", String(data.credits));
        router.push("/chat?payment=success");
      } else {
        throw new Error(data.error || "Erro ao entrar em modo de teste");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao entrar em modo de teste.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleCheckout = async (tier: string) => {
    try {
      setIsLoading(tier);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao iniciar o pagamento. Tente novamente.");
    } finally {
      setIsLoading(null);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Isso substitui a terapia com um psicólogo?",
      answer:
        "Não. Nosso Mentor de IA é um conselheiro de bolso para alívio imediato, dicas de comunicação e organização de pensamentos. Para questões clínicas profundas, traumas ou depressão, recomendamos fortemente o acompanhamento com um profissional de saúde mental.",
    },
    {
      question: "Minhas conversas são realmente privadas?",
      answer:
        "Sim. A sua privacidade é nosso pilar. Não armazenamos seus dados pessoais de forma identificável, e suas conversas são criptografadas de ponta a ponta. Você tem total anonimato.",
    },
    {
      question: "Como funciona a assinatura?",
      answer:
        "É um acesso vitalício ou mensal (dependendo da oferta escolhida no checkout). Sem taxas ocultas. Você paga uma vez e tem seu mentor disponível 24 horas por dia, 7 dias por semana.",
    },
    {
      question: "A IA realmente entende de relacionamentos?",
      answer:
        "Nosso sistema foi treinado com princípios de Comunicação Não-Violenta (CNV), psicologia comportamental e resolução de conflitos. Ele não dá 'palpites', ele guia você para encontrar as melhores respostas com empatia.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-200">
      {/* HEADER TOP BAR */}
      <div className="bg-brand-900 text-white text-center py-2 text-xs md:text-sm font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-300" />
        <span>Vagas limitadas para acesso fundadores com 80% de desconto</span>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-32 overflow-hidden px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-brand-200/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-brand-100 rounded-full px-4 py-2 text-sm font-medium text-brand-700 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Aconselhamento 100% Anônimo</span>
            </div>

            <h1 className="font-playfair text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]">
              Clareza e paz de espírito para seu{" "}
              <span className="text-brand-500">relacionamento</span> — a
              qualquer hora.
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
              Um mentor de inteligência artificial treinado em psicologia
              comportamental para te ajudar a lidar com a ansiedade amorosa,
              conflitos e mensagens difíceis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("planos")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="premium-button bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand-500/30"
              >
                Ver Planos a partir de R$ 4,99{" "}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium pt-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-sage-500" /> 24/7 Disponível
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4 text-sage-500" /> Totalmente Seguro
              </div>
            </div>
          </div>

          {/* Form/Mockup Side */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-300 to-rose-200 rounded-[2rem] blur-2xl opacity-40 animate-pulse-gentle -z-10"></div>
            <div className="glass-card p-6 md:p-8 rounded-[2rem] relative border border-white/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Experimente a IA</h3>
                  <p className="text-sm text-slate-500">
                    Como posso ajudar seu coração hoje?
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="chat-bubble-user text-sm ml-auto w-fit max-w-[85%]">
                  Ele visualizou e não respondeu há 4 horas. Estou surtando.
                </div>
                <div className="chat-bubble-ai text-sm mr-auto w-fit max-w-[90%] bg-slate-50 border border-slate-100 p-3 rounded-2xl rounded-tl-none">
                  Entendo que a ansiedade bate forte nessas horas. Respire
                  fundo. O silêncio raramente é sobre você, pode ser apenas a
                  rotina dele. Antes de mandar outra mensagem, vamos focar em
                  algo que você controla?
                </div>
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById("planos")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Continuar conversa <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-white border-y border-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-around gap-8 text-center divide-x divide-slate-100">
          <div className="px-4">
            <p className="text-4xl font-extrabold text-brand-600 mb-2">24/7</p>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
              Disponibilidade
            </p>
          </div>
          <div className="px-4">
            <p className="text-4xl font-extrabold text-brand-600 mb-2">100%</p>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
              Livre de Julgamentos
            </p>
          </div>
          <div className="px-4">
            <p className="text-4xl font-extrabold text-brand-600 mb-2">+10k</p>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
              Conselhos Gerados
            </p>
          </div>
          <div className="px-4">
            <p className="text-4xl font-extrabold text-brand-600 mb-2">0</p>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
              Mensagens de Arrependimento
            </p>
          </div>
        </div>
      </section>

      {/* METHODOLOGY SECTION (4 STEPS) */}
      <section className="py-20 md:py-32 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4 block">
            Metodologia Exclusiva
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            O Sistema de Inteligência Emocional em 4 Etapas
          </h2>
          <p className="text-lg text-slate-600">
            Não damos conselhos genéricos. Nossa IA analisa sua situação
            específica e entrega um plano de ação claro, evitando que você reaja
            por impulso.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Desabafo Seguro",
              desc: "Escreva o que está sentindo no calor do momento. A IA escuta sem limites ou julgamentos.",
            },
            {
              step: "02",
              title: "Análise de Padrão",
              desc: "Identificamos o real gatilho emocional por trás da situação usando fundamentos da psicologia.",
            },
            {
              step: "03",
              title: "Scripts Práticos",
              desc: "Receba exatamente O QUE falar e COMO falar, usando Comunicação Não-Violenta.",
            },
            {
              step: "04",
              title: "Paz de Espírito",
              desc: "Retome o controle das suas emoções e construa relações mais maduras e saudáveis.",
            },
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="text-6xl font-black text-slate-100 absolute -top-8 -left-4 -z-10 transition-transform group-hover:scale-110">
                {item.step}
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full">
                <h3 className="font-bold text-xl text-slate-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section
        id="planos"
        className="py-20 md:py-32 bg-slate-900 text-white px-4"
      >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-6">
            Escolha seu pacote de conselhos
          </h2>
          <p className="text-slate-300 text-lg">
            Sem mensalidades. Pague apenas pelas respostas que usar.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-end">
          {/* Básico */}
          <div className="bg-white/10 border border-white/20 text-white rounded-3xl p-8 hover:bg-white/15 transition-colors relative">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Básico</h3>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-4xl font-black">R$ 4</span>
                <span className="font-bold text-xl">,99</span>
              </div>
              <p className="text-sm text-brand-200">5 Respostas da IA</p>
            </div>
            <button
              onClick={() => handleCheckout("basic")}
              disabled={isLoading !== null}
              className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isLoading === "basic" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Escolher Básico"
              )}
            </button>
          </div>

          {/* Premium */}
          <div className="bg-white text-slate-900 rounded-3xl p-8 transform md:-translate-y-4 hover:scale-[1.02] transition-transform shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
              Melhor Custo-Benefício
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-brand-600">
                Premium
              </h3>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-5xl font-black">R$ 29</span>
                <span className="font-bold text-xl">,90</span>
              </div>
              <p className="text-sm text-slate-500">50 Respostas da IA</p>
            </div>
            <button
              onClick={() => handleCheckout("premium")}
              disabled={isLoading !== null}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              {isLoading === "premium" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Escolher Premium"
              )}
            </button>
          </div>

          {/* Plus */}
          <div className="bg-white/10 border border-white/20 text-white rounded-3xl p-8 hover:bg-white/15 transition-colors relative">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Plus</h3>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-4xl font-black">R$ 9</span>
                <span className="font-bold text-xl">,90</span>
              </div>
              <p className="text-sm text-brand-200">15 Respostas da IA</p>
            </div>
            <button
              onClick={() => handleCheckout("plus")}
              disabled={isLoading !== null}
              className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isLoading === "plus" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Escolher Plus"
              )}
            </button>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-12 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <Lock className="w-4 h-4" /> Pagamento 100% Seguro via Stripe
        </div>

        <div className="max-w-md mx-auto mt-6">
          <button
            onClick={enterTestMode}
            disabled={isLoading !== null}
            className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 disabled:opacity-50 text-green-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            {isLoading === "test" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <TestTube className="w-5 h-5" />
                Modo de Teste (Grátis - 10 Créditos)
              </>
            )}
          </button>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 md:py-32 px-4 max-w-3xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-300 transition-colors"
              onClick={() => toggleFaq(index)}
            >
              <div className="p-6 flex items-center justify-between gap-4">
                <h3 className="font-bold text-slate-800 text-left">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                />
              </div>
              <div
                className={`px-6 text-slate-600 text-sm leading-relaxed transition-all duration-300 ease-in-out ${
                  openFaq === index
                    ? "pb-6 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden py-0"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA & FOOTER */}
      <footer className="bg-brand-900 pt-20 pb-8 px-4 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-6">
            O sucesso do seu relacionamento não pode esperar.
          </h2>
          <p className="text-brand-200 text-lg mb-8">
            Pare de reagir por impulso e comece a agir com inteligência
            emocional ainda hoje.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("planos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex premium-button bg-white text-brand-900 px-8 py-4 rounded-xl font-bold text-lg items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            Ver Pacotes Disponíveis
          </button>
        </div>

        <div className="border-t border-brand-800 pt-8 flex flex-col items-center justify-between gap-4 text-sm text-brand-300 max-w-6xl mx-auto md:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" /> Mentor IA 2024
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
