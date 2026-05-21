import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">เกี่ยวกับสาขา</h1>
      <p className="text-muted-foreground leading-relaxed">
        สาขาวิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยศรีปทุม มุ่งเน้นการผลิตบัณฑิตที่มีความรู้ความสามารถ
        ด้านวิศวกรรมคอมพิวเตอร์ทั้งภาคทฤษฎีและปฏิบัติ พร้อมทำงานในอุตสาหกรรมเทคโนโลยีสารสนเทศ
      </p>
      <div className="border rounded-lg p-5 space-y-3">
        <h2 className="font-semibold">ข้อมูลสาขา</h2>
        <dl className="space-y-2 text-sm">
          {[
            ['ชื่อสาขา', 'วิศวกรรมคอมพิวเตอร์'],
            ['ระยะเวลา', '4 ปี'],
            ['มหาวิทยาลัย', 'มหาวิทยาลัยศรีปทุม'],
            ['คณะ', 'วิทยาลัยวิศวกรรมศาสตร์'],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-4">
              <dt className="w-32 text-muted-foreground">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
