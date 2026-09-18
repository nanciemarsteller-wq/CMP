import { createFileRoute } from "@tanstack/react-router";
import { FptCmpHome } from "@/components/fpt-cmp-home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FPT CMP — Nền tảng Quản trị Sự đồng ý & Quyền riêng tư Dữ liệu cá nhân" },
      { name: "description", content: "Quản lý tập trung sự đồng ý của khách hàng trên mọi kênh, từ thu thập đến lưu trữ và quản trị." },
      { property: "og:title", content: "FPT CMP — Nền tảng Quản trị Sự đồng ý & Quyền riêng tư Dữ liệu cá nhân" },
      { property: "og:description", content: "Quản lý tập trung sự đồng ý của khách hàng trên mọi kênh, từ thu thập đến lưu trữ và quản trị." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <FptCmpHome />;
}
