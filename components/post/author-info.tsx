import Image from "next/image"

interface AuthorInfoProps {
  name: string
  timestamp: string
  avatarUrl: string
  isOnline?: boolean
}

export function AuthorInfo({ name, timestamp, avatarUrl, isOnline = false }: AuthorInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Image src={avatarUrl || "/placeholder.svg"} alt={name} width={40} height={40} className="rounded-full" />
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          <span className="text-gray-500 text-sm">{timestamp}</span>
        </div>
      </div>
    </div>
  )
}
