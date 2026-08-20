import { DeviceFrame } from "@/components/shared/device-frame";
import type { CaseStudyMockup } from "@/types";

interface DeviceMockupProps extends CaseStudyMockup {
  className?: string;
  priority?: boolean;
}

export function DeviceMockup({ device, image, label, className, priority }: DeviceMockupProps) {
  return (
    <DeviceFrame
      device={device}
      image={image}
      alt={`${label} preview`}
      className={className}
      priority={priority}
    />
  );
}
