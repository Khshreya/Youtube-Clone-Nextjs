import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.video.deleteMany();

  await prisma.video.createMany({
    data: [
      {
        title: "Lo-fi Beats to Study",
        videoUrl: "https://youtu.be/pxPWEudVo3M",
        thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
        duration: "3:00:00",
        channel: "ChillZone",
        category: "Music",
      },
      {
        title: "Epic Gaming Highlights",
        videoUrl: "https://youtu.be/6Oms5cqj9G8?si=0C22moXxun6qJ5K_",
        thumbnail: "https://tse4.mm.bing.net/th/id/OIP.YWzIedzAOmr8L57f_1XquQHaEK?pid=Api&P=0&h=180",
        duration: "18:45",
        channel: "ProGamer",
        category: "Gaming",
      },
      {
        title: "Live Coding Session",
        videoUrl: "https://youtu.be/cjztLTGd6MA",
        thumbnail: "https://i.ytimg.com/vi/5MgBikgcWnY/hqdefault.jpg",
        duration: "1:20:00",
        channel: "DevLive",
        category: "Live",
      },
      {
        title: "Today’s Tech News",
        videoUrl: "https://youtu.be/Otim2mDjsYM?si=Um57Vh_znDyOZEY2",
        thumbnail: "https://tse1.mm.bing.net/th/id/OIP.qjxiRI_rubGxPLeZQ1xFmwHaEc?pid=Api&P=0&h=180",
        duration: "12:10",
        channel: "DailyNews",
        category: "News",
      },
      {
        title: "Top 10 Sci-Fi Movies",
        videoUrl: "https://youtu.be/d8uV8U6lWa0?si=AtAcTv2RvzsHLYhw",
        thumbnail: "https://i.ytimg.com/vi/HMGetv40FkI/hqdefault.jpg",
        duration: "22:30",
        channel: "MovieMania",
        category: "Movies",
      },
      {
        title: "Football Match Highlights",
        videoUrl: "https://youtu.be/pr75h4Rq4ZM?si=Gj8f8yYo4ebU14LF",
        thumbnail: "https://e0.365dm.com/24/03/1600x900/skysports-premier-league-highlights_6477568.jpg?20240303173426",
        duration: "15:05",
        channel: "SportZone",
        category: "Sports",
      },
      {
        title: "Next.js Basics",
        videoUrl: "https://youtu.be/ZVnjOPwW4ZA?si=XUajKBLSM3liY2V-",
        thumbnail: "https://i.ytimg.com/vi/IkOVe40Sy0U/hqdefault.jpg",
        duration: "50:00",
        channel: "CodeWithShreya",
        category: "Technology",
      },
      {
        title: "Stand-up Comedy Night",
        videoUrl: "https://youtu.be/GqqwbcgOHek?si=GvWyuLJYFN-NPWWt",
        thumbnail: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/04/25-best-sci-fi-movies-of-all-time-1.jpg",
        duration: "30:00",
        channel: "LaughHub",
        category: "Comedy",
      },
      {
        title: "HTML Full Course",
        videoUrl: "https://youtu.be/qz0aGYrrlhU?si=mW7gdKcEOLCveE6t",
        thumbnail: "https://i.ytimg.com/vi/pQN-pnXPaVg/hqdefault.jpg",
        duration: "2:00:00",
        channel: "CodeWithShreya",
        category: "Education",
      },
      {
        title: "30-Minute Home Workout",
        videoUrl: "https://youtu.be/cvEJ5WFk2KE?si=F8A6uIn8r6iSx0Bn",
        thumbnail: "https://i.ytimg.com/vi/ml6cT4AZdqI/hqdefault.jpg",
        duration: "30:00",
        channel: "FitLife",
        category: "Fitness",
      },
      {
        title: "Web Development Roadmap 2025",
        videoUrl: "https://youtu.be/GxmfcnU3feo?si=9brcsa2GVEls4PLZ",
        thumbnail: "https://i.ytimg.com/vi/zJSY8tbf_ys/hqdefault.jpg",
        duration: "25:00",
        channel: "CodeWithShreya",
        category: "Trending",
      },
    ],
  });

  console.log("✅ Fresh videos inserted with working thumbnails");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
