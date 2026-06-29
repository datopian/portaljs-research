"use client";

import { useMemo, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  ChevronDown,
  Clipboard,
  Code2,
  Download,
  Fingerprint,
  GraduationCap,
  Link2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { envVars } from "@/lib/env";
import { Dataset } from "@/schemas/ckan";
import { CitationStyle, formatDatasetCitation } from "@/lib/citation";
import { ApiAccessStyle, formatDatasetApiSnippet } from "@/lib/api-access";
import { generateMockDoi } from "@/lib/doi";
import { getDatasetStableUrl } from "@/lib/dataset-links";
import { useTranslations } from "next-intl";

type ActiveModal = null | "stable-url" | "citation" | "api-access";

const citationStyles = [
  { id: "apa", label: "APA" },
  { id: "bibtex", label: "BibTeX" },
] as const;

const accessStyles = [
  { id: "curl", label: "curl" },
  { id: "python", label: "Python" },
  { id: "r", label: "R" },
  { id: "javascript", label: "JavaScript" },
] as const;

function SnippetBlock({ content }: { content: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-[color:var(--border)] bg-[color:var(--foreground)] p-3.5 text-[13px] leading-6 whitespace-pre-wrap text-white/90">
      <code>{content}</code>
    </pre>
  );
}

export default function DatasetReusePanel({ dataset }: { dataset: Dataset }) {
  const t = useTranslations("Common");
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [citationStyle, setCitationStyle] = useState<CitationStyle>("apa");
  const [accessStyle, setAccessStyle] = useState<ApiAccessStyle>("curl");
  const panelRef = useRef<HTMLDivElement>(null);

  const datasetDoi = useMemo(() => generateMockDoi(dataset.name), [dataset.name]);
  const datasetStableUrl = useMemo(
    () => getDatasetStableUrl(dataset, envVars.siteUrl),
    [dataset],
  );
  const datasetCitation = useMemo(
    () =>
      formatDatasetCitation(dataset, {
        style: citationStyle,
        stableUrl: datasetStableUrl,
        doi: datasetDoi,
        publisher: "Research Portal",
      }),
    [citationStyle, dataset, datasetDoi, datasetStableUrl],
  );
  const datasetAccessSnippet = useMemo(
    () =>
      formatDatasetApiSnippet(dataset, {
        style: accessStyle,
        apiBaseUrl: envVars.dms ?? envVars.siteUrl,
      }),
    [accessStyle, dataset],
  );

  const copyValue = async (label: string, value?: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch (error) {
      console.error(`Failed to copy ${label}`, error);
    }
  };

  return (
    <section className="">
      <div ref={panelRef} className="relative">
        <Button
       
          variant={"outline"}
          onClick={() => setIsOpen((open) => !open)}
          className="h-10 w-full justify-between px-3.5 text-sm"
        >
          <span className="inline-flex items-center gap-2">
            <Code2 className="size-3.5" />
            Use this dataset
          </span>
          <ChevronDown
            className={`size-3.5 transition ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>

        {isOpen ? (
          <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white py-1.5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.4)]">
            <button
              type="button"
              onClick={() => {
                setActiveModal("api-access");
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-accent/5 hover:text-accent"
            >
              <Code2 className="size-3.5 text-muted-foreground" />
              API access
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveModal("citation");
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-accent/5 hover:text-accent"
            >
              <GraduationCap className="size-3.5 text-muted-foreground" />
              Cite this dataset
            </button>
            <button
              type="button"
              onClick={() => {
                void copyValue("doi", datasetDoi);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-accent/5 hover:text-accent"
            >
              <Fingerprint className="size-3.5 text-muted-foreground" />
              {copiedField === "doi" ? "DOI copied" : "Copy DOI"}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveModal("stable-url");
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-accent/5 hover:text-accent"
            >
              <Link2 className="size-3.5 text-muted-foreground" />
              Show stable URL
            </button>
          </div>
        ) : null}
      </div>

  
      <Dialog
        open={activeModal === "stable-url"}
        onClose={() => setActiveModal(null)}
        className="relative z-[90]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/35" />
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Stable URL</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Use this persistent dataset URL for sharing, citation, and long-term reference.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal(null)}
                className="panel-icon-button"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-muted/40 p-4 text-sm break-all text-foreground">
              {datasetStableUrl}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => void copyValue("stable-url", datasetStableUrl)}
              >
                <Clipboard className="size-4" />
                {copiedField === "stable-url" ? t("copied") : "Copy stable URL"}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={activeModal === "citation"}
        onClose={() => setActiveModal(null)}
        className="relative z-[90]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/35" />
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Cite this dataset</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Choose a citation format and copy a ready-to-use reference generated from this dataset&apos;s metadata.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal(null)}
                className="panel-icon-button"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {citationStyles.map((style) => (
                <Button
                  key={style.id}
                  type="button"
                  variant={citationStyle === style.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCitationStyle(style.id)}
                >
                  {style.label}
                </Button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-muted/40 p-4 text-sm leading-7 whitespace-pre-wrap text-foreground">
              {datasetCitation}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void copyValue("citation", datasetCitation)}>
                <Clipboard className="size-4" />
                {copiedField === "citation" ? t("copied") : "Copy citation"}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={activeModal === "api-access"}
        onClose={() => setActiveModal(null)}
        className="relative z-[90]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/35" />
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">API access</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Use one of these starter snippets to access this dataset programmatically.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal(null)}
                className="panel-icon-button"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {accessStyles.map((style) => (
                <Button
                  key={style.id}
                  type="button"
                  variant={accessStyle === style.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAccessStyle(style.id)}
                >
                  {style.label}
                </Button>
              ))}
            </div>

            <div className="mt-4">
              <SnippetBlock content={datasetAccessSnippet} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void copyValue("api-access", datasetAccessSnippet)}>
                <Clipboard className="size-4" />
                {copiedField === "api-access" ? t("copied") : "Copy snippet"}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
