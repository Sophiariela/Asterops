"use client";

import * as React from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Espelha o schema do servidor em /api/contact — mudou um, muda o outro. */
const inquirySchema = z.object({
  name: z.string().min(2, "Escreva seu nome."),
  email: z.string().email("Escreva um e-mail válido."),
  whatsapp: z
    .string()
    .min(10, "Escreva seu WhatsApp com DDD.")
    .regex(/^[\d\s()+-]+$/, "Use apenas números, espaços e os sinais ( ) + -."),
  businessName: z.string().optional(),
  businessType: z.string().min(1, "Escolha o tipo de negócio."),
  service: z.string().min(1, "Escolha o que você precisa."),
  message: z.string().min(10, "Conte um pouco mais — pelo menos 10 caracteres."),
  problem: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

type InquiryValues = z.infer<typeof inquirySchema>;
type Status = "idle" | "submitting" | "success" | "error";

const DEFAULT_ERROR = "Não consegui enviar agora. Tente de novo em instantes.";

const businessTypes = [
  "Salão de beleza",
  "Studio de unhas",
  "Lash / brow designer",
  "Estética / esteticista",
  "Clínica ou spa",
  "Barbearia",
  "Profissional autônomo",
  "Outro",
];

const budgets = [
  "Ainda não sei",
  "Até R$ 2.000",
  "R$ 2.000 a R$ 5.000",
  "R$ 5.000 a R$ 10.000",
  "Acima de R$ 10.000",
];

const timelines = ["O quanto antes", "Nas próximas semanas", "Nos próximos meses", "Só pesquisando"];

const fieldClass =
  "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export interface ContactFormProps {
  serviceOptions: string[];
  tierOptions?: string[];
  /** Pré-selecionado ao chegar de um cartão de solução (`?servico=`). */
  defaultService?: string;
  /** Pré-selecionado ao chegar de um nível (`?plano=`). */
  defaultTier?: string;
}

export function ContactForm({
  serviceOptions,
  tierOptions = [],
  defaultService,
  defaultTier,
}: ContactFormProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Partial<Record<keyof InquiryValues, string>>>({});
  const [errorMessage, setErrorMessage] = React.useState(DEFAULT_ERROR);
  const formRef = React.useRef<HTMLFormElement>(null);

  const knownService = defaultService && serviceOptions.includes(defaultService) ? defaultService : undefined;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setErrors({});

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      whatsapp: String(data.get("whatsapp") ?? "").trim(),
      businessName: String(data.get("businessName") ?? "").trim(),
      businessType: String(data.get("businessType") ?? ""),
      service: String(data.get("service") ?? ""),
      message: String(data.get("message") ?? "").trim(),
      problem: String(data.get("problem") ?? "").trim(),
      budget: String(data.get("budget") ?? ""),
      timeline: String(data.get("timeline") ?? ""),
    };

    const parsed = inquirySchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof InquiryValues, string>> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as keyof InquiryValues] = issue.message;
      }
      setErrors(fieldErrors);
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(fieldErrors)[0]}"]`);
      first?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, tier: defaultTier }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(typeof body?.error === "string" ? body.error : undefined);
      }
      setStatus("success");
      form.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : DEFAULT_ERROR);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-lg border border-accent/40 bg-accent/[0.06] p-8"
      >
        <CheckCircle2 className="h-6 w-6 text-accent-ink" aria-hidden />
        <h2 className="text-lg font-medium text-foreground">Recebemos seu pedido.</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Vamos ler com calma e responder em até um dia útil, no e-mail ou no WhatsApp que você deixou. Se
          for urgente, chame a gente direto no WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {defaultTier ? (
        <p className="rounded-md border border-accent/30 bg-accent/[0.06] px-4 py-3 text-sm text-foreground">
          Nível selecionado: <strong className="font-medium">{defaultTier}</strong>. Dá para mudar depois —
          o escopo final sai do diagnóstico.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Seu nome</Label>
          <Input id="name" name="name" placeholder="Maria Silva" autoComplete="name" />
          {errors.name ? <p className="text-sm text-red-400">{errors.name}</p> : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" inputMode="tel" placeholder="(71) 90000-0000" autoComplete="tel" />
          {errors.whatsapp ? <p className="text-sm text-red-400">{errors.whatsapp}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="maria@studio.com.br" autoComplete="email" />
          {errors.email ? <p className="text-sm text-red-400">{errors.email}</p> : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="businessName">Nome do negócio</Label>
          <Input
            id="businessName"
            name="businessName"
            placeholder="Studio Maria"
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="businessType">Tipo de negócio</Label>
          <select id="businessType" name="businessType" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Selecione
            </option>
            {businessTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.businessType ? <p className="text-sm text-red-400">{errors.businessType}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="service">O que você precisa</Label>
          <select id="service" name="service" defaultValue={knownService ?? ""} className={fieldClass}>
            <option value="" disabled>
              Selecione
            </option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="Integrações">Integrações</option>
            <option value="Ainda não sei">Ainda não sei</option>
          </select>
          {errors.service ? <p className="text-sm text-red-400">{errors.service}</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Conte o que você quer resolver</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Ex.: quero que minhas clientes marquem horário sozinhas, sem eu responder cada mensagem."
        />
        {errors.message ? <p className="text-sm text-red-400">{errors.message}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="problem">O que mais atrapalha hoje (opcional)</Label>
        <Textarea
          id="problem"
          name="problem"
          rows={3}
          placeholder="Ex.: perco cliente porque demoro a responder e esqueço de confirmar os horários."
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget">Investimento previsto (opcional)</Label>
          <select id="budget" name="budget" defaultValue="" className={fieldClass}>
            <option value="">Prefiro não dizer</option>
            {budgets.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="timeline">Prazo desejado (opcional)</Label>
          <select id="timeline" name="timeline" defaultValue="" className={fieldClass}>
            <option value="">Sem prazo definido</option>
            {timelines.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {tierOptions.length > 0 && defaultTier ? (
        <input type="hidden" name="tier" value={defaultTier} />
      ) : null}

      {status === "error" ? (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-fit">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Enviando
          </>
        ) : (
          <>
            Solicitar diagnóstico
            <Send className="h-4 w-4" aria-hidden />
          </>
        )}
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Usamos esses dados só para responder o seu pedido. Nada de lista de disparo.
      </p>
    </form>
  );
}
