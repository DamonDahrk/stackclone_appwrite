import React from "react";
import { users } from "@/models/server/config";
import { avatars } from "@/models/client/config";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import convertDateToRelativeTime from "@/utils/relativeTime";
import EditButton from "./EditButton";

interface UserHeaderProps {
  userId: string;
}

// Async server component
const UserHeader = async ({ userId }: UserHeaderProps) => {
  const user = await users.get(userId);

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="w-40 shrink-0">
        <img
          src={avatars.getInitials(user.name, 200, 200)}
          alt={user.name}
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      <div className="w-full">
        <div className="flex items-start justify-between">
          <div className="block space-y-0.5">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-lg text-gray-500">{user.email}</p>
            <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
              <IconUserFilled className="w-4 shrink-0" /> Dropped{" "}
              {convertDateToRelativeTime(new Date(user.$createdAt))},
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <IconClockFilled className="w-4 shrink-0" /> Last activity{" "}
              {convertDateToRelativeTime(new Date(user.$updatedAt))}
            </p>
          </div>
          <div className="shrink-0">
            <EditButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
