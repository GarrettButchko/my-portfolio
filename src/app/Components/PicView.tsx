import Image from "next/image";

export function PicView({ profile }: { profile: string | null }) {
  if (!profile) return null;

  return (
    <div className="flex justify-center items-center w-full p-4">
      <div className="relative w-full h-[80vh] rounded-xl overflow-hidden">
        <Image
          key={profile}
          src={profile}
          alt="Profile"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}


