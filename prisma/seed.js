import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old videos
  await prisma.video.deleteMany();

  // Insert fresh videos
  await prisma.video.createMany({
    data: [
      {
        title: "Dance",
        videoUrl: "https://youtube.com/shorts/8QKWm_I_ZqI?si=9dpMUpNQhGe9TCU0",
        thumbnail: "https://tse2.mm.bing.net/th/id/OIP.T1g_youHomfJZHiDawhufgHaE8?pid=Api&P=0&h=180",
        duration: "12:00",
        channel: "Meenakshi",
        category: "dance",
        contentType: "short",
      },
      {
        title: "Epic Gaming Highlights",
        videoUrl: "https://youtu.be/GyO1MtLhyt0?si=b-41bPd-6SlMd3B2",
        thumbnail: "https://tse4.mm.bing.net/th/id/OIP.YWzIedzAOmr8L57f_1XquQHaEK?pid=Api&P=0&h=180",
        duration: "18:45",
        channel: "ProGamer",
        category: "Gaming",
        contentType: "video",
      },
      {
        title: "Live Coding Session",
        videoUrl: "https://youtu.be/cjztLTGd6MA",
        thumbnail: "https://i.ytimg.com/vi/5MgBikgcWnY/hqdefault.jpg",
        duration: "1:20:00",
        channel: "DevLive",
        category: "Live",
        contentType: "video",
      },
      {
        title: "Today’s Tech News",
        videoUrl: "https://youtu.be/Otim2mDjsYM?si=Um57Vh_znDyOZEY2",
        thumbnail: "https://tse1.mm.bing.net/th/id/OIP.qjxiRI_rubGxPLeZQ1xFmwHaEc?pid=Api&P=0&h=180",
        duration: "12:10",
        channel: "DailyNews",
        category: "News",
        contentType: "video",
      },
      {
        title: "Top 10 Sci-Fi Movies",
        videoUrl: "https://youtu.be/d8uV8U6lWa0?si=AtAcTv2RvzsHLYhw",
        thumbnail: "https://i.ytimg.com/vi/HMGetv40FkI/hqdefault.jpg",
        duration: "22:30",
        channel: "MovieMania",
        category: "Movies",
        contentType: "video",
      },
      {
        title: "Football Match Highlights",
        videoUrl: "https://youtu.be/pr75h4Rq4ZM?si=Gj8f8yYo4ebU14LF",
        thumbnail: "https://e0.365dm.com/24/03/1600x900/skysports-premier-league-highlights_6477568.jpg",
        duration: "15:05",
        channel: "SportZone",
        category: "Sports",
        contentType: "video",
      },
      {
        title: "Lo-fi Beats to Study",
        videoUrl: "https://youtu.be/pxPWEudVo3M",
        thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
        duration: "3:00:00",
        channel: "ChillZone",
        category: "Music",
        contentType: "video",
      },
      {
        title: "Next.js Basics",
        videoUrl: "https://youtu.be/ZVnjOPwW4ZA?si=XUajKBLSM3liY2V-",
        thumbnail: "https://i.ytimg.com/vi/IkOVe40Sy0U/hqdefault.jpg",
        duration: "50:00",
        channel: "CodeWithShreya",
        category: "Technology",
        contentType: "video",
      },
      {
        title: "Stand-up Comedy Night",
        videoUrl: "https://youtu.be/GqqwbcgOHek?si=GvWyuLJYFN-NPWWt",
        thumbnail: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/04/25-best-sci-fi-movies-of-all-time-1.jpg",
        duration: "30:00",
        channel: "LaughHub",
        category: "Comedy",
        contentType: "video",
      },
      {
        title: "Web Development Roadmap 2025",
        videoUrl: "https://youtu.be/GxmfcnU3feo?si=9brcsa2GVEls4PLZ",
        thumbnail: "https://i.ytimg.com/vi/zJSY8tbf_ys/hqdefault.jpg",
        duration: "25:00",
        channel: "CodeWithShreya",
        category: "Trending",
        contentType: "video",
      },
      {
        title: "30-Minute Home Workout",
        videoUrl: "https://youtu.be/cvEJ5WFk2KE?si=F8A6uIn8r6iSx0Bn",
        thumbnail: "https://i.ytimg.com/vi/ml6cT4AZdqI/hqdefault.jpg",
        duration: "30:00",
        channel: "FitLife",
        category: "Fitness",
        contentType: "video",
      },
      {
        title: "HTML Full Course",
        videoUrl: "https://youtu.be/qz0aGYrrlhU?si=mW7gdKcEOLCveE6t",
        thumbnail: "https://i.ytimg.com/vi/pQN-pnXPaVg/hqdefault.jpg",
        duration: "2:00:00",
        channel: "CodeWithShreya",
        category: "Education",
        contentType: "video",
      },
      {
        title: "Travelling",
        videoUrl: "https://youtube.com/shorts/HtGXLW6FuQc?si=TVDdeEYF-YkTtK0c",
        thumbnail: "https://frontenacarchbiosphere.ca/wp-content/uploads/2023/02/full-shot-travel-concept-with-landmarks-1024x576.jpg",
        duration: "10:00",
        channel: "Travel World",
        category: "Travelling",
        contentType: "short",
      }
    ],
  });

  console.log("Videos restored successfully");
}

main()
  .catch((e) => {
    console.error(" Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
