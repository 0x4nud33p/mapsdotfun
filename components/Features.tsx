import { cn } from "@/lib/utils";
import {
  IconPlaceholder,
  IconHistory,
  IconChartAreaLineFilled,
  IconTimeDuration0,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Real-Time Analysis",
      description:
        "Monitor token launches and transactions as they happen on Solana.",
      icon: <IconTimeDuration0 />,
    },
    {
      title: "Ownership Mapping",
      description:
        "Visualize wallet relationships and detect insider trading patterns.",
      icon: <IconChartAreaLineFilled />,
    },
    {
      title: "Historical Data",
      description:
        "Access complete transaction history and holder distribution.",
      icon: <IconHistory />,
    },
    {
      title: "Verify Legitimacy",
      description:
        "Get instant risk scores and legitimacy ratings based on on-chain data.",
      icon: <IconPlaceholder />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-800/50",
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b"
      )}
    >
      {/* Hover background effect */}
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent_70%)] pointer-events-none" />

      {/* Icon */}
      <div className="mb-4 relative z-10 px-10 text-emerald-400 group-hover/feature:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Title */}
      <div className="text-lg font-semibold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-emerald-600 group-hover/feature:bg-emerald-400 transition-all duration-200 origin-center shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-100">
          {title}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-400 max-w-xs relative z-10 px-10 group-hover/feature:text-neutral-200 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};
