"use client";

import { useEffect, useRef, useState } from "react";
import { PenLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const SUPABASE_READY = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

type SaveState = "idle" | "saving" | "saved";

export function ReflectionBlock({
  blockId,
  content,
}: {
  blockId: string;
  content: Record<string, unknown> | null;
}) {
  const t = useTranslations();
  const prompt = (content?.prompt as string) ?? "";
  const [value, setValue] = useState("");
  const [state, setState] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load any existing reflection for this block.
  useEffect(() => {
    if (!SUPABASE_READY) return;
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("user_reflections")
        .select("content")
        .eq("user_id", user.id)
        .eq("block_id", blockId)
        .maybeSingle();
      const row = data as { content: string } | null;
      if (row?.content) setValue(row.content);
    })();
  }, [blockId]);

  function onChange(next: string) {
    setValue(next);
    setState("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(next), 700);
  }

  async function save(text: string) {
    if (!SUPABASE_READY) {
      setState("saved");
      return;
    }
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setState("idle");
      return;
    }
    await supabase
      .from("user_reflections")
      .upsert(
        { user_id: user.id, block_id: blockId, content: text },
        { onConflict: "user_id,block_id" },
      );
    setState("saved");
  }

  return (
    <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-semibold text-blue-600">
          <PenLine className="h-5 w-5" /> {t("learn.reflection")}
        </span>
        <span className="text-xs text-gray-500">
          {state === "saving"
            ? t("common.saving")
            : state === "saved"
              ? t("common.saved")
              : ""}
        </span>
      </div>
      <p className="text-gray-700">{prompt}</p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("learn.reflection_placeholder")}
      />
    </div>
  );
}
