import { getTranslations } from "next-intl/server";
import { Award, CheckCircle2, XCircle } from "lucide-react";
import QRCode from "qrcode";
import { getCertificateByUid } from "@/lib/data";
import type { CertificateStatus } from "@/lib/supabase/types";

const STATUS_STYLE: Record<
  CertificateStatus,
  { className: string; icon: typeof CheckCircle2 }
> = {
  active: { className: "text-success", icon: CheckCircle2 },
  expired: { className: "text-gray-500", icon: XCircle },
  revoked: { className: "text-error", icon: XCircle },
};

export default async function VerifyPage({
  params,
}: {
  params: { uid: string };
}) {
  const t = await getTranslations("certificate");
  const view = await getCertificateByUid(params.uid);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const pageUrl = `${appUrl}/verify/${params.uid}`;
  const qr = await QRCode.toDataURL(pageUrl, { margin: 1, width: 160 });

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2 text-blue-900">
          <Award className="h-7 w-7 text-gold-500" />
          <span className="font-heading text-xl font-black">Karatou Academy</span>
        </div>

        {!view ? (
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm">
            <XCircle className="mx-auto mb-3 h-12 w-12 text-error" />
            <h1 className="font-heading text-lg font-bold text-gray-900">
              {t("not_found")}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{t("not_found_body")}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
            <div className="bg-blue-900 px-6 py-4 text-white">
              <h1 className="font-heading text-lg font-bold">
                {t("verify_title")}
              </h1>
            </div>
            <div className="space-y-4 p-6">
              {(() => {
                const style = STATUS_STYLE[view.certificate.status];
                const Icon = style.icon;
                return (
                  <div className={`flex items-center gap-2 ${style.className}`}>
                    <Icon className="h-6 w-6" />
                    <span className="text-lg font-semibold">
                      {t(view.certificate.status)}
                    </span>
                  </div>
                );
              })()}

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">{t("holder")}</dt>
                  <dd className="font-medium text-gray-900">
                    {view.holderName ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">{t("module")}</dt>
                  <dd className="font-medium text-gray-900">
                    {view.moduleTitle ?? "—"}
                  </dd>
                </div>
                {view.organizationName && (
                  <div>
                    <dt className="text-gray-500">{t("organization")}</dt>
                    <dd className="font-medium text-gray-900">
                      {view.organizationName}
                    </dd>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-gray-500">{t("issued")}</dt>
                    <dd className="font-mono-data text-gray-900">
                      {new Date(view.certificate.issued_at).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">{t("expires")}</dt>
                    <dd className="font-mono-data text-gray-900">
                      {new Date(view.certificate.expires_at).toLocaleDateString()}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="text-gray-500">ID</dt>
                  <dd className="font-mono-data text-gray-900">
                    {view.certificate.certificate_uid}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-col items-center gap-2 border-t border-gray-100 pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="QR code" width={160} height={160} />
                <p className="break-all text-center text-xs text-gray-500">
                  {pageUrl}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
