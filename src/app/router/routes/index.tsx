import { Link } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { BookOpen, Code2, GraduationCap, Users } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

const cards = [
  { icon: GraduationCap, title: 'หลักสูตร', desc: 'วิศวกรรมคอมพิวเตอร์ 4 ปี' },
  { icon: Code2, title: 'การเรียนการสอน', desc: 'ทฤษฎี + ปฏิบัติจริง' },
  { icon: Users, title: 'คณาจารย์', desc: 'ผู้เชี่ยวชาญหลากสาขา' },
  { icon: BookOpen, title: 'งานวิจัย', desc: 'ส่งเสริมนวัตกรรม' },
];

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-3 py-10">
        <h1 className="text-4xl font-bold">สาขาวิชาวิศวกรรมคอมพิวเตอร์</h1>
        <p className="text-muted-foreground text-lg">มหาวิทยาลัยศรีปทุม · Computer Engineering</p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            to="/about"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
          >
            เกี่ยวกับสาขา
          </Link>
          <Link
            to="/counter"
            className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted"
          >
            ลอง Counter
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="border rounded-lg p-4 space-y-2 hover:shadow-sm">
            <Icon className="size-6 text-primary" />
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
