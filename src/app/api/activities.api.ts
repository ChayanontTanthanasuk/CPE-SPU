import type { Activity, ActivityFormValues } from '@/features/admin/types';

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Open House 2568',
    description: 'งานเปิดบ้านสาขาวิชาวิศวกรรมคอมพิวเตอร์ นำเสนอผลงานนักศึกษาและหลักสูตร',
    date: '2568-02-15',
    location: 'อาคาร 11 มหาวิทยาลัยศรีปทุม',
    status: 'completed',
  },
  {
    id: 2,
    title: 'CE Hackathon "Build the Future" 2568',
    description: 'การแข่งขัน Hackathon 48 ชั่วโมงสำหรับนักศึกษาสาขา CE และสาขาที่เกี่ยวข้อง',
    date: '2568-03-15',
    location: 'ห้องปฏิบัติการคอมพิวเตอร์ 11-701',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'สัมมนาอาชีพด้าน ICT 2568',
    description: 'เสวนากับผู้เชี่ยวชาญจากอุตสาหกรรมซอฟต์แวร์และเทคโนโลยีชั้นนำของประเทศ',
    date: '2568-04-20',
    location: 'ห้องประชุมใหญ่ มหาวิทยาลัยศรีปทุม',
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'ทัศนศึกษา NECTEC & Software Park',
    description: 'พานักศึกษาชั้นปีที่ 3 เยี่ยมชม NECTEC และ Software Park Thailand อุทยานวิทยาศาสตร์',
    date: '2568-01-25',
    location: 'อุทยานวิทยาศาสตร์ประเทศไทย ปทุมธานี',
    status: 'completed',
  },
  {
    id: 5,
    title: 'CE Project Day 2568',
    description: 'นำเสนอโปรเจกต์จบการศึกษาของนักศึกษาชั้นปีที่ 4 ต่อคณะกรรมการและภาคอุตสาหกรรม',
    date: '2568-05-10',
    location: 'ล็อบบี้อาคาร 11 มหาวิทยาลัยศรีปทุม',
    status: 'upcoming',
  },
  {
    id: 6,
    title: 'Workshop: Cloud Computing with AWS',
    description: 'อบรมเชิงปฏิบัติการ AWS Cloud fundamentals พร้อมสอบ certification จาก AWS Educate',
    date: '2568-06-08',
    location: 'ห้องปฏิบัติการ 11-605',
    status: 'ongoing',
  },
];

let store: Activity[] = [...MOCK_ACTIVITIES];

export const activitiesService = {
  getAll: async (): Promise<Activity[]> => {
    await delay();
    return [...store];
  },

  getById: async (id: number): Promise<Activity | undefined> => {
    await delay();
    return store.find((a) => a.id === id);
  },

  create: async (body: ActivityFormValues): Promise<Activity> => {
    await delay();
    const item: Activity = { ...body, id: Date.now() };
    store = [...store, item];
    return item;
  },

  update: async (id: number, body: Partial<ActivityFormValues>): Promise<Activity> => {
    await delay();
    store = store.map((a) => (a.id === id ? { ...a, ...body } : a));
    return store.find((a) => a.id === id)!;
  },

  delete: async (id: number): Promise<void> => {
    await delay();
    store = store.filter((a) => a.id !== id);
  },

  getStats: async () => {
    await delay(100);
    return {
      total: store.length,
      upcoming: store.filter((a) => a.status === 'upcoming').length,
    };
  },
};
