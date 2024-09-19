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

  saveMediaList: (mediaList: Media[]): void => {
    localStorage.setItem(mediaService.mediaKey, JSON.stringify(mediaList));
  },
};
