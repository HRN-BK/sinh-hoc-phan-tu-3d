// Bài 10: Phiên mã ở nhân sơ: holoenzyme σ, −35/−10, khởi đầu hụt, kéo dài, kết thúc ρ-độc lập & ρ-phụ thuộc.
import { labels, clamp, lerp } from './_kit.js';

// Gene mô hình (mạch mã hóa 5′→3′). Promoter đúng khoảng cách thật: −35 … 17 bp … −10 … 6 bp … +1.
const SEG = [
  ['up', 'GC'],
  ['m35', 'TTGACA'],           // −35
  ['sp', 'CTTTACGATCGAGGCTA'], // 17 bp đệm
  ['m10', 'TATAAT'],           // −10 (Pribnow)
  ['dis', 'GCCGTA'],           // −6 … −1
  ['utr', 'AAGGAGAC'],         // +1 … (5′UTR, có SD AGGAG)
  ['atg', 'ATG'],
  ['cds', 'GCTAAA'],
  ['stop', 'TAA'],
  ['rut', 'CCTCACCC'],         // rut: giàu C, nghèo G (rút gọn)
  ['s1', 'GCCCGC'],            // đoạn lặp đảo 1
  ['loop', 'TTCG'],
  ['s2', 'GCGGGC'],            // đoạn lặp đảo 2 (bổ sung với s1)
  ['uu', 'TTTTTTT'],           // dãy U
  ['down', 'GC'],
];
const START = {}; let SEQ = '';
for (const [k, s] of SEG) { START[k] = SEQ.length; SEQ += s; }
const LEN = Object.fromEntries(SEG.map(([k, s]) => [k, s.length]));
const mid = (k) => START[k] + (LEN[k] - 1) / 2;
const P1 = START.utr;                  // chỉ số của +1
const TX = START.down - P1;            // chiều dài RNA bình thường (tới hết dãy U)
const NMAX = SEQ.length - P1;          // RNA đọc lố tới hết DNA
const K = (seg) => START[seg] - P1;    // vị trí trên RNA (0 = đầu 5′)
const PAUSE_SEQ = 'CAATCTAACGTATCAACTGAATC'; // thay s1+loop+s2+uu khi xem ρ-phụ thuộc (không kẹp tóc, không dãy U)
const COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };

export default {
  title: 'Phiên mã ở nhân sơ',
  sub: 'Một loại RNA polymerase duy nhất (lõi α₂ββ′ω) cộng yếu tố σ đi tìm promoter −35/−10, mở bóng phiên mã, chép RNA 5′→3′ không cần mồi, rồi dừng ở terminator nhờ kẹp tóc + dãy U hoặc nhờ protein ρ.',
  legend: '<span><i style="background:#5b8def"></i>mạch mã hóa</span><span><i style="background:#ef6c8b"></i>mạch khuôn</span><span><i style="background:#2bb3a3"></i>lõi RNAP α₂ββ′ω</span><span><i style="background:#9b6dd6"></i>σ⁷⁰</span><span><i style="background:#f2994a"></i>RNA (U)</span><span><i style="background:#ff7aa8"></i>ρ (Rho)</span><span><i style="background:#e8505b"></i>A</span><span><i style="background:#f2c94c"></i>T</span><span><i style="background:#3fb27f"></i>G</span><span><i style="background:#4a90e2"></i>C</span>',

  why: `<p>Vi khuẩn phải bật/tắt hàng nghìn gene thật nhanh khi môi trường đổi. Mọi gene đều được chép bởi <b>cùng một loại RNA polymerase</b>. Vậy làm sao enzyme biết <b>bắt đầu ở đâu</b> và <b>dừng ở đâu</b>?</p>
  <ul><li><b>Bắt đầu:</b> enzyme lõi (core) gắn thêm <b>yếu tố σ</b> (sigma) thành <b>holoenzyme</b>. σ đọc 2 hộp trên DNA: <b>−35 (TTGACA)</b> và <b>−10 (TATAAT)</b>, cách nhau ~17 bp. Đó là <b>promoter</b>.</li>
  <li><b>Mở:</b> hộp −10 giàu A–T (mỗi cặp chỉ 2 liên kết H) nên tách mạch dễ, tạo <b>bóng phiên mã</b> ~13 bp quanh +1.</li>
  <li><b>Chép:</b> lõi đọc <b>mạch khuôn 3′→5′</b>, nối RNA <b>5′→3′</b>, <b>không cần mồi</b>. RNA giống mạch mã hóa, chỉ thay T bằng U.</li>
  <li><b>Dừng:</b> hoặc RNA tự gập thành <b>kẹp tóc GC + dãy U</b> (ρ-độc lập), hoặc protein <b>ρ</b> chạy theo RNA bằng ATP và kéo RNA ra (ρ-phụ thuộc).</li></ul>
  <div class="box warn">⚠️ <b>Bẫy cá nhân (xem lại Bài 1):</b> hộp <b>−10 TATAAT</b> là một phần của <b>promoter trên DNA</b>, σ đọc nó để <b>phiên mã</b>. Nó <b>KHÔNG</b> phải codon mở đầu <b>AUG</b>. AUG nằm <b>trên mRNA</b>, sau +1 và sau 5′UTR, do <b>ribosome</b> đọc để <b>dịch mã</b>. Promoter không hề có mặt trong mRNA.</div>`,

  without: `<ul>
  <li><b>Không có σ:</b> lõi vẫn bám DNA và vẫn kéo dài được, nhưng bám <b>không đặc hiệu</b>, trượt lung tung, không nhận ra promoter. Hậu quả: không khởi đầu đúng chỗ, gần như không có mRNA.</li>
  <li><b>Hộp −10 bị đột biến thành GC:</b> σ bám kém hơn và DNA khó tách mạch (G–C có 3 liên kết H). Phức hợp đóng khó chuyển thành phức hợp mở, phiên mã giảm mạnh.</li>
  <li><b>Có rifampicin:</b> thuốc gắn tiểu đơn vị β, chặn kênh ra của RNA. Enzyme chỉ làm được RNA 2–3 nt rồi nhả, không bao giờ vào giai đoạn kéo dài.</li>
  <li><b>Hỏng kẹp tóc terminator (hoặc thiếu ρ ở gene cần ρ):</b> polymerase <b>đọc lố</b> (read-through) sang vùng phía sau, tạo RNA dài bất thường.</li></ul>
  <div class="box info">👉 Bật các công tắc <b>💥</b> dưới mô hình 3D ở từng bước để nhìn tận mắt hậu quả.</div>`,

  foundation: [
    { q: 'Phiên mã (transcription) là gì?', a: 'Là quá trình chép trình tự một đoạn DNA thành RNA. Enzyme thực hiện là <b>RNA polymerase</b> (RNAP). Sản phẩm có thể là mRNA (để dịch mã), rRNA hoặc tRNA. Ở vi khuẩn, <b>một loại RNAP</b> làm hết.' },
    { q: 'Mạch khuôn (template) và mạch mã hóa (coding) khác nhau thế nào?', a: 'RNAP đọc <b>mạch khuôn</b> theo chiều 3′→5′. RNA tạo ra <b>bổ sung</b> với mạch khuôn nên <b>giống hệt mạch mã hóa</b> (chỉ thay T bằng U). Vì vậy người ta luôn viết trình tự promoter (TTGACA, TATAAT) và gene <b>theo mạch mã hóa</b>, 5′→3′.' },
    { q: 'Vì sao promoter có số âm (−35, −10)?', a: 'Nucleotide đầu tiên được phiên mã là <b>+1</b>. Phía trước nó (upstream) đánh số âm: −1, −2… <b>Không có vị trí 0.</b> Hộp −10 nằm khoảng 10 bp trước +1, hộp −35 khoảng 35 bp trước +1. Phía sau +1 (downstream) là số dương.' },
    { q: 'Trình tự đồng thuận (consensus) là gì?', a: 'Là trình tự "trung bình" khi xếp thẳng hàng rất nhiều promoter thật: −35 là <b>TTGACA</b>, −10 là <b>TATAAT</b>, khoảng đệm tối ưu 17 bp (16–19). Promoter thật hiếm khi trùng 100%. <b>Càng giống consensus thì promoter càng mạnh</b> (σ bám tốt hơn).' },
    { q: 'Vì sao cặp A–T dễ tách hơn cặp G–C?', a: 'A–T chỉ có <b>2 liên kết hydro</b>, G–C có <b>3</b>. Lực xếp chồng (stacking) giữa các cặp A–T cũng yếu hơn. Vì thế vùng giàu A–T như hộp −10 TATAAT là chỗ DNA "dễ mở" nhất. Cũng vì thế cặp lai rU·dA (dãy U trên RNA với A trên khuôn) là cặp yếu nhất.' },
    { q: 'Enzyme lõi (core) và holoenzyme khác nhau thế nào?', a: '<b>Lõi</b> gồm 5 tiểu đơn vị <b>α₂ββ′ω</b>. Nó tổng hợp được RNA nhưng <b>không nhận ra promoter</b>. Gắn thêm <b>σ</b> thì thành <b>holoenzyme</b> (α₂ββ′ωσ), lúc đó mới khởi đầu đúng chỗ. β và β′ tạo "càng cua" ôm DNA, chứa trung tâm hoạt động.' },
    { q: 'RNAP cần những gì để nối nucleotide?', a: 'Cần <b>khuôn DNA</b> và 4 loại <b>NTP</b> (ATP, GTP, CTP, UTP; có ribose, không phải dNTP). Nó gắn NTP mới vào <b>đầu 3′-OH</b> của RNA, nên RNA luôn kéo dài theo chiều 5′→3′. Khác DNA polymerase, RNAP <b>không cần mồi</b>: nó tự bắt đầu chuỗi mới tại +1.' },
    { q: 'Đoạn lặp đảo (inverted repeat) tạo kẹp tóc thế nào?', a: 'Hai đoạn trên cùng một mạch RNA <b>bổ sung với nhau khi đọc ngược chiều</b>, ví dụ 5′-GCCCGC…GCGGGC-3′. Khi RNA được chép ra, hai đoạn này tự bắt cặp thành <b>thân</b> (stem), đoạn giữa thành <b>vòng</b> (loop). Thân giàu G–C nên rất bền.' },
    { q: 'Helicase là gì? ρ liên quan gì?', a: '<b>Helicase</b> là enzyme dùng năng lượng thủy phân <b>ATP</b> để tách hai mạch nucleic acid đang bắt cặp. <b>ρ</b> (Rho) là một helicase dạng <b>vòng 6 tiểu đơn vị</b>, chạy trên <b>RNA</b> theo chiều 5′→3′. Tới RNAP, nó tách cặp lai RNA–DNA, làm RNA tuột ra.' },
  ],

  steps: [
    { title: 'Bản đồ gene nhân sơ: promoter, +1, terminator', text: 'Trình tự viết theo <b>mạch mã hóa</b> (xanh, 5′→3′, trái sang phải). <b>Promoter</b> gồm hộp <b>−35 TTGACA</b> và <b>−10 TATAAT</b> (hộp Pribnow), cách nhau 17 bp. <b>+1</b> là nucleotide đầu tiên của RNA. Sau +1 mới tới <b>ATG</b> (sẽ thành AUG trên mRNA, tín hiệu cho ribosome), rồi vùng mã hóa, STOP, vùng <b>rut</b> và <b>terminator</b> (đoạn lặp đảo GC + dãy T). <b>−10 không phải AUG</b>: hai thứ cách nhau cả một đoạn, nằm trên hai phân tử khác nhau.' },
    { title: 'Holoenzyme = lõi α₂ββ′ω + σ', text: 'Lõi RNAP gồm 2 α (lắp ráp, bám yếu tố điều hòa), <b>β và β′</b> (hai "càng" ôm DNA, chứa trung tâm xúc tác), <b>ω</b> (giúp gấp/ổn định β′). Lõi chép được RNA nhưng <b>mù promoter</b>. <b>σ⁷⁰</b> gắn vào tạo <b>holoenzyme</b>. Bật <b>💥 Không có σ</b> để thấy lõi đứng một mình.' },
    { title: 'σ nhận ra −35 và −10: phức hợp ĐÓNG', text: 'Holoenzyme trượt trên DNA và dừng khi σ khớp với promoter: <b>vùng 4 của σ</b> bám hộp <b>−35</b>, <b>vùng 2 của σ</b> bám hộp <b>−10</b>. σ đọc trình tự từ các nhóm hóa học lộ ra ở rãnh lớn, <b>khi DNA vẫn còn mạch kép</b>. Đây là <b>phức hợp đóng</b> (closed complex). Không có σ thì lõi chỉ trượt ngẫu nhiên.' },
    { title: 'Tách mạch ở −10: phức hợp MỞ, bóng ~13 bp', text: 'DNA tách mạch bắt đầu từ hộp <b>−10 giàu A–T</b> (2 liên kết H mỗi cặp), lan tới khoảng <b>−11 → +2</b>: đó là <b>bóng phiên mã</b> ~12–14 bp. Mạch khuôn (hồng, phía dưới) được đưa vào trung tâm hoạt động. RNAP vi khuẩn <b>tự mở xoắn</b>, không cần helicase riêng. Bật <b>💥 Đột biến −10 thành GC</b>: bóng không mở nổi.' },
    { title: 'Khởi đầu "hụt" (abortive initiation)', text: 'RNAP nối vài NTP đầu tiên ngay tại +1, <b>không cần mồi</b>. Nhưng σ vẫn bám chặt promoter nên enzyme chưa rời đi được. Nó kéo DNA phía trước vào mình (<b>scrunching</b>, bóng to dần), làm RNA ngắn 2–9 nt rồi <b>nhả ra</b>, lặp lại nhiều lần. Bật <b>💥 Rifampicin</b>: thuốc chặn kênh ra của RNA trên β, RNA chỉ dài 2–3 nt rồi bị nhả.' },
    { title: 'σ rời đi, lõi kéo dài RNA 5′→3′', text: 'Khi RNA dài ~8–10 nt, enzyme "thoát promoter" (promoter escape) và <b>σ thường rời ra</b> (để được dùng lại). Lõi chạy về phía 3′ của mạch mã hóa, kéo theo bóng ~13 bp. Bên trong bóng là <b>cặp lai RNA–DNA ~8 bp</b>. Lõi đọc khuôn <b>3′→5′</b>, nối RNA <b>5′→3′</b>, dùng <b>U thay T</b>. Đầu 5′ của RNA đi ra qua kênh thoát và vươn ra phía sau.' },
    { title: 'Kết thúc ρ-độc lập: kẹp tóc GC + dãy U', text: 'RNAP chép qua <b>đoạn lặp đảo giàu GC</b>, RNA vừa ra khỏi kênh liền tự gập thành <b>kẹp tóc</b> (thân GC bền). Kẹp tóc làm enzyme <b>khựng lại</b> và bóp kênh RNA. Lúc đó cặp lai trong bóng chỉ toàn <b>rU·dA</b>, cặp yếu nhất, nên <b>RNA tuột ra</b>, lõi rời DNA, bóng đóng lại. Không cần protein nào. Bật <b>💥 Hỏng kẹp tóc</b>: không có kẹp tóc, enzyme đọc lố.' },
    { title: 'Kết thúc ρ-phụ thuộc: ρ đuổi theo RNAP', text: 'Để so sánh, mô hình thay vùng terminator bằng một vùng cuối <b>không có kẹp tóc GC và dãy U</b>, chỉ có một <b>điểm dừng tạm</b> (pause). Trên RNA có vùng <b>rut</b> (giàu C, nghèo G, không có cấu trúc; thật dài ~70–80 nt, mô hình rút gọn). <b>ρ</b> là vòng <b>6 tiểu đơn vị</b>, ôm RNA tại rut rồi <b>dùng ATP</b> chạy theo RNA chiều <b>5′→3′</b>. Khi RNAP dừng tạm, ρ đuổi kịp, <b>tháo cặp lai RNA–DNA</b>: RNA và RNAP rời ra. Bật <b>💥 Không có ρ</b>: RNAP dừng một lúc rồi chạy tiếp, đọc lố.' },
    { title: 'Chu trình σ và các loại σ', text: 'σ rời một lõi đang kéo dài rồi gắn vào <b>lõi tự do khác</b>, tạo holoenzyme mới đi tìm promoter: đó là <b>chu trình σ</b>. Vi khuẩn có nhiều loại σ, mỗi loại nhận một kiểu promoter: <b>σ⁷⁰</b> (gene "giữ nhà"), và (kiến thức mở rộng) <b>σ³²</b> (gene sốc nhiệt), <b>σ⁵⁴</b> (đồng hóa nitơ, cần activator dùng ATP). Đổi σ là đổi cả bộ gene được bật. Bật <b>Sốc nhiệt: σ³²</b> để xem.' },
  ],

  application: `<ul>
  <li><b>Rifampicin, thuốc chữa lao (Mycobacterium tuberculosis):</b> gắn tiểu đơn vị <b>β</b> (gene <i>rpoB</i>) ngay trong kênh ra của RNA, chặn RNA dài quá 2–3 nt. Nó <b>chặn khởi đầu</b>, không làm dừng enzyme đã đang kéo dài. Không ảnh hưởng RNAP nhân thực nên ít độc với người. Vi khuẩn kháng thuốc thường mang <b>đột biến điểm ở rpoB</b>, vì vậy luôn phối hợp nhiều thuốc chữa lao.</li>
  <li><b>Fidaxomicin</b> (trị tiêu chảy do <i>Clostridioides difficile</i>): cũng nhắm RNAP vi khuẩn nhưng ở vị trí khác (vùng "bản lề" switch region), ngăn DNA vào và mở bóng, tức chặn ở bước tạo phức hợp mở.</li>
  <li><b>Sốc nhiệt và σ³²</b> (kiến thức mở rộng): khi nhiệt độ tăng, lượng σ³² tăng, cạnh tranh lấy lõi và bật các gene chaperone (DnaK, GroEL) sửa protein biến tính. <b>σ⁵⁴</b> nhận promoter kiểu −24/−12 và cần protein hoạt hóa thủy phân ATP để mở bóng. Ở <i>Bacillus</i>, một chuỗi σ thay nhau điều khiển quá trình tạo bào tử.</li>
  <li><b>Hiệu ứng phân cực (polarity)</b> ở operon: ribosome thường bám sát RNAP và che vùng rut. Nếu một đột biến vô nghĩa (STOP sớm) làm ribosome rời sớm, rut lộ ra, ρ bám vào và cắt ngang phiên mã, nên <b>các gene phía sau trong operon cũng không được biểu hiện</b>.</li>
  <li><b>Công nghệ sinh học:</b> người ta tối ưu promoter cho gần consensus (−35 TTGACA, −10 TATAAT, đệm 17 bp) để biểu hiện mạnh, và đặt <b>terminator ρ-độc lập</b> (kẹp tóc GC + dãy T) sau gene để RNAP không đọc lố sang gene khác trên plasmid.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>RNAP nhân sơ</th><th>RNAP nhân thực</th></tr>
  <tr><td>Số loại</td><td><b>1</b> loại chép mọi RNA</td><td><b>3</b> loại chính: Pol I (rRNA lớn), Pol II (mRNA, phần lớn miRNA), Pol III (tRNA, 5S rRNA)</td></tr>
  <tr><td>Tiểu đơn vị</td><td>Lõi <b>α₂ββ′ω</b> (5) + σ</td><td>Pol II có <b>12</b> tiểu đơn vị, đuôi CTD</td></tr>
  <tr><td>Nhận promoter nhờ</td><td><b>σ</b> bám trực tiếp −35 và −10</td><td>Các <b>yếu tố phiên mã chung</b>: TBP/TFIID bám hộp TATA, rồi TFIIA, B, F, E, H</td></tr>
  <tr><td>Yếu tố lõi của promoter</td><td><b>−35 TTGACA</b>, <b>−10 TATAAT</b> (Pribnow)</td><td><b>TATA ~−25/−30</b> (TATAAA), Inr…; thêm CAAT/GC box và enhancer</td></tr>
  <tr><td>Mở bóng</td><td>RNAP tự mở (bắt đầu ở −10)</td><td>TFIIH dùng ATP mở DNA</td></tr>
  <tr><td>Kết thúc</td><td>ρ-độc lập (kẹp tóc + U) hoặc ρ-phụ thuộc</td><td>Pol II: cắt ở tín hiệu poly-A (AAUAAA), RNA phía sau bị phân hủy</td></tr>
  <tr><td>RNA sau phiên mã</td><td>Dịch ngay, phiên mã và dịch mã <b>đồng thời</b>, thường đa cistron</td><td>Gắn mũ, cắt intron, gắn poly-A rồi mới ra tế bào chất</td></tr>
  <tr><td>Chất ức chế điển hình</td><td><b>Rifampicin</b> (β)</td><td><b>α-amanitin</b> (Pol II rất nhạy)</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>DNA polymerase (tái bản)</th><th>RNA polymerase (phiên mã)</th></tr>
  <tr><td>Cần mồi?</td><td><b>Có</b> (mồi RNA do primase làm)</td><td><b>Không</b>, tự bắt đầu tại +1</td></tr>
  <tr><td>Nguyên liệu</td><td>dNTP (deoxyribose, có T)</td><td>NTP (ribose, có U)</td></tr>
  <tr><td>Chiều tổng hợp</td><td>5′→3′</td><td>5′→3′ (giống nhau!)</td></tr>
  <tr><td>Mở xoắn</td><td>Cần helicase riêng</td><td>Tự mở bóng ~13 bp</td></tr>
  <tr><td>Sửa sai</td><td>Exonuclease 3′→5′, sai ~10⁻⁹ sau sửa</td><td>Không có exo 3′→5′; chỉ lùi lại (backtrack) rồi cắt nhờ GreA/GreB; sai ~10⁻⁴–10⁻⁵</td></tr>
  <tr><td>Chép gì, bao nhiêu</td><td><b>Toàn bộ</b> bộ gene, <b>1 lần</b> mỗi chu kỳ</td><td>Từng gene, <b>nhiều bản</b>, lúc cần</td></tr>
  <tr><td>Sản phẩm</td><td>Mạch mới ở lại bắt cặp với khuôn</td><td>RNA rời khỏi khuôn, DNA đóng lại</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Kết thúc ρ-độc lập</th><th>Kết thúc ρ-phụ thuộc</th></tr>
  <tr><td>Tín hiệu trên RNA</td><td>Đoạn lặp đảo <b>giàu GC</b> (kẹp tóc) + <b>dãy U</b> ngay sau</td><td>Vùng <b>rut</b>: giàu C, nghèo G, không cấu trúc, nằm trước điểm dừng</td></tr>
  <tr><td>Protein cần</td><td>Không cần</td><td><b>ρ</b>: vòng 6 tiểu đơn vị, helicase/translocase</td></tr>
  <tr><td>Năng lượng</td><td>Không tốn ATP</td><td>ρ thủy phân <b>ATP</b> để chạy 5′→3′ trên RNA</td></tr>
  <tr><td>Cơ chế tuột</td><td>Kẹp tóc làm RNAP khựng; lai rU·dA yếu nên RNA tuột</td><td>ρ đuổi kịp RNAP đang dừng tạm, tháo cặp lai RNA–DNA</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cặp dễ lẫn</th><th>Cái thứ 1</th><th>Cái thứ 2</th></tr>
  <tr><td>Hộp −10 vs AUG</td><td>−10 TATAAT: trên <b>DNA</b>, σ đọc, mở đầu <b>phiên mã</b>, <b>không có</b> trong mRNA</td><td>AUG: trên <b>mRNA</b>, sau +1 và 5′UTR, ribosome đọc, mở đầu <b>dịch mã</b></td></tr>
  <tr><td>Hộp Pribnow vs hộp TATA</td><td>Nhân sơ, <b>−10</b>, TATAAT, σ bám</td><td>Nhân thực, <b>~−25/−30</b>, TATAAA, <b>TBP</b> bám</td></tr>
  <tr><td>Phức hợp đóng vs mở</td><td>Đóng: holoenzyme bám promoter, DNA <b>còn kép</b></td><td>Mở: DNA đã tách ~13 bp (−11 → +2), mạch khuôn vào trung tâm hoạt động</td></tr>
  <tr><td>Terminator vs codon STOP</td><td>Terminator: trên DNA/RNA, dừng <b>phiên mã</b></td><td>STOP (UAA/UAG/UGA): trên mRNA, dừng <b>dịch mã</b>; nằm trước terminator</td></tr>
  </table></div>
  <div class="box warn">⚠️ Một số tài liệu gọi hộp −10 là "hộp TATA của vi khuẩn". Chỉ là <b>giống về trình tự</b> (đều giàu T/A). Hộp TATA nhân thực nằm ở ~−30, do TBP bám, không có σ nào ở đó. Khi làm bài, gọi đúng: <b>hộp Pribnow (−10)</b> ở nhân sơ.</div>
  <div class="box info">Slide nói "σ rời khỏi phức hợp, enzyme bắt đầu phiên mã". Chính xác hơn: RNAP đã <b>bắt đầu nối nucleotide khi σ còn bám</b> (giai đoạn khởi đầu hụt). σ <b>thường</b> rời khi RNA dài ~8–10 nt, lúc enzyme thoát promoter và chuyển sang kéo dài.</div>`,

  traps: [
    { trap: 'Hộp −10 TATAAT là codon mở đầu (hoặc "promoter là chỗ ribosome bám").', truth: '<b>Sai.</b> −10 thuộc <b>promoter trên DNA</b>, do <b>σ</b> đọc để bắt đầu <b>phiên mã</b>; nó nằm <b>trước +1</b> nên không có trong mRNA. <b>AUG</b> nằm trên <b>mRNA</b>, sau 5′UTR, do <b>ribosome</b> đọc để bắt đầu <b>dịch mã</b>. Xem lại Bài 1.' },
    { trap: 'Hộp −10 của vi khuẩn chính là hộp TATA.', truth: 'Chỉ giống trình tự. <b>Pribnow (−10, TATAAT)</b> do σ nhận ở nhân sơ. <b>TATA (~−30, TATAAA)</b> do TBP nhận ở nhân thực.' },
    { trap: 'RNA giống mạch khuôn.', truth: 'RNA <b>bổ sung</b> với mạch khuôn nên <b>giống mạch mã hóa</b> (T → U). Promoter và gene được viết theo mạch mã hóa 5′→3′.' },
    { trap: 'RNA polymerase đọc khuôn 5′→3′ (hoặc tổng hợp 3′→5′).', truth: 'Đọc khuôn <b>3′→5′</b>, tổng hợp RNA <b>5′→3′</b> (nối vào đầu 3′-OH), giống DNA polymerase.' },
    { trap: 'RNA polymerase cũng cần mồi như DNA polymerase.', truth: '<b>Không cần mồi.</b> RNAP tự nối 2 NTP đầu tiên tại +1. Chính vì vậy primase (một loại RNA polymerase) mới làm được mồi cho tái bản.' },
    { trap: 'σ cần trong suốt quá trình phiên mã / lõi không làm gì được nếu thiếu σ.', truth: 'σ cần cho <b>khởi đầu</b> (nhận promoter, mở bóng) và <b>thường</b> rời khi RNA ~8–10 nt. Lõi một mình vẫn <b>kéo dài</b> được, chỉ không khởi đầu đúng promoter.' },
    { trap: 'Nucleotide ngay trước +1 là vị trí 0.', truth: 'Không có 0. Ngay trước +1 là <b>−1</b>. +1 là nucleotide đầu tiên của RNA, không phải nucleotide đầu tiên được dịch.' },
    { trap: 'Kẹp tóc terminator là kẹp tóc trên DNA.', truth: 'Kẹp tóc hình thành <b>trên RNA vừa chép ra</b> (trong kênh thoát của RNAP). DNA chỉ <b>mã hóa</b> đoạn lặp đảo; DNA vẫn là mạch kép bình thường.' },
    { trap: 'ρ chạy trên DNA / chạy 3′→5′ / không cần năng lượng.', truth: 'ρ là vòng 6 tiểu đơn vị chạy <b>trên RNA</b>, chiều <b>5′→3′</b> (đuổi theo RNAP), <b>thủy phân ATP</b>. Nó bám vùng <b>rut</b> giàu C, nghèo G.' },
    { trap: 'Rifampicin làm dừng mọi RNA polymerase đang chạy.', truth: 'Rifampicin gắn β, chặn RNA dài quá 2–3 nt, nên chỉ chặn <b>khởi đầu</b>. Enzyme đã đang kéo dài thì không bị ảnh hưởng. Nó cũng không tác động RNAP nhân thực (Pol II nhạy với <b>α-amanitin</b>).' },
  ],

  quiz: [
    { q: 'Vì sao DNA bắt đầu tách mạch ở vùng −10 mà không phải −35?', ops: ['Vì −10 gần ribosome hơn', 'Vì −10 chứa codon AUG', 'Vì −10 giàu A–T, mỗi cặp chỉ 2 liên kết H nên dễ tách', 'Vì σ cắt DNA ở −10'], a: 2, e: 'TATAAT toàn A–T: 2 liên kết H mỗi cặp, xếp chồng yếu, nên dễ mở. −10 không liên quan ribosome hay AUG (đó là tín hiệu dịch mã trên mRNA). σ không cắt DNA.' },
    { q: 'Một chủng có lõi RNAP bình thường nhưng σ⁷⁰ bị bất hoạt. Điều gì xảy ra với gene "giữ nhà"?', ops: ['Phiên mã bình thường vì lõi tự nhận promoter', 'Lõi vẫn bám DNA không đặc hiệu nhưng không khởi đầu đúng promoter, mRNA gần như không có', 'Phiên mã bắt đầu nhưng không dừng được', 'Ribosome không bám được mRNA'], a: 1, e: 'σ là phần "định vị" promoter. Lõi α₂ββ′ω vẫn tổng hợp được RNA nhưng không nhận ra −35/−10.' },
    { q: 'Mạch mã hóa: 5′-…TATAAT…(6 bp)…AAGG…-3′. Nếu +1 là chữ A đầu tiên của AAGG, RNA bắt đầu bằng gì?', ops: ['5′-AAGG…', '5′-UUCC…', '5′-UAUAAU…', '3′-UUCC…'], a: 0, e: 'RNA giống mạch mã hóa (T→U) và bắt đầu tại +1, nên là 5′-AAGG… Hộp TATAAT ở trước +1, không được phiên mã.' },
    { q: 'Gene có terminator ρ-độc lập. Đột biến nào làm RNAP đọc lố mạnh nhất?', ops: ['Đổi một base trong vòng (loop) của kẹp tóc', 'Thêm 1 chữ T vào dãy T', 'Đổi đoạn lặp đảo thứ 2 để không còn bổ sung với đoạn thứ 1', 'Đổi codon STOP UAA thành UAG'], a: 2, e: 'Mất bổ sung thì không có thân kẹp tóc, RNAP không khựng nên chạy tiếp. Đổi base ở vòng hay thêm T ít ảnh hưởng. Codon STOP là tín hiệu dịch mã, không liên quan kết thúc phiên mã.' },
    { q: 'Phát biểu nào đúng về ρ?', ops: ['ρ bám vùng giàu GC trên DNA và chạy 3′→5′', 'ρ là vòng 6 tiểu đơn vị, bám vùng rut giàu C trên RNA, dùng ATP chạy 5′→3′ tới RNAP', 'ρ tạo kẹp tóc trên RNA', 'ρ là một tiểu đơn vị của lõi RNAP'], a: 1, e: 'ρ là helicase hexamer chạy trên RNA về phía đầu 3′ (nơi RNAP đang chép), cần ATP. Kẹp tóc là cơ chế của kết thúc ρ-độc lập. ρ không thuộc lõi α₂ββ′ω.' },
    { q: 'Thêm rifampicin vào ống nghiệm có các RNAP đã đang kéo dài, và cả các holoenzyme mới bám promoter. Kết quả?', ops: ['Mọi phiên mã dừng ngay', 'Không ảnh hưởng gì', 'RNAP đang kéo dài chép tiếp tới hết; holoenzyme mới chỉ tạo RNA 2–3 nt', 'Chỉ RNAP đang kéo dài bị dừng'], a: 2, e: 'Rifampicin chặn kênh ra của RNA trên β, chỉ có tác dụng khi RNA còn rất ngắn (khởi đầu). Enzyme đã thoát promoter thì RNA đã lấp kênh, thuốc không vào được.' },
    { q: 'Điểm nào là KHÁC BIỆT giữa RNA polymerase và DNA polymerase?', ops: ['Chiều tổng hợp', 'Cần khuôn', 'Gắn nucleotide vào đầu 3′-OH', 'Cần mồi'], a: 3, e: 'Cả hai đều tổng hợp 5′→3′, đều cần khuôn, đều nối vào 3′-OH. Chỉ DNA polymerase cần mồi; RNA polymerase thì không.' },
  ],

  recall: [
    'Vẽ tay lại một gene nhân sơ trên 2 mạch: đánh dấu −35, −10 (ghi trình tự consensus), khoảng đệm 17 bp, +1, chiều 5′/3′ của mỗi mạch, mạch nào là khuôn, rồi vẽ RNA bắt đầu ở đâu và AUG nằm ở đâu.',
    'Kể theo thứ tự 5 giai đoạn: phức hợp đóng → phức hợp mở → khởi đầu hụt → σ rời và kéo dài → kết thúc. Mỗi giai đoạn: σ đang ở đâu, DNA kép hay đã mở?',
    'So sánh 2 kiểu kết thúc (tín hiệu trên RNA, protein, ATP, vì sao RNA tuột), rồi giải thích vì sao rifampicin chỉ chặn khởi đầu.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const rise = 0.22, N = SEQ.length;
    const dna = api.dna({ seq: SEQ, rise, radius: 0.7, turn: 10.5, openR: 0.3, splitY: 1.6 });
    const X = (i) => dna.xOf(i);
    const XM = (k) => X(mid(k));

    // ---- vùng tô nền ----
    const shell = (a, b, color, op = 0.13) => {
      const m = api.cylinder(1.15, 1.15, (b - a + 1) * rise, color, null, { opacity: op, depthWrite: false, side: THREE.DoubleSide });
      m.rotation.z = Math.PI / 2; m.position.x = (X(a) + X(b)) / 2; return m;
    };
    const SH = {
      m35: shell(START.m35, START.m35 + 5, 0xe8505b), m10: shell(START.m10, START.m10 + 5, 0xf5a623),
      atg: shell(START.atg, START.atg + 2, 0x9b6dd6), rut: shell(START.rut, START.rut + 7, 0x66d9ef),
      term: shell(START.s1, START.uu + 6, 0xf2c94c),
    };
    const plus1Bar = api.box(0.06, 3.4, 0.06, C.good); plus1Bar.position.set(X(P1), 0, 0);

    // ---- nhãn cố định (2 tầng trên, 2 tầng dưới) ----
    L.add('cod', '5′ mạch mã hóa →', [X(0) + 1.1, 1.75, 0], null, 'dim');
    L.add('tpl', '← mạch khuôn 5′', [X(N - 1) - 1.1, -1.75, 0], null, 'dim');
    L.add('m35', '−35 TTGACA', [XM('m35'), -2.0, 0], null, '');
    L.add('m10', '−10 TATAAT (Pribnow)', [XM('m10'), -2.85, 0], null, '');
    L.add('sp', '17 bp', [XM('sp') + 0.3, -1.15, 0], null, 'dim');
    L.add('plus1', '+1', [X(P1), 2.0, 0], null, 'good');
    L.add('atg', 'ATG → AUG (dịch mã)', [XM('atg') + 0.6, 2.95, 0], null, 'warn');
    L.add('rut', 'rut (giàu C)', [XM('rut'), -2.0, 0], null, 'dim');
    L.add('term', 'terminator', [(X(START.s1) + X(START.uu + 6)) / 2, 2.0, 0], null, '');
    L.add('trap', '−10 ≠ AUG (Bài 1)', [(XM('m10') + XM('atg')) / 2, 4.0, 0], null, 'big');

    // ---- lõi RNAP α₂ββ′ω (hàm tạo để dùng 2 lần) ----
    const SUB = [ // [key, r, color, pos, opacity, label]
      ['bp', 1.05, 0x2bb3a3, [0.05, -0.05, -0.95], 0.4, 'β′', [0.75, 0.75, 0.6]],
      ['b', 1.05, 0x3fc9b5, [0.05, -0.05, 0.95], 0.28, 'β', [-0.2, -0.55, 1.0]],
      ['a1', 0.42, 0x5fbf9c, [-0.85, 1.35, 0.25], 0.95, 'α'],
      ['a2', 0.42, 0x5fbf9c, [-0.15, 1.6, -0.15], 0.95, 'α'],
      ['w', 0.28, 0xa0e0a8, [0.75, 1.25, -0.6], 0.95, 'ω'],
    ];
    const makeCore = (withLabels) => {
      const g = api.group(); const parts = [];
      SUB.forEach(([k, r, col, p, op, lb, lp], i) => {
        const m = api.blob(r, col, g, { seed: 3 + i * 2.3, mat: { opacity: op, depthWrite: op > 0.9 } });
        m.position.set(...p); m.userData.home = V(...p); m.userData.op = op;
        if (withLabels) m.userData.lbl = api.label(lb, lp ?? [0, r * 0.2, r + 0.15], m, 'plain');
        parts.push(m);
      });
      return { g, parts };
    };
    const core = makeCore(true), core2 = makeCore(false);
    const coreLbl = api.label('holoenzyme = lõi α₂ββ′ω + σ', [0, 3.0, 0], core.g, 'good');
    const rif = api.group(core.g);
    for (let i = 0; i < 4; i++) { const s = api.sphere(0.13, 0xff3b30, rif); s.position.set((i % 2) * 0.22, Math.floor(i / 2) * 0.2, 0); }
    rif.position.set(-0.75, 0.85, 1.0);
    const rifLbl = api.label('☠ rifampicin', [0.2, -0.55, 0.3], rif, 'warn');

    // ---- σ (vùng 2 + vùng 4 nối bằng dải) ----
    const SIG70 = 0x9b6dd6, SIG32 = 0xff6b4a;
    const sig2 = api.blob(0.5, SIG70, null, { seed: 21, mat: { opacity: 0.95 } });
    const sig4 = api.blob(0.42, SIG70, null, { seed: 23, mat: { opacity: 0.95 } });
    const sigLink = api.stick(V(0, 0, 0), V(1, 0, 0), 0.12, SIG70);
    const sigLbl = api.label('σ⁷⁰', [0, 0.75, 0], sig2, 'tag');
    const sig4Lbl = api.label('vùng 4 → −35', [0, 0.8, 0], sig4, 'plain');
    const sig2Lbl = api.label('vùng 2 → −10', [0, 0.85, 0], sig2, 'plain');

    // ---- RNA: chuỗi hạt ----
    const beadG = new THREE.SphereGeometry(0.16, 12, 8);
    const beads = [];
    for (let k = 0; k < NMAX; k++) {
      const m = new THREE.Mesh(beadG, api.mat(C.rna, { opacity: 1, emissive: C.rna, emissiveIntensity: 0.6 })); api.add(m); m.visible = false; beads.push(m);
    }
    const rnaLink = []; for (let k = 0; k < NMAX - 1; k++) { const s = api.stick(V(0, 0, 0), V(1, 0, 0), 0.045, C.rna); s.visible = false; rnaLink.push(s); }
    const rungs = []; for (let j = 0; j < 6; j++) { const s = api.stick(V(0, 0, 0), V(1, 0, 0), 0.05, 0xffffff, null, { opacity: 0.85 }); s.visible = false; rungs.push(s); }
    // mảnh RNA khởi đầu hụt bay đi
    const frags = [];
    for (let k = 0; k < 30; k++) { const m = new THREE.Mesh(beadG, api.mat(C.rna, { opacity: 1 })); m.scale.setScalar(0.85); api.add(m); m.visible = false; frags.push({ m, v: V(0, 0, 0), life: 0 }); }
    let fragNext = 0;

    // ---- ρ: vòng 6 tiểu đơn vị ----
    const rho = api.group();
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const b = api.blob(0.27, 0xff7aa8, rho, { seed: 31 + i, mat: { emissive: 0xff7aa8, emissiveIntensity: 0.25 } }); b.position.set(Math.cos(a) * 0.52, Math.sin(a) * 0.52, 0); }
    const rhoLbl = api.label('ρ (6 tiểu đơn vị) + ATP → chạy 5′→3′', [0, 0, 0], null, 'tag');
    const atp = []; for (let i = 0; i < 4; i++) { const s = api.sphere(0.08, 0xffd60a); s.visible = false; atp.push(s); }
    rho.visible = false;

    // ---- nhãn theo bước ----
    const XA = X(P1);
    L.add('closed', 'phức hợp ĐÓNG: DNA còn mạch kép', [XM('m10') - 1.2, 4.3, 0], null, 'big');
    L.add('open', 'phức hợp MỞ: −10 giàu A–T tách mạch', [XM('m10') - 0.6, 4.3, 0], null, 'big');
    L.add('bub', 'bóng ~13 bp (−11 → +2)', [XA + 1.0, -3.4, 0], null, 'good');
    L.add('noSig', '❌ lõi không có σ: trượt ngẫu nhiên, không nhận promoter', [XM('m10'), 5.0, 0], null, 'warn');
    L.add('gc', '❌ −10 thành GCGCGC: khó tách mạch', [XM('m10'), 3.4, 0], null, 'warn');
    L.add('abort', 'khởi đầu hụt: RNA 2–9 nt bị nhả', [XA - 0.6, 4.4, 0], null, 'big');
    L.add('scr', 'DNA bị kéo vào (scrunching)', [XA + 1.4, -3.4, 0], null, 'dim');
    L.add('rifMsg', '☠ rifampicin chặn kênh RNA trên β: chỉ 2–3 nt', [XA - 0.4, 4.4, 0], null, 'warn');
    L.add('elong', 'đọc khuôn 3′→5′ · RNA 5′→3′ · không mồi', [X(START.cds), 4.9, 0], null, 'big');
    L.add('sigOff', 'σ rời (RNA ~10 nt)', [XM('m10') - 1.6, 6.0, 0], null, 'good');
    L.add('hyb', 'lai RNA–DNA ~8 bp', [-0.2, -3.45, 0], core.g, 'good');
    L.add('hp', 'kẹp tóc GC trên RNA', [X(START.loop) + 0.6, 4.6, 0], null, 'big');
    L.add('uu', 'dãy U: lai rU·dA yếu', [X(START.uu + 3) + 0.5, -3.3, 0], null, 'good');
    L.add('rel', 'RNA tuột ra, lõi rời DNA', [X(START.loop), 5.6, 0], null, 'good');
    L.add('thru', '❌ không có kẹp tóc: đọc lố (read-through)', [X(START.uu) - 1.5, 4.6, 0], null, 'warn');
    L.add('pause', 'RNAP dừng tạm (pause)', [X(START.uu + 3), -3.3, 0], null, 'dim');
    L.add('rutR', 'rut trên RNA', [XM('rut') - 0.3, -2.0, 0], null, 'good');
    L.add('noRho', '❌ không có ρ: RNAP chạy tiếp, đọc lố', [X(START.s2), 5.4, 0], null, 'warn');
    L.add('cycle', 'σ gắn lõi tự do mới → holoenzyme mới', [-1.2, 7.0, 0], null, 'good');
    L.add('s32', 'σ³²: bỏ qua promoter σ⁷⁰, chỉ nhận promoter gene sốc nhiệt', [-0.8, 7.9, 0], null, 'warn');
    L.add('core1', 'lõi đang kéo dài (không cần σ)', [X(START.rut), 4.4, 0], null, 'dim');

    // ---- trạng thái ----
    let cur = 0, tt = 0, snap = true;
    let noSig = false, gc10 = false, rifOn = false, brk = false, noRho = false, s32 = false;
    let ab = { n: 0, cyc: 0, hold: 0 };
    let tCatch = -1, nCont = 0;
    let bubbleKey = '';
    const seqNow = SEQ.split('');

    const recolor = () => {
      const s = SEQ.split('');
      if (gc10) 'GCGCGC'.split('').forEach((b, j) => { s[START.m10 + j] = b; });
      if (brk && cur === 6) 'ATTATA'.split('').forEach((b, j) => { s[START.s2 + j] = b; });
      if (cur === 7) PAUSE_SEQ.split('').forEach((b, j) => { s[START.s1 + j] = b; });
      for (let i = 0; i < N; i++) {
        if (s[i] === seqNow[i]) continue;
        seqNow[i] = s[i];
        const p = dna.pairs[i];
        p.base1.material.color.setHex(C[s[i]]); p.base2.material.color.setHex(C[COMP[s[i]]]);
      }
      for (let k = 0; k < NMAX; k++) { const b = seqNow[P1 + k]; const c = b === 'T' ? C.U : C[b]; beads[k].material.color.setHex(c); beads[k].material.emissive.setHex(c); }
      L.set('m10', gc10 ? '−10 GCGCGC ✕' : '−10 TATAAT (Pribnow)');
      L.set('term', cur === 7 ? 'điểm dừng tạm (không kẹp tóc)' : (brk && cur === 6 ? 'terminator hỏng ✕' : 'terminator'));
    };

    const restart = (hard) => {
      tt = 0; snap = !!hard; ab = { n: 0, cyc: 0, hold: 0 }; tCatch = -1; nCont = 0;
      if (hard) rho.visible = false;
    };

    // ---------- công tắc ----------
    const T = {};
    const onT = () => { restart(false); recolor(); applyLabels(); readout(); };
    T.sig = api.toggle('💥 Không có σ (chỉ có lõi)', false, (x) => { noSig = x; onT(); });
    T.gc = api.toggle('💥 Đột biến −10: TATAAT → GCGCGC', false, (x) => { gc10 = x; onT(); });
    T.rif = api.toggle('💥 Rifampicin', false, (x) => { rifOn = x; onT(); });
    T.brk = api.toggle('💥 Hỏng kẹp tóc terminator', false, (x) => { brk = x; onT(); });
    T.rho = api.toggle('💥 Không có ρ', false, (x) => { noRho = x; onT(); });
    T.s32 = api.toggle('Sốc nhiệt: σ³² thay σ⁷⁰', false, (x) => { s32 = x; onT(); });
    const SHOW = { sig: [1, 2, 3, 4, 5], gc: [2, 3, 4, 5], rif: [4, 5], brk: [6], rho: [7], s32: [8] };
    const showToggles = (s) => { for (const k in T) if (T[k]?.el) T[k].el.style.display = SHOW[k].includes(s) ? '' : 'none'; };

    const blocked = () => (noSig && cur >= 1 && cur <= 5) || (gc10 && cur >= 3 && cur <= 5);

    const readout = () => {
      let t;
      const s = cur;
      if (s === 0) t = 'Promoter (−35, −10) nằm <b>trước +1</b> nên không có trong RNA. ATG nằm <b>sau +1</b>, là tín hiệu cho ribosome.';
      else if (noSig && s <= 5) t = '<b>Không có σ:</b> lõi bám DNA không đặc hiệu, trượt qua promoter mà không dừng. Không có phức hợp đóng/mở, không có RNA từ +1.';
      else if (s === 1) t = 'Lõi α₂ββ′ω (5 tiểu đơn vị) + σ⁷⁰ = holoenzyme. σ là "kính đọc promoter".';
      else if (s === 2) t = gc10 ? 'σ vẫn bám được −35 nên vẫn có phức hợp đóng (yếu hơn). Vấn đề lớn nằm ở bước mở mạch tiếp theo.' : 'Phức hợp đóng: σ bám −35 và −10 trên DNA <b>mạch kép</b>.';
      else if (gc10) t = '<b>−10 = GCGCGC:</b> G–C có 3 liên kết H, DNA chỉ hé ra rồi đóng lại. Không có phức hợp mở ổn định, phiên mã giảm mạnh.';
      else if (s === 3) t = 'Phức hợp mở: bóng ~13 bp từ −11 tới +2. Mạch khuôn đã vào trung tâm hoạt động.';
      else if (rifOn && (s === 4 || s === 5)) t = '<b>Rifampicin</b> chặn kênh ra của RNA: chỉ có RNA 2–3 nt rồi bị nhả. σ không rời, enzyme không thoát promoter. (Enzyme đã đang kéo dài thì không bị ảnh hưởng.)';
      else if (s === 4) t = `Khởi đầu hụt: RNA dài tới ~9 nt rồi bị nhả, σ vẫn giữ promoter. Lần thử: <b>${ab.cyc + 1}</b>.`;
      else if (s === 5) t = 'σ rời, lõi kéo dài RNA 5′→3′ theo khuôn 3′→5′. Cặp lai RNA–DNA ~8 bp di chuyển cùng bóng.';
      else if (s === 6) t = brk ? '<b>Hỏng kẹp tóc:</b> RNA không gập lại, enzyme không khựng nên chạy qua dãy U, đọc lố tới hết đoạn DNA.' : 'Kẹp tóc GC hình thành trên RNA, enzyme khựng, lai rU·dA yếu nên RNA tuột ra. Không cần protein, không cần ATP.';
      else if (s === 7) t = noRho ? '<b>Không có ρ:</b> RNAP dừng tạm rồi lại chạy tiếp, đọc lố. Gene phụ thuộc ρ cần ρ để dừng đúng chỗ.' : 'ρ bám rut, dùng ATP chạy 5′→3′ trên RNA, đuổi kịp RNAP đang dừng tạm và tháo cặp lai. RNA được giải phóng.';
      else t = s32 ? '<b>σ³²</b> tăng khi sốc nhiệt, giành lõi và bật các gene chaperone. Holoenzyme σ³² lướt qua promoter σ⁷⁰ này mà không bám: nó chỉ nhận promoter gene sốc nhiệt (−35/−10 có trình tự khác). Đổi σ là đổi tập promoter được nhận.' : '<b>Chu trình σ:</b> σ được tái sử dụng, gắn vào lõi tự do khác để khởi đầu vòng mới.';
      api.readout(t);
    };

    const applyLabels = () => {
      // cận cảnh chỉ giữ nhãn nền nằm trong khung (bước 3–5 camera ở gần, đầu 5′ và −35 ra ngoài)
      const s = cur, keys = (s === 6 || s === 7) ? ['tpl'] : s === 2 ? ['tpl', 'm35', 'm10', 'plus1'] : (s === 3 || s === 4) ? ['tpl', 'm10', 'plus1'] : s === 5 ? ['plus1'] : s === 8 ? ['cod', 'm35', 'm10', 'plus1'] : s === 1 ? ['cod', 'plus1'] : ['cod', 'tpl', 'm35', 'm10', 'plus1'];
      if (s === 0) keys.push('sp', 'atg', 'rut', 'term', 'trap');
      if (s === 2) keys.push('sp');
      if (noSig && s >= 1 && s <= 5) keys.push(s >= 2 ? 'noSig' : null);
      else if (gc10 && s >= 3 && s <= 5) keys.push('gc');
      else if (s === 2) keys.push('closed');
      else if (s === 3) keys.push('open', 'bub');
      else if (s === 4 || (s === 5 && rifOn)) keys.push(rifOn ? 'rifMsg' : 'abort', 'scr');
      else if (s === 5) keys.push('elong', 'sigOff', 'hyb');
      if (s === 6) keys.push(...(brk ? ['thru'] : ['hp', 'uu', 'rel']));
      if (s === 7) keys.push('rutR', 'pause', ...(noRho ? ['noRho'] : []));
      if (s === 8) keys.push(s32 ? 's32' : 'cycle', 'core1');
      L.get('noSig').position.x = s === 5 ? 0.8 : XM('m10');
      L.only(keys.filter(Boolean));
      L.set('hyb', 'lai RNA–DNA ~8 bp');
      // nhãn gắn trên vật thể
      const showSub = s === 1;
      core.parts.forEach(p => api.showLabel(p.userData.lbl, showSub));
      api.showLabel(coreLbl, s === 1 && !noSig);
      api.showLabel(sig4Lbl, s === 2 && !noSig);
      api.showLabel(sig2Lbl, s === 2 && !noSig);
      api.showLabel(rifLbl, rifOn && (s === 4 || s === 5));
      api.showLabel(rhoLbl, s === 7);
      sigLbl.element.innerHTML = s32 && s === 8 ? 'σ³²' : 'σ⁷⁰';
      api.showLabel(sigLbl, s === 1 || s === 8 || ((s === 3 || s === 4) && !noSig));
      [sig2, sig4, sigLink].forEach(o => o.material.color.setHex(s32 && s === 8 ? SIG32 : SIG70));
      // tô nền
      SH.m35.material.opacity = (s === 0 || s === 2 || s === 8) ? 0.3 : 0.13;
      SH.m10.material.opacity = (s >= 0 && s <= 4) || s === 8 ? 0.3 : 0.13;
      SH.atg.material.opacity = s === 0 ? 0.32 : 0.1;
      SH.rut.material.opacity = (s === 0 || s === 7) ? 0.3 : 0.08;
      SH.term.material.opacity = (s === 0 || s === 6) ? 0.3 : (s === 7 ? 0.12 : 0.08);
      plus1Bar.visible = s <= 4 || s === 8;
    };

    const CAMS = [
      [[0, 1.2, 22], [0, 0.4, 0]],
      [[-3.4, 5.0, 12], [-3.6, 4.0, 0]],
      [[-5, 2.4, 15], [-5, 1.0, 0]],
      [[-3.2, 2.0, 12], [-3.0, 0.6, 0]],
      [[-2.6, 2.2, 12], [-2.4, 0.8, 0]],
      [[0.6, 2.6, 17], [0.8, 1.3, 0]],
      [[5.6, 2.4, 13], [5.8, 1.5, 0]],
      [[5.0, 2.4, 15], [5.3, 1.4, 0]],
      [[-0.5, 2.6, 20], [-0.5, 1.6, 0]],
    ];

    // ---------- tính vị trí ----------
    const tmp = V(0, 0, 0);
    const tplPos = (i, out) => { const h = dna.pairs[Math.max(0, Math.min(N - 1, i))].half2.position; return out.set(h.x, h.y + 0.6, h.z * 0.5 + 0.6); };
    const exitPos = (pA, d2, out) => out.set(X(pA) - 1.9 - 0.2 * d2, 1.2 + 1.8 * (1 - Math.exp(-d2 / 5)) + 0.12 * Math.sin(d2 * 0.9), 1.0 + 0.35 * Math.sin(d2 * 0.4));
    const linearPos = (k, n, pA, out) => { const d = n - 1 - k; return d < 8 ? tplPos(P1 + k, out) : exitPos(pA, d - 8, out); };
    const hairpinPos = (k, pA, out) => {
      const B = V(X(pA) - 2.0, 1.15, 1.0);
      const ks1 = K('s1'), kl = K('loop'), ks2 = K('s2');
      if (k < ks1) { const d = ks1 - k; return out.set(B.x - 0.3 - 0.2 * d, B.y + 1.2 * (1 - Math.exp(-d / 5)), B.z + 0.3 * Math.sin(d * 0.4)); }
      if (k < kl) { const j = k - ks1; return out.set(B.x - 0.28, B.y + 0.34 * j, B.z); }
      if (k < ks2) { const j = k - kl, th = Math.PI - (j + 0.5) / 4 * Math.PI; return out.set(B.x + 0.36 * Math.cos(th), B.y + 0.34 * 5 + 0.3 + 0.32 * Math.sin(th), B.z); }
      const j = k - ks2; return out.set(B.x + 0.28, B.y + 0.34 * (5 - j), B.z);
    };

    const follow = (obj, target, dt, k = 6) => { if (snap) obj.position.copy(target); else obj.position.lerp(target, 1 - Math.exp(-dt * k)); };
    const setOp = (obj, op) => obj.traverse(o => { if (o.material && !o.isCSS2DObject) { o.material.transparent = true; o.material.opacity = Math.min(o.userData.op ?? 0.95, op); o.material.depthWrite = op > 0.9 && (o.userData.op ?? 1) > 0.9; } });
    const setBubble = (a, b, amt) => { const key = a + ':' + b + ':' + amt.toFixed(2); if (key !== bubbleKey) { bubbleKey = key; dna.openRange(a, b, amt); } };
    const releaseFrag = (n) => {
      for (let k = 0; k < n; k++) {
        const f = frags[fragNext++ % frags.length];
        f.m.position.copy(beads[k].position); f.m.material.color.copy(beads[k].material.color);
        f.v.set(-0.4 + Math.random() * 0.5, 1.4 + Math.random() * 0.6, 0.9 + Math.random() * 0.4); f.life = 1.6; f.m.visible = true;
      }
    };

    // vòng lặp "kéo dài" chung: n RNA, pA vị trí hoạt động, fold, rel
    const S = { coreOn: false, coreP: V(0, 0, 0), coreOp: 1, asm: 1, sig: 'hide', n: 0, fold: 0, rel: 0, bub: null, rho: -1, core2: null };

    function compute(dt) {
      const s = cur;
      S.coreOn = s >= 1; S.coreOp = 1; S.asm = 1; S.sig = 'hide'; S.n = 0; S.fold = 0; S.rel = 0; S.bub = null; S.rho = -1; S.core2 = null;
      const atPromoter = V(XA - 0.6, 0.15, 0);
      const wander = () => V(XA - 2 + 5.5 * Math.sin(tt * 0.55) + 1.5 * Math.sin(tt * 1.7 + 1), 0.15, 0);
      if (s === 0) { S.coreOn = false; S.coreP.set(XA - 1.5, 4.6, 0); return; }
      if (s === 1) {
        S.coreP.set(XA - 1.2, 4.0, 0); S.asm = clamp(tt / 1.6);
        S.sig = noSig ? 'hide' : (tt > 1.4 ? 'holo' : 'arrive');
        return;
      }
      if (noSig && s <= 5) { S.coreP.copy(wander()); return; }
      if (s === 2) { S.coreP.copy(atPromoter); S.sig = 'prom'; return; }
      if (s === 3) {
        S.coreP.copy(atPromoter); S.sig = 'prom';
        S.bub = gc10 ? [P1 - 11, P1 + 2, Math.sin(tt * 2.6) > 0.55 ? 0.3 : 0] : [P1 - 11, P1 + 2, 1];
        return;
      }
      if (gc10 && (s === 4 || s === 5)) { S.coreP.copy(atPromoter); S.sig = 'prom'; S.bub = [P1 - 11, P1 + 2, Math.sin(tt * 2.6) > 0.55 ? 0.3 : 0]; return; }
      if (s === 4 || (s === 5 && rifOn)) {
        S.coreP.copy(atPromoter); S.sig = 'prom';
        const LIM = rifOn ? [2, 3, 2, 3] : [4, 7, 3, 9, 5, 8];
        const lim = LIM[ab.cyc % LIM.length];
        if (ab.hold > 0) { ab.hold -= dt; if (ab.hold <= 0) { releaseFrag(lim); ab.n = 0; ab.cyc++; readout(); } }
        else { ab.n = Math.min(lim, ab.n + dt * 4); if (ab.n >= lim) ab.hold = 0.35; }
        S.n = Math.floor(ab.n);
        S.bub = [P1 - 11, P1 + 3 + S.n, 1];
        return;
      }
      if (s === 5) {
        let n;
        if (tt < 1.7) n = 1 + tt / 1.7 * 9; else n = Math.min(K('rut') + 8, 10 + (tt - 1.7) * 7);
        S.n = Math.floor(n);
        const pA = P1 + S.n - 1;
        S.coreP.set(X(pA) - 0.6, 0.15, 0);
        S.sig = S.n >= 10 ? 'free' : 'prom';
        S.bub = S.n >= 10 ? [pA - 10, pA + 3, 1] : [P1 - 11, pA + 3, 1];
        if (tt > 1.7 + (K('rut') - 2) / 7 + 2.5) restart(true);
        return;
      }
      if (s === 6) {
        const n0 = 22, rate = 6, nEnd = brk ? NMAX : TX;
        nCont = Math.min(nEnd, n0 + tt * rate);
        S.n = Math.floor(nCont);
        const tEnd = (nEnd - n0) / rate;
        const pA = P1 + S.n - 1;
        S.coreP.set(X(pA) - 0.6, 0.15, 0);
        if (!brk) {
          S.fold = clamp((nCont - (K('uu') + 1)) / 5);
          S.rel = clamp((tt - tEnd - 0.7) / 1.3);
        } else {
          const run = Math.max(0, tt - tEnd);
          S.coreP.x += run * 2.2; S.rel = clamp((run - 0.8) / 1.4);
        }
        S.coreOp = 1 - S.rel;
        S.bub = S.rel > 0.3 ? null : [pA - 10, Math.min(N, pA + 3), 1];
        if (tt > tEnd + 3.8) restart(true);
        return;
      }
      if (s === 7) {
        const n0 = 20, rate = 6, nP = TX - 3;
        let n;
        const tP = (nP - n0) / rate;
        if (noRho) {
          if (tt < tP) n = n0 + tt * rate; else if (tt < tP + 2) n = nP; else n = Math.min(NMAX, nP + (tt - tP - 2) * rate);
        } else n = Math.min(nP, n0 + tt * rate);
        S.n = Math.floor(n);
        let pA = P1 + S.n - 1;
        S.coreP.set(X(pA) - 0.6, 0.15, 0);
        const tEndNR = tP + 2 + (NMAX - nP) / rate;
        if (noRho && tt > tEndNR) { const run = tt - tEndNR; S.coreP.x += run * 2.2; S.rel = clamp((run - 0.8) / 1.4); }
        if (!noRho) {
          const kre = K('rut') + 7, tLoad = (kre + 9 - n0) / rate;
          if (tt > tLoad) {
            const kr = Math.min(S.n - 9.5, K('rut') + 2 + (tt - tLoad) * 5);
            S.rho = kr;
            if (S.n >= nP && kr >= S.n - 9.6 && tCatch < 0) tCatch = tt;
          }
          if (tCatch >= 0) S.rel = clamp((tt - tCatch - 0.5) / 1.3);
        }
        S.coreOp = 1 - S.rel;
        S.bub = S.rel > 0.3 ? null : [pA - 10, Math.min(N, pA + 3), 1];
        if ((tCatch >= 0 && tt > tCatch + 3.2) || (noRho && tt > tEndNR + 3.2)) restart(true);
        return;
      }
      // s === 8: chu trình σ
      const nn = 16 + ((tt * 3) % 16);
      S.n = Math.floor(nn);
      const pA = P1 + S.n - 1;
      S.coreP.set(X(pA) - 0.6, 0.15, 0);
      S.bub = [pA - 10, pA + 3, 1];
      const ph = tt % 7;
      S.core2 = ph < 2.6 ? V(XA - 3.0, 4.6, 0) : V(XA - 0.6, lerp(4.6, 0.15, clamp((ph - 2.6) / 1.6)), 0);
      if (ph >= 2.6) S.core2.x = lerp(XA - 3.0, XA - 0.6, clamp((ph - 2.6) / 1.6));
      S.sig = ph < 1.0 ? 'free' : (ph < 4.2 || s32 ? 'holo2' : 'prom2');
      if (s32 && ph >= 2.6) { S.core2.y = lerp(4.6, 2.3, clamp((ph - 2.6) / 1.6)); S.core2.x += 1.6 * Math.sin((ph - 2.6) * 1.8); } // σ³² lướt qua, không ngồi xuống promoter σ⁷⁰
      S.core2Op = clamp(ph / 0.6) * (1 - clamp((ph - 6.4) / 0.6));
      // vùng σ: khi holoenzyme mới đã ngồi lên promoter, lõi 1 vẫn phải xa
    }

    // ---------- áp dụng ----------
    const sigT2 = V(0, 0, 0), sigT4 = V(0, 0, 0);
    let sigOpNow = 0;
    function apply(dt, t) {
      const s = cur;
      // lõi
      core.g.visible = S.coreOn;
      if (S.coreOn) {
        follow(core.g, S.coreP, dt, 4);
        core.parts.forEach((p, i) => {
          const home = p.userData.home, ex = home.clone().multiplyScalar(2.6).add(V(0, (i - 2) * 0.4, 0));
          p.position.copy(ex.lerp(home, S.asm < 1 ? S.asm * S.asm * (3 - 2 * S.asm) : 1));
        });
        setOp(core.g, S.coreOp);
        core.g.rotation.y = s === 1 ? Math.sin(t * 0.4) * 0.35 : 0;
      }
      rif.visible = rifOn && (s === 4 || s === 5);
      // lõi 2
      core2.g.visible = !!S.core2;
      if (S.core2) { if (S.core2Op < 0.15) core2.g.position.copy(S.core2); else follow(core2.g, S.core2, dt, 5); setOp(core2.g, S.core2Op); }
      // σ
      let op = 1;
      const holoOf = (c) => { sigT2.copy(c).add(V(-1.35, 1.0, 0.9)); sigT4.copy(c).add(V(-2.5, 0.75, 0.9)); };
      if (S.sig === 'hide') op = 0;
      else if (S.sig === 'arrive') { sigT2.set(XA - 7, 6.0, 1.0); sigT4.set(XA - 8.2, 5.8, 1.0); op = 1; }
      else if (S.sig === 'holo') holoOf(core.g.position);
      else if (S.sig === 'prom') { sigT2.set(XM('m10'), 1.05, 0.85); sigT4.set(XM('m35'), 1.05, 0.85); }
      else if (S.sig === 'free') { sigT2.set(XM('m10') - 1.6, 5.0 + 0.2 * Math.sin(t), 0.8); sigT4.set(XM('m10') - 2.8, 5.0, 0.8); op = 0.75; }
      else if (S.sig === 'holo2') holoOf(core2.g.position);
      else if (S.sig === 'prom2') { sigT2.set(XM('m10'), 1.05, 0.85); sigT4.set(XM('m35'), 1.05, 0.85); }
      sigOpNow += (op - sigOpNow) * (1 - Math.exp(-dt * 5));
      if (snap && op === 0) sigOpNow = 0;
      const k = S.sig === 'arrive' ? 2 : 4;
      if (snap || sigOpNow < 0.05) { sig2.position.copy(sigT2); sig4.position.copy(sigT4); }
      else { sig2.position.lerp(sigT2, 1 - Math.exp(-dt * k)); sig4.position.lerp(sigT4, 1 - Math.exp(-dt * k)); }
      [sig2, sig4, sigLink].forEach(o => { o.visible = sigOpNow > 0.03; o.material.transparent = true; o.material.opacity = 0.95 * sigOpNow; });
      api.setStick(sigLink, sig2.position, sig4.position);
      // bóng
      if (S.bub) setBubble(Math.max(0, S.bub[0]), Math.min(N, S.bub[1]), S.bub[2]); else setBubble(0, 0, 0);
      // RNA
      const pA = P1 + Math.max(1, S.n) - 1;
      for (let k2 = 0; k2 < NMAX; k2++) {
        const b = beads[k2], on = k2 < S.n && S.rel < 0.999;
        if (!on) { b.visible = false; if (k2 < NMAX - 1) rnaLink[k2].visible = false; b.position.copy(tplPos(pA, tmp)); continue; }
        linearPos(k2, S.n, pA, tmp);
        if (S.fold > 0 && k2 < K('uu')) { const h = hairpinPos(k2, pA, V(0, 0, 0)); tmp.lerp(h, S.fold); }
        if (S.rel > 0) tmp.add(V(-0.6 * S.rel, 3.2 * S.rel, 1.6 * S.rel));
        const fresh = !b.visible;
        b.visible = true;
        if (snap || fresh) b.position.copy(fresh && !snap ? tplPos(pA, V(0, 0, 0)) : tmp);
        b.position.lerp(tmp, 1 - Math.exp(-dt * 12));
        b.material.opacity = 1 - S.rel;
      }
      for (let k2 = 0; k2 < NMAX - 1; k2++) {
        const on = beads[k2].visible && beads[k2 + 1].visible;
        rnaLink[k2].visible = on;
        if (on) { api.setStick(rnaLink[k2], beads[k2].position, beads[k2 + 1].position); rnaLink[k2].material.transparent = true; rnaLink[k2].material.opacity = 1 - S.rel; }
      }
      const ks1 = K('s1'), ks2 = K('s2');
      rungs.forEach((r, j) => {
        const on = S.fold > 0.6 && beads[ks1 + j].visible && beads[ks2 + 5 - j].visible;
        r.visible = on; if (on) { api.setStick(r, beads[ks1 + j].position, beads[ks2 + 5 - j].position); r.material.opacity = 0.85 * (1 - S.rel); }
      });
      // ρ
      rho.visible = S.rho >= 0 && S.rel < 0.98;
      if (rho.visible) {
        const k0 = Math.max(0, Math.min(S.n - 2, Math.floor(S.rho))), f = S.rho - k0;
        const a = beads[k0].position, b = beads[k0 + 1].position;
        tmp.copy(a).lerp(b, clamp(f));
        rho.position.copy(tmp);
        const dir = b.clone().sub(a); if (dir.lengthSq() > 1e-6) rho.quaternion.setFromUnitVectors(V(0, 0, 1), dir.normalize());
        rho.rotateZ(t * 3);
        setOp(rho, 1 - S.rel);
      }
      atp.forEach((p, i) => {
        const on = rho.visible && S.rel === 0;
        p.visible = on; if (!on) return;
        const ph = (t * 1.6 + i / 4) % 1;
        p.position.copy(rho.position).add(V(Math.cos(i * 1.6) * (0.5 + ph), 0.4 + ph * 1.2, Math.sin(i * 1.6) * (0.5 + ph)));
        p.scale.setScalar(1 - ph);
      });
      // mảnh hụt
      frags.forEach(f => {
        if (f.life <= 0) { f.m.visible = false; return; }
        f.life -= dt; f.m.position.addScaledVector(f.v, dt);
        f.m.material.transparent = true; f.m.material.opacity = clamp(f.life / 1.2);
      });
      // nhãn động
      if (cur === 6 && !brk) { L.show('hp', S.fold > 0.5 && S.rel < 0.6); L.show('uu', S.n >= K('uu') + 2 && S.rel < 0.3); L.show('rel', S.rel > 0.05); }
      if (cur === 7) { api.showLabel(rhoLbl, rho.visible); if (rho.visible) rhoLbl.position.copy(rho.position).add(V(0, 1.5, 0)); if (beads[K('rut') + 4].visible) L.get('rutR').position.copy(beads[K('rut') + 3].position).add(V(-0.4, -0.95, 0)); L.show('rutR', S.n > K('rut') + 12 && S.rel < 0.3); }
      if (cur === 1) api.showLabel(sigLbl, S.sig === 'holo');
      sigLbl.position.set(cur === 1 ? -0.9 : 0, cur === 1 ? 0.5 : 0.75, 0); // bước 1: lệch trái để không đè nhãn α khi lõi xoay
      snap = false;
    }

    function render() { recolor(); applyLabels(); readout(); }

    const ctl = {
      setStep(s) {
        cur = s;
        noSig = gc10 = rifOn = brk = noRho = s32 = false;
        for (const k in T) T[k]?.set?.(false);
        showToggles(s);
        restart(false);
        frags.forEach(f => { f.life = 0; f.m.visible = false; });
        render();
        api.camera(...CAMS[s]);
      },
      update(dt, t) {
        dt = Math.min(dt, 0.05);
        tt += dt;
        compute(dt);
        apply(dt, t);
      },
    };
    ctl.setStep(0);
    return ctl;
  },
};
