export function PicView({ profile }: { profile: string | null }) {
  if (profile) {
    return (
    <div className="flex justify-center items-center w-full p-4">
        <img
          key={profile}
          src={profile}
          alt="Profile"
          className="
          rounded-[12px]
          shadow-lg
          max-w-full
          max-h-[80vh]
          h-auto
          w-auto
        "
        />
      </div>
    );
  }
}
