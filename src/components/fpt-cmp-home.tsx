import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Clock3,
  FileSearch,
  Menu,
  Network,
  Newspaper,
  Play,
  Search,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";
import { z } from "zod";

import logo from "@/assets/product/fpt-logo.png";
import cookieBanner from "@/assets/product/cmp-22.webp";
import scanDomain from "@/assets/product/cmp-23.webp";
import dataConsent from "@/assets/product/cmp-24.webp";
import consentList from "@/assets/product/cmp-25.webp";
import consentReport from "@/assets/product/cmp-26.webp";

const navItems = [
  ["Tổng quan", "tong-quan"],
  ["Tính năng", "tinh-nang"],
  ["Tích hợp", "tich-hop"],
  ["Case study", "case-study"],
  ["Tin tức", "tin-tuc"],
  ["Câu hỏi thường gặp", "faq"],
] as const;

const partnerPlaceholders = ["Đối tác 01", "Đối tác 02", "Đối tác 03", "Đối tác 04", "Đối tác 05", "Đối tác 06"] as const;

const caseStudies = [
  { tag: "Dự án tham khảo", title: "vbpl.vn", text: "Thông tin triển khai thực tế đang được cập nhật.", image: cookieBanner },
  { tag: "Dự án tham khảo", title: "greenbaytech.com.vn", text: "Thông tin triển khai thực tế đang được cập nhật.", image: consentList },
  { tag: "Dự án tham khảo", title: "hvtsurvey.com.vn", text: "Thông tin triển khai thực tế đang được cập nhật.", image: consentReport },
] as const;

const newsPlaceholders = [
  ["Kiến thức CMP", "Doanh nghiệp nên chuẩn bị gì trước khi triển khai quản lý consent?"],
  ["Quản lý cookies", "Từ phân loại cookies đến ghi nhận lựa chọn của người dùng"],
  ["Vận hành dữ liệu", "Kết nối các điểm thu thập consent với hệ thống doanh nghiệp"],
] as const;

type SolutionTab = { label: string; heading: string; text: string; image?: string; alt?: string; chips?: readonly string[] };

const solutionTabs: readonly SolutionTab[] = [
  {
    label: "Quản trị Sự đồng ý",
    heading: "Tập trung hóa việc thu thập và quản lý Consent",
    text: "Chuẩn hóa quy trình thu thập, ghi nhận và quản lý sự đồng ý của khách hàng trên các kênh và điểm chạm, đảm bảo Consent được quản lý thống nhất và xuyên suốt vòng đời dữ liệu.",
    image: dataConsent,
    alt: "Giao diện Data Consent của FPT CMP",
  },
  {
    label: "Minh bạch & Truy xuất",
    heading: "Ghi nhận đầy đủ lịch sử và bằng chứng Consent",
    text: "Lưu trữ thông tin, trạng thái và lịch sử thay đổi của Consent, hỗ trợ doanh nghiệp truy xuất, đối soát và cung cấp bằng chứng khi cần kiểm tra hoặc thực hiện các yêu cầu liên quan đến dữ liệu.",
    image: consentList,
    alt: "Giao diện danh sách Consent của FPT CMP",
  },
  {
    label: "Quản trị & Tuân thủ",
    heading: "Hỗ trợ chuẩn hóa quy trình quản trị dữ liệu cá nhân",
    text: "Thiết lập cơ chế quản trị Consent theo chính sách của doanh nghiệp, hỗ trợ kiểm soát việc thu thập và sử dụng dữ liệu phù hợp với các yêu cầu về bảo vệ dữ liệu cá nhân.",
    image: consentReport,
    alt: "Giao diện báo cáo Consent của FPT CMP",
  },
  {
    label: "Kết nối & Vận hành",
    heading: "Đồng bộ Consent trên toàn bộ hệ sinh thái",
    text: "Kết nối với các hệ thống và nền tảng hiện hữu như CRM, CDP, Website, App, Marketing… giúp đồng bộ trạng thái Consent, tăng tính nhất quán trong quản lý và nâng cao hiệu quả vận hành.",
    chips: ["CRM", "CDP", "Website", "App", "Marketing"],
  },
];

type ProblemItem = { icon: typeof FileSearch; title: string; text: string };

const problemItems: readonly ProblemItem[] = [
  { icon: Network, title: "Dữ liệu phân tán, khó quản trị tập trung", text: "Dữ liệu khách hàng được thu thập và lưu trữ trên Website, App, CRM…, gây khó khăn trong quản lý thống nhất và kiểm soát toàn diện." },
  { icon: FileSearch, title: "Hạn chế khả năng truy xuất, đối soát", text: "Thiếu cơ chế ghi nhận và quản lý xuyên suốt lịch sử thu thập, sử dụng và xử lý dữ liệu, làm tăng thời gian kiểm tra, đối soát." },
  { icon: Settings2, title: "Thiếu minh bạch trong thu thập dữ liệu", text: "Thông tin về mục đích, phạm vi và phương thức xử lý dữ liệu chưa được chuẩn hóa trên các kênh, ảnh hưởng đến tính minh bạch và trải nghiệm khách hàng." },
  { icon: FileSearch, title: "Khó đáp ứng quyền của chủ thể dữ liệu", text: "Chưa có quy trình tập trung để tiếp nhận, xác minh và xử lý yêu cầu rút lại sự đồng ý, hạn chế hoặc phản đối xử lý dữ liệu." },
  { icon: ShieldCheck, title: "Gia tăng rủi ro tuân thủ", text: "Quy trình và chính sách quản trị dữ liệu chưa được chuẩn hóa đồng bộ, tiềm ẩn rủi ro khi đáp ứng yêu cầu bảo vệ dữ liệu cá nhân." },
  { icon: Building2, title: "Thiếu cơ chế phối hợp liên phòng ban", text: "Marketing, IT, Pháp chế và các đơn vị liên quan chưa có cơ chế quản trị thống nhất, gây khó khăn trong phối hợp, kiểm soát và khai thác dữ liệu." },
];

type Feature = {
  title: string;
  description: string;
  bullets: readonly string[];
  image: string;
  alt: string;
  cta?: boolean;
  highlighted?: boolean;
};

const features: readonly Feature[] = [
  {
    title: "Linh hoạt thiết kế trải nghiệm xin sự đồng ý",
    description: "Tùy chỉnh Cookie banner theo nhận diện thương hiệu và yêu cầu quản trị của doanh nghiệp, đồng thời kiểm soát cách thức hiển thị thông tin và lựa chọn của người dùng.",
    bullets: ["Tùy chỉnh giao diện theo nhận diện thương hiệu.", "Thiết lập nội dung và cách hiển thị banner.", "Phân loại cookie theo mục đích sử dụng.", "Hỗ trợ quản lý lựa chọn đồng ý hoặc từ chối của người dùng."],
    image: cookieBanner,
    alt: "Giao diện Cookie Banner của FPT CMP",
  },
  {
    title: "Chủ động nhận diện rủi ro tuân thủ",
    description: "Tự động quét và phân tích các điểm thu thập dữ liệu trên hệ thống, hỗ trợ doanh nghiệp nhận diện các vấn đề có thể ảnh hưởng đến yêu cầu tuân thủ về dữ liệu cá nhân và sự đồng ý.",
    bullets: ["Quét các điểm thu thập dữ liệu trên website.", "Phát hiện các vấn đề liên quan đến cơ chế xin và quản lý sự đồng ý.", "Tổng hợp kết quả theo nhóm rủi ro.", "Hỗ trợ doanh nghiệp chủ động rà soát và xử lý."],
    image: scanDomain,
    alt: "Giao diện báo cáo Scan Domain của FPT CMP",
  },
  {
    title: "Quản lý tập trung sự đồng ý trên mọi kênh",
    description: "Thu thập và quản lý thông tin đồng ý của khách hàng từ nhiều điểm tiếp xúc như Website, Ứng dụng, CRM và các nền tảng số khác trên một hệ thống thống nhất. Dễ dàng theo dõi trạng thái đồng ý theo từng khách hàng, mục đích và phạm vi xử lý dữ liệu.",
    bullets: ["Tập trung dữ liệu sự đồng ý trên một nền tảng.", "Quản lý theo từng mục đích và phạm vi xử lý.", "Đồng bộ trạng thái giữa các kênh và hệ thống liên quan.", "Hỗ trợ quản lý xuyên suốt vòng đời sự đồng ý."],
    image: dataConsent,
    alt: "Giao diện thu thập sự đồng ý của FPT CMP",
    cta: true,
  },
  {
    title: "Lưu lịch sử đồng ý và khả năng truy vết",
    description: "Ghi nhận đầy đủ lịch sử đồng ý, từ chối hoặc thay đổi lựa chọn của chủ thể dữ liệu, giúp doanh nghiệp dễ dàng kiểm tra quá trình xử lý và cung cấp bằng chứng khi cần.",
    bullets: ["Lưu lịch sử đồng ý, từ chối và thay đổi trạng thái.", "Ghi nhận thời điểm, mục đích và phạm vi đồng ý.", "Theo dõi lịch sử thay đổi theo từng chủ thể dữ liệu.", "Hỗ trợ truy xuất thông tin khi kiểm tra hoặc đối soát."],
    image: consentList,
    alt: "Giao diện danh sách Consent của FPT CMP",
  },
  {
    title: "Chuẩn hóa báo cáo, hỗ trợ đáp ứng yêu cầu quản lý",
    description: "Hỗ trợ doanh nghiệp tổng hợp và xuất thông tin theo cấu trúc biểu mẫu A05, giảm thao tác tổng hợp thủ công và thuận tiện hơn trong quá trình chuẩn bị hồ sơ, báo cáo liên quan.",
    bullets: ["Hỗ trợ tổng hợp dữ liệu theo biểu mẫu A05.", "Chuẩn hóa thông tin phục vụ báo cáo.", "Giảm thời gian tổng hợp dữ liệu thủ công.", "Hỗ trợ tra cứu và đối chiếu dữ liệu khi cần."],
    image: consentReport,
    alt: "Giao diện báo cáo Consent của FPT CMP",
    highlighted: true,
  },
];

const faqs = [
  ["CMP của FPT có thể tích hợp với các hệ thống CRM, CDP, ERP hiện có của doanh nghiệp không?", "Có. FPT CMP được xây dựng theo kiến trúc API-first và microservices, hỗ trợ tích hợp linh hoạt với CRM, CDP/DMP, ERP, Marketing Automation, Core Banking, Google Tag Manager và IAB TCF. Phạm vi và thời gian tích hợp được xác định theo hệ thống hiện tại của doanh nghiệp."],
  ["Doanh nghiệp nên tự xây dựng hệ thống quản lý Consent hay lựa chọn nền tảng CMP chuyên biệt?", "Doanh nghiệp cần cân nhắc khả năng đáp ứng yêu cầu pháp lý, việc cập nhật tuân thủ liên tục, nguồn lực đầu tư, cơ chế quản trị liên phòng ban và mức độ tập trung vào năng lực cốt lõi."],
  ["Doanh nghiệp nhỏ dưới 50 nhân viên có được miễn tuân thủ Luật Bảo vệ dữ liệu cá nhân không?", "Theo Điều 41 Nghị định 356/2025/NĐ-CP, doanh nghiệp siêu nhỏ và startup có thể được hưởng một số cơ chế hỗ trợ nhất định. Doanh nghiệp trong các lĩnh vực có dữ liệu nhạy cảm vẫn nên chủ động triển khai tuân thủ sớm."],
  ["Dữ liệu cá nhân thông thường và dữ liệu cá nhân nhạy cảm được phân biệt như thế nào?", "Dữ liệu thông thường gồm họ tên, giới tính, nghề nghiệp, số điện thoại, email. Dữ liệu nhạy cảm gồm dữ liệu sức khỏe, sinh trắc học, tài khoản ngân hàng, hồ sơ y tế, vị trí và tài chính; nhóm này yêu cầu mức độ bảo vệ cao hơn."],
  ["Doanh nghiệp cần xử lý thế nào khi chủ thể dữ liệu rút lại sự đồng ý?", "Doanh nghiệp cần ngừng xử lý dữ liệu trong phạm vi sự đồng ý đã được rút lại, đồng bộ trạng thái Consent trên các hệ thống liên quan, đồng thời ghi nhận đầy đủ thời điểm, nội dung và lịch sử xử lý yêu cầu."],
  ["Việc chuyển dữ liệu cá nhân ra nước ngoài cần đáp ứng những điều kiện nào?", "Doanh nghiệp cần đáp ứng các yêu cầu pháp lý về chuyển giao dữ liệu xuyên biên giới, bao gồm việc thực hiện đánh giá tác động chuyển dữ liệu cá nhân xuyên biên giới theo quy định áp dụng."],
  ["Doanh nghiệp có bắt buộc thực hiện Đánh giá tác động xử lý dữ liệu cá nhân (DPIA) không?", "Theo Nghị định 356/2025/NĐ-CP, doanh nghiệp phải lập DPIA trong nhiều trường hợp có nguy cơ ảnh hưởng đến quyền riêng tư của chủ thể dữ liệu. FPT hỗ trợ quản lý hồ sơ, tiến độ đánh giá và tài liệu tuân thủ."],
  ["Sự đồng ý của chủ thể dữ liệu cần đáp ứng những điều kiện nào để được coi là hợp lệ?", "Consent cần tự nguyện, riêng biệt cho từng mục đích xử lý, được thông báo đầy đủ, cụ thể, rõ ràng, có thể rút lại bất kỳ lúc nào và có khả năng chứng minh khi kiểm toán."],
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Button({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; variant?: "primary" | "secondary"; className?: string; disabled?: boolean }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={`btn btn-${variant} ${className}`}>{children}</button>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner">
    <a href="#tong-quan" className="brand" aria-label="FPT CMP - Trang chủ"><img src={logo} alt="FPT" width="70" height="47" /><span><b>FPT CMP</b><small>Consent Management Platform</small></span></a>
    <nav className="desktop-nav" aria-label="Điều hướng chính">{navItems.map(([label,id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    <Button onClick={() => scrollTo("dang-ky-demo")} className="desktop-cta">Đăng ký demo</Button>
    <button className="menu-button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <nav className="mobile-nav" aria-label="Điều hướng trên thiết bị di động">{navItems.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}<Button onClick={() => { setOpen(false); scrollTo("dang-ky-demo"); }}>Đăng ký demo</Button></nav>}
  </div></header>;
}

const leadSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ và tên.").max(100),
  phone: z.string().trim().regex(/^\+?[0-9][0-9\s().-]{7,17}$/, "Số điện thoại chưa hợp lệ."),
  company: z.string().trim().min(2, "Vui lòng nhập tên doanh nghiệp.").max(150),
  email: z.string().trim().max(255).refine((value) => !value || z.string().email().safeParse(value).success, "Email chưa hợp lệ."),
  interest: z.string().max(120),
  consent: z.literal(true, { errorMap: () => ({ message: "Vui lòng xác nhận trước khi gửi." }) }),
});

function LeadForm({ variant }: { variant: "hero" | "footer" }) {
  const prefix = `${variant}-${useId().replaceAll(":", "")}`;
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [notice, setNotice] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setNotice("");
    const data = new FormData(event.currentTarget);
    const parsed = leadSchema.safeParse({ name: data.get("name"), phone: data.get("phone"), company: data.get("company"), email: data.get("email"), interest: data.get("interest"), consent: data.get("consent") === "on" });
    if (!parsed.success) { setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]))); return; }
    setErrors({}); setNotice("Bản xem trước chưa kết nối hệ thống tiếp nhận. Thông tin chưa được gửi.");
  }
  const field = (name: string, label: string, required: boolean, type = "text") => <div className="field"><label htmlFor={`${prefix}-${name}`}>{label}{required && <span aria-hidden="true"> *</span>}</label><input id={`${prefix}-${name}`} name={name} type={type} required={required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${prefix}-${name}-error` : undefined} />{errors[name] && <p className="field-error" id={`${prefix}-${name}-error`}>{errors[name]}</p>}</div>;
  return <form className="lead-form" onSubmit={submit} noValidate>
    <div className="form-grid">{field("name", "Họ và tên", true)}{field("phone", "Số điện thoại", true, "tel")}{field("company", "Doanh nghiệp", true)}{field("email", "Email công việc", false, "email")}</div>
    <div className="field"><label htmlFor={`${prefix}-interest`}>Nhu cầu quan tâm</label><select id={`${prefix}-interest`} name="interest" defaultValue=""><option value="">Chọn nhu cầu</option><option>Quản lý cookies trên website</option><option>Thu thập và quản lý sự đồng ý</option><option>Tích hợp với hệ thống hiện tại</option><option>Cần tư vấn lựa chọn giải pháp</option></select></div>
    <label className="consent-check" htmlFor={`${prefix}-consent`}><input id={`${prefix}-consent`} name="consent" type="checkbox" /><span>Tôi đồng ý để FPT sử dụng thông tin này nhằm liên hệ và sắp xếp buổi giới thiệu sản phẩm.</span></label>{errors["consent"] && <p className="field-error">{errors["consent"]}</p>}
    <Button type="submit" className="form-submit">Đăng ký demo <ArrowRight size={18} /></Button>
    {notice ? <p className="form-notice" role="status">{notice}</p> : <p className="form-note">Đội ngũ FPT sẽ liên hệ để trao đổi nhu cầu và sắp xếp buổi giới thiệu.</p>}
  </form>;
}

function ProductImage({ src, alt, priority = false, onOpen }: { src: string; alt: string; priority?: boolean; onOpen: (src: string, alt: string) => void }) {
  return <button className="product-shot" onClick={() => onOpen(src, alt)} aria-label={`Phóng to: ${alt}`}><img src={src} alt={alt} width="1325" height="805" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} /><span><Search size={16} /> Nhấn để phóng to</span></button>;
}

function ImageModal({ image, onClose }: { image: {src:string;alt:string} | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!image) return; closeRef.current?.focus(); const handler=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose();}; document.addEventListener("keydown",handler); document.body.classList.add("modal-open"); return()=>{document.removeEventListener("keydown",handler);document.body.classList.remove("modal-open");}; }, [image,onClose]);
  if (!image) return null;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={image.alt} onMouseDown={(e) => { if(e.target===e.currentTarget) onClose(); }}><div className="modal-content"><button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Đóng ảnh"><X /></button><img src={image.src} alt={image.alt} /></div></div>;
}

export function FptCmpHome() {
  const [modal, setModal] = useState<{src:string;alt:string}|null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [solutionTab, setSolutionTab] = useState(0);
  const [problemOpen, setProblemOpen] = useState<number | null>(0);
  const openImage=(src:string,alt:string)=>setModal({src,alt});
  return <><Header /><main>
    <section className="hero" id="tong-quan"><div className="container">
      <div className="hero-copy"><p className="eyebrow">FPT Consent Management Platform</p><h1>Nền tảng Quản trị Sự đồng ý &amp; Quyền riêng tư Dữ liệu cá nhân</h1><p className="hero-description">Quản lý tập trung sự đồng ý (consent) của khách hàng trên mọi kênh, từ thu thập đến lưu trữ và quản trị. Hỗ trợ doanh nghiệp đáp ứng yêu cầu của Luật Bảo vệ Dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025.</p><div className="hero-actions"><Button onClick={() => scrollTo("dang-ky-demo")}>Đăng ký demo <ArrowRight size={18} /></Button><Button variant="secondary" onClick={() => scrollTo("tinh-nang")}>Khám phá tính năng</Button></div></div>
      <div className="hero-showcase"><div className="showcase-tabs"><span className="active">Giải pháp quản trị Consent</span><span>Giao diện sản phẩm</span></div><div className="showcase-body"><div className="showcase-copy"><p className="eyebrow">Quản lý tập trung</p><h2>Giải pháp quản trị sự đồng ý &amp; Quyền riêng tư dữ liệu</h2><p>FPT CMP quản lý tập trung toàn bộ vòng đời sự đồng ý, từ thu thập, lưu trữ, cập nhật đến truy xuất và quản lý yêu cầu.</p><ul className="hero-points"><li><Check />Quản trị sự đồng ý</li><li><Check />Minh bạch và truy xuất</li><li><Check />Kết nối và vận hành</li></ul></div><button className="hero-video" onClick={() => openImage(consentReport, "Giao diện báo cáo Consent của FPT CMP")} aria-label="Xem giao diện giới thiệu FPT CMP"><img src={consentReport} alt="Giao diện báo cáo Consent của FPT CMP" width="1325" height="805" fetchPriority="high" /><span className="play-button"><Play fill="currentColor" /> <b>Xem giao diện FPT CMP</b></span></button></div></div>
    </div></section>

    <section className="partner-strip" aria-label="Khu vực logo đối tác"><div className="container"><div className="partner-heading"><p className="eyebrow">Đối tác đồng hành</p><span>Nội dung minh họa — logo sẽ được cập nhật sau khi xác minh.</span></div></div><div className="partner-marquee"><div className="partner-track">{[...partnerPlaceholders,...partnerPlaceholders].map((partner,index)=><div className="partner-logo" key={`${partner}-${index}`} aria-hidden={index >= partnerPlaceholders.length}><span>{String(index % partnerPlaceholders.length + 1).padStart(2,"0")}</span>{partner}</div>)}</div></div></section>

    <section className="section" aria-labelledby="problems-title"><div className="container"><div className="section-heading"><p className="eyebrow">Thách thức doanh nghiệp gặp phải</p><h2 id="problems-title">Những thách thức cốt lõi trong quản trị dữ liệu cá nhân</h2></div>
      <div className="problems-accordion">
        {problemItems.map((item, i) => { const Icon = item.icon; const open = problemOpen === i; return <button key={item.title} type="button" id={`problem-tab-${i}`} aria-expanded={open} aria-controls="problems-panel" className={`solution-tab problem-card ${open ? "active" : ""}`} style={{ order: i + 1 }} onClick={() => setProblemOpen(open ? null : i)}><Icon size={18} />{item.title}</button>; })}
        {(() => { const k = problemOpen ?? 0; const item = problemItems[k]!; const Icon = item.icon; return <div id="problems-panel" role="region" aria-labelledby={`problem-tab-${k}`} className={`problem-panel ${problemOpen !== null ? "open" : ""}`} style={{ "--pa-3": Math.floor(k / 3) * 3 + 3, "--pa-2": Math.floor(k / 2) * 2 + 2, "--pa-1": k + 1 } as React.CSSProperties}><div className="problem-panel-clip"><div className="problem-panel-inner"><div className="icon-box"><Icon /></div><h3>{item.title}</h3><p>{item.text}</p></div></div></div>; })()}
      </div>
    </div></section>

    <section className="section solution" id="giai-phap" aria-labelledby="solution-title"><div className="container">
      <div className="section-heading"><p className="eyebrow">Giải pháp</p><h2 id="solution-title">Giải pháp quản trị sự đồng ý &amp; Quyền riêng tư dữ liệu</h2><p>FPT Consent Management Platform (FPT CMP) cung cấp nền tảng quản lý tập trung toàn bộ vòng đời sự đồng ý của chủ thể dữ liệu, từ thu thập, lưu trữ, cập nhật đến truy xuất và quản lý yêu cầu. Giải pháp giúp doanh nghiệp chuẩn hóa quy trình quản trị Consent, tăng khả năng kiểm soát dữ liệu và hỗ trợ đáp ứng các yêu cầu về bảo vệ dữ liệu cá nhân.</p></div>
      <div className="solution-tabs" role="tablist" aria-label="Các trụ cột giải pháp của FPT CMP">
        {solutionTabs.map((tab, i) => <button key={tab.label} type="button" role="tab" id={`solution-tab-${i}`} aria-selected={solutionTab === i} aria-controls="solution-panel" tabIndex={solutionTab === i ? 0 : -1} className={`solution-tab ${solutionTab === i ? "active" : ""}`} onClick={() => setSolutionTab(i)} onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const next = e.key === "ArrowRight" ? (i + 1) % solutionTabs.length : (i - 1 + solutionTabs.length) % solutionTabs.length; setSolutionTab(next); document.getElementById(`solution-tab-${next}`)?.focus(); } }}><span>0{i + 1}</span>{tab.label}</button>)}
      </div>
      {(() => { const tab = solutionTabs[solutionTab]!; return <div className="solution-panel" role="tabpanel" id="solution-panel" aria-labelledby={`solution-tab-${solutionTab}`}>
        <div className="solution-copy"><span className="feature-number">0{solutionTab + 1}</span><h3>{tab.heading}</h3><p>{tab.text}</p></div>
        {tab.image ? <ProductImage src={tab.image} alt={tab.alt ?? ""} onOpen={openImage} /> : <div className="solution-network" aria-hidden="true"><div className="solution-hub">FPT CMP</div><ul className="solution-chips">{tab.chips?.map((chip) => <li key={chip}>{chip}</li>)}</ul></div>}
      </div>; })()}
    </div></section>

    <section className="section features" id="tinh-nang"><div className="container"><div className="section-heading"><p className="eyebrow">Tính năng cốt lõi</p><h2>Giải pháp quản trị sự đồng ý &amp; Quyền riêng tư dữ liệu</h2><p>FPT CMP giúp doanh nghiệp chuẩn hóa quy trình quản trị Consent, tăng khả năng kiểm soát dữ liệu và hỗ trợ đáp ứng các yêu cầu về bảo vệ dữ liệu cá nhân.</p></div>
      <div className="feature-list">{features.map((feature,index)=><article className={`feature-row ${feature.highlighted ? "feature-highlight" : ""}`} key={feature.title}><div className="feature-copy"><span className="feature-number">0{index+1}</span><h3>{feature.title}</h3><p>{feature.description}</p><ul>{feature.bullets.map((item)=><li key={item}><Check />{item}</li>)}</ul>{feature.cta && <Button onClick={() => scrollTo("dang-ky-demo")}>Đăng ký xem demo <ArrowRight size={18} /></Button>}</div><ProductImage src={feature.image} alt={feature.alt} onOpen={openImage} /></article>)}</div>
    </div></section>

    <section className="section integration" id="tich-hop"><div className="container integration-grid"><div><p className="eyebrow">Kết nối &amp; Vận hành</p><h2>Đồng bộ Consent trên toàn bộ hệ sinh thái</h2><p>Kết nối với các hệ thống và nền tảng hiện hữu như CRM, CDP, Website, App, Marketing… giúp đồng bộ trạng thái Consent, tăng tính nhất quán trong quản lý và nâng cao hiệu quả vận hành.</p><p className="integration-note">Phạm vi tích hợp được xác định theo hệ thống hiện tại và nhu cầu triển khai.</p></div><div className="integration-map" aria-label="Sơ đồ các nhóm hệ thống có thể kết nối với FPT CMP"><div className="hub"><img src={logo} alt="" /><b>FPT CMP</b><span>Consent hub</span></div>{["Website","Mobile App","CRM","ERP","DMS"].map((item,i)=><div className={`satellite satellite-${i+1}`} key={item}>{item}</div>)}</div></div></section>

    <section className="section case-section" id="case-study"><div className="container"><div className="section-heading"><p className="eyebrow">Case study</p><h2>Từ bài toán quản trị Consent đến triển khai CMP thực tế</h2><p>Câu chuyện chuẩn hóa, tập trung hóa và tự động hóa quản trị Sự đồng ý trên toàn bộ hệ sinh thái dữ liệu.</p></div><div className="case-grid">{caseStudies.map((item)=><article className="case-card" key={item.title}><img src={item.image} alt="Giao diện minh họa FPT CMP" width="1325" height="805" loading="lazy" /><div><span>{item.tag}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div></section>

    <section className="section news-section" id="tin-tuc"><div className="container"><div className="section-heading"><p className="eyebrow">Tin tức nổi bật</p><h2>Thông tin về consent và quản lý cookies</h2><p>Nội dung mẫu đang chờ bài viết và đường dẫn chính thức.</p></div><div className="news-grid">{newsPlaceholders.map(([category,title],index)=><article className="news-card" key={title}><div className={`news-visual news-visual-${index+1}`}><Newspaper /><span>Nội dung đang cập nhật</span></div><div className="news-meta"><span>{category}</span><span><Clock3 /> Chờ ngày đăng</span></div><h3>{title}</h3><p>Bài viết sẽ được hiển thị khi có nội dung và đường dẫn đã được duyệt.</p></article>)}</div></div></section>

    <section className="section faq-section" id="faq"><div className="container faq-form-layout"><div><p className="eyebrow">Câu hỏi thường gặp</p><h2>Thông tin doanh nghiệp cần biết về quản trị Consent</h2><p>Những nội dung thường được quan tâm khi triển khai quản trị sự đồng ý và quyền riêng tư dữ liệu cá nhân.</p><div className="accordion">{faqs.map(([question,answer],i)=>{const open=faqOpen===i;return <div className="faq-item" key={question}><h3><button aria-expanded={open} aria-controls={`faq-panel-${i}`} onClick={()=>setFaqOpen(open?null:i)}>{question}<ChevronDown /></button></h3><div id={`faq-panel-${i}`} hidden={!open}><p>{answer}</p></div></div>;})}</div></div><aside className="faq-form" id="dang-ky-demo"><p className="form-kicker">Demo theo nhu cầu</p><h2>Đăng ký xem demo FPT CMP</h2><p>Trao đổi với đội ngũ FPT để xem giao diện thực tế và xác định nhu cầu triển khai.</p><LeadForm variant="footer" /></aside></div></section>
  </main><footer><div className="container footer-grid"><div><div className="brand footer-brand"><img src={logo} alt="FPT" width="70" height="47" /><span><b>FPT CMP</b><small>Consent Management Platform</small></span></div><p>Nền tảng quản trị sự đồng ý và quyền riêng tư dữ liệu cá nhân tập trung cho doanh nghiệp.</p></div><div><h2>Điều hướng</h2>{navItems.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</div><div><h2>Liên hệ</h2><p>Tòa nhà FPT, Số 10 phố Phạm Văn Bạch, P. Cầu Giấy, TP. Hà Nội</p></div></div><div className="container footer-bottom">© 2026 BizNext by FPT Corporation. All rights reserved.</div></footer><ImageModal image={modal} onClose={()=>setModal(null)} /></>;
}
