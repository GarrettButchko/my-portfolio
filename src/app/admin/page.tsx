import { VStack, HStack } from "../Components/Components";
import Plus from "../../../public/svg/plus.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Post, Project } from "@/app/types";
import { useReducer, useEffect, useState } from "react";
import DragDropUpload from "../Components/DragAndDrop";
import { downloadImageAsFile } from "../lib/downloadImageAsFile";

// --- Reducer & Actions ---
type PostAction =
  | { type: "SET_FIELD"; field: keyof Post; value: any }
  | { type: "ADD_TAG" }
  | { type: "REMOVE_TAG"; index: number }
  | { type: "UPDATE_TAG"; index: number; value: string }
  | { type: "ADD_RELATED_PROJECT" }
  | { type: "REMOVE_RELATED_PROJECT"; index: number }
  | { type: "UPDATE_RELATED_PROJECT"; index: number; value: string }
  | { type: "SET_PHOTO_FILE"; file: File | null }
  | { type: "RESET"; post: Post };

function postReducer(state: Post, action: PostAction): Post {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "ADD_TAG":
      return { ...state, tags: [...state.tags, ""] };

    case "REMOVE_TAG":
      return { ...state, tags: state.tags.filter((_, i) => i !== action.index) };

    case "UPDATE_TAG":
      return {
        ...state,
        tags: state.tags.map((t, i) => (i === action.index ? action.value : t)),
      };

    case "ADD_RELATED_PROJECT":
      return { ...state, relatedProjects: [...state.relatedProjects, ""] };

    case "REMOVE_RELATED_PROJECT":
      return {
        ...state,
        relatedProjects: state.relatedProjects.filter((_, i) => i !== action.index),
      };

    case "UPDATE_RELATED_PROJECT":
      return {
        ...state,
        relatedProjects: state.relatedProjects.map((p, i) =>
          i === action.index ? action.value : p
        ),
      };

    case "RESET":
      return action.post;

    default:
      return state;
  }
}

// --- Helper for downloading existing photo ---
function getFileNameFromUrl(url: string | null): string {
  if (!url) return "photo.png";
  const cleanUrl = url.split("?")[0];
  return cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
}

// --- Component ---
export default function EditAddPostView({
  workingPost,
  id,
  setPosts,
  setShow,
}: {
  workingPost: Post;
  id: number;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [localPost, dispatch] = useReducer(postReducer, { ...workingPost, id });

  // Load existing photo as File
  useEffect(() => {
    if (!workingPost.photo) return;
    async function loadImage() {
      const fileName = getFileNameFromUrl(workingPost.photo);
      const file = await downloadImageAsFile(workingPost.photo, fileName);
      setPhotoFile(file);
    }
    loadImage();
  }, [workingPost.photo]);

  // Fetch projects
  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = localStorage.getItem("projects");
    if (cached) {
      setProjects(JSON.parse(cached));
    }
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const cachedData = cached ? JSON.parse(cached) : null;
        if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
          setProjects(data);
          localStorage.setItem("projects", JSON.stringify(data));
        }
      })
      .catch((err) => console.error("Error loading projects:", err))
  }, []);

  return (
    <VStack
      className="bg-foreground rounded-[25px] p-6 w-full shadow-lg h-162 overflow-x-auto
      [&::-webkit-scrollbar]:w-[0px]
      hover:[&::-webkit-scrollbar]:w-[6px]
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-400/30
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60"
      spacing={8}
    >
      {/* ID, Title, Subtitle */}
      <HStack spacing={10} className="w-full">
        {/* ID */}
        <VStack className="items-center">
          <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">ID</p>
          <p className="text-sub3 font-bold md:text-[20px] sm:text-[20px] text-[13px] px-10 py-3 rounded-[12px] bg-sub1">
            {localPost.id}
          </p>
        </VStack>

        {/* Title */}
        <VStack className="items-center w-full">
          <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Title</p>
          <input
            type="text"
            placeholder="Type Here..."
            value={localPost.title}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "title", value: e.target.value })
            }
            className="outline-none w-full text-sub3 font-bold md:text-[20px] sm:text-[20px] text-[13px] px-5 py-3 rounded-[12px] bg-sub1"
          />
        </VStack>

        {/* Subtitle */}
        <VStack className="items-center w-full">
          <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Subtitle</p>
          <input
            type="text"
            placeholder="Type Here..."
            value={localPost.subtitle}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "subtitle", value: e.target.value })
            }
            className="outline-none w-full text-sub3 font-bold md:text-[20px] sm:text-[20px] text-[13px] px-5 py-3 rounded-[12px] bg-sub1"
          />
        </VStack>
      </HStack>

      {/* Body */}
      <VStack className="items-center w-full">
        <p className="text-left w-full ml-6 text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">
          Body
        </p>
        <textarea
          placeholder="Type Here..."
          value={localPost.body}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "body", value: e.target.value })
          }
          className="outline-none text-left text-sub3 md:text-[20px] sm:text-[20px] text-[13px] px-6 py-4 rounded-[12px] bg-sub1 w-full min-h-[300px] resize-none"
        />
      </VStack>

      {/* Photo + Date */}
      <HStack spacing={5}>
        <VStack className="items-center w-full">
          <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Photo</p>
          <DragDropUpload
            photoFile={photoFile}
            setPhotoFile={setPhotoFile}
            onFileSelect={(file) => setPhotoFile(file)}
          />
        </VStack>

        <div className="w-full max-w-xs items-center text-center">
          <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Date</p>
          <DatePicker
            selected={localPost.publish ?? new Date()}
            onChange={(date: Date | null) =>
              dispatch({ type: "SET_FIELD", field: "publish", value: date ?? new Date() })
            }
            dateFormat="MM-dd-yyyy"
            placeholderText="Select a date"
            className="outline-none px-3 py-2 rounded-[12px] w-full bg-sub1 text-sub2 text-center md:text-[20px] sm:text-[20px] text-[13px] cursor-pointer"
          />
        </div>
      </HStack>

      {/* Related Projects + Tags */}
      <HStack spacing={10} className="w-full text-center">
        {/* Related Projects */}
        <VStack className="w-full items-center" spacing={8}>
          <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Related Projects</p>
          {localPost.relatedProjects.map((project, i) => (
            <HStack key={i} className="w-full gap-2">
              <select
                value={project}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RELATED_PROJECT",
                    index: i,
                    value: e.target.value,
                  })
                }
                className="outline-none w-full text-sub3 font-bold md:text-[20px] sm:text-[20px] text-[13px] px-5 py-3 rounded-[12px] bg-sub1"
              >
                <option value="">Select a project</option>
                {projects.map((opt) => (
                  <option key={opt.title} value={opt.title}>
                    {opt.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => dispatch({ type: "REMOVE_RELATED_PROJECT", index: i })}
                className="flex justify-center items-center p-2 hover:brightness-75 active:scale-95 transition-all ease-in-out duration-300 cursor-pointer"
              >
                <Plus className="text-red-500 md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6 rotate-45" />
              </button>
            </HStack>
          ))}
          <button
            type="button"
            onClick={() => dispatch({ type: "ADD_RELATED_PROJECT" })}
            className="w-20 bg-accent rounded-full flex justify-center items-center p-2 hover:brightness-75 active:scale-95 transition-all ease-in-out duration-300 cursor-pointer"
          >
            <Plus className="text-white md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6" />
          </button>
        </VStack>

        {/* Tags */}
        <VStack className="w-full items-center" spacing={8}>
          <p className="text-sub2 md:text-[20px] sm:text-[20px] text-[13px]">Tags</p>
          {localPost.tags.map((tag, i) => (
            <HStack key={i} className="w-full gap-2">
              <input
                type="text"
                placeholder="Type Here..."
                value={tag}
                onChange={(e) =>
                  dispatch({ type: "UPDATE_TAG", index: i, value: e.target.value })
                }
                className="outline-none w-full text-sub3 font-bold md:text-[20px] sm:text-[20px] text-[13px] px-5 py-3 rounded-[12px] bg-sub1"
              />
              <button
                type="button"
                onClick={() => dispatch({ type: "REMOVE_TAG", index: i })}
                className="flex justify-center items-center p-2 hover:brightness-75 active:scale-95 transition-all ease-in-out duration-300 cursor-pointer"
              >
                <Plus className="text-red-500 md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6 rotate-45" />
              </button>
            </HStack>
          ))}
          <button
            type="button"
            onClick={() => dispatch({ type: "ADD_TAG" })}
            className="w-20 bg-accent rounded-full flex justify-center items-center p-2 hover:brightness-75 active:scale-95 transition-all ease-in-out duration-300 cursor-pointer"
          >
            <Plus className="text-white md:h-7 sm:h-6 h-5 w-5 md:w-7 sm:w-6" />
          </button>
        </VStack>
      </HStack>
    </VStack>
  );
}
