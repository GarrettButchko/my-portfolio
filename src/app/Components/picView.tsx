export function picView(photo: string) {
  return (
    <div className="flex justify-center items-center w-full p-4">
      <img
        key={photo}
        src={photo}
        alt="Screenshot"
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