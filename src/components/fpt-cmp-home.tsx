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
  { tag: "Tình huống tham khảo", title: "Quản lý lựa chọn cookies trên hệ thống website", text: "Khung nội dung chờ thông tin triển khai và kết quả đã được khách hàng xác minh.", image: cookieBanner },
  { tag: "Tình huống tham khảo", title: "Tập trung bản ghi consent từ nhiều điểm chạm", text: "Khung nội dung chờ thông tin doanh nghiệp, phạm vi kết nối và kết quả thực tế.", image: consentList },
  { tag: "Tình huống tham khảo", title: "Theo dõi và đối soát sự đồng ý qua báo cáo", text: "Khung nội dung chờ số liệu, trích dẫn và quyền sử dụng hình ảnh khách hàng.", image: consentReport },
] as const;

const newsPlaceholders = [
  ["Kiến thức CMP", "Doanh nghiệp nên chuẩn bị gì trước khi triển khai quản lý consent?"],
  ["Quản lý cookies", "Từ phân loại cookies đến ghi nhận lựa chọn của người dùng"],
  ["Vận hành dữ liệu", "Kết nối các điểm thu thập consent với hệ thống doanh nghiệp"],
] as const;

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
    title: "Cho người dùng chủ động lựa chọn cookies",
    description: "Hiển thị các lựa chọn rõ ràng ngay trên website doanh nghiệp.",
    bullets: ["Đồng ý, từ chối hoặc tùy chỉnh cookies.", "Trình bày các nhóm cookies để người dùng lựa chọn.", "Tùy chỉnh giao diện theo nhận diện thương hiệu."],
    image: cookieBanner,
    alt: "Giao diện Cookie Banner của FPT CMP",
  },
  {
    title: "Nắm thông tin cookies đang xuất hiện trên website",
    description: "Xem kết quả quét và phân loại cookies trên một giao diện báo cáo.",
    bullets: ["Quét domain website.", "Thống kê và phân loại cookies.", "Theo dõi thông tin trong báo cáo quét."],
    image: scanDomain,
    alt: "Giao diện báo cáo Scan Domain của FPT CMP",
  },
  {
    title: "Thu thập sự đồng ý theo từng mục đích",
    description: "Trình bày nội dung xin đồng ý để người dùng hiểu và lựa chọn.",
    bullets: ["Thiết lập biểu mẫu xin đồng ý xử lý dữ liệu cá nhân.", "Hiển thị các mục đích xử lý.", "Ghi nhận lựa chọn của người dùng."],
    image: dataConsent,
    alt: "Giao diện Data Consent của FPT CMP",
    cta: true,
  },
  {
    title: "Quản lý và tra cứu consent tập trung",
    description: "Tìm lại bản ghi và theo dõi trạng thái sự đồng ý khi cần đối soát.",
    bullets: ["Theo dõi danh sách consent.", "Tra cứu các bản ghi.", "Xem trạng thái đồng ý trên hệ thống."],
    image: consentList,
    alt: "Giao diện danh sách Consent của FPT CMP",
  },
  {
    title: "Theo dõi sự đồng ý qua báo cáo trực quan",
    description: "Tổng hợp thông tin để hỗ trợ quản lý và kiểm tra nội bộ.",
    bullets: ["Xem thống kê và tỷ lệ đồng ý.", "Tra cứu thông tin báo cáo.", "Xuất báo cáo phục vụ đối soát."],
    image: consentReport,
    alt: "Giao diện báo cáo Consent của FPT CMP",
    highlighted: true,
  },
];

const faqs = [
  ["FPT CMP quản lý cookies hay cả sự đồng ý xử lý dữ liệu cá nhân?", "Nền tảng được giới thiệu với cả hai phạm vi: quản lý lựa chọn cookies và thu thập, quản lý sự đồng ý xử lý dữ liệu cá nhân."],
  ["Đã có cookie banner thì doanh nghiệp cần xem xét thêm điều gì?", "Doanh nghiệp có thể cần xem xét cách phân loại cookies, nội dung lựa chọn, việc lưu bản ghi và cách cập nhật khi người dùng thay đổi lựa chọn."],
  ["FPT CMP có thể kết nối với hệ thống hiện tại không?", "Tài liệu giới thiệu kiến trúc API-first. Phạm vi kết nối cụ thể được xác định theo hệ thống hiện tại và nhu cầu triển khai của doanh nghiệp."],
  ["Bộ phận nào sẽ quản trị và sử dụng nền tảng?", "Tùy mô hình doanh nghiệp, các bộ phận IT, Pháp chế, Compliance hoặc DPO có thể được phân quyền để cùng quản trị và theo dõi."],
  ["Doanh nghiệp cần chuẩn bị gì trước khi triển khai?", "Nên xác định các điểm thu thập dữ liệu, mục đích xử lý, nội dung xin đồng ý và những hệ thống cần kết nối để trao đổi phạm vi phù hợp."],
  ["Làm thế nào để được tư vấn phạm vi và chi phí?", "Đăng ký buổi demo để đội ngũ FPT tìm hiểu nhu cầu, giới thiệu giao diện và trao đổi phương án triển khai cụ thể."],
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
  const openImage=(src:string,alt:string)=>setModal({src,alt});
  return <><Header /><main>
    <section className="hero" id="tong-quan"><div className="container">
      <div className="hero-copy"><p className="eyebrow">FPT Consent Management Platform</p><h1>Đơn giản hóa việc thu thập và quản lý sự đồng ý</h1><p className="hero-description">FPT CMP giúp doanh nghiệp quản lý lựa chọn cookies và sự đồng ý xử lý dữ liệu cá nhân, lưu bằng chứng và theo dõi trạng thái consent tập trung.</p><div className="hero-actions"><Button onClick={() => scrollTo("dang-ky-demo")}>Đăng ký demo <ArrowRight size={18} /></Button><Button variant="secondary" onClick={() => scrollTo("tinh-nang")}>Khám phá tính năng</Button></div></div>
      <div className="hero-showcase"><div className="showcase-tabs"><span className="active">Giải pháp quản lý consent</span><span>Giao diện sản phẩm</span></div><div className="showcase-body"><div className="showcase-copy"><p className="eyebrow">Quản lý tập trung</p><h2>Sự đồng ý và cookies trên một nền tảng</h2><p>Thiết lập điểm thu thập, ghi nhận lựa chọn và tra cứu bằng chứng khi cần đối soát.</p><ul className="hero-points"><li><Check />Lựa chọn cookies rõ ràng</li><li><Check />Bản ghi consent tập trung</li><li><Check />Báo cáo trực quan</li></ul></div><button className="hero-video" onClick={() => openImage(consentReport, "Giao diện báo cáo Consent của FPT CMP")} aria-label="Xem giao diện giới thiệu FPT CMP"><img src={consentReport} alt="Giao diện báo cáo Consent của FPT CMP" width="1325" height="805" fetchPriority="high" /><span className="play-button"><Play fill="currentColor" /> <b>Xem giao diện FPT CMP</b></span></button></div></div>
    </div></section>

    <section className="partner-strip" aria-label="Khu vực logo đối tác"><div className="container"><div className="partner-heading"><p className="eyebrow">Đối tác đồng hành</p><span>Nội dung minh họa — logo sẽ được cập nhật sau khi xác minh.</span></div></div><div className="partner-marquee"><div className="partner-track">{[...partnerPlaceholders,...partnerPlaceholders].map((partner,index)=><div className="partner-logo" key={`${partner}-${index}`} aria-hidden={index >= partnerPlaceholders.length}><span>{String(index % partnerPlaceholders.length + 1).padStart(2,"0")}</span>{partner}</div>)}</div></div></section>

    <section className="section" aria-labelledby="problems-title"><div className="container"><div className="section-heading"><p className="eyebrow">Bài toán quản lý</p><h2 id="problems-title">Khó quản lý sự đồng ý khi dữ liệu đến từ nhiều điểm chạm?</h2></div><div className="problems-grid">
      {[[FileSearch,"Khó tra cứu bằng chứng đồng ý","Khi cần đối soát, doanh nghiệp mất thời gian xác định khách hàng đã đồng ý nội dung nào."],[Network,"Thông tin consent nằm rải rác","Lựa chọn của người dùng được ghi nhận qua nhiều biểu mẫu và hệ thống, gây khó khăn khi tổng hợp."],[Settings2,"Khó theo dõi khi lựa chọn thay đổi","Các bộ phận cần cập nhật kịp thời khi người dùng thay đổi hoặc rút lại sự đồng ý."]].map(([Icon,title,text]) => {const I=Icon as typeof FileSearch;return <article className="problem" key={String(title)}><div className="icon-box"><I /></div><h3>{String(title)}</h3><p>{String(text)}</p></article>;})}
    </div></div></section>

    <section className="section features" id="tinh-nang"><div className="container"><div className="section-heading"><p className="eyebrow">Giao diện sản phẩm</p><h2>Khám phá các tính năng của FPT CMP</h2><p>Giao diện trực quan cho từng bước thu thập, quản lý và theo dõi sự đồng ý.</p></div>
      <div className="feature-list">{features.map((feature,index)=><article className={`feature-row ${feature.highlighted ? "feature-highlight" : ""}`} key={feature.title}><div className="feature-copy"><span className="feature-number">0{index+1}</span><h3>{feature.title}</h3><p>{feature.description}</p><ul>{feature.bullets.map((item)=><li key={item}><Check />{item}</li>)}</ul>{feature.cta && <Button onClick={() => scrollTo("dang-ky-demo")}>Đăng ký xem demo <ArrowRight size={18} /></Button>}</div><ProductImage src={feature.image} alt={feature.alt} onOpen={openImage} /></article>)}</div>
    </div></section>

    <section className="section integration" id="tich-hop"><div className="container integration-grid"><div><p className="eyebrow">Kiến trúc kết nối</p><h2>Kết nối quản lý consent với hệ thống doanh nghiệp</h2><p>FPT CMP được giới thiệu với kiến trúc API-first, hỗ trợ phương án kết nối các điểm thu thập và hệ thống nghiệp vụ.</p><p className="integration-note">Phạm vi tích hợp được xác định theo hệ thống hiện tại và nhu cầu triển khai.</p></div><div className="integration-map" aria-label="Sơ đồ các nhóm hệ thống có thể kết nối với FPT CMP"><div className="hub"><img src={logo} alt="" /><b>FPT CMP</b><span>Consent hub</span></div>{["Website","Mobile App","CRM","ERP","DMS"].map((item,i)=><div className={`satellite satellite-${i+1}`} key={item}>{item}</div>)}</div></div></section>

    <section className="section" id="trien-khai"><div className="container"><div className="section-heading"><p className="eyebrow">Triển khai</p><h2>Triển khai theo nhu cầu thực tế của doanh nghiệp</h2></div><div className="deployment-grid"><ol>{["Khởi tạo tài khoản và phân quyền.","Cấu hình giao diện và mục đích xử lý.","Tích hợp, kiểm tra hoạt động.","Bàn giao và hướng dẫn vận hành."].map((item,i)=><li key={item}><span>0{i+1}</span>{item}</li>)}</ol><div className="support-panel"><h3>Đồng hành trong quá trình vận hành</h3><ul><li><Building2 />Nền tảng được giới thiệu triển khai trên FPT Cloud.</li><li><ShieldCheck />Phân quyền quản trị cho các bộ phận liên quan.</li><li><Settings2 />Hỗ trợ cấu hình và kết nối theo nhu cầu.</li></ul></div></div></div></section>

    <section className="section case-section" id="case-study"><div className="container"><div className="section-heading"><p className="eyebrow">Case study</p><h2>Các tình huống ứng dụng FPT CMP</h2><p>Khu vực được dựng sẵn để cập nhật câu chuyện khách hàng sau khi nội dung được xác minh.</p></div><div className="case-grid">{caseStudies.map((item)=><article className="case-card" key={item.title}><img src={item.image} alt="Giao diện minh họa FPT CMP" width="1325" height="805" loading="lazy" /><div><span>{item.tag}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div></section>

    <section className="section news-section" id="tin-tuc"><div className="container"><div className="section-heading"><p className="eyebrow">Tin tức nổi bật</p><h2>Thông tin về consent và quản lý cookies</h2><p>Nội dung mẫu đang chờ bài viết và đường dẫn chính thức.</p></div><div className="news-grid">{newsPlaceholders.map(([category,title],index)=><article className="news-card" key={title}><div className={`news-visual news-visual-${index+1}`}><Newspaper /><span>Nội dung đang cập nhật</span></div><div className="news-meta"><span>{category}</span><span><Clock3 /> Chờ ngày đăng</span></div><h3>{title}</h3><p>Bài viết sẽ được hiển thị khi có nội dung và đường dẫn đã được duyệt.</p></article>)}</div></div></section>

    <section className="section faq-section" id="faq"><div className="container faq-form-layout"><div><p className="eyebrow">Câu hỏi thường gặp</p><h2>Giải đáp trước khi triển khai</h2><p>Thông tin tổng quan giúp doanh nghiệp chuẩn bị trước buổi trao đổi.</p><div className="accordion">{faqs.map(([question,answer],i)=>{const open=faqOpen===i;return <div className="faq-item" key={question}><h3><button aria-expanded={open} aria-controls={`faq-panel-${i}`} onClick={()=>setFaqOpen(open?null:i)}>{question}<ChevronDown /></button></h3><div id={`faq-panel-${i}`} hidden={!open}><p>{answer}</p></div></div>;})}</div></div><aside className="faq-form" id="dang-ky-demo"><p className="form-kicker">Demo theo nhu cầu</p><h2>Đăng ký xem demo FPT CMP</h2><p>Trao đổi với đội ngũ FPT để xem giao diện thực tế và xác định nhu cầu triển khai.</p><LeadForm variant="footer" /></aside></div></section>
  </main><footer><div className="container footer-grid"><div><div className="brand footer-brand"><img src={logo} alt="FPT" width="70" height="47" /><span><b>FPT CMP</b><small>Consent Management Platform</small></span></div><p>Nền tảng quản lý sự đồng ý và lựa chọn cookies tập trung cho doanh nghiệp.</p></div><div><h2>Điều hướng</h2>{navItems.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</div><div><h2>Liên hệ</h2><p>Tòa nhà FPT, Số 10 phố Phạm Văn Bạch, P. Cầu Giấy, TP. Hà Nội</p></div></div><div className="container footer-bottom">© 2026 BizNext by FPT Corporation. All rights reserved.</div></footer><ImageModal image={modal} onClose={()=>setModal(null)} /></>;
}