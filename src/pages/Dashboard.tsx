import type React from "react";
import { Heart, Calendar, Star, Info } from "lucide-react";
import RightSidebar from "../components/RightSidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardCard {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  content: string[];
}

const Dashboard: React.FC = () => {
  const dashboardCards: DashboardCard[] = [
    {
      title: "What I Love About Me",
      icon: (
        <Heart className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-500",
      content: ["I am kind to everyone.", "I am funny."],
    },
    {
      title: "My Ambitions",
      icon: (
        <Calendar className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-green-50",
      iconColor: "bg-green-500",
      content: ["I want to be a doctor.", "I want to be happy."],
    },
    {
      title: "What My Teacher Thinks About Me",
      icon: <Star className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
      bgColor: "bg-pink-50",
      iconColor: "bg-pink-600",
      content: ["Jacob is a joyous, happy boy."],
    },
    {
      title: "My Strengths",
      icon: <Info className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-600",
      content: ["I am a good listener."],
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between gap-5">
      <div className="w-full md:w-3/4">
        <div className="relative flex items-end pb-3 sm:pb-5 justify-center mb-4 sm:mb-6 bg-white h-[20vh] sm:h-[25vh] lg:h-[27vh]">
          <div className="absolute -top-8 sm:-top-10 lg:-top-12 left-1/2 -translate-x-1/2 mx-auto mb-5 bg-[#eaf7fd] p-1 rounded-full w-fit">
            <Avatar className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36">
              <AvatarImage
                src="https://i.pravatar.cc/1000"
                alt="Jacob Smith"
                className="object-cover"
              />
              <AvatarFallback className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gray-200">
                JS
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-2 text-center px-4">
            Jacob Smith is a Meliorist
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-sm p-4 sm:p-5 lg:p-6 shadow-sm`}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 ${card.iconColor} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  {card.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-semibold text-gray-800 leading-tight">
                  {card.title}
                </h3>
              </div>
              <div className="space-y-2">
                {card.content.map((text, textIndex) => (
                  <p
                    key={textIndex}
                    className="text-gray-800 p-2 sm:p-2.5 lg:p-3 border border-gray-200 rounded bg-white text-sm sm:text-sm md:text-base lg:text-lg leading-relaxed"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RightSidebar - Hidden on mobile, visible on tablets and larger */}
      <div className="hidden md:block md:w-1/4 h-[89.5vh]">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
