import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Building2, MapPin, BarChart3, Sparkles } from 'lucide-react';

const volumes = ['Até 50 pedidos/mês', '51 a 200 pedidos/mês', '201 a 1.000 pedidos/mês', '1.001 a 5.000 pedidos/mês', 'Mais de 5.000 pedidos/mês'];

function maskCnpj(v: string) {
  return v.replace(/\D/g, '').slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function maskCep(v: string) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
}

export default function SignupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [cnpj, setCnpj] = useState('');
  const [cep, setCep] = useState('');
  const [volume, setVolume] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setStep(1);
    setCnpj('');
    setCep('');
    setVolume('');
    setError('');
  };

  const close = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const next = () => {
    if (cnpj.replace(/\D/g, '').length < 14) {
      setError('Informe um CNPJ válido para continuar.');
      return;
    }
    if (cep.replace(/\D/g, '').length < 8) {
      setError('Informe o CEP do local de coleta.');
      return;
    }
    if (!volume) {
      setError('Selecione o volume de pedidos por mês.');
      return;
    }
    setError('');
    setStep(2);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-ink-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-[28px] overflow-hidden card-shadow relative"
          >
            <button onClick={close} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors z-10" aria-label="Fechar">
              <X size={18} />
            </button>

            {step === 1 ? (
              <div>
                <div className="bg-gradient-to-br from-ASTER-700 via-ASTER-600 to-ASTER-500 text-white px-7 sm:px-9 pt-8 pb-7 relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-volt-400/25 blur-[60px] rounded-full" />
                  <div className="relative">
                    <p className="font-display text-xl" style={{ fontWeight: 800 }}>ASTER<span className="text-volt-400">.</span></p>
                    <h3 className="font-display font-extrabold text-2xl sm:text-[28px] mt-3 leading-tight">Crie sua conta grátis</h3>
                    <p className="text-white/75 text-sm sm:text-[15px] mt-2">Economize até 50% no frete com Envios da ASTER</p>
                  </div>
                </div>
                <div className="px-7 sm:px-9 py-7">
                  <p className="text-sm text-slate-500 mb-5">Vamos começar! Informe o CNPJ e o CEP do local de coleta para continuar o cadastro.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[13px] font-bold text-ink-900 flex items-center gap-1.5 mb-1.5">
                        <Building2 size={14} className="text-ASTER-600" /> CNPJ *
                      </label>
                      <input
                        value={cnpj}
                        onChange={(e) => setCnpj(maskCnpj(e.target.value))}
                        placeholder="00.000.000/0000-00"
                        inputMode="numeric"
                        className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[13px] font-bold text-ink-900 flex items-center gap-1.5 mb-1.5">
                        <MapPin size={14} className="text-ASTER-600" /> CEP de coleta *
                      </label>
                      <input
                        value={cep}
                        onChange={(e) => setCep(maskCep(e.target.value))}
                        placeholder="00000-000"
                        inputMode="numeric"
                        className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[13px] font-bold text-ink-900 flex items-center gap-1.5 mb-1.5">
                        <BarChart3 size={14} className="text-ASTER-600" /> Volume de pedidos/mês *
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {volumes.map((v) => (
                          <button
                            key={v}
                            onClick={() => setVolume(v)}
                            className={`text-left text-sm font-semibold rounded-xl px-4 py-2.5 border-2 transition-all ${
                              volume === v
                                ? 'border-ASTER-600 bg-ASTER-50 text-ASTER-700'
                                : 'border-ASTER-100 text-slate-500 hover:border-ASTER-300'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {error && <p className="text-rose-500 text-sm font-semibold mt-4">{error}</p>}
                  <button onClick={next} className="mt-6 w-full bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold py-4 rounded-full transition-all hover:shadow-lg hover:shadow-ASTER-600/30 flex items-center justify-center gap-2">
                    Avançar <ArrowRight size={18} />
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4">30 dias grátis · Sem cartão de crédito · Cancele quando quiser</p>
                </div>
              </div>
            ) : (
              <div className="px-7 sm:px-9 py-10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                  <CheckCircle2 size={72} className="text-emerald-500 mx-auto" />
                </motion.div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900 mt-5">Conta criada com sucesso! 🎉</h3>
                <p className="text-slate-500 mt-3 text-[15px]">
                  Enviamos os próximos passos para o e-mail vinculado ao CNPJ <strong className="text-ink-900">{cnpj}</strong>.
                </p>
                <div className="mt-6 bg-gradient-to-r from-ASTER-50 to-volt-400/10 border border-ASTER-100 rounded-2xl p-4 flex gap-3 text-left">
                  <Sparkles size={18} className="text-ASTER-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-[#2c1a63]"><strong>A Lis já está te esperando:</strong> conecte seu primeiro canal de vendas e ela configura estoque, frete e notas para você.</p>
                </div>
                <div className="flex gap-3 mt-7">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 font-bold text-slate-400 hover:text-slate-600 px-4 py-3.5 transition-colors text-sm">
                    <ArrowLeft size={16} /> Voltar
                  </button>
                  <button onClick={close} className="flex-1 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold py-3.5 rounded-full transition-all">
                    Acessar meu painel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
