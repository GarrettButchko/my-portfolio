import { VStack, HStack, Text, Section, Divider, Spacer, ZStack } from "../Components/components";
import { Project } from "@/app/Types/Project"


export function ProjSection({ project, index }: { project: Project; index: number }) {
  const total = Object.values(project.languages).reduce((a, b) => a + b, 0);

  const languageColors: Record<string, string> = {
    Swift: "#ffac45",
    JavaScript: "#f1e05a",
    Shell: "#89e051",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    Scala: "#c22d40",
    Haskell: "#5e5086",
    R: "#198CE7",
    "Objective C": "#438eff",
    HTML: "#e34c26",
    CSS: "#563d7c",
    SQL: "#e38c00",
    MATLAB: "#e16737",
  };

  return (
    <VStack
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: (index + 1) * 0.2 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-sub1 rounded-[24px] py-6 w-full overflow-hidden"
      spacing={10}
    >
      {/* Title + Github button */}
      <HStack className="items-center px-6 w-full">
        <VStack className="min-w-0">
          <p className="font-bold text-sub3 md:text-45 sm:text-45 text-35 truncate">
            {project.title}
          </p>
          <p className="text-sub3 md:text-[15px] sm:text-[12px] text-[10px] truncate">
            {project.type}
          </p>
        </VStack>
        <Spacer />
        <button
          type="button"
          onClick={() => window.open(project.link, "_blank")}
          className="z-20 rounded-[25px] active:scale-95 transition-all ease-in-out duration-300 bg-blue-500 hover:bg-blue-600 cursor-pointer h-8 w-25 flex justify-center items-center"
        >
          <span className="text-white font-semibold">Github</span>
        </button>
      </HStack>

      {/* Photos */}
      <HStack
        spacing={20}
        className="
          overflow-x-auto
          py-[1px] px-[1px] ml-6
          [&::-webkit-scrollbar]:h-[0px]
          hover:[&::-webkit-scrollbar]:h-[6px]
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-400/30
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60
        "
      >
        {project.photos.map((photo) => (
          <img
            key={photo}
            src={photo}
            alt={`Screenshot from ${project.title}`}
            className="rounded-[10px] h-[150px]"
          />
        ))}
      </HStack>

      {/* Languages */}
      <VStack className="" spacing={5}>
        {/* Badges */}
        <HStack
          spacing={15}
          className="
            overflow-x-auto py-[1px] px-[1px] ml-6 min-w-0
            transition-opacity duration-300
            [&::-webkit-scrollbar]:h-[0px]
            hover:[&::-webkit-scrollbar]:h-[6px]
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-400/30
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60
          "
        >
          {Object.entries(project.languages).map(([name, bytes]) => (
            <HStack
              key={name}
              spacing={5}
              className="px-3 py-[1px] rounded-[15px] bg-sub2/20 items-center mb-[2px]"
            >
              <div
                className="w-2 h-2 md:w-3 md:h-3 rounded-full"
                style={{ backgroundColor: languageColors[name] }}
              />
              <HStack spacing={1}>
                <p className="text-sub3 text-[12px] md:text-[15px] font-bold">
                  {name}:
                </p>
                <p className="text-sub3 text-[12px] md:text-[15px] ml-1">
                  {((bytes / total) * 100).toFixed(1)}%
                </p>
              </HStack>
            </HStack>
          ))}
        </HStack>

        {/* Language bar */}
        <VStack className="px-6">
          <div className="flex h-1 overflow-hidden rounded-lg">
            {Object.entries(project.languages).map(([name, bytes]) => (
              <div
                key={name}
                className="h-full transition-all duration-700"
                style={{
                  width: `${(bytes / total) * 100}%`,
                  backgroundColor: languageColors[name] || "#888",
                }}
              />
            ))}
          </div>
        </VStack>
      </VStack>
    </VStack>
  );
}



export function ProjSectionPlaceHolder({ className, animate=true}: { className?: string, animate?: boolean}) {
    return (
        <VStack
            className={`bg-sub1 rounded-[24px] p-6 w-full overflow-hidden ${animate ? "animate-pulse" : ""} ${className ?? ""}`}
            spacing={10}
        >
            <HStack className="items-center">
                <VStack spacing={5}>
                    <div className="font-bold text-sub3 md:h-[36px] sm:h-[32px] h-[28px] w-15 rounded-[10px] bg-sub2/30" />
                    <div className="font-bold text-sub3 md:h-[15px] sm:h-[12px] h-[10px] w-10 rounded-[10px] bg-sub2/30" />
                </VStack>
                <Spacer />
            </HStack>
            <HStack spacing={20}>
                <div className="w-20 h-[150px] rounded-[10px] my-2 bg-sub2/30" />
                <div className="w-20 h-[150px] rounded-[10px] my-2 bg-sub2/30" />
                <div className="w-20 h-[150px] rounded-[10px] my-2 bg-sub2/30" />
            </HStack>
            <div className="rounded-[10px] w-full md:h-[36px] sm:h-[32px] h-[28px] bg-sub2/30" />
        </VStack>
    );
}
