// Registry of lessons. Each lesson module lives in its own file and is loaded on demand.
export const CHAPTERS = [
  { id: 0, name: 'Khởi động' },
  { id: 1, name: 'Chương 1 · Đại phân tử sinh học' },
  { id: 2, name: 'Chương 2 · Ổn định & linh động của DNA' },
  { id: 3, name: 'Chương 3 · Phiên mã & điều hòa' },
  { id: 4, name: 'Chương 4 · Ngoại di truyền (Epigenetic)' },
  { id: 5, name: 'Chương 5 · Dịch mã' },
  { id: 6, name: 'Chương 6 · Protein sau dịch mã' },
];
const L = (num, id, chapter, title, short) => ({ num, id, chapter, title, short, load: () => import(`./${id}.js`) });
export const LESSONS = [
  L(1, 'dogma', 0, 'Bản đồ gene: Promoter ≠ AUG', 'DNA → mRNA → protein. Cái gì nằm ở đâu, ai đọc nó.'),
  L(2, 'nucleic', 1, 'Cấu trúc DNA & RNA', 'Nucleotide, liên kết, chiều 5′→3′, rãnh lớn/nhỏ, A/B/Z.'),
  L(3, 'macro', 1, 'Protein, lipid (raft), carbohydrate', '4 bậc cấu trúc, liên kết peptide, màng & lipid raft, đường.'),
  L(4, 'denature', 1, 'Biến tính & hồi tính DNA (Tm)', 'Nhiệt độ, %GC, hiệu ứng tăng sắc 260 nm.'),
  L(5, 'meselson', 2, 'Thí nghiệm Meselson–Stahl', 'Vì sao nhân đôi là bán bảo toàn: ¹⁵N/¹⁴N.'),
  L(6, 'fork', 2, 'Chạc ba sao chép & sửa lỗi đọc', 'Helicase, primase, Pol III/Pol I, ligase, mạch chậm Okazaki.'),
  L(7, 'initiation', 2, 'Khởi đầu sao chép · RecBCD · nhân sơ vs nhân thực', 'Ori (λ), nhiều ori, telomere, RecBCD-Chi.'),
  L(8, 'repair', 2, 'Sửa chữa DNA: BER · HR · SSA · NHEJ', 'Base bị hỏng, đứt gãy mạch đôi: chọn đường nào?'),
  L(9, 'transposon', 2, 'Gene nhảy (transposon)', 'DNA transposon "cắt-dán" vs retrotransposon "chép-dán".'),
  L(10, 'txprok', 3, 'Phiên mã ở nhân sơ', 'Holoenzyme σ, −35/−10, kết thúc ρ-độc lập & ρ-phụ thuộc.'),
  L(11, 'operon', 3, 'Operon trp, lac & CAP–cAMP', 'Bật/tắt glucose & lactose: dự đoán gene lac.'),
  L(12, 'txeuk', 3, 'Phiên mã ở nhân thực', 'Pol I/II/III, TATA–TBP, PIC, CTD, FACT, kết thúc.'),
  L(13, 'processing', 3, 'Xử lý RNA: mũ, đuôi poly-A, cắt nối & miRNA', 'Spliceosome, intron/exon, miRNA tắt gene.'),
  L(14, 'epieuk', 4, 'Epigenetic nhân thực', 'Nucleosome, methyl hóa DNA (DNMT), acetyl hóa histone, lncRNA.'),
  L(15, 'epiprok', 4, 'Epigenetic nhân sơ', 'Hệ R-M, methyl hóa Dam, công tắc pha.'),
  L(16, 'translation', 5, 'Dịch mã: ribosome & tRNA', 'Vị trí A/P/E, khởi đầu, kéo dài, kết thúc; nhân sơ vs nhân thực.'),
  L(17, 'ptm', 6, 'Biến đổi sau dịch mã & kiểm soát chất lượng ở ER', 'Glycan, PDI, BiP, calnexin, ubiquitin–proteasome.'),
  L(18, 'mito', 6, 'Nhập protein vào ti thể', 'Tom20/22 → Tom40 → Tim23/17 → mtHsp70 → MPP.'),
  L(19, 'mtor', 6, 'mTORC1: cảm biến dinh dưỡng', 'Amino acid, Rag, Rheb-GTP, TSC; kích hoạt tổng hợp protein.'),
];
