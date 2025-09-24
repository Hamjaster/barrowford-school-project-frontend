import type React from "react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Users,
  Zap,
  GraduationCap,
  Shield,
} from "lucide-react";
import Footer from "@/components/footer";
//import for personal section
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from "@/store/slices/personalSectionSlice";
import type { RootState, AppDispatch } from "../../store";
import supabase from "@/lib/supabse";

interface CardData {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
  description: string;
}

const cardData: CardData[] = [
  {
    id: "love-about-me",
    title: "What I Love About Me",
    icon: <Heart className="w-6 h-6" />,
    color: "border-orange-400 bg-orange-100 ",
    iconColor: "bg-orange-400",
    description:
      "I love my creativity and how I can make people laugh. I'm really good at drawing and I always try to help my friends when they need it. I think I'm brave and I'm not afraid to try new things!",
  },
  {
    id: "read-pleasure",
    title: "What I Read for Pleasure",
    icon: <BookOpen className="w-6 h-6" />,
    color: "border-sky-300 bg-sky-100 ",
    iconColor: "bg-sky-300",
    description:
      "I love reading adventure books, especially stories about pirates and treasure hunts. My favorite series is Captain Underpants and I also enjoy comic books about superheroes. I like funny books that make me giggle!",
  },
  {
    id: "read-school",
    title: "What I Read at School",
    icon: <BookOpen className="w-6 h-6" />,
    color: "border-blue-500 bg-blue-100 ",
    iconColor: "bg-blue-500",
    description:
      "At school, I'm reading chapter books about friendship and animals. We're currently reading Charlotte's Web as a class, and I really like learning about different countries in our geography books.",
  },
  {
    id: "ambitions",
    title: "My Ambitions",
    icon: <Lightbulb className="w-6 h-6" />,
    color: "border-pink-500 bg-pink-100 ",
    iconColor: "bg-pink-500",
    description:
      "I want to become a video game designer when I grow up! I love creating stories and characters, and I think it would be amazing to make games that other kids would enjoy playing. I also want to learn how to code.",
  },
  {
    id: "next-steps",
    title: "My Next Steps",
    icon: <ArrowRight className="w-6 h-6" />,
    color: "border-orange-500 bg-orange-100 ",
    iconColor: "bg-orange-500",
    description:
      "I want to get better at math, especially multiplication tables. I'm also working on reading longer books and I want to join the school's art club next term. I'm practicing drawing every day!",
  },
  {
    id: "teachers-know",
    title: "Things I Want my Teachers to Know About Me",
    icon: <Users className="w-6 h-6" />,
    color: "border-green-500 bg-green-100 ",
    iconColor: "bg-green-500",
    description:
      "Sometimes I need extra time to think about my answers, but I always try my best. I learn better when I can move around a bit, and I love working in groups. If I seem quiet, it doesn't mean I don't understand - I'm just thinking!",
  },
  {
    id: "strengths",
    title: "My Strengths",
    icon: <Zap className="w-6 h-6" />,
    color: "border-blue-500 bg-blue-100 ",
    iconColor: "bg-blue-500",
    description:
      "I'm really good at art and being creative. I'm a good friend who listens to others, and I'm great at solving puzzles. I'm also good at making people feel better when they're sad, and I never give up when something is hard.",
  },
  {
    id: "adults-school",
    title: "My Adults in School",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "border-amber-500 bg-amber-100 ",
    iconColor: "bg-amber-500",
    description:
      "My teacher Mrs. Johnson is really kind and helps me when I'm stuck. Mr. Davis the art teacher encourages my drawing, and Mrs. Smith the librarian always finds me the best books. The school counselor Ms. Brown is someone I can talk to about anything.",
  },
  {
    id: "people-safety",
    title: "My People of Safety",
    icon: <Shield className="w-6 h-6" />,
    color: "border-pink-400 bg-pink-100 ",
    iconColor: "bg-pink-400",
    description:
      "My mom and dad always make me feel safe and loved. My grandma gives the best hugs, and my big sister helps me with homework. At school, I feel safe with my teacher and my best friends Emma and Sam always look out for me.",
  },
];

export default function StudentDashboard() {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  // Grab state from Redux
  // const { topics, loading, error } = useSelector(
  //   (state: RootState) => state.personalSection
  // );
  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      console.log(data, "user data");
    }
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-pink-500 text-white p-6 rounded-b-2xl">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-40 h-40">
                <AvatarImage
                  src="/student-photo.png"
                  alt="Jacob Smith"
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold bg-pink-100 text-pink-600">
                  JS
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Jacob Smith is a Meliorist
              </h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 min-w-[280px]">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">Jacob Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">8 Years Old</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">3WH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hair Color:</span>
                  <span className="font-medium">Brown</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eye Color:</span>
                  <span className="font-medium">Brown</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium">3ft 4in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card) => (
            <Card
              key={card.id}
              className={`${card.color} font-medium p-6 cursor-pointer hover:shadow-md transition-all duration-300 border shadow-lg min-h-[120px]`}
              onClick={() => setSelectedCard(card)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`${card.iconColor} text-white p-5 rounded-full`}
                >
                  {card.icon}
                </div>
                <h3 className="font-semibold text-xl leading-tight">
                  {card.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedCard && (
                <>
                  <div
                    className={`${selectedCard.iconColor} text-white p-4 rounded-full`}
                  >
                    {selectedCard.icon}
                  </div>
                  {selectedCard.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 leading-relaxed">
              {selectedCard?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
