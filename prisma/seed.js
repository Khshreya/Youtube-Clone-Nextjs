import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.video.createMany({
    data: [
      {
        title: "Learn Tailwind CSS in 1 Hour",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://i.ytimg.com/vi/OORUHkgg4IM/maxresdefault.jpg",
        duration: "10:03",
        channel: "CodeWithShreya",
      },
      {
        title: "HTML Full Course",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnail: "https://i.ytimg.com/vi/pQN-pnXPaVg/maxresdefault.jpg",
        duration: "2:00:00",
        channel: "CodeWithShreya",
      },
      {
        title: "CSS Crash Course",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://i.ytimg.com/vi/yfoY53QXEnI/maxresdefault.jpg",
        duration: "1:30:00",
        channel: "CodeWithShreya",
      },
      {
        title: "JavaScript Basics",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnail: "https://i.ytimg.com/vi/hdI2bqOjy3c/maxresdefault.jpg",
        duration: "45:00",
        channel: "CodeWithShreya",
      },
      {
        title: "React JS Introduction",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/maxresdefault.jpg",
        duration: "1:10:00",
        channel: "CodeWithShreya",
      },
      {
        title: "Next.js Basics",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnail: "https://i.ytimg.com/vi/IkOVe40Sy0U/maxresdefault.jpg",
        duration: "50:00",
        channel: "CodeWithShreya",
      },
      {
        title: "Node.js Tutorial",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://i.ytimg.com/vi/TlB_eWDSMt4/maxresdefault.jpg",
        duration: "1:40:00",
        channel: "CodeWithShreya",
      },
      {
        title: "MongoDB Basics",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnail: "https://i.ytimg.com/vi/-56x56UppqQ/maxresdefault.jpg",
        duration: "35:00",
        channel: "CodeWithShreya",
      },
      {
        title: "Git & GitHub Tutorial",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://i.ytimg.com/vi/RGOj5yH7evk/maxresdefault.jpg",
        duration: "55:00",
        channel: "CodeWithShreya",
      },
      {
        title: "Web Development Roadmap",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnail: "https://i.ytimg.com/vi/zJSY8tbf_ys/maxresdefault.jpg",
        duration: "25:00",
        channel: "CodeWithShreya",
      },
    ],
  });

  console.log("✅ 10 videos inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
