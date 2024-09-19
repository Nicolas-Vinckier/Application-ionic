import { Media } from "../models/media";

export const mediaService = {
  mediaKey: "mediaList",

  getMediaList: (): Media[] => {
    const media = localStorage.getItem(mediaService.mediaKey);
    return media ? JSON.parse(media) : [];
  },

  addMedia: (newMedia: Media): void => {
    const mediaList = mediaService.getMediaList();
    mediaList.push(newMedia);
    mediaService.saveMediaList(mediaList);
  },

  updateMedia: (updatedMedia: Media): void => {
    const mediaList = mediaService.getMediaList();
    const index = mediaList.findIndex(media => media.id === updatedMedia.id);
    if (index !== -1) {
      mediaList[index] = updatedMedia;
      mediaService.saveMediaList(mediaList);
    }
  },

  saveMediaList: (mediaList: Media[]): void => {
    localStorage.setItem(mediaService.mediaKey, JSON.stringify(mediaList));
  },
};