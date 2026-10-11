// Bài 11: Operon lac & trp, CAP–cAMP, attenuation (mở rộng). Nhân sơ bật/tắt cả một cụm gene bằng một công tắc chung.
import { labels, clamp, lerp } from './_kit.js';

// Đoạn DNA (sơ đồ rút gọn, không đúng tỉ lệ). Trình tự CAP, promoter, operator O1 và đầu lacZ lấy theo operon lac thật:
// −35 TTTACA, khoảng cách 18 nt, −10 TATGTT. Đầu lacI dùng codon khởi đầu GTG (đúng như gene thật).
const SEG = {
  lacI: 'GTGAAACCAGTA',
  sp1: 'ACGT',
  cap: 'AATGTGAGTTAGCTCA',
  sp2: 'CT',
  prom: 'TTTACA' + 'CTTTATGCTTCCGGCTCG' + 'TATGTT',
  op: 'AATTGTGAGCGGATAACAATT',
  Z: 'ATGACCATGATTACGGATTCAC',
  Y: 'ATGTACTATTTAAAAA',
  A: 'ATGAACATGCCA',
};
const ORDER = ['lacI', 'sp1', 'cap', 'sp2', 'prom', 'op', 'Z', 'Y', 'A'];
const START = {};
let _acc = 0;
for (const k of ORDER) { START[k] = _acc; _acc += SEG[k].length; }
const SEQ = ORDER.map(k => SEG[k]).join('');
const NBP = SEQ.length;
const mid = (k) => START[k] + (SEG[k].length - 1) / 2;
const GENE0 = START.Z, GENE1 = NBP - 1;

// Đoạn leader trpL dùng cho bước attenuation: 4 vùng bắt cặp 1-2-3-4, rồi chuỗi U.
const ATT = [['5', 3], ['1', 6], ['l12', 2], ['2', 6], ['l23', 2], ['3', 6], ['l34', 2], ['4', 6], ['U', 6]];
const ATT_COL = { '5': 0xf2994a, '1': 0xf5c542, l12: 0xf2994a, '2': 0x5dade2, l23: 0xf2994a, '3': 0x58d68d, l34: 0xf2994a, '4': 0xc39bd3, U: 0xff8c42 };

export default {
  title: 'Operon trp, lac & CAP–cAMP: công tắc chung cho cả cụm gene',
  sub: 'Vi khuẩn không bật tắt từng gene một. Các gene cùng một việc nằm cạnh nhau, dùng chung một promoter và một công tắc (operator), rồi được phiên mã thành một mRNA. Bài này cho thấy công tắc lac đọc 2 tín hiệu (lactose và glucose), và công tắc trp đọc tín hiệu tryptophan.',
  legend: '<span><i style="background:#9b6dd6"></i>repressor LacI / TrpR</span><span><i style="background:#2bb3a3"></i>RNA polymerase</span><span><i style="background:#66d9ef"></i>CAP</span><span><i style="background:#d4e157"></i>cAMP</span><span><i style="background:#f5a623"></i>allolactose / Trp</span><span><i style="background:#f2994a"></i>mRNA</span><span><i style="background:#7fb3d5"></i>ribosome</span><span>· sơ đồ rút gọn, không đúng tỉ lệ</span>',

  why: `<p><b>Operon</b> là <b>một cụm gene cấu trúc</b> cùng phục vụ một việc (ví dụ 3 gene để dùng lactose), <b>dùng chung một promoter và một operator</b>, được phiên mã thành <b>một mRNA đa cistron</b> (polycistronic). Lợi ích: một tín hiệu bật cả cụm, nên tế bào có đủ các enzyme của cả con đường cùng lúc, và không tốn năng lượng làm enzyme khi chưa cần.</p>
  <p><b>Operon lac</b> cho E. coli biết <b>khi nào nên đầu tư</b> vào việc dùng lactose. Nó trả lời <b>2 câu hỏi</b>: (1) Có lactose không? (2) Còn glucose không? Glucose là đường "dễ ăn" nhất, nên vi khuẩn chỉ bật mạnh khi <b>có lactose</b> và <b>hết glucose</b>.</p>
  <p><b>Operon trp</b> thì ngược lại: nó làm enzyme <b>tổng hợp</b> tryptophan (Trp), nên khi <b>đã đủ Trp</b> thì phải <b>tắt</b> để khỏi phí.</p>`,

  without: `<ul>
  <li><b>Mất repressor LacI</b> (lacI⁻): operon bật liên tục (constitutive), kể cả khi không có lactose. Tế bào tốn năng lượng và nguyên liệu làm enzyme không dùng tới.</li>
  <li><b>Operator hỏng (Oᶜ, operator constitutive)</b>: repressor vẫn có nhưng không bám được, nên operon cũng bật liên tục. Kết quả giống lacI⁻.</li>
  <li><b>Repressor không nhận allolactose</b> (lacIˢ, "siêu ức chế"): repressor bám operator mãi, operon kẹt ở trạng thái TẮT. Vi khuẩn không dùng được lactose dù xung quanh đầy lactose.</li>
  <li><b>Mất CAP hoặc mất cAMP</b> (CAP⁻ / cya⁻): khi hết glucose vẫn không có lực kích hoạt, nên có lactose cũng chỉ bật "một ít". Vi khuẩn chuyển sang dùng lactose rất chậm.</li>
  <li><b>Mất repressor TrpR</b> (trpR⁻): đủ Trp rồi vẫn tiếp tục làm enzyme tổng hợp Trp. Phí, nhưng không tối đa, vì cơ chế attenuation (bước 10) vẫn cắt bớt phiên mã.</li></ul>
  <div class="box info">👉 Ở <b>bước 8</b> có 4 công tắc 💥 (<b>lacI⁻, Oᶜ, lacIˢ, CAP⁻</b>). Bật từng cái rồi đổi Glucose/Lactose, xem nhãn <b>Biểu hiện</b> (none / low / HIGH) và lý do trong khung chữ. Ở <b>bước 9</b> có 💥 <b>trpR⁻</b>.</div>`,

  foundation: [
    { q: 'Gene, promoter và operator khác nhau thế nào?', a: '<b>Gene</b> là đoạn DNA mã hóa một sản phẩm (protein hoặc RNA). <b>Promoter</b> là đoạn DNA mà <b>RNA polymerase</b> bám vào để bắt đầu phiên mã. <b>Operator</b> là đoạn DNA nằm sát (thường chồng lên) promoter, nơi <b>repressor</b> bám vào để chặn RNA polymerase. Operator không mã hóa gì; nó chỉ là "công tắc" trên DNA. (Promoter không phải codon AUG: xem bài 1.)' },
    { q: 'Operon là gì? Gồm những phần nào?', a: 'Operon là <b>một đơn vị phiên mã có điều hòa</b> gồm: <b>promoter + operator + nhiều gene cấu trúc nằm liền nhau</b> (ví dụ lacZ, lacY, lacA). Cả cụm được phiên mã thành <b>một mRNA đa cistron</b>, rồi dịch thành nhiều protein riêng. <b>Gene điều hòa</b> (lacI, trpR) tạo ra repressor; nó có promoter riêng và không thuộc phần được phiên mã chung. Operon gặp chủ yếu ở <b>nhân sơ</b> và virus của chúng; ở nhân thực mỗi gene thường có promoter riêng.' },
    { q: 'Điều hòa âm và điều hòa dương khác nhau thế nào?', a: '<b>Điều hòa âm</b> (negative): một protein <b>repressor</b> bám DNA thì gene <b>TẮT</b>. Ví dụ LacI, TrpR. <b>Điều hòa dương</b> (positive): một protein <b>activator</b> bám DNA thì gene <b>BẬT mạnh hơn</b>. Ví dụ CAP. Operon lac có <b>cả hai</b>: LacI (âm) và CAP (dương).' },
    { q: 'Chất cảm ứng (inducer) và chất đồng ức chế (corepressor) là gì?', a: 'Cả hai đều là phân tử nhỏ gắn vào repressor và làm nó <b>đổi hình dạng</b> (điều hòa dị lập thể, allosteric). <b>Chất cảm ứng</b> làm repressor <b>mất khả năng bám</b> operator, nên gene BẬT. Ví dụ <b>allolactose</b> với LacI. <b>Chất đồng ức chế</b> thì ngược lại: nó làm repressor <b>bám được</b> operator, nên gene TẮT. Ví dụ <b>tryptophan</b> với TrpR.' },
    { q: 'Lactose trở thành allolactose như thế nào, khi operon còn đang tắt?', a: 'Repressor không chặn tuyệt đối: thỉnh thoảng nó rời operator một chút, nên mỗi tế bào vẫn có <b>vài phân tử</b> permease và β-galactosidase (mức nền, basal). Nhờ vài permease đó, một ít lactose vào được tế bào; vài β-galactosidase đổi một phần lactose thành <b>allolactose</b>. Allolactose mới là thứ thật sự gỡ repressor. Khi operon bật, có thêm permease, lactose vào nhiều hơn, nên tín hiệu tự khuếch đại.' },
    { q: 'Ba gene lacZ, lacY, lacA làm gì?', a: '<b>lacZ</b>: <b>β-galactosidase</b>, cắt lactose thành glucose + galactose (và tạo một ít allolactose). <b>lacY</b>: <b>permease</b>, protein màng đưa lactose vào tế bào. <b>lacA</b>: <b>transacetylase</b>, vai trò phụ (không cần để dùng lactose). Cả 3 nằm trên cùng một mRNA nên được làm cùng lúc.' },
    { q: 'cAMP và CAP là gì?', a: '<b>cAMP</b> (AMP vòng) là một phân tử tín hiệu trong tế bào. <b>Glucose thấp thì cAMP cao</b>, glucose cao thì cAMP thấp (ngược chiều). <b>CAP</b> (catabolite activator protein, còn gọi là CRP) là một dimer. Khi gắn cAMP, CAP bám vào <b>vị trí CAP</b> ngay trước promoter, uốn cong DNA và tiếp xúc trực tiếp với RNA polymerase, giúp nó bám promoter tốt hơn. CAP là <b>activator</b>, không phải repressor.' },
    { q: 'Vì sao operon lac cần cả 2 tín hiệu mới bật mạnh?', a: 'Glucose là nguồn năng lượng rẻ nhất, nên vi khuẩn <b>ưu tiên</b> nó. Chỉ khi <b>có lactose</b> (gỡ repressor) <b>và hết glucose</b> (cAMP cao, CAP hoạt động) thì mới đáng làm nhiều enzyme cho lactose. Hai "chìa khóa": chìa 1 (lactose) là <b>bắt buộc</b> để bật; chìa 2 (hết glucose) để bật <b>mạnh</b>.' },
    { q: 'Vì sao ở vi khuẩn, ribosome dịch mã được mRNA khi mRNA còn đang được phiên mã?', a: 'Vi khuẩn <b>không có màng nhân</b>, nên DNA, RNA polymerase và ribosome ở chung một khoang. Đầu 5′ của mRNA vừa ló ra khỏi RNA polymerase là ribosome bám vào dịch ngay (<b>phiên mã và dịch mã đồng thời</b>, coupled). Điều này là nền tảng của cơ chế attenuation ở operon trp. Nhân thực không làm được vì mRNA phải xử lý xong và ra khỏi nhân rồi mới dịch.' },
    { q: 'Kẹp tóc RNA (hairpin) và terminator không cần ρ là gì?', a: 'Một đoạn RNA có hai vùng <b>bổ sung</b> nhau có thể gập lại, tự bắt cặp thành <b>thân</b> và <b>vòng</b>, giống cái kẹp tóc. Nếu một kẹp tóc giàu GC nằm ngay trước một chuỗi <b>U</b>, nó là <b>terminator không cần ρ</b> (ρ-independent): kẹp tóc làm RNA polymerase khựng lại, cặp U–A yếu bung ra, RNA rời khỏi khuôn và phiên mã dừng.' },
  ],

  steps: [
    { title: 'Toàn cảnh: operon lac nằm trên DNA', text: 'Đọc từ trái sang phải. <b>lacI</b> là gene điều hòa, tạo repressor. Tiếp theo là <b>vị trí CAP</b>, <b>promoter</b> (có −35 TTTACA và −10 TATGTT), <b>operator O</b> và 3 gene <b>lacZ · lacY · lacA</b>. Operator chồng lên đầu vùng được phiên mã, nên repressor bám ở đó sẽ chặn RNA polymerase. Các vùng có ống màu bao quanh để dễ nhìn.' },
    { title: 'lacI luôn tạo repressor (một tetramer)', text: 'Gene <b>lacI</b> có promoter riêng và được phiên mã <b>liên tục ở mức thấp</b> (constitutive), nên tế bào lúc nào cũng có khoảng chục phân tử repressor. Quan sát khối tím hiện ra ở lacI: repressor LacI là <b>tetramer</b> (4 tiểu đơn vị). Mỗi tiểu đơn vị có một chỗ gắn allolactose.' },
    { title: 'Không có lactose: repressor bám operator → TẮT', text: 'Mặc định: <b>có glucose, không có lactose</b>. Repressor ôm lấy <b>operator</b>. RNA polymerase (xanh ngọc) vẫn bám được promoter nhưng <b>không đi vào gene được</b> vì repressor chắn đường. Kết quả: không có mRNA, biểu hiện <b>none</b>. Thử bật công tắc <b>Lactose</b> để xem điều gì xảy ra.' },
    { title: 'Có lactose: allolactose gỡ repressor → "một ít"', text: 'Lactose vào nhờ vài permease có sẵn và được đổi thành <b>allolactose</b> (chấm cam). Các chấm cam gắn vào repressor, làm nó <b>đổi hình dạng</b> và <b>nhả operator</b>. RNA polymerase chạy vào gene, kéo theo sợi mRNA cam. Nhưng <b>glucose vẫn còn</b> (lục giác trắng), cAMP thấp nên CAP lơ lửng không bám. Vì vậy chỉ có <b>low</b>: một RNA polymerase chạy chậm.' },
    { title: 'Hết glucose: cAMP tăng, CAP–cAMP bám → HIGH', text: 'Glucose cạn, <b>cAMP tăng</b> (nhiều chấm vàng-xanh). Hai cAMP gắn vào CAP, CAP bám <b>vị trí CAP</b>, uốn cong DNA và tiếp xúc với RNA polymerase, kéo nó bám promoter mạnh hơn nhiều. Lactose đã gỡ repressor, nên cả 2 chìa khóa đều có: nhiều RNA polymerase nối đuôi nhau, biểu hiện <b>HIGH</b>. Đây là <b>điều hòa dương</b>.' },
    { title: 'Một mRNA, ba protein', text: 'Nhìn xuống dưới: <b>một mRNA đa cistron</b> chứa 3 vùng mã hóa. Mỗi vùng có trình tự Shine–Dalgarno và AUG riêng, nên <b>ribosome</b> (xanh nhạt) dịch từng vùng độc lập, cho ra <b>β-galactosidase</b>, <b>permease LacY</b> và <b>transacetylase LacA</b>. Ribosome bám mRNA ngay khi mRNA còn đang được phiên mã, vì vi khuẩn không có màng nhân.' },
    { title: 'Bảng 4 tổ hợp (tự chạy)', text: 'Cảnh tự đổi qua <b>4 tổ hợp</b>, mỗi tổ hợp khoảng 3 giây. Đọc nhãn xanh trên cùng và nhãn Biểu hiện. Quy luật: <b>Lactose −</b> → <b>none</b>, bất kể glucose (repressor bám). <b>Lactose +, Glucose +</b> → <b>low</b>. <b>Lactose +, Glucose −</b> → <b>HIGH</b>. Mẹo: lactose quyết định <b>có bật hay không</b>, glucose quyết định <b>bật mạnh hay yếu</b>.' },
    { title: 'Đột biến: lacI⁻, Oᶜ, lacIˢ, CAP⁻', text: 'Dùng 4 công tắc 💥 cùng Glucose/Lactose. <b>lacI⁻</b>: không có repressor → bật liên tục. <b>Oᶜ</b>: operator hỏng, repressor không bám → bật liên tục. <b>lacIˢ</b>: repressor không nhận allolactose → kẹt TẮT dù có lactose. <b>CAP⁻</b>: hết glucose cũng chỉ "low". Thử: lacI⁻ + glucose có + không lactose → low (không bị chặn nhưng không có CAP).' },
    { title: 'Operon trp: Trp là chất đồng ức chế', text: 'Cùng khung DNA nhưng giờ là <b>operon trp</b> (trpE D C B A, làm enzyme <b>tổng hợp</b> Trp). Repressor <b>TrpR</b> (dimer) tự nó <b>không bám</b> operator. Khi <b>có Trp</b> (chấm cam), Trp gắn vào TrpR, TrpR mới bám operator → <b>TẮT</b>. Tắt công tắc <b>Tryptophan</b> → TrpR rời, phiên mã <b>HIGH</b>. Gene trpR thật ra nằm <b>xa</b> operon trên nhiễm sắc thể. Operon trp không có vị trí CAP.' },
    { title: 'Mở rộng: attenuation của operon trp', text: '<i>Kiến thức mở rộng, slide không nói đến.</i> Đoạn đầu mRNA (leader trpL) có 4 vùng <b>1–2–3–4</b>; vùng 1 chứa <b>2 codon Trp</b> liền nhau. Ribosome dịch leader ngay khi RNA polymerase còn đang phiên mã. <b>Đủ Trp</b>: ribosome chạy qua vùng 1 tới codon stop và <b>che vùng 2</b>, nên <b>3:4</b> gập thành kẹp tóc + chuỗi U = <b>terminator</b> → RNA polymerase rời, dừng sớm. <b>Thiếu Trp</b>: ribosome <b>kẹt</b> ở 2 codon Trp, vùng 2 tự do bắt cặp với 3 (<b>2:3</b>, chống kết thúc), nên 3:4 không hình thành → phiên mã tiếp vào trpE. Bật/tắt <b>Tryptophan</b> để xem lại.' },
  ],

  application: `<ul>
  <li><b>Sản xuất protein tái tổ hợp trong E. coli:</b> nhiều vector biểu hiện đặt gene đích sau promoter lac hoặc biến thể của nó (lacUV5, tac, hệ pET dùng T7 + lac operator). Thêm <b>IPTG</b>, chất cảm ứng nhân tạo giống allolactose nhưng <b>không bị β-galactosidase phân giải</b>, để gỡ LacI và bật gene đích đúng lúc mong muốn. Insulin người tái tổ hợp đầu tiên (1979) được biểu hiện dưới dạng protein dung hợp với β-galactosidase, nằm sau promoter lac.</li>
  <li><b>Sàng lọc khuẩn lạc xanh–trắng:</b> vector mang đoạn <b>lacZα</b> có vị trí cắt nối gene. Trên đĩa có <b>X-gal</b> và IPTG, khuẩn lạc có β-galactosidase hoạt động biến X-gal thành màu <b>xanh</b>. Nếu gene lạ đã chèn vào giữa lacZα, β-galactosidase không hoạt động và khuẩn lạc <b>trắng</b>, tức là đã nhân dòng thành công.</li>
  <li><b>Thí nghiệm kinh điển của Jacob & Monod (1961, Nobel 1965):</b> các đột biến lacI⁻, Oᶜ, lacIˢ và phép lai "lưỡng bội một phần" (merodiploid) chứng minh repressor là protein khuếch tán được, còn operator là đoạn DNA chỉ tác động lên gene nằm cùng phân tử.</li>
  <li><b>Hiệu ứng "tăng trưởng hai pha" (diauxie):</b> nuôi E. coli trong môi trường có cả glucose và lactose, vi khuẩn dùng hết glucose trước, tạm dừng một lúc để bật operon lac, rồi mới dùng lactose. Đường cong tăng trưởng có 2 bậc.</li>
  <li><b>Sinh học tổng hợp:</b> LacI/IPTG, TetR/tetracycline và AraC/arabinose là các "công tắc" chuẩn để bật tắt gene trong mạch di truyền nhân tạo.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Operon <b>lac</b> (cảm ứng được)</th><th>Operon <b>trp</b> (ức chế được)</th></tr>
  <tr><td>Loại con đường</td><td><b>Phân giải</b> (dùng lactose)</td><td><b>Tổng hợp</b> (làm tryptophan)</td></tr>
  <tr><td>Gene cấu trúc</td><td>lacZ, lacY, lacA</td><td>trpE, trpD, trpC, trpB, trpA</td></tr>
  <tr><td>Repressor</td><td>LacI (tetramer), gene lacI nằm ngay cạnh operon</td><td>TrpR (dimer), gene trpR nằm xa operon</td></tr>
  <tr><td>Phân tử nhỏ</td><td><b>Allolactose</b> = chất <b>cảm ứng</b>, làm repressor RỜI operator</td><td><b>Tryptophan</b> = chất <b>đồng ức chế</b>, làm repressor BÁM operator</td></tr>
  <tr><td>Repressor tự nó (chưa gắn gì)</td><td><b>Đang hoạt động</b>: bám operator</td><td><b>Không hoạt động</b>: không bám</td></tr>
  <tr><td>Gene BẬT khi</td><td><b>CÓ</b> lactose (cơ chất)</td><td><b>KHÔNG CÓ</b> tryptophan (sản phẩm)</td></tr>
  <tr><td>Điều hòa dương (CAP)</td><td><b>Có</b>: cAMP–CAP khi glucose thấp</td><td><b>Không</b></td></tr>
  <tr><td>Attenuation (mở rộng)</td><td>Không</td><td><b>Có</b>: leader trpL, kẹp tóc 2:3 / 3:4</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Glucose</th><th>Lactose</th><th>cAMP</th><th>CAP bám?</th><th>Repressor bám operator?</th><th>Biểu hiện lac</th></tr>
  <tr><td>+ (có)</td><td>−</td><td>thấp</td><td>Không</td><td>Có</td><td><b>none</b></td></tr>
  <tr><td>+ (có)</td><td>+</td><td>thấp</td><td>Không</td><td>Không</td><td><b>low</b> (một ít)</td></tr>
  <tr><td>− (hết)</td><td>−</td><td>cao</td><td>Có</td><td>Có</td><td><b>none</b> (CAP có bám cũng vô ích)</td></tr>
  <tr><td>− (hết)</td><td>+</td><td>cao</td><td>Có</td><td>Không</td><td><b>HIGH</b></td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Đột biến</th><th>Không lactose</th><th>Có lactose, hết glucose</th><th>Tác động</th></tr>
  <tr><td>Bình thường</td><td>none</td><td>HIGH</td><td></td></tr>
  <tr><td><b>lacI⁻</b> (mất repressor)</td><td>bật (constitutive)</td><td>HIGH</td><td>Lặn; sửa được bằng lacI⁺ trên DNA khác (<b>trans</b>)</td></tr>
  <tr><td><b>Oᶜ</b> (operator hỏng)</td><td>bật (constitutive)</td><td>HIGH</td><td>Chỉ ảnh hưởng gene cùng DNA (<b>cis</b>)</td></tr>
  <tr><td><b>lacIˢ</b> (không nhận allolactose)</td><td>none</td><td>none</td><td>Trội: repressor hỏng vẫn bám mọi operator</td></tr>
  <tr><td><b>CAP⁻</b> / cya⁻</td><td>none</td><td>low</td><td>Mất điều hòa dương</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cặp dễ lẫn</th><th>Cái thứ 1</th><th>Cái thứ 2</th></tr>
  <tr><td>Operator vs promoter</td><td>Operator: DNA cho <b>repressor bám</b></td><td>Promoter: DNA cho <b>RNA polymerase bám</b></td></tr>
  <tr><td>Repressor vs activator</td><td>Repressor (LacI, TrpR): bám operator → TẮT</td><td>Activator (CAP): bám vị trí CAP → BẬT mạnh hơn</td></tr>
  <tr><td>Repression vs attenuation (trp)</td><td>Repression: TrpR + Trp chặn <b>khởi đầu</b> phiên mã</td><td>Attenuation: phiên mã đã bắt đầu nhưng <b>dừng sớm</b> ở leader</td></tr>
  </table></div>
  <div class="box warn">⚠️ Về slide: (1) slide viết "cAMP–CAP bám promoter"; chính xác hơn là CAP bám <b>vị trí CAP</b> ngay trước promoter (ở lac, tâm tại khoảng −61) rồi chạm vào RNA polymerase. (2) Định nghĩa "induction" trên slide khá rối: hiểu là <b>chất cảm ứng gắn repressor, làm repressor rời operator, gene BẬT</b>.</div>
  <div class="box info">Mở rộng: ngoài cAMP–CAP, glucose còn ức chế lac theo cách thứ hai. Khi glucose đang được vận chuyển vào tế bào, protein EIIA<sup>Glc</sup> của hệ PTS (dạng không phosphoryl hóa) bám và ức chế permease LacY, nên ít lactose vào được (<b>loại trừ chất cảm ứng</b>, inducer exclusion).</div>`,

  traps: [
    { trap: '"Lactose/allolactose là chất đồng ức chế của operon lac."', truth: 'Allolactose là <b>chất cảm ứng</b>: nó làm repressor rời operator, gene BẬT. Chất đồng ức chế là <b>Trp</b> ở operon trp: nó giúp repressor bám, gene TẮT.' },
    { trap: '"Tryptophan là chất cảm ứng của operon trp."', truth: 'Trp là <b>chất đồng ức chế</b>. TrpR tự nó không bám operator; phải gắn Trp mới bám. Có Trp → TẮT gene tổng hợp Trp.' },
    { trap: '"Có glucose thì operon lac luôn tắt."', truth: 'Glucose không trực tiếp tắt lac; nó làm <b>cAMP thấp</b> nên CAP không giúp. Nếu có lactose thì repressor vẫn rời và operon vẫn chạy ở mức <b>low</b>.' },
    { trap: '"cAMP cao khi glucose cao."', truth: 'Ngược lại: <b>glucose thấp → cAMP cao → CAP–cAMP hoạt động</b>.' },
    { trap: '"Hết glucose (CAP bám) là operon lac bật, dù không có lactose."', truth: 'Không. Không có lactose thì <b>repressor vẫn bám operator</b> và chặn hẳn. CAP chỉ tăng cường khi đường đã thông. Lactose là điều kiện <b>bắt buộc</b>.' },
    { trap: '"CAP là repressor của operon lac."', truth: 'CAP là <b>activator</b> (điều hòa dương). Repressor của lac là <b>LacI</b>.' },
    { trap: '"Đột biến lacI⁻ làm giảm biểu hiện gene lac."', truth: 'Ngược lại: không có repressor thì gene <b>bật liên tục</b> (constitutive). Mất chức năng của một chất <b>ức chế</b> thì làm <b>tăng</b> biểu hiện.' },
    { trap: '"Oᶜ sửa được bằng cách thêm một bản operator bình thường trên plasmid."', truth: 'Không. Operator chỉ là đoạn DNA, chỉ điều khiển gene nằm <b>cùng phân tử DNA</b> với nó (<b>cis</b>). Operator hỏng vẫn để gene bên cạnh nó bật liên tục. Ngược lại, lacI⁻ sửa được bằng lacI⁺ ở nơi khác (<b>trans</b>), vì repressor là protein khuếch tán được.' },
    { trap: '"Repressor bám vào promoter."', truth: 'Repressor bám <b>operator</b>; RNA polymerase bám <b>promoter</b>. Hai đoạn nằm sát và có thể chồng một phần lên nhau, nên repressor chặn được polymerase, nhưng chúng là hai vị trí khác nhau.' },
    { trap: '"Promoter (hộp −10) chính là điểm bắt đầu dịch mã AUG."', truth: 'Promoter là chỗ <b>RNA polymerase</b> bám để bắt đầu <b>phiên mã</b>, nằm <b>trước</b> điểm +1. AUG là codon bắt đầu <b>dịch mã</b> trên mRNA, nằm sau Shine–Dalgarno. Một operon có 1 promoter nhưng nhiều AUG (mỗi gene một AUG). Xem lại bài 1.' },
  ],

  quiz: [
    { q: 'Môi trường có lactose và KHÔNG có glucose. Operon lac biểu hiện thế nào?', ops: ['none (repressor bám)', 'low (một ít)', 'HIGH (mạnh nhất)', 'Chỉ lacZ được phiên mã'], a: 2, e: 'Lactose gỡ repressor (điều kiện bắt buộc); hết glucose nên cAMP cao, CAP–cAMP kích hoạt. Đủ 2 chìa khóa → HIGH. "low" là đáp án bẫy: đó là trường hợp còn glucose. "Chỉ lacZ" sai vì cả operon nằm trên một mRNA.' },
    { q: 'Operator bị đột biến Oᶜ (repressor không bám được). Khi KHÔNG có lactose và có glucose, operon lac sẽ:', ops: ['Phiên mã ở mức thấp (constitutive, không có CAP)', 'Hoàn toàn tắt vì repressor vẫn còn', 'Phiên mã HIGH', 'Repressor bị phân hủy'], a: 0, e: 'Repressor không bám được nên không có gì chặn: operon bật liên tục. Nhưng còn glucose nên CAP không giúp → mức low. "Hoàn toàn tắt" là bẫy: nhầm rằng repressor còn là đủ, trong khi chỗ bám của nó đã hỏng.' },
    { q: 'Phân tử nào làm repressor LacI RỜI khỏi operator?', ops: ['Glucose', 'cAMP', 'Tryptophan', 'Allolactose'], a: 3, e: 'Allolactose gắn vào LacI, đổi hình dạng của nó (dị lập thể) nên LacI nhả operator. cAMP tác động lên CAP chứ không lên LacI. Trp là chất đồng ức chế của operon trp.' },
    { q: 'Operon trp bị TẮT khi nào?', ops: ['Khi không có tryptophan', 'Khi có tryptophan, vì Trp giúp TrpR bám operator', 'Khi có lactose', 'Khi glucose thấp'], a: 1, e: 'Trp là chất đồng ức chế: Trp gắn TrpR thì TrpR mới bám operator và tắt các gene tổng hợp Trp. "Khi không có Trp" ngược logic: lúc đó tế bào cần Trp nên gene phải BẬT.' },
    { q: 'Tế bào có lacI⁺ trên NST nhưng mang Oᶜ ở chính operon lac của NST đó; thêm plasmid mang lacI⁺ O⁺. Không có lactose, các gene lac trên NST sẽ:', ops: ['Bị tắt nhờ repressor từ plasmid', 'Tắt vì có 2 bản lacI', 'Vẫn bật, vì Oᶜ tác động cis: repressor nào cũng không bám được operator hỏng', 'Chỉ bật khi glucose cao'], a: 2, e: 'Operator là đoạn DNA, chỉ điều khiển gene nằm cùng phân tử với nó (cis). Thêm repressor từ plasmid cũng không bám được Oᶜ, nên gene trên NST vẫn bật. Đáp án "tắt nhờ repressor plasmid" là bẫy: cách đó chỉ sửa được lacI⁻ (trans).' },
    { q: 'Đột biến làm CAP không bám được DNA. Có lactose, hết glucose. Kết quả?', ops: ['none, vì repressor vẫn bám', 'low, vì mất lực kích hoạt của CAP', 'HIGH như bình thường', 'Operon bật cả khi không có lactose'], a: 1, e: 'Lactose đã gỡ repressor nên phiên mã vẫn có, nhưng thiếu CAP để tăng cường → low. "none" sai vì repressor đã rời. "HIGH" sai vì HIGH cần cả CAP–cAMP.' },
    { q: '(Mở rộng) Ở operon trp, khi tế bào THIẾU Trp, ribosome dừng ở 2 codon Trp của leader. Điều gì xảy ra tiếp?', ops: ['Vùng 3:4 gập thành terminator, phiên mã dừng', 'Vùng 2:3 gập thành kẹp tóc chống kết thúc, phiên mã đi tiếp vào trpE', 'TrpR bám operator', 'mRNA bị cắt bởi RNase'], a: 1, e: 'Ribosome kẹt ở vùng 1 nên vùng 2 tự do, bắt cặp với vùng 3 (2:3). Vùng 3 đã bận nên 3:4 (terminator) không hình thành → RNA polymerase đi tiếp. 3:4 chỉ hình thành khi đủ Trp (ribosome chạy tới stop và che vùng 2).' },
  ],

  recall: [
    'Vẽ tay lại operon lac nằm ngang: lacI (có promoter riêng) → vị trí CAP → promoter → operator → lacZ, lacY, lacA. Đánh dấu chỗ repressor bám, chỗ RNA polymerase bám, chỗ CAP–cAMP bám, và vẽ 1 mRNA đa cistron cho ra 3 protein.',
    'Không nhìn sách, lập bảng 4 dòng (Glucose, Lactose, cAMP, CAP bám, Repressor bám, Biểu hiện). Sau đó dự đoán cho lacI⁻, Oᶜ, lacIˢ, CAP⁻.',
    'Vẽ tay operon trp ở 2 trạng thái: có Trp (TrpR + Trp bám operator) và không có Trp. Viết 2 câu so sánh chất cảm ứng với chất đồng ức chế.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
    const dnaY = 1.0, rise = 0.2;

    // ---------- DNA ----------
    const dnaG = api.group(); dnaG.position.y = dnaY;
    const dna = api.dna({ seq: SEQ, rise, radius: 0.7, turn: 10.5, openR: 0.8, parent: dnaG });
    const X = (i) => dna.xOf(i);
    const regG = api.group(); regG.position.y = dnaY;
    const shellOf = (a, b, color) => {
      const len = (b - a + 1) * rise;
      const m = api.cylinder(1.08, 1.08, len, color, regG, { opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
      m.rotation.z = Math.PI / 2; m.position.x = (X(a) + X(b)) / 2; return m;
    };
    const sh = {
      reg: shellOf(START.lacI, START.lacI + SEG.lacI.length - 1, 0x9b6dd6),
      cap: shellOf(START.cap, START.cap + SEG.cap.length - 1, 0x66d9ef),
      prom: shellOf(START.prom, START.prom + SEG.prom.length - 1, 0x2bb3a3),
      op: shellOf(START.op, START.op + SEG.op.length - 1, 0xf5a623),
      Z: shellOf(START.Z, START.Z + SEG.Z.length - 1, 0x4a90e2),
      Y: shellOf(START.Y, START.Y + SEG.Y.length - 1, 0x5b9ff0),
      A: shellOf(START.A, START.A + SEG.A.length - 1, 0x7ab0f5),
      // operon trp dùng lại vùng gene: leader trpL + 5 gene
      tL: shellOf(GENE0, GENE0 + 9, 0xf5c542),
      tG: shellOf(GENE0 + 10, GENE1, 0x4a90e2),
    };
    const xm = (k) => X(mid(k));
    // nhãn vùng (so le cao thấp để không đè nhau)
    L.add('reg', 'lacI', [xm('lacI'), 2.0, 0], regG, 'dim');
    L.add('cap', 'vị trí CAP', [xm('cap'), -2.3, 0], regG, 'dim');
    L.add('prom', 'PROMOTER', [xm('prom'), 2.0, 0], regG, 'big');
    L.add('op', 'OPERATOR', [xm('op'), -2.0, 0], regG, 'warn');
    L.add('Z', 'lacZ', [xm('Z'), 2.0, 0], regG, 'good');
    L.add('Y', 'lacY', [xm('Y'), 3.4, 0], regG, 'good');
    L.add('A', 'lacA', [xm('A'), 2.0, 0], regG, 'good');
    L.add('tL', 'trpL (leader)', [X(GENE0 + 5), 3.4, 0], regG, 'dim');
    L.add('tG', 'trpE D C B A', [X((GENE0 + 10 + GENE1) / 2), 2.0, 0], regG, 'good');
    L.add('m35', '−35', [X(START.prom + 2.5), -1.4, 0], regG, 'plain');
    L.add('m10', '−10', [X(START.prom + 26.5), -1.4, 0], regG, 'plain');
    L.add('meter', '', [xm('op') - 2.9, 5.0, 0], regG, 'warn');
    L.add('blocked', '🚫 bị chặn', [xm('prom') - 1.4, -2.6, 1.2], regG, 'warn');
    L.add('lacIBad', '✕ lacI⁻: không có repressor', [xm('lacI') + 2.4, -3.5, 0], regG, 'warn');
    L.add('combo', '', [0, 6.2, 0], regG, 'big');
    const p0 = dna.pairs[0], pz = dna.pairs[NBP - 1];
    L.add('e5', '5′', [X(0) - 0.6, p0.half1.position.y + 0.2, p0.half1.position.z], dnaG, 'plain');
    L.add('e3', '3′', [X(NBP - 1) + 0.6, pz.half1.position.y + 0.2, pz.half1.position.z], dnaG, 'plain');

    // ---------- repressor (LacI tetramer / TrpR dimer) ----------
    const rep = api.group();
    const SUB = [[-0.42, 0.28, 0], [0.42, 0.28, 0], [-0.42, -0.3, 0.12], [0.42, -0.3, 0.12]];
    const subs = SUB.map((p, k) => { const b = api.blob(0.42, C.protein, rep, { seed: 3 + k }); b.position.set(...p); return b; });
    const SITE = SUB.map(p => V(p[0] * 1.35, p[1] + 0.32, 0.42));
    L.add('repL', 'repressor LacI', [0, 1.25, 0], rep, '');
    rep.scale.setScalar(0.01);

    // ---------- CAP dimer + cAMP ----------
    const capG = api.group();
    for (const sx of [-0.36, 0.36]) { const b = api.blob(0.4, 0x66d9ef, capG, { seed: sx > 0 ? 9 : 11 }); b.position.set(sx, 0, 0); }
    const CAP_SITE = [V(-0.36, 0.42, 0.3), V(0.36, 0.42, 0.3)];
    L.add('capL', 'CAP', [0, 1.05, 0], capG, '');
    capG.scale.setScalar(0.01);

    // ---------- small-molecule pools ----------
    const ligG = new THREE.IcosahedronGeometry(0.15, 1);
    const ligs = []; for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(ligG, api.mat(0xf5a623, { emissive: 0x442200 })); api.add(m); m.scale.setScalar(0.01); ligs.push(m); }
    const campG = new THREE.SphereGeometry(0.11, 12, 8);
    const camps = []; for (let k = 0; k < 8; k++) { const m = new THREE.Mesh(campG, api.mat(0xd4e157, { emissive: 0x223300 })); api.add(m); m.scale.setScalar(0.01); camps.push(m); }
    const gluGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 6);
    const glus = []; for (let k = 0; k < 5; k++) { const m = new THREE.Mesh(gluGeo, api.mat(0xf4f7fb)); m.rotation.x = Math.PI / 2; api.add(m); m.scale.setScalar(0.01); glus.push(m); }
    const LIG_C = V(xm('op') + 3.2, dnaY + 4.0, 0.8), CAMP_C = V(xm('cap') + 2.2, dnaY + 4.5, 0.6), GLU_C = V(xm('cap') - 3.0, dnaY + 4.3, 0.6);
    L.add('ligL', 'allolactose', LIG_C.clone().add(V(0.6, 1.1, 0)), null, 'dim');
    L.add('campL', 'cAMP', CAMP_C.clone().add(V(0, 1.1, 0)), null, 'dim');
    L.add('gluL', 'glucose', GLU_C.clone().add(V(0, 1.1, 0)), null, 'dim');

    // ---------- RNA polymerases (pool) with nascent mRNA tails ----------
    const rnaps = [], tails = [];
    const beadG = new THREE.SphereGeometry(0.12, 10, 8), beadM = api.mat(C.rna);
    for (let k = 0; k < 3; k++) {
      const r = api.blob(0.6, C.enzyme, null, { seed: 2 + k, scale: [1.25, 1, 1], mat: { opacity: 0.92 } });
      r.scale.multiplyScalar(0.01); rnaps.push(r);
      const tl = []; for (let j = 0; j < 12; j++) { const b = new THREE.Mesh(beadG, beadM); api.add(b); b.visible = false; tl.push(b); }
      tails.push(tl);
    }
    L.add('rnapL', 'RNA polymerase', [0, -1.05, 0.5], rnaps[0], 'dim');
    const RNAP_S = new THREE.Vector3(1.25, 1, 1);

    // ---------- product layer: polycistronic mRNA → 3 proteins ----------
    const prodG = api.group(); prodG.visible = false;
    const mY = dnaY - 4.0;
    const segX = (k) => [X(START[k]), X(START[k] + SEG[k].length - 1)];
    const cist = ['Z', 'Y', 'A'];
    api.tube([V(X(START.op) - 0.2, mY, 0.4), V(segX('Z')[0], mY, 0.4)], 0.13, C.rna, prodG);
    const CIST_COL = { Z: 0xf2994a, Y: 0xf5b26b, A: 0xf8c88f };
    for (const k of cist) {
      const [a, b] = segX(k);
      api.tube([V(a, mY, 0.4), V((a + b) / 2, mY + 0.12, 0.4), V(b, mY, 0.4)], 0.16, CIST_COL[k], prodG);
      const sd = api.box(0.22, 0.34, 0.34, 0xff3b30, prodG); sd.position.set(a - 0.15, mY, 0.4);
    }
    const ribos = cist.map((k, i) => {
      const g = api.group(prodG);
      const big = api.blob(0.42, C.ribosome, g, { seed: 20 + i }); big.position.y = 0.32;
      const small = api.blob(0.3, 0xa9cce3, g, { seed: 30 + i }); small.position.y = -0.3;
      const pep = api.blob(0.3, C.protein, g, { seed: 40 + i }); pep.position.set(0, 0.95, 0); pep.scale.setScalar(0.01);
      g.userData = { k, pep };
      return g;
    });
    const PROT = {
      Z: (() => { const g = api.group(prodG); for (let k = 0; k < 4; k++) { const b = api.blob(0.32, C.protein, g, { seed: 50 + k }); b.position.set((k % 2 - 0.5) * 0.6, (k > 1 ? -0.5 : 0) * 0.9 + 0.2, 0); } return g; })(),
      Y: (() => { const g = api.group(prodG); const c = api.cylinder(0.32, 0.32, 1.1, 0xb48ae0, g); c.rotation.z = 0.15; return g; })(),
      A: (() => { const g = api.group(prodG); api.blob(0.34, 0x8a5cc9, g, { seed: 61 }); return g; })(),
    };
    const protY = mY - 1.9;
    for (const k of cist) PROT[k].position.set((segX(k)[0] + segX(k)[1]) / 2, protY, 0.4);
    L.add('mrnaL', 'mRNA đa cistron (1 mRNA → 3 protein)', [X(START.op) - 0.6, mY - 0.75, 0.4], null, 'dim');
    L.add('pZ', 'β-galactosidase', [PROT.Z.position.x, protY - 1.05, 0.4], null, 'good');
    L.add('pY', 'permease', [PROT.Y.position.x, protY + 1.0, 0.4], null, 'good');
    L.add('pA', 'transacetylase', [PROT.A.position.x + 0.4, protY - 1.05, 0.4], null, 'good');

    // ---------- attenuation stage (step 10) ----------
    const attG = api.group(); attG.position.set(0, dnaY - 2.2, 2.6); attG.visible = false;
    const AS = 0.42, AX0 = -8.4;
    const rod = api.cylinder(0.14, 0.14, 19, 0x8fa3bf, attG, { opacity: 0.7 }); rod.rotation.z = Math.PI / 2; rod.position.set(0.8, 1.9, -0.4);
    const attBeads = [], attInfo = [];
    const segStart = {};
    { let n = 0; for (const [k, c] of ATT) { segStart[k] = n; for (let j = 0; j < c; j++) { attInfo.push({ k, j }); n++; } } }
    const NB = attInfo.length;
    const attBeadG = new THREE.SphereGeometry(0.17, 14, 10);
    attInfo.forEach(({ k, j }) => {
      const trpCodon = k === '1' && (j === 2 || j === 3);
      const m = new THREE.Mesh(attBeadG, api.mat(trpCodon ? 0xe74c3c : ATT_COL[k], trpCodon ? { emissive: 0x551111 } : {}));
      attG.add(m); m.position.set(AX0 + attBeads.length * AS, 0, 0); attBeads.push(m);
    });
    const attLinks = []; for (let i = 0; i < NB - 1; i++) attLinks.push(api.stick(V(0, 0, 0), V(1, 0, 0), 0.05, C.rna, attG));
    const rungs = []; for (let i = 0; i < 6; i++) { const r = api.stick(V(0, 0, 0), V(1, 0, 0), 0.05, 0xffffff, attG, { opacity: 0.85 }); r.visible = false; rungs.push(r); }
    const attRibo = api.group(attG);
    { const b = api.blob(0.62, C.ribosome, attRibo, { seed: 70 }); b.position.y = 0.48; const s = api.blob(0.44, 0xa9cce3, attRibo, { seed: 71 }); s.position.y = -0.42; }
    const attRnap = api.blob(0.62, C.enzyme, attG, { seed: 72, scale: [1.25, 1, 1], mat: { opacity: 0.92 } });
    const regLab = (k, txt) => { const i = segStart[k] + 1; return L.add('a' + k, txt, [0, 0.55, 0], attBeads[i], 'plain'); };
    regLab('1', '1 (UGG UGG = 2 codon Trp)'); regLab('2', '2'); regLab('3', '3'); regLab('4', '4');
    L.add('aU', 'UUUUUU', [0, -0.5, 0], attBeads[segStart.U + 3], 'plain');
    L.add('aRibo', 'ribosome', [0, 1.4, 0], attRibo, 'dim');
    L.add('aRnap', 'RNA pol', [0, 0.95, 0], attRnap, 'dim');
    L.add('aHp', '', [0, 0, 0], attG, 'good');
    L.add('aMsg', '', [0.5, 3.6, 0], attG, 'big');

    // ---------- state ----------
    let cur = 0, tStep = 0;
    let glu = true, lac = false, tryp = true;
    let kIs = false, kOc = false, kIsup = false, kCap = false, kTrpR = false;
    let combo = -1;
    const COMBOS = [[true, false], [true, true], [false, false], [false, true]];
    const isTrp = () => cur >= 8;
    const eff = () => (cur === 6 && combo >= 0) ? { glu: COMBOS[combo][0], lac: COMBOS[combo][1] } : { glu, lac };
    const derive = () => {
      if (isTrp()) {
        const repExists = !kTrpR;
        const repBound = repExists && tryp;
        return { repExists, repBound, capOn: false, induced: false, level: repBound ? 0 : (tryp ? 1 : 2) };
      }
      const e = eff();
      const repExists = !kIs;
      const induced = repExists && e.lac && !kIsup;
      const repBound = repExists && !kOc && !induced;
      const capOn = !e.glu && !kCap;
      return { repExists, repBound, capOn, induced, level: repBound ? 0 : (capOn ? 2 : 1), glu: e.glu, lac: e.lac };
    };
    const LV = ['none', 'low', 'HIGH'], LVC = ['warn', '', 'good'];

    const readout = () => {
      const d = derive();
      if (cur === 9) {
        api.readout(tryp
          ? '<b>Đủ Trp</b>: có nhiều tRNA mang Trp, ribosome chạy qua 2 codon Trp tới codon stop, <b>che vùng 2</b>. Vùng 3 bắt cặp với 4 thành <b>kẹp tóc 3:4</b>, theo sau là chuỗi U → <b>terminator</b>: RNA polymerase rời DNA, phiên mã dừng ngay sau leader.'
          : '<b>Thiếu Trp</b>: ít tRNA mang Trp, ribosome <b>kẹt</b> ở 2 codon Trp trong vùng 1. Vùng 2 tự do nên bắt cặp với vùng 3 (<b>kẹp tóc 2:3, chống kết thúc</b>). Vùng 3 đã bận, 3:4 không hình thành → RNA polymerase <b>đi tiếp</b> vào trpE D C B A.');
        return;
      }
      let why;
      if (isTrp()) {
        why = d.repBound ? 'Có Trp: Trp gắn TrpR (chất <b>đồng ức chế</b>), TrpR bám operator, RNA polymerase bị chặn. Tế bào đã đủ Trp nên tắt.'
          : (!tryp ? 'Không có Trp: TrpR không gắn Trp nên <b>không bám</b> operator. Phiên mã mạnh để tổng hợp Trp.'
            : '<b>trpR⁻</b>: không có repressor nên operator luôn thông. Nhưng đủ Trp nên <b>attenuation</b> vẫn cắt sớm phần lớn mRNA (bước 10) → chỉ còn mức thấp.');
      } else if (!d.repExists) {
        why = '<b>lacI⁻</b>: không có repressor nên không gì chặn operator.';
      } else if (kOc && !d.induced) {
        why = '<b>Oᶜ</b>: repressor có mặt nhưng không bám được operator hỏng.';
      } else if (d.repBound) {
        why = kIsup && d.lac ? '<b>lacIˢ</b>: repressor không nhận allolactose nên vẫn bám operator dù có lactose.' : 'Không có lactose: <b>repressor bám operator</b>, RNA polymerase bị chặn.';
        if (d.capOn) why += ' CAP–cAMP có bám cũng vô ích.';
      } else {
        why = 'Lactose → allolactose gỡ repressor (chìa khóa bắt buộc).';
      }
      if (!isTrp() && !d.repBound) {
        why += d.capOn ? ' Hết glucose: cAMP cao, <b>CAP–cAMP</b> bám và kéo RNA polymerase → mạnh.'
          : (d.glu ? ' Còn glucose: cAMP thấp, CAP không bám → chỉ một ít.' : ' <b>CAP⁻</b>: hết glucose cũng không có CAP giúp → chỉ một ít.');
      }
      api.readout(`<b>Biểu hiện: ${LV[d.level]}</b>. ${why}`);
    };

    // ---------- toggles (hiện/ẩn theo bước) ----------
    const T = {};
    const rerender = () => render(cur, false);
    T.glu = api.toggle('Glucose có mặt', true, (x) => { glu = x; rerender(); });
    T.lac = api.toggle('Lactose có mặt', false, (x) => { lac = x; rerender(); });
    T.kIs = api.toggle('💥 lacI⁻ (mất repressor)', false, (x) => { kIs = x; rerender(); });
    T.kOc = api.toggle('💥 Oᶜ (operator hỏng)', false, (x) => { kOc = x; rerender(); });
    T.kIsup = api.toggle('💥 lacIˢ (không nhận allolactose)', false, (x) => { kIsup = x; rerender(); });
    T.kCap = api.toggle('💥 CAP⁻ (CAP không bám DNA)', false, (x) => { kCap = x; rerender(); });
    T.tryp = api.toggle('Tryptophan có mặt', true, (x) => { tryp = x; render(cur, cur === 9); });
    T.kTrpR = api.toggle('💥 trpR⁻ (mất TrpR)', false, (x) => { kTrpR = x; rerender(); });
    const SHOW = {
      glu: [0, 1, 2, 3, 4, 5, 7], lac: [0, 1, 2, 3, 4, 5, 7],
      kIs: [7], kOc: [7], kIsup: [7], kCap: [7], tryp: [8, 9], kTrpR: [8],
    };
    const showToggles = (s) => { for (const k in T) if (T[k]?.el) T[k].el.style.display = SHOW[k].includes(s) ? '' : 'none'; };
    // trạng thái đặt sẵn khi vào mỗi bước: [glucose, lactose]
    const PRESET = [[1, 0], [1, 0], [1, 0], [1, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 0], [1, 0]];
    const setT = (k, v) => { T[k]?.set?.(v); };

    const applyLabels = (s, d) => {
      const trp = isTrp();
      L.set('reg', trp ? 'trpR (thật ra ở xa)' : 'lacI');
      L.set('prom', trp ? 'PROMOTER trp' : 'PROMOTER');
      L.set('op', trp ? 'OPERATOR trp' : (kOc ? 'OPERATOR Oᶜ ✕' : 'OPERATOR'));
      L.set('repL', trp ? (d.repBound ? 'TrpR + Trp' : 'TrpR (chưa gắn Trp)') : (kIsup ? 'LacIˢ (không nhận allolactose)' : (d.induced ? 'LacI + allolactose' : 'repressor LacI')));
      L.set('ligL', trp ? 'tryptophan' : 'allolactose');
      L.set('capL', kCap ? 'CAP⁻ ✕ không bám' : (d.capOn ? 'CAP–cAMP' : 'CAP (thiếu cAMP)'));
      const m = L.get('meter'); m.element.className = 'lbl ' + LVC[d.level]; L.set('meter', `Biểu hiện: <b>${LV[d.level]}</b>`);
      const keys = [];
      if (s === 9) {
        keys.push('a1', 'a2', 'a3', 'a4', 'aU', 'aRibo', 'aRnap', 'aMsg');
        return keys;
      }
      keys.push('reg', 'prom', 'op', 'e5', 'e3');
      if (trp) keys.push('tL', 'tG'); else keys.push('cap', 'Z', 'Y', 'A');
      if (s === 0) keys.push('m35', 'm10');
      if (s >= 2) keys.push('meter');
      if (s >= 1 && d.repExists) keys.push('repL');
      if (!d.repExists && s >= 1 && !trp) keys.push('lacIBad');
      if (s >= 2 && d.level === 0) keys.push('blocked');
      if (s === 2 || s === 3) keys.push('rnapL');
      const showLig = trp ? tryp : (d.lac && s >= 3);
      if (showLig && (s === 3 || s === 8)) keys.push('ligL');
      if (!trp && s >= 3 && s <= 7) keys.push('capL');
      if (!trp && (s === 4 || s === 6)) { keys.push('campL'); if (d.glu) keys.push('gluL'); }
      if (!trp && s === 3 && d.glu) keys.push('gluL');
      if (s === 6) keys.push('combo');
      if (!trp && d.level > 0 && (s === 4 || s === 5)) keys.push('mrnaL');
      if (!trp && d.level > 0 && s === 5) keys.push('pZ', 'pY', 'pA');
      return keys;
    };

    const CAMS = [
      [[0, 1.5, 32], [0, 0.8, 0]],
      [[-8, 3.5, 14], [-9, 2.4, 0]],
      [[-1.5, 2.5, 16], [-2, 1.4, 0]],
      [[-3, 3, 21], [-3.5, 2.2, 0]],
      [[-1.5, 2, 23], [-1.5, 1.2, 0]],
      [[4.5, -0.8, 19], [4.5, -2, 0]],
      [[0, 1.5, 27], [0, 1.4, 0]],
      [[0, 1.5, 27], [0, 1.2, 0]],
      [[0, 2, 27], [0, 1.4, 0]],
      [[0, -1.2, 21], [0, -1.8, 2.6]],
    ];

    // attenuation state
    const att = { rp: 0, fold: 0, gone: 0 };
    // đủ Trp: ribosome tới codon stop và đè lên vùng 2; thiếu Trp: kẹt ở 2 codon Trp của vùng 1
    const attTargetIdx = () => tryp ? segStart['2'] + 1.5 : segStart['1'] + 2.5;

    function render(s, resetAtt = true) {
      const d = derive();
      // shells
      const trp = isTrp();
      const hi = { reg: s === 1, cap: s === 4 && !trp, prom: s >= 2 && s !== 9, op: s === 2 || s === 3 || s === 8 };
      for (const k in sh) {
        const m = sh[k];
        const visible = s !== 9 && (trp ? !['cap', 'Z', 'Y', 'A'].includes(k) : !['tL', 'tG'].includes(k));
        m.visible = visible;
        m.material.opacity = hi[k] ? 0.3 : 0.12;
      }
      api.fadeTo(dnaG, s === 9 ? 0.12 : 1, 4);
      // repressor
      const nSub = trp ? 2 : 4;
      subs.forEach((b, k) => { b.visible = k < nSub; });
      const repShow = s >= 1 && s !== 9 && d.repExists;
      const repOn = V(xm('op'), dnaY + 1.15, 0.15);
      const repOff = V(xm('op') + 1.8, dnaY + 3.6, 0.9);
      let repTo = d.repBound ? repOn : repOff;
      if (s === 1) { repTo = V(xm('lacI') + 0.4, dnaY + 2.6, 0.6); if (resetAtt) { rep.position.set(xm('lacI'), dnaY + 0.6, 0.4); rep.scale.setScalar(0.01); } }
      if (trp && !d.repBound && s >= 8) repTo = V(xm('op') + 1.6, dnaY + 3.4, 0.9);
      api.moveTo(rep, repTo, 2.5);
      api.scaleTo(rep, repShow ? 1 : 0.01, 4);
      api.rotateTo(rep, 'z', d.induced ? 0.45 : (trp && !d.repBound ? -0.35 : 0), 3);
      // CAP
      const capShow = !trp && s >= 3 && s <= 7;
      api.scaleTo(capG, capShow ? 1 : 0.01, 4);
      api.moveTo(capG, d.capOn ? V(xm('cap'), dnaY + 1.1, 0.2) : V(xm('cap'), dnaY + 3.0, 0.9), 2.5);
      // product layer
      prodG.visible = !trp && d.level > 0 && s >= 4 && s <= 7;
      // attenuation stage
      attG.visible = s === 9;
      if (s === 9 && resetAtt) { att.rp = 0; att.fold = 0; att.gone = 0; attRnap.position.set(AX0 + (NB - 1) * AS + 0.55, 1.15, 0); attRnap.scale.set(1.25, 1, 1); }
      if (s === 9 && !resetAtt) { att.fold = 0; att.gone = 0; }
      L.only(applyLabels(s, d));
      api.showLabel(L.get('blocked'), s >= 2 && s !== 9 && d.level === 0);
      readout();
    }

    const ctl = {
      setStep(s) {
        cur = s; tStep = 0; combo = s === 6 ? 0 : -1;
        const p = PRESET[s];
        glu = !!p[0]; lac = !!p[1]; tryp = true;
        kIs = kOc = kIsup = kCap = kTrpR = false;
        setT('glu', glu); setT('lac', lac); setT('tryp', tryp);
        for (const k of ['kIs', 'kOc', 'kIsup', 'kCap', 'kTrpR']) setT(k, false);
        showToggles(s);
        if (s === 6) L.set('combo', comboText(0));
        render(s, true);
        api.camera(...CAMS[s]);
      },
      update(dt, t) {
        tStep += dt;
        // step 7: auto-cycle the 4 combinations
        if (cur === 6) {
          const c = Math.floor(tStep / 3.2) % 4;
          if (c !== combo) { combo = c; L.set('combo', comboText(c)); render(6, false); }
        }
        const d = derive();
        const trp = isTrp();
        const showRNAP = cur >= 2 && cur !== 9;
        // ---- RNA polymerases & DNA bubbles ----
        const xA = xm('prom'), xB = X(GENE1) + 0.9, xTSS = X(START.op);
        const n = d.level === 0 ? 1 : (d.level === 1 ? 1 : 3);
        const speed = d.level === 2 ? 2.6 : 1.1;
        const runX = [];
        rnaps.forEach((r, k) => {
          let on = showRNAP && k < n, x = xA, sc = 0.01;
          if (on && d.level === 0) { x = xm('prom') - 0.4; sc = 1; }
          else if (on) {
            const len = xB - xA, u = ((t * speed / len) + k / n) % 1;
            x = xA + u * len; sc = clamp(Math.min(u / 0.06, (1 - u) / 0.06));
            if (x > xTSS) runX.push(x);
          }
          tmp.set(x, dnaY + (d.level === 0 ? 0.05 : 0), 0.55);
          r.position.lerp(tmp, d.level === 0 ? 1 - Math.exp(-dt * 4) : 1);
          tmp2.copy(RNAP_S).multiplyScalar(Math.max(0.01, sc));
          r.scale.lerp(tmp2, 1 - Math.exp(-dt * 10));
          // nascent mRNA tail
          tails[k].forEach((b, j) => {
            const bx = r.position.x - 0.35 - j * 0.3;
            const vis = on && d.level > 0 && bx > xTSS && sc > 0.2;
            b.visible = vis;
            if (vis) b.position.set(bx, dnaY - 0.95 - j * 0.16, 0.7 + Math.sin(j * 0.9 + t * 2.5) * 0.18);
          });
        });
        for (const p of dna.pairs) {
          const x = X(p.i); let o = 0;
          for (const rx of runX) if (Math.abs(x - rx) < 0.75) { o = 0.55; break; }
          p.target = cur === 9 ? 0 : o;
        }
        // ---- ligands (allolactose / Trp) ----
        const ligN = cur === 9 ? 0 : (trp ? (tryp ? 4 : 0) : ((d.lac && cur >= 3) ? 6 : 0));
        const bindN = trp ? (d.repBound ? 2 : 0) : (d.induced ? 4 : 0);
        ligs.forEach((m, k) => {
          const on = k < ligN;
          if (k < bindN) { tmp.copy(SITE[k]).applyEuler(rep.rotation).multiplyScalar(rep.scale.x).add(rep.position); }
          else tmp.set(LIG_C.x + Math.cos(t * 0.7 + k * 1.7) * 1.1, LIG_C.y + Math.sin(t * 0.9 + k * 2.3) * 0.6, LIG_C.z + Math.sin(t * 0.5 + k) * 0.5);
          m.position.lerp(tmp, 1 - Math.exp(-dt * 3));
          const s = on ? 1 : 0.01; m.scale.setScalar(lerp(m.scale.x, s, 1 - Math.exp(-dt * 6)));
          m.rotation.y += dt;
        });
        // ---- cAMP & glucose clouds ----
        const lacScene = !trp && cur >= 3 && cur <= 7;
        const campN = lacScene ? (d.glu ? 1 : 8) : 0;
        const capHasCamp = lacScene && !d.glu;
        camps.forEach((m, k) => {
          const on = k < campN;
          if (capHasCamp && k < 2) tmp.copy(CAP_SITE[k]).multiplyScalar(capG.scale.x).add(capG.position);
          else tmp.set(CAMP_C.x + Math.cos(t * 0.8 + k * 1.3) * 1.0, CAMP_C.y + Math.sin(t * 1.1 + k * 2.1) * 0.5, CAMP_C.z + Math.cos(t * 0.6 + k) * 0.4);
          m.position.lerp(tmp, 1 - Math.exp(-dt * 3));
          m.scale.setScalar(lerp(m.scale.x, on ? 1 : 0.01, 1 - Math.exp(-dt * 6)));
        });
        const gluN = lacScene && d.glu ? 5 : 0;
        glus.forEach((m, k) => {
          tmp.set(GLU_C.x + Math.cos(t * 0.5 + k * 1.26) * 1.1, GLU_C.y + Math.sin(t * 0.7 + k * 1.9) * 0.5, GLU_C.z);
          m.position.lerp(tmp, 1 - Math.exp(-dt * 3));
          m.scale.setScalar(lerp(m.scale.x, k < gluN ? 1 : 0.01, 1 - Math.exp(-dt * 6)));
          m.rotation.z += dt * 0.6;
        });
        // ---- product layer: ribosomes walk along each cistron, release protein ----
        if (prodG.visible) {
          const rs = d.level === 2 ? 0.45 : 0.18;
          ribos.forEach((g, i) => {
            const [a, b] = segX(g.userData.k);
            const u = (t * rs + i * 0.33) % 1;
            g.position.set(lerp(a, b, u), mY, 0.4);
            g.userData.pep.scale.setScalar(Math.max(0.01, u));
          });
          const pOn = cur === 5 ? 1 : 0.01;
          for (const k of cist) { const P = PROT[k]; P.scale.setScalar(lerp(P.scale.x, pOn, 1 - Math.exp(-dt * 4))); P.rotation.y += dt * 0.5; }
        }
        // ---- attenuation stage ----
        if (cur === 9) updateAtt(dt, t);
        // breathing
        capG.rotation.y = Math.sin(t * 0.8) * 0.25;
      },
    };

    function comboText(c) {
      const [g, l] = COMBOS[c];
      const lv = l ? (g ? 'low' : 'HIGH') : 'none';
      return `Glucose ${g ? '+' : '−'} · Lactose ${l ? '+' : '−'} → <b>${lv}</b>`;
    }

    // bead layout for the leader: hairpin (A with B) folds downward
    const attPos = attBeads.map(() => new THREE.Vector3());
    function layoutAtt(pairA, pairB, loopK, fold) {
      let cx = AX0;
      const out = attPos;
      for (let i = 0; i < NB; i++) out[i].set(AX0 + i * AS, 0, 0); // linear
      if (!pairA || fold <= 0) return { cx: 0 };
      const hp = [];
      let x = AX0;
      for (const [k, c] of ATT) {
        const i0 = segStart[k];
        if (k === pairA) {
          for (let j = 0; j < c; j++) hp[i0 + j] = V(x, -(j + 0.7) * 0.42, 0);
          cx = x;
        } else if (k === loopK) {
          const yb = -(6 + 0.7) * 0.42 - 0.15;
          for (let j = 0; j < c; j++) { const a = Math.PI + (j + 1) / (c + 1) * Math.PI; hp[i0 + j] = V(cx + 0.36 + Math.cos(a) * 0.36, yb + Math.sin(a) * 0.36, 0); }
        } else if (k === pairB) {
          for (let j = 0; j < c; j++) hp[i0 + j] = V(cx + 0.72, -(c - 1 - j + 0.7) * 0.42, 0);
          x = cx + 0.72 + AS;
        } else {
          for (let j = 0; j < c; j++) { hp[i0 + j] = V(x, 0, 0); x += AS; }
        }
      }
      for (let i = 0; i < NB; i++) out[i].lerp(hp[i], fold);
      return { cx };
    }

    function updateAtt(dt, t) {
      const target = attTargetIdx();
      // ribosome walks along the leader
      att.rp = Math.min(target, att.rp + dt * 3.2);
      const arrived = att.rp >= target - 0.01;
      if (arrived) att.fold = Math.min(1, att.fold + dt * 0.7);
      const pairA = tryp ? '3' : '2', pairB = tryp ? '4' : '3', loopK = tryp ? 'l34' : 'l23';
      const { cx } = layoutAtt(pairA, pairB, loopK, att.fold);
      attBeads.forEach((b, i) => b.position.lerp(attPos[i], 1 - Math.exp(-dt * 8)));
      for (let i = 0; i < NB - 1; i++) api.setStick(attLinks[i], attBeads[i].position, attBeads[i + 1].position);
      // H-bond rungs in the hairpin
      const iA = segStart[pairA], iB = segStart[pairB];
      rungs.forEach((r, j) => {
        const on = att.fold > 0.75;
        r.visible = on;
        if (on) api.setStick(r, attBeads[iA + j].position, attBeads[iB + 5 - j].position);
      });
      // ribosome sits on the bead it has reached
      const i0 = Math.floor(att.rp), f = att.rp - i0;
      tmp.copy(attBeads[Math.min(NB - 1, i0)].position).lerp(attBeads[Math.min(NB - 1, i0 + 1)].position, f);
      attRibo.position.set(tmp.x, 0.05, 0.1);
      attRibo.rotation.z = arrived && !tryp ? Math.sin(t * 9) * 0.04 : 0; // stalled ribosome jitters
      // RNA polymerase rides the DNA rod just ahead of the 3′ end
      const last = attBeads[NB - 1].position;
      if (att.fold > 0.9) att.gone = Math.min(1, att.gone + dt * 0.6);
      if (tryp) {
        tmp.set(last.x + 0.55 + att.gone * 1.2, 1.15 + att.gone * 2.2, att.gone * 0.6);
        attRnap.scale.setScalar(1).multiplyScalar(Math.max(0.01, 1 - att.gone * 0.85)); attRnap.scale.x *= 1.25;
      } else {
        tmp.set(last.x + 0.55 + att.gone * 2.5, 1.15, 0);
        attRnap.scale.set(1.25, 1, 1);
      }
      attRnap.position.lerp(tmp, 1 - Math.exp(-dt * 6));
      // labels
      const hp = L.get('aHp');
      const showHp = att.fold > 0.7;
      api.showLabel(hp, showHp);
      if (showHp) { hp.position.set(cx + 0.36, -3.6, 0.2); L.set('aHp', tryp ? 'kẹp tóc 3:4 = terminator' : 'kẹp tóc 2:3 = chống kết thúc'); hp.element.className = 'lbl ' + (tryp ? 'warn' : 'good'); }
      L.set('aMsg', !arrived ? (tryp ? 'Đủ Trp: ribosome chạy nhanh qua vùng 1…' : 'Thiếu Trp: ribosome chạy tới 2 codon Trp…')
        : (tryp ? (att.gone > 0.3 ? '⛔ Dừng sớm: RNA pol rời DNA' : 'Ribosome dừng ở codon stop, che vùng 2')
          : (att.gone > 0.3 ? '✅ Phiên mã tiếp → trpE D C B A' : 'Ribosome kẹt ở UGG UGG (thiếu Trp-tRNA)')));
    }

    ctl.setStep(0);
    return ctl;
  },
};
