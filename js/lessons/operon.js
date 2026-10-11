// Bài 11: Operon lac & trp, CAP–cAMP. Nhân sơ bật/tắt cả một cụm gene bằng một công tắc chung.
import { labels } from './_kit.js';

// Chỉ số đoạn DNA (sơ đồ rút gọn, không đúng tỉ lệ). Promoter có −35 TTTACA và −10 TATGTT cách nhau 17 nt.
const SEG = {
  lacI: 'ATGAAACGCA',
  sp1: 'GGTCTA',
  cap: 'TGTGAGTTAGCTCA',
  sp2: 'TG',
  prom: 'TTTACA' + 'CTGGCGAAAGGGGGATG' + 'TATGTT',
  op: 'AATTGTGAGCGGATAACAATT',
  genes: 'ATGACCATGATTACGGATTC',
};
const ORDER = ['lacI', 'sp1', 'cap', 'sp2', 'prom', 'op', 'genes'];
const START = {};
let _acc = 0;
for (const k of ORDER) { START[k] = _acc; _acc += SEG[k].length; }
const SEQ = ORDER.map(k => SEG[k]).join('');
const span = (k) => [START[k], START[k] + SEG[k].length - 1];
const mid = (k) => START[k] + (SEG[k].length - 1) / 2;

export default {
  title: 'Operon lac & trp: công tắc chung cho cả cụm gene',
  sub: 'Vi khuẩn không bật tắt từng gene một. Nhiều gene liên quan nằm cạnh nhau, dùng chung một promoter và một công tắc, rồi được phiên mã thành một mRNA. Bài này cho thấy công tắc lac đọc 2 tín hiệu (lactose và glucose) như thế nào.',
  legend: '<span><i style="background:#9b6dd6"></i>repressor LacI / TrpR</span><span><i style="background:#2bb3a3"></i>RNA polymerase</span><span><i style="background:#66d9ef"></i>CAP–cAMP</span><span><i style="background:#f5a623"></i>allolactose / tryptophan</span><span><i style="background:#f2994a"></i>mRNA đa cistron</span><span>· sơ đồ rút gọn, không đúng tỉ lệ</span>',

  why: `<p>Một operon là <b>một cụm gene cấu trúc</b> cùng chức năng (ví dụ 3 gene để phân giải lactose), <b>dùng chung một promoter và một công tắc</b>, được phiên mã thành <b>một mRNA đa cistron</b>. Lợi ích: một tín hiệu bật cả cụm, nên tế bào làm đủ các enzyme cùng lúc, không tốn năng lượng cho enzyme không cần.</p>
  <p>Operon lac cho E. coli biết <b>khi nào nên đầu tư</b> vào việc tiêu hóa lactose. Nó đọc <b>2 câu hỏi</b>: (1) Có lactose để ăn không? (2) Có glucose không? Glucose là đường tốt nhất, nên vi khuẩn chỉ bật mạnh khi <b>có lactose</b> và <b>hết glucose</b>.</p>`,

  without: `<ul>
  <li><b>Mất repressor LacI</b> (lacI⁻): operon bật liên tục, kể cả khi không có lactose. Tế bào tốn năng lượng làm enzyme không dùng tới, và cạnh tranh tài nguyên với các hoạt động khác.</li>
  <li><b>Operator không bám được (Oᶜ)</b>: repressor có mặt nhưng không gắn vào, nên operon luôn bật. Giống lacI⁻ về kết quả.</li>
  <li><b>Mất CAP (CAP⁻)</b>: khi hết glucose vẫn không có lực kích hoạt, nên operon lac chỉ bật yếu (mức "một ít") ngay cả khi có lactose. Vi khuẩn không chuyển nhanh sang lactose khi glucose cạn.</li>
  <li><b>Mất khả năng đáp ứng với lactose</b> (đột biến ở LacI làm nó không nhả ra): operon bị kẹt tắt, vi khuẩn chết đói giữa đống lactose.</li></ul>
  <div class="box info">👉 Bật <b>💥 lacI⁻</b>, <b>💥 Oᶜ</b> và <b>💥 CAP⁻</b> rồi đổi tổ hợp Glucose/Lactose. Quan sát ô <b>Biểu hiện</b> (none / low / HIGH) và lý do đi kèm.</div>`,

  foundation: [
    { q: 'Gene, promoter và operator khác nhau thế nào?', a: '<b>Gene</b> là đoạn DNA mã hóa một sản phẩm (protein hoặc RNA). <b>Promoter</b> là đoạn DNA RNA polymerase bám vào để bắt đầu phiên mã. <b>Operator</b> là đoạn DNA ngay cạnh promoter mà <b>repressor</b> bám vào, để chặn RNA polymerase. Operator không mã hóa gì; nó chỉ là "công tắc" nằm trên DNA.' },
    { q: 'Operon là gì?', a: 'Operon là <b>một đơn vị điều hòa</b> gồm: promoter + operator + nhiều gene cấu trúc nằm liền nhau (ví dụ <b>lacZ, lacY, lacA</b>). Cả cụm được phiên mã thành <b>một mRNA đa cistron</b>, sau đó dịch thành nhiều protein. Operon chỉ gặp ở <b>nhân sơ</b> và virus; ở nhân thực mỗi gene có promoter riêng.' },
    { q: 'Repressor và activator khác nhau thế nào?', a: '<b>Repressor</b> (chất ức chế) bám vào <b>operator</b> và <b>chặn</b> RNA polymerase, làm gene TẮT. <b>Activator</b> (chất hoạt hóa) bám gần <b>promoter</b> và <b>giúp</b> RNA polymerase bám mạnh hơn, làm gene BẬT mạnh hơn. Hai kiểu này đối lập nhau về hướng, nên hay bị nhầm.' },
    { q: 'Chất cảm ứng (inducer) và chất đồng ức chế (corepressor) là gì?', a: '<b>Chất cảm ứng</b> bám vào repressor và làm repressor <b>BẤT HOẠT</b>, khiến repressor rời operator và gene BẬT. Ví dụ: <b>allolactose</b> với operon lac. <b>Chất đồng ức chế</b> thì ngược lại: nó bám vào repressor và <b>KÍCH HOẠT</b> repressor, để repressor bám operator và gene TẮT. Ví dụ: <b>tryptophan</b> với operon trp.' },
    { q: 'Lactose biến thành allolactose như thế nào?', a: 'Một lượng nhỏ <b>β-galactosidase</b> (sản phẩm gene lacZ) biến một phần lactose thành <b>allolactose</b>, một đồng phân của lactose. Allolactose là thứ thật sự gỡ repressor. Lúc đầu vẫn chỉ có một ít β-galactosidase, nên operon phải có sẵn một lượng nhỏ lactose trước khi bật mạnh.' },
    { q: 'Ba gene lacZ, lacY, lacA làm gì?', a: '<b>lacZ</b>: β-galactosidase, cắt lactose thành glucose và galactose (đồng thời tạo allolactose). <b>lacY</b>: permease, một kênh màng đưa lactose vào tế bào. <b>lacA</b>: transacetylase, chức năng phụ, ít quan trọng trong bài này. Cả 3 cùng nằm trong một mRNA, nên bật cùng lúc.' },
    { q: 'Cyclic AMP (cAMP) và CAP là gì?', a: '<b>cAMP</b> là một tín hiệu nội bào. Khi <b>glucose thấp</b> thì <b>cAMP cao</b>, và ngược lại (hai đại lượng đối nghịch). <b>CAP</b> (catabolite activator protein, còn gọi là CRP) khi bám cAMP sẽ có hoạt tính và bám vào vùng gần promoter để <b>kích hoạt</b> RNA polymerase. CAP là một activator, không phải repressor.' },
    { q: 'Vì sao vi khuẩn cần cả 2 tín hiệu để bật lac mạnh?', a: 'Glucose là nguồn năng lượng rẻ nhất, nên vi khuẩn <b>ưu tiên</b> dùng nó. Chỉ khi <b>hết glucose</b> (cAMP cao, CAP hoạt động) và <b>có lactose</b> (gỡ repressor) thì mới đáng tổng hợp mạnh enzyme phân giải lactose. Đây là hai "chìa khóa": repressor cần lactose để gỡ ra, CAP cần glucose thấp để kích hoạt.' },
  ],

  steps: [
    { title: 'Toàn cảnh: một operon và công tắc của nó', text: 'Nhìn từ trái sang phải. <b>lacI</b> là gene tạo repressor (màu tím, nằm xa). Tiếp theo là vùng <b>CAP</b> (xanh lam), <b>promoter</b> (vùng bám RNA polymerase), <b>operator O</b> (công tắc, vùng nền sáng nhất), và cuối cùng là <b>lacZ, lacY, lacA</b>. Operator nằm ngay sau promoter nên repressor bám vào đó sẽ chặn trực tiếp RNA polymerase.' },
    { title: 'Gene lacI tạo repressor', text: 'Gene <b>lacI</b> luôn được phiên mã nhẹ, tạo ra repressor LacI (protein tím). Repressor là một <b>tetramer</b> nên có nhiều chỗ bám. Lúc này không có lactose nên repressor chưa bị gỡ. Nó trôi xuống phía operator, đúng chỗ nó sẽ bám.' },
    { title: 'Repressor bám operator và chặn RNA polymerase', text: 'Repressor bám vào <b>operator O</b> và đứng ngay trên promoter. RNA polymerase (xanh ngọc) tới được promoter nhưng <b>không mở được DNA để phiên mã</b> vì repressor đã chắn lối. Kết quả: <b>KHÔNG có mRNA</b>, biểu hiện <b>none</b>. Đây là trạng thái mặc định khi không có lactose.' },
    { title: 'Lactose đến: allolactose gỡ repressor', text: 'Khi có lactose, một lượng nhỏ được biến thành <b>allolactose</b> (cam). Allolactose bám vào repressor và làm nó đổi hình dạng, <b>nhả khỏi operator</b>. Repressor bay lơ lửng ra xa. Lúc này <b>operator đã trống</b>, RNA polymerase có thể bắt đầu phiên mã. Chú ý: allolactose là chất <b>cảm ứng</b>, không phải chất đồng ức chế.' },
    { title: 'Hết glucose: cAMP cao, CAP bám và kích hoạt', text: 'Khi glucose thấp, <b>cAMP tăng</b>. cAMP gắn vào CAP và CAP (xanh lơ) bám vào <b>vùng CAP</b> gần promoter. CAP-cAMP tạo ra một chỗ tiếp xúc để RNA polymerase bám mạnh hơn. Đây là <b>điều hòa dương tính</b>. Kết hợp với lactose đã gỡ repressor, operon bật <b>HIGH</b>: nhiều mRNA được tạo, các chấm đỏ chạy nhanh.' },
    { title: 'Có glucose: CAP rời đi, biểu hiện chỉ "một ít"', text: 'Glucose quay lại, cAMP giảm, CAP không còn hoạt động và rời khỏi DNA. Lactose vẫn còn nên repressor vẫn được gỡ, RNA polymerase vẫn phiên mã, nhưng <b>chậm</b> (mức <b>low</b>, "một ít"). Đây là trường hợp <b>glucose cao, lactose có</b>: vi khuẩn chọn glucose trước.' },
    { title: 'Bảng 4 tổ hợp: đọc ra logic đầy đủ', text: 'Đây là bảng sự thật của operon lac. <b>Glucose −, Lactose +</b> cho HIGH vì cả 2 chìa khóa đều có. <b>Glucose +, Lactose +</b> cho low. <b>Lactose −</b> thì repressor bám operator và cho none, bất kể glucose. Mẹo nhớ: lactose là điều kiện <b>bắt buộc</b> để bật, glucose thấp là điều kiện để bật <b>mạnh</b>.' },
    { title: 'Đột biến: lacI⁻, Oᶜ, CAP⁻', text: 'Bật các công tắc 💥 để thấy đột biến. <b>lacI⁻</b>: không còn repressor nên operon bật liên tục. <b>Oᶜ</b>: repressor còn nhưng không bám được operator, kết quả giống lacI⁻. <b>CAP⁻</b>: CAP không bám được nên khi hết glucose cũng chỉ bật "một ít". Đổi tổ hợp Glucose/Lactose để so sánh.' },
  ],

  application: `<ul>
  <li><b>Sản xuất protein tái tổ hợp trong E. coli:</b> nhiều vector biểu hiện dùng promoter lac (hoặc lac biến thể như T7-lac). Thêm <b>IPTG</b> (chất cảm ứng tổng hợp giống allolactose, không bị phân giải) để gỡ repressor và bật gene đích. Đây là cách sản xuất insulin và nhiều enzyme trong công nghiệp.</li>
  <li><b>Sàng lọc khuẩn lạc xanh–trắng:</b> gene lacZ (đoạn α) được dùng làm báo cáo. Khi có X-gal, khuẩn lạc có β-galactosidase hoạt động sẽ <b>xanh</b>, khuẩn lạc đứt gene sẽ <b>trắng</b>. Đây là kỹ thuật cơ bản khi nhân dòng gene trong phòng thí nghiệm.</li>
  <li><b>Chứng minh kinh điển (Jacob & Monod, 1961):</b> các đột biến lacI⁻ và Oᶜ được tìm thấy nhờ quan sát lac tự bật liên tục. Từ đó mô hình repressor–operator được xác nhận.</li>
  <li><b>Điều hòa nhân sơ nói chung:</b> ngoài lac và trp, E. coli còn nhiều operon (ara, gal…) cũng dùng cùng logic: chất cảm ứng gỡ repressor, CAP kích hoạt khi thiếu glucose. Nhớ logic này là hiểu được nhiều operon khác.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Operon <b>lac</b> (cảm ứng được)</th><th>Operon <b>trp</b> (ức chế được)</th></tr>
  <tr><td>Loại con đường</td><td>Phân giải (dùng lactose)</td><td>Tổng hợp (làm tryptophan)</td></tr>
  <tr><td>Phân tử gỡ / gắn repressor</td><td><b>Allolactose</b>: chất <b>cảm ứng</b>, GỠ repressor</td><td><b>Tryptophan</b>: chất <b>đồng ức chế</b>, KÍCH HOẠT repressor</td></tr>
  <tr><td>Lúc nào gene BẬT?</td><td>Khi <b>CÓ</b> lactose (cơ chất)</td><td>Khi <b>KHÔNG CÓ</b> tryptophan</td></tr>
  <tr><td>Lúc nào gene TẮT?</td><td>Khi không có lactose</td><td>Khi có tryptophan (sản phẩm cuối đã đủ)</td></tr>
  <tr><td>Điều hòa dương (CAP)</td><td><b>Có</b>: cAMP–CAP tăng hoạt tính khi glucose thấp</td><td><b>Không</b> (trp không có CAP)</td></tr>
  <tr><td>Tên cơ chế</td><td>Inducible (cảm ứng)</td><td>Repressible (ức chế)</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Glucose</th><th>Lactose</th><th>CAP bám?</th><th>Repressor bám operator?</th><th>Biểu hiện</th></tr>
  <tr><td>+ (có)</td><td>−</td><td>Không</td><td>Có</td><td><b>none</b></td></tr>
  <tr><td>+ (có)</td><td>+</td><td>Không</td><td>Không</td><td><b>low</b> (một ít)</td></tr>
  <tr><td>− (thấp)</td><td>−</td><td>Có</td><td>Có</td><td><b>none</b></td></tr>
  <tr><td>− (thấp)</td><td>+</td><td>Có</td><td>Không</td><td><b>HIGH</b> (mạnh nhất)</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cặp dễ lẫn</th><th>Cái thứ 1</th><th>Cái thứ 2</th></tr>
  <tr><td>Operator vs promoter</td><td>Operator: DNA <b>repressor bám</b>, chặn polymerase</td><td>Promoter: DNA <b>RNA polymerase bám</b>, bắt đầu phiên mã</td></tr>
  <tr><td>Chất cảm ứng vs chất đồng ức chế</td><td>Cảm ứng (allolactose): <b>gỡ</b> repressor, BẬT gene</td><td>Đồng ức chế (Trp): <b>kích hoạt</b> repressor, TẮT gene</td></tr>
  <tr><td>Repressor vs activator (CAP)</td><td>Repressor: bám <b>operator</b>, TẮT</td><td>CAP: bám vùng gần <b>promoter</b>, BẬT mạnh hơn</td></tr>
  <tr><td>Repressor (protein) vs repression (hiện tượng)</td><td>Repressor: protein LacI</td><td>Repression: repressor đang bám, gene tắt</td></tr>
  </table></div>`,

  traps: [
    { trap: '"Lactose là chất đồng ức chế của operon lac."', truth: 'Lactose (cụ thể là <b>allolactose</b>) là <b>chất cảm ứng</b>: nó gỡ repressor và BẬT gene. Chất đồng ức chế là Trp ở operon trp, làm repressor bám và TẮT gene.' },
    { trap: '"Tryptophan là chất cảm ứng của operon trp."', truth: 'Trp là <b>chất đồng ức chế</b>. Repressor trp không hoạt động cho tới khi gắn Trp. Có Trp thì repressor bám operator và tắt gene tổng hợp Trp.' },
    { trap: '"Có glucose thì operon lac luôn tắt."', truth: 'Glucose không tắt operon lac trực tiếp. Nó chỉ làm <b>cAMP thấp</b> để CAP không hoạt động. Nếu có lactose và repressor đã được gỡ, operon vẫn bật ở mức <b>low</b>.' },
    { trap: '"cAMP cao khi glucose cao."', truth: 'Ngược lại. <b>Glucose thấp → cAMP cao → CAP hoạt động</b>. Glucose cao khiến cAMP thấp.' },
    { trap: '"Có lactose là đủ để operon lac bật mạnh."', truth: 'Lactose chỉ <b>gỡ repressor</b> (bắt buộc). Để bật <b>mạnh</b> (HIGH) còn cần <b>CAP–cAMP</b>, tức glucose phải thấp. Có lactose + glucose cao thì chỉ "low".' },
    { trap: '"CAP là repressor của operon lac."', truth: 'CAP là <b>activator</b> (điều hòa dương tính). Nó tăng phiên mã khi cAMP cao. Repressor của lac là <b>LacI</b>, bám operator.' },
    { trap: '"Đột biến lacI⁻ làm giảm biểu hiện gene."', truth: 'Ngược lại: lacI⁻ không có repressor nên gene <b>bật liên tục</b> (constitutive), biểu hiện <b>cao</b> cả khi không có lactose. Đột biến mất chức năng ở repressor làm <b>tăng</b> biểu hiện.' },
    { trap: '"Operon và promoter là một thứ."', truth: 'Operon là cả <b>cụm</b> gồm promoter + operator + các gene cấu trúc. Promoter chỉ là một phần, nơi RNA polymerase bám.' },
    { trap: '"Repressor bám vào promoter."', truth: 'Repressor bám vào <b>operator</b>, nằm sát và chồng lên promoter, nên chặn được polymerase. Polymerase mới bám promoter. Hai chỗ khác nhau dù gần nhau.' },
  ],

  quiz: [
    { q: 'Trong môi trường có lactose và không có glucose, operon lac biểu hiện ra sao?', ops: ['none (repressor bám)', 'low (một ít)', 'HIGH (mạnh nhất)', 'Không tính được'], a: 2, e: 'Lactose gỡ repressor (điều kiện bắt buộc), glucose thấp làm cAMP cao để CAP kích hoạt. Cả hai chìa khóa cùng có nên bật HIGH. "low" là đáp án bẫy khi glucose còn cao.' },
    { q: 'Một đột biến làm operator Oᶜ không bám được repressor. Điều gì xảy ra khi không có lactose?', ops: ['none: repressor vẫn chặn', 'low: chỉ CAP bật', 'Operon bật liên tục (constitutive)', 'Repressor bị đẩy ra khỏi tế bào'], a: 2, e: 'Repressor không bám được operator nên không còn gì chặn polymerase, operon bật liên tục. Đáp án "none" là bẫy: nó nhầm Oᶜ với việc repressor còn nguyên chức năng.' },
    { q: 'Chất nào làm repressor LacI RỜI operator?', ops: ['Glucose', 'cAMP', 'Allolactose (chất cảm ứng)', 'Tryptophan'], a: 2, e: 'Allolactose bám repressor và làm nó nhả operator. Glucose và cAMP không tác động trực tiếp lên repressor. Tryptophan là chất đồng ức chế của operon trp, không liên quan đến lac.' },
    { q: 'Operon trp được TẮT khi nào?', ops: ['Khi không có tryptophan', 'Khi có tryptophan (corepressor kích hoạt repressor)', 'Khi có lactose', 'Khi glucose thấp'], a: 1, e: 'Trp là chất đồng ức chế: khi có Trp, repressor trp hoạt động, bám operator và tắt gene tổng hợp Trp. Đáp án "không có Trp" là ngược logic.' },
    { q: 'Vì sao đột biến CAP⁻ chỉ làm giảm biểu hiện ở mức "low" dù có lactose và glucose thấp?', ops: ['Vì repressor vẫn bám', 'Vì CAP không kích hoạt được RNA polymerase, nên mất lực bật mạnh', 'Vì lactose bị mất', 'Vì mRNA không được dịch'], a: 1, e: 'Lactose đã gỡ repressor nên phiên mã vẫn xảy ra, chỉ thiếu CAP để tăng cường. Đáp án "repressor vẫn bám" là sai vì lactose đã gỡ nó.' },
    { q: 'Ghép đúng: Operon nhân sơ khác nhân thực ở điểm nào?', ops: ['Có promoter riêng cho từng gene', 'Nhiều gene cấu trúc nằm cạnh nhau, dùng chung promoter và được phiên mã thành một mRNA', 'Không có RNA polymerase', 'Gene nằm trong nhân'], a: 1, e: 'Operon là cụm gene dùng chung promoter, tạo một mRNA đa cistron, đặc trưng của nhân sơ. Nhân thực mỗi gene thường có promoter riêng.' },
    { q: 'Một đột biến làm lacI⁻ (không có repressor) và đồng thời CAP⁻, glucose cao, lactose không có. Biểu hiện?', ops: ['none', 'low', 'HIGH', 'Không biểu hiện'], a: 1, e: 'Không có repressor nên không bị chặn (không phải none). CAP⁻ và glucose cao nên không có HIGH. Kết quả là low. Đáp án "none" là bẫy vì nhầm với trạng thái bình thường khi có repressor.' },
  ],

  recall: [
    'Vẽ DNA nằm ngang: lacI (xa) → CAP → promoter → operator → lacZYA. Đánh dấu chỗ repressor bám, chỗ RNA polymerase bám, và chỗ CAP–cAMP bám.',
    'Lập bảng 4 dòng (Glucose, Lactose, CAP bám, Repressor bám) và ghi mức biểu hiện cho từng dòng, không nhìn sách.',
    'Viết 2 câu: chất cảm ứng và chất đồng ức chế khác nhau thế nào, và vì sao allolactose gỡ repressor còn Trp thì kích hoạt nó.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const v = new THREE.Vector3();
    const rise = 0.3, bpt = 10.5;

    // ---- DNA ----
    const dnaG = api.group(); dnaG.position.y = 0.6;
    const dna = api.dna({ seq: SEQ, rise, radius: 0.85, turn: bpt, openR: 1.1, parent: dnaG });
    const X = (i) => dna.xOf(i);
    const regG = api.group(); regG.position.y = 0.6;
    const shells = {};
    const shell = (key, k0, color) => {
      const [a, b] = span(k0);
      const len = (b - a + 1) * rise;
      const m = api.cylinder(1.25, 1.25, len, color, regG, { opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
      m.rotation.z = Math.PI / 2; m.position.x = (X(a) + X(b)) / 2;
      shells[key] = m;
    };
    shell('lacI', 'lacI', 0x9b9b9b);
    shell('cap', 'cap', 0x66d9ef);
    shell('prom', 'prom', 0x2bb3a3);
    shell('op', 'op', 0xf5a623);
    shell('genes', 'genes', 0x4a90e2);

    // labels (managed by visibility per step)
    L.add('lacI', 'gene lacI (repressor)', [X(mid('lacI')), 2.6, 0], regG, 'dim');
    L.add('cap', 'vùng CAP', [X(mid('cap')), 2.6, 0], regG, 'dim');
    L.add('prom', 'PROMOTER', [X(mid('prom')), 2.9, 0], regG, 'big');
    L.add('op', 'OPERATOR O', [X(mid('op')), -2.1, 0], regG, 'warn');
    L.add('genes', 'lacZ · lacY · lacA', [X(mid('genes')), 2.6, 0], regG, 'good');
    L.add('mRNAname', 'mRNA đa cistron', [X(mid('genes')), -3.4, 0], regG, 'dim');
    L.add('blockedMsg', '🚫 repressor chặn RNA polymerase', [X(mid('prom')) - 0.3, 4.6, 0], regG, 'warn');
    L.add('capMsg', '✅ CAP–cAMP kích hoạt', [X(mid('cap')) + 0.6, 4.5, 0], regG, 'good');
    L.add('capBad', '❌ CAP⁻: không bám', [X(mid('cap')), 4.3, 0], regG, 'warn');
    L.add('lacIBad', '❌ lacI⁻: không có repressor', [X(mid('lacI')), 4.3, 0], regG, 'warn');
    L.add('ocBad', '❌ Oᶜ: repressor không bám', [X(mid('op')), 4.3, 0], regG, 'warn');
    // 5′/3′ ends
    const p0 = dna.pairs[0], pz = dna.pairs[dna.pairs.length - 1];
    api.label('5′', [X(0) - 0.8, p0.half1.position.y + 0.2, p0.half1.position.z], dnaG, 'plain');
    api.label('3′', [X(SEQ.length - 1) + 0.8, pz.half1.position.y + 0.2, pz.half1.position.z], dnaG, 'plain');

    // ---- actors ----
    const repressor = api.blob(0.8, C.protein, null, { mat: { opacity: 0.95 }, seed: 3 });
    const rep2 = api.blob(0.45, C.protein, repressor, { mat: { opacity: 0.95 }, seed: 6 });
    rep2.position.set(0.75, 0.4, 0.2);
    const allo = api.sphere(0.22, 0xf5a623, null, { mat: { opacity: 1 } });
    const cap = api.blob(0.7, 0x66d9ef, null, { mat: { opacity: 0.95 }, seed: 9 });
    const rnap = api.blob(0.95, C.enzyme, null, { mat: { opacity: 0.9 }, seed: 2, scale: [1.2, 1, 1] });
    const rnapIcon = api.label('RNA polymerase', [0, 1.5, 0], rnap, 'dim');
    const capMod = api.label('CAP', [0, 1.1, 0], cap, 'dim');
    const beads = [];
    for (let k = 0; k < 6; k++) { const b = api.box(0.36, 0.36, 0.36, C.rna, null); b.visible = false; beads.push(b); }

    // ---- state ----
    let mode = 'lac';        // 'lac' | 'trp'
    let glu = true, lac = false, tryp = false, lacIBad = false, oc = false, capBad = false;
    let cur = 0;
    const derive = () => {
      if (mode === 'trp') {
        const repBound = tryp && !lacIBad && !oc;
        return { repExists: !lacIBad, repBound, capOn: false, level: repBound ? 0 : 2 };
      }
      const repExists = !lacIBad;
      const repBound = repExists && !oc && !lac;
      const capOn = !glu && !capBad;
      return { repExists, repBound, capOn, level: repBound ? 0 : (capOn ? 2 : 1) };
    };
    const levelName = ['none', 'low', 'HIGH'];
    const readout = () => {
      const d = derive(); const lv = levelName[d.level];
      let why;
      if (mode === 'trp') {
        why = d.repBound
          ? 'Có Trp là <b>chất đồng ức chế</b>: repressor TrpR bám operator, chặn RNA polymerase.'
          : (!tryp ? 'Không có Trp: repressor không hoạt động, RNA polymerase đi qua.' : 'Operator Oᶜ hoặc repressor mất chức năng nên không chặn được.');
      } else if (d.repBound) {
        why = '<b>Repressor bám operator</b>, RNA polymerase bị chặn. ' + (lac ? '' : 'Không có lactose để gỡ repressor.');
      } else if (lacIBad && !lac) {
        why = 'Không có repressor (lacI⁻) nên không bị chặn.' + (d.capOn ? ' CAP–cAMP bật thêm.' : ' Không có CAP nên không bật mạnh.');
      } else if (oc && !lac) {
        why = 'Repressor không bám được operator (Oᶜ) nên không bị chặn.' + (d.capOn ? ' CAP–cAMP bật thêm.' : ' Không có CAP nên không bật mạnh.');
      } else {
        why = lac ? 'Lactose gỡ repressor (điều kiện bắt buộc).' : '';
        why += d.capOn ? ' Glucose thấp, cAMP cao, CAP–cAMP kích hoạt RNA polymerase → mạnh.' : (glu ? ' Glucose còn cao nên CAP không hoạt động → chỉ một ít.' : (capBad ? ' CAP⁻ nên không tăng được dù glucose thấp.' : ''));
      }
      api.readout(`<b>Biểu hiện: ${lv}</b>. ${why}`);
    };

    // ---- toggles ----
    api.toggle('Mode trp (thay vì lac)', false, (x) => { mode = x ? 'trp' : 'lac'; applyMode(); ctl.setStep(cur); readout(); });
    api.toggle('Glucose có mặt', true, (x) => { glu = x; ctl.setStep(cur); readout(); });
    api.toggle('Lactose có mặt', false, (x) => { lac = x; ctl.setStep(cur); readout(); });
    api.toggle('Tryptophan có mặt (chế độ trp)', false, (x) => { tryp = x; ctl.setStep(cur); readout(); });
    api.toggle('💥 lacI⁻ (không có repressor)', false, (x) => { lacIBad = x; ctl.setStep(cur); readout(); });
    api.toggle('💥 Oᶜ (operator không bám)', false, (x) => { oc = x; ctl.setStep(cur); readout(); });
    api.toggle('💥 CAP⁻ (không bám được CAP)', false, (x) => { capBad = x; ctl.setStep(cur); readout(); });

    const applyMode = () => {
      if (mode === 'trp') {
        L.set('lacI', 'gene trpR (repressor trp)');
        L.set('cap', 'không dùng CAP');
        L.set('prom', 'PROMOTER trp');
        L.set('op', 'OPERATOR trp');
        L.set('genes', 'trpE · trpD · trpC · trpB · trpA');
        L.set('mRNAname', 'mRNA đa cistron (trp)');
        L.set('lacIBad', '❌ trpR⁻: không có repressor');
        L.set('blockedMsg', '🚫 TrpR + Trp chặn polymerase');
      } else {
        L.set('lacI', 'gene lacI (repressor)');
        L.set('cap', 'vùng CAP');
        L.set('prom', 'PROMOTER');
        L.set('op', 'OPERATOR O');
        L.set('genes', 'lacZ · lacY · lacA');
        L.set('mRNAname', 'mRNA đa cistron');
        L.set('lacIBad', '❌ lacI⁻: không có repressor');
        L.set('blockedMsg', '🚫 repressor chặn RNA polymerase');
      }
    };

    // ---- camera per step ----
    const CAMS = [
      [[0, 1.5, 30], [0, 0.5, 0]],
      [[-9, 4, 13], [-10.5, 2, 0]],
      [[-2, 4, 12], [-4, 1.2, 0]],
      [[-2, 4, 12], [-3, 1.2, 0]],
      [[0, 3, 13], [1, 1.2, 0]],
      [[-1, 3, 13], [1, 1.2, 0]],
      [[0, 0, 26], [0, 0, 0]],
      [[0, 1.5, 22], [0, 0.4, 0]],
    ];

    const ctl = {
      setStep(s) {
        cur = s;
        const d = derive();
        // shells
        for (const k in shells) {
          const hi = (k === 'op' && (s === 2 || s === 3)) || (k === 'prom' && s >= 2) || (k === 'cap' && s === 4);
          shells[k].material.opacity = hi ? 0.32 : 0.12;
        }
        // repressor visibility/position
        const repShow = d.repExists && s >= 1;
        api.fadeTo(repressor, repShow ? 1 : 0, 3);
        const repTarget = d.repBound ? new THREE.Vector3(X(mid('op')), 2.0, 0) : new THREE.Vector3(X(mid('op')) + 2.6, 4.6, 0);
        if (s === 1) api.moveTo(repressor, new THREE.Vector3(X(mid('lacI')), 4.0, 0), 2.5);
        else api.moveTo(repressor, repTarget, 2.5);
        // allolactose: follows lactose, bound to repressor when it is released
        const allowAllo = mode === 'lac' && lac && s >= 3 && d.repExists;
        api.fadeTo(allo, allowAllo ? 1 : 0, 3);
        api.moveTo(allo, new THREE.Vector3(repressor.position.x + 0.6, repressor.position.y + 1.2, 0), 3);
        // CAP
        const capShow = mode === 'lac' && d.capOn && s >= 4;
        api.fadeTo(cap, capShow ? 1 : 0, 3);
        api.moveTo(cap, new THREE.Vector3(X(mid('cap')), 2.1, 0), 3);
        // RNA polymerase
        const rnapShow = s >= 2;
        api.fadeTo(rnap, rnapShow ? 1 : 0, 3);
        api.moveTo(rnap, d.level === 0 ? new THREE.Vector3(X(mid('prom')) - 2.6, 2.2, 0) : new THREE.Vector3(X(mid('prom')), 2.1, 0), 3);
        // labels
        const keys = ['lacI', 'cap', 'prom', 'op', 'genes'];
        if (s >= 2 && d.level === 0) keys.push('blockedMsg');
        if (mode === 'lac' && d.capOn && s >= 4) keys.push('capMsg');
        if (mode === 'lac' && capBad && s >= 4 && !glu) keys.push('capBad');
        if (lacIBad && s >= 1) keys.push('lacIBad');
        if (oc && s >= 2) keys.push('ocBad');
        L.only(keys);
        L.show('mRNAname', d.level > 0 && s >= 4);
        L.show('cap', mode === 'lac');
        api.showLabel(rnapIcon, rnapShow); api.showLabel(capMod, capShow);
        api.camera(...CAMS[s]);
        readout();
      },
      update(dt, t) {
        const d = derive();
        // mRNA beads: count and speed follow the level
        const count = d.level === 0 ? 0 : (d.level === 1 ? 2 : 6);
        const speed = d.level === 2 ? 2.4 : 0.8;
        const show = cur >= 4 ? count : 0;
        const x0 = X(START.genes), x1 = X(START.genes + SEG.genes.length - 1);
        beads.forEach((b, k) => {
          const on = k < show;
          b.visible = on;
          if (!on) return;
          const span2 = x1 - x0;
          const phase = ((t * speed + k * (span2 / 3)) % span2 + span2) % span2;
          v.set(x0 + phase, -2.2 + Math.sin(k * 1.3) * 0.2 + 0.6, 0);
          b.position.lerp(v, 1 - Math.exp(-dt * 6));
        });
        // gentle breathing on the repressor
        repressor.scale.setScalar(1 + Math.sin(t * 2) * 0.03);
        cap.rotation.y += dt * 0.4;
      },
    };
    applyMode();
    ctl.setStep(0);
    return ctl;
  },
};
