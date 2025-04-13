
import { redirect } from "@remix-run/node";

export const loader = async () => {
  // Redirect to the embedded app route
  return redirect("/app");
};

export default function Index() {
  return (
    <iframe
      src="https://preview--auditai-insight-engine.lovable.app"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
      title="ConvertIQ CRO Assistant"
    />
  );
}
