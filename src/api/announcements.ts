import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";

export type Announcement = {
  id: string;
  courseId: string;
  title: string;
  body: string;
  author: string;
  authorId: string;
  isPinned: boolean;
  isUnread: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnouncementInput = {
  title: string;
  body: string;
  isPinned?: boolean;
};

export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>;

export const getAnnouncements = async (
  courseId: string,
  params: PaginationParams = {}
): Promise<Paginated<Announcement>> => {
  const { data } = await apiClient.get<Paginated<Announcement>>(
    `/courses/${courseId}/announcements`,
    { params }
  );
  return data;
};

export const addAnnouncement = async (
  courseId: string,
  input: CreateAnnouncementInput
): Promise<Announcement> => {
  const { data } = await apiClient.post<Announcement>(
    `/courses/${courseId}/announcements`,
    input
  );
  return data;
};

export const updateAnnouncement = async (
  courseId: string,
  announcementId: string,
  input: UpdateAnnouncementInput
): Promise<Announcement> => {
  const { data } = await apiClient.patch<Announcement>(
    `/courses/${courseId}/announcements/${announcementId}`,
    input
  );
  return data;
};

export const deleteAnnouncement = async (
  courseId: string,
  announcementId: string
): Promise<void> => {
  await apiClient.delete(`/courses/${courseId}/announcements/${announcementId}`);
};