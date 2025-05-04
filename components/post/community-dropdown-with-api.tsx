import { useEffect, useState } from "react";
import { CommunityDropdown } from "./community-dropdown";
import { ENV } from "@/lib/config/env";

export interface Community {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CommunityDropdownWithAPIProps {
  selectedCommunity: string | null;
  onSelect: (category: string | null) => void;
}

export default function CommunityDropdownWithAPI({
  selectedCommunity,
  onSelect,
}: CommunityDropdownWithAPIProps) {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${ENV.API_ENDPOINT}/communities`);
        const data = await response.json();
        setCommunities(data);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <CommunityDropdown
      communities={communities}
      selectedCommunity={selectedCommunity}
      onSelect={onSelect}
    />
  );
}