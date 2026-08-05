import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

type AuthorizationDetails = {
  client?: { name?: string; client_name?: string; logo_uri?: string } | null;
  scope?: string | null;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Thiếu authorization_id trong đường dẫn.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: err } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (err) {
        setError(err.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error: err } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Máy chủ uỷ quyền không trả về đường dẫn chuyển tiếp.");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "ứng dụng này";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo />
          </div>
          {error ? (
            <>
              <CardTitle className="font-heading text-xl">Không thể xử lý yêu cầu</CardTitle>
              <CardDescription>{error}</CardDescription>
            </>
          ) : !details ? (
            <>
              <CardTitle className="font-heading text-xl">Đang tải…</CardTitle>
              <CardDescription>Vui lòng đợi trong giây lát.</CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="font-heading text-xl">Kết nối {clientName} với tài khoản của bạn</CardTitle>
              <CardDescription>
                {clientName} sẽ có thể xem khách sạn, tình trạng phòng, đơn đặt phòng và danh sách yêu thích của bạn
                trên Easybooko với quyền của chính bạn.
              </CardDescription>
            </>
          )}
        </CardHeader>
        {details && !error && (
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
              {busy ? "Đang xử lý…" : "Cho phép"}
            </Button>
            <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>
              Từ chối
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default OAuthConsent;
