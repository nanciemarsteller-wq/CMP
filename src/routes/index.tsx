import { createFileRoute } from "@tanstack/react-router";
import { FptCmpHome } from "@/components/fpt-cmp-home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FPT CMP — Nền tảng quản lý sự đồng ý" },
      { name: "description", content: "FPT CMP giúp doanh nghiệp thu thập, quản lý, tra cứu sự đồng ý xử lý dữ liệu cá nhân và lựa chọn cookies tập trung." },
      { property: "og:title", content: "FPT CMP — Nền tảng quản lý sự đồng ý" },
      { property: "og:description", content: "Quản lý consent, lựa chọn cookies, bằng chứng và báo cáo trên một nền tảng tập trung." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <FptCmpHome />;
}
