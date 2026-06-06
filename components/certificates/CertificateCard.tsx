import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Certificate, CertificateStatus } from "@/lib/supabase/types";

const STATUS_VARIANT: Record<CertificateStatus, "success" | "error" | "neutral"> = {
  active: "success",
  expired: "neutral",
  revoked: "error",
};

export async function CertificateCard({
  certificate,
  moduleTitle,
}: {
  certificate: Certificate;
  moduleTitle: string | null;
}) {
  const t = await getTranslations("certificate");
  const issued = new Date(certificate.issued_at).toLocaleDateString();
  const expires = new Date(certificate.expires_at).toLocaleDateString();

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-100">
              <Award className="h-5 w-5 text-gold-500" />
            </div>
            <h3 className="font-heading text-base font-bold text-gray-900">
              {moduleTitle ?? "—"}
            </h3>
          </div>
          <Badge variant={STATUS_VARIANT[certificate.status]}>
            {t(certificate.status)}
          </Badge>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-gray-500">{t("issued")}</dt>
            <dd className="font-mono-data text-gray-900">{issued}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{t("expires")}</dt>
            <dd className="font-mono-data text-gray-900">{expires}</dd>
          </div>
        </dl>
        <p className="font-mono-data text-xs text-gray-500">
          {certificate.certificate_uid}
        </p>
        <Link
          href={`/verify/${certificate.certificate_uid}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-500"
        >
          {t("verify_title")} <ExternalLink className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
