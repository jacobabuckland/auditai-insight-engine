import { TitleBar } from "@shopify/app-bridge-react";
import { useRouteLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  return null;
};

export default function Index() {
  const rootData = useRouteLoaderData("root");

  return (
    <>
      <TitleBar title="AuditAI" />
      <iframe
        src="https://preview--auditai-insight-engine.lovable.app"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
        }}
      />
    </>
  );
}
