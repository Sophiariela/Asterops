import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { DeviceMockup } from "./device-mockup";
import type { CaseStudy, CaseStudyMockup } from "@/types";

export function CaseStudyGallery({ caseStudy }: { caseStudy: CaseStudy }) {
  const { mockups, title, description, placeholderNotice } = caseStudy.gallery;
  const byDevice = (device: CaseStudyMockup["device"]) => mockups.find((mockup) => mockup.device === device);

  const desktop = byDevice("desktop");
  const laptop = byDevice("laptop");
  const tablet = byDevice("tablet");
  const mobile = byDevice("mobile");

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow="Visual Gallery"
          title={title}
          description={description}
          align="center"
          className="mx-auto items-center text-center"
        />

        <RevealGroup className="mt-14 flex flex-col gap-10">
          {desktop ? (
            <RevealItem className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3">
              <DeviceMockup {...desktop} className="w-full" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {desktop.label}
              </span>
            </RevealItem>
          ) : null}

          <RevealItem className="flex flex-wrap items-end justify-center gap-10">
            {laptop ? (
              <div className="flex w-full max-w-md flex-col items-center gap-3">
                <DeviceMockup {...laptop} />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {laptop.label}
                </span>
              </div>
            ) : null}
            {tablet ? (
              <div className="flex w-full max-w-[260px] flex-col items-center gap-3">
                <DeviceMockup {...tablet} />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {tablet.label}
                </span>
              </div>
            ) : null}
            {mobile ? (
              <div className="flex w-full max-w-[220px] flex-col items-center gap-3">
                <DeviceMockup {...mobile} />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {mobile.label}
                </span>
              </div>
            ) : null}
          </RevealItem>
        </RevealGroup>

        <p className="mx-auto mt-12 max-w-xl text-center text-xs italic leading-relaxed text-muted-foreground/80">
          {placeholderNotice}
        </p>
      </div>
    </section>
  );
}
