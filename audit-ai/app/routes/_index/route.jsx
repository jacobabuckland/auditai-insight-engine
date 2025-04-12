import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    window.location.href = "https://preview--auditai-insight-engine.lovable.app";
  }, []);

  return (
    <Page fullWidth>
      <TitleBar title="AuditAI Dashboard" />
      <iframe
        src="https://preview--auditai-insight-engine.lovable.app"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="AuditAI"
      />
    </Page>
  );
}
