import React, { useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown, InfoIcon } from "lucide-react";
import Link from "next/link";

const MOCK_EMISSION_MONTH_DATA = 114.74;

const RenderGlobalEmission = ({ value }: { value: number }) => {
  const { decimalPart, integerPart } = useMemo(() => {
    const [integerPart, decimalPart] = value.toString().split(".");
    return {
      integerPart,
      decimalPart,
    };
  }, [value]);
  return (
    <span className="flex items-baseline">
      <span className="text-5xl font-semibold font-sans">{integerPart}.</span>
      <span className="text-3xl text-muted-foreground">{decimalPart}</span>
    </span>
  );
};

function GlobalEmission() {
  return (
    <div className="w-full md:w-1/3">
      <div className="flex items-center gap-1">
        <h1 className="text-sm text-muted-foreground">Global Emissions</h1>
        <Popover>
          <PopoverTrigger asChild>
            <InfoIcon className="w-4 h-4" />
          </PopoverTrigger>
          <PopoverContent className="shadow-none border border-foreground/20 rounded-3xl">
            <p className="text-xs font-sans">
              Carbon dioxide (CO2) emissions from the use of fossil fuels and
              the production of cement are the main driving force of climate
              change.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-2xl font-semibold mt-4 font-sans flex  items-baseline mb-2">
        <RenderGlobalEmission value={MOCK_EMISSION_MONTH_DATA} />
        <span className="text-base ml-2">MtCO2 per Day</span>
      </p>

      <p className="text-sm text-muted-foreground mt-4">
        As of September 1, 2025
      </p>
      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
        <ChevronDown className="w-4 h-4 text-green-500" />
        <span className="text-sm">1.2% from last month</span>
      </p>
      <p className="text-xs text-muted-foreground mt-4">
        Data Extracted from{" "}
        <Link
          href="https://carbonmonitor.org/"
          target="_blank"
          className="text-blue-500 underline"
        >
          Carbon Monitor
        </Link>
      </p>
    </div>
  );
}

export default GlobalEmission;
