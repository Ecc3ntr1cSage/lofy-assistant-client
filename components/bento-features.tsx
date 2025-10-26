"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
} from "@tabler/icons-react";

export function BentoFeatures() {
  return (
    <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={item.className}

        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full rounded-xl bg-linear-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "Smart Calendar",
    description:
      "Instantly schedule meetings and create calendar events using simple, natural language input.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500 lg:col-span-3" />,
    className: "md:col-span-3",
  },
  {
    title: "Flexible Reminders",
    description: "Tailor reminders to any specific task or calendar event.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500 lg:col-span-2" />,
    className: "md:col-span-2",
  },
  {
    title: "Save To Memory",
    description:
      "Build a searchable archive of your mind. Capture ideas, notes, and fleeting thoughts the moment they strike.",
    header: <Skeleton />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500 lg:col-span-2" />,
    className: "md:col-span-3",
  },
  {
    title: "Voice Content Extraction",
    description:
      "Record meetings or voice notes for high-accuracy transcription. Instantly transform spoken content into your desired output, including smart summaries or clear action plans.",
    header: <Skeleton />,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500 lg:col-span-5" />,
    className: "md:col-span-5",
  },
  {
    title: "Centralized Task Management",
    description:
      "Command center for getting things done. Organize, assign, and plan your steps.",
    header: <Skeleton />,
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500 lg:col-span-3" />,
    className: "md:col-span-3",
  },
];
