import React, { useState, useEffect } from "react";
import { Media } from "../models/media";
import { mediaService } from "../services/mediaService";
import "./Components.css";
import { IonIcon } from "@ionic/react";
import { camera, checkmarkDone, cog } from "ionicons/icons";
import { Camera, CameraResultType } from "@capacitor/camera";

interface ContainerProps {}

const WatchInProgress: React.FC<ContainerProps> = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [newMediaTitle, setNewMediaTitle] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newMediaType, setNewMediaType] = useState<"film" | "serie">("film");
  const [newMediaSeason, setNewMediaSeason] = useState<number>(1);
  const [newMediaEpisode, setNewMediaEpisode] = useState<number>(1);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const media = await mediaService.getMediaList();
    setMediaList(media.filter((m) => m.status === "inProgress"));
  };

  const addMedia = async () => {
    const newMedia: Media = {
      id: Date.now(),
      title: newMediaTitle,
      type: newMediaType,
      status: "inProgress",
      season: newMediaType === "serie" ? newMediaSeason : undefined,
      episode: newMediaType === "serie" ? newMediaEpisode : undefined,
      rating: undefined,
      imageUrl: "",
      description: "",
    };

    await mediaService.addMedia(newMedia);
    setNewMediaTitle("");
    setShowModal(false);
    loadMedia();
  };

  const updateMedia = async (updatedMedia: Media) => {
    await mediaService.updateMedia(updatedMedia);
    loadMedia();
  };

  const openEditModal = (media: Media) => {
    setEditingMedia(media);
    setShowModal(true);
  };

  const saveEditedMedia = async () => {
    if (editingMedia) {
      await updateMedia(editingMedia);
      setEditingMedia(null);
      setShowModal(false);
    }
  };

  const changeEpisode = (media: Media, increment: number) => {
    if (media.type === "serie" && media.episode !== undefined) {
      const updatedMedia = {
        ...media,
        episode: Math.max(1, media.episode + increment),
      };
      updateMedia(updatedMedia);
    }
  };

  const changeSeason = (media: Media, increment: number) => {
    if (media.type === "serie" && media.season !== undefined) {
      const updatedMedia = {
        ...media,
        season: Math.max(1, media.season + increment),
      };
      updateMedia(updatedMedia);
    }
  };

  const setFinished = (media: Media) => {
    const updatedMedia = { ...media, status: "end" as "inProgress" | "end" };
    updateMedia(updatedMedia);
  };

  const renderStars = (rating: number | undefined) => {
    if (rating === undefined || rating === null) {
      return <span>Pas encore de note</span>;
    }

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, media: Media) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });

      if (image.dataUrl) {
        const updatedMedia = { ...media, imageUrl: image.dataUrl };
        await updateMedia(updatedMedia);
      }
    } catch (error) {
      console.error("Erreur lors de la capture d'image : ", error);
    }
  };

  return (
    <div id="WatchInProgress">
      {mediaList.length > 0 ? (
        mediaList.map((media) => (
          <div key={media.id} className="single-movie">
            <div className="movie-info">
              <div className="image-container">
                <img
                  src={media.imageUrl || "default-image.jpg"}
                  alt={media.title}
                />
                <label className="image-upload-label">
                  <IonIcon icon={camera} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, media)}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <h2>{media.title}</h2>
              {media.type === "serie" && (
                <h3>
                  Saison {media.season}, Épisode {media.episode}
                </h3>
              )}
              <button
                className="modifiation"
                onClick={() => openEditModal(media)}
              >
                <IonIcon className="icon" icon={cog} />
              </button>
            </div>
            <div className="user-avis">
              <div className="note">
                <p>Note: {renderStars(media.rating)}</p>
              </div>
              {media.type === "serie" && (
                <div className="change-episode-saison">
                  <div className="change-episode">
                    <p>Episode</p>
                    <div>
                      <button
                        className="minus"
                        onClick={() => changeEpisode(media, -1)}
                      >
                        -
                      </button>
                      <button
                        className="plus"
                        onClick={() => changeEpisode(media, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="change-saison">
                    <p>Saison</p>
                    <div>
                      <button
                        className="minus"
                        onClick={() => changeSeason(media, -1)}
                      >
                        -
                      </button>
                      <button
                        className="plus"
                        onClick={() => changeSeason(media, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="set-finish">
                <button onClick={() => setFinished(media)}>
                  <IonIcon className="icon" icon={checkmarkDone} />
                </button>
              </div>
            </div>
            <div className="separation" />
          </div>
        ))
      ) : (
        <p>Aucun film ou série en cours de visionnage.</p>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {editingMedia ? "Modifier" : "Ajouter"} un film ou une série
            </h2>
            <input
              type="text"
              value={editingMedia ? editingMedia.title : newMediaTitle}
              onChange={(e) =>
                editingMedia
                  ? setEditingMedia({
                      ...editingMedia,
                      title: e.target.value,
                    })
                  : setNewMediaTitle(e.target.value)
              }
              placeholder="Nom du film ou série"
              required
            />
            <div>
              <label>
                <input
                  type="radio"
                  value="film"
                  checked={
                    editingMedia
                      ? editingMedia.type === "film"
                      : newMediaType === "film"
                  }
                  onChange={() =>
                    editingMedia
                      ? setEditingMedia({ ...editingMedia, type: "film" })
                      : setNewMediaType("film")
                  }
                />
                Film
              </label>
              <label>
                <input
                  type="radio"
                  value="serie"
                  checked={
                    editingMedia
                      ? editingMedia.type === "serie"
                      : newMediaType === "serie"
                  }
                  onChange={() =>
                    editingMedia
                      ? setEditingMedia({ ...editingMedia, type: "serie" })
                      : setNewMediaType("serie")
                  }
                />
                Série
              </label>
            </div>

            {(editingMedia
              ? editingMedia.type === "serie"
              : newMediaType === "serie") && (
              <>
                <div>
                  <label>Saison :</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="number"
                      value={
                        editingMedia ? editingMedia.season : newMediaSeason
                      }
                      readOnly
                      style={{ width: "10em", textAlign: "center" }}
                    />
                    <button
                      className="minus"
                      onClick={() =>
                        editingMedia
                          ? setEditingMedia({
                              ...editingMedia,
                              season: Math.max(
                                1,
                                (editingMedia.season || 1) - 1
                              ),
                            })
                          : setNewMediaSeason(Math.max(1, newMediaSeason - 1))
                      }
                    >
                      −
                    </button>
                    <button
                      className="plus"
                      onClick={() =>
                        editingMedia
                          ? setEditingMedia({
                              ...editingMedia,
                              season: (editingMedia.season || 1) + 1,
                            })
                          : setNewMediaSeason(newMediaSeason + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label>Épisode :</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="number"
                      value={
                        editingMedia ? editingMedia.episode : newMediaEpisode
                      }
                      readOnly
                      style={{ width: "10em", textAlign: "center" }}
                    />
                    <button
                      className="minus"
                      onClick={() =>
                        editingMedia
                          ? setEditingMedia({
                              ...editingMedia,
                              episode: Math.max(
                                1,
                                (editingMedia.episode || 1) - 1
                              ),
                            })
                          : setNewMediaEpisode(Math.max(1, newMediaEpisode - 1))
                      }
                    >
                      −
                    </button>
                    <button
                      className="plus"
                      onClick={() =>
                        editingMedia
                          ? setEditingMedia({
                              ...editingMedia,
                              episode: (editingMedia.episode || 1) + 1,
                            })
                          : setNewMediaEpisode(newMediaEpisode + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label>Note :</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  className="minus"
                  onClick={() =>
                    editingMedia &&
                    setEditingMedia({
                      ...editingMedia,
                      rating: Math.max(0, (editingMedia.rating || 0) - 1),
                    })
                  }
                >
                  −
                </button>

                <span style={{ margin: "auto" }}>
                  {editingMedia?.rating !== undefined
                    ? editingMedia.rating
                    : "0"}
                </span>

                <button
                  className="plus"
                  onClick={() =>
                    editingMedia &&
                    setEditingMedia({
                      ...editingMedia,
                      rating: Math.min(5, (editingMedia.rating || 0) + 1),
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="popupconfirmation">
              <button
                className="plus"
                onClick={editingMedia ? saveEditedMedia : addMedia}
              >
                {editingMedia ? "Sauvegarder" : "Ajouter"}
              </button>
              <button
                className="minus"
                onClick={() => {
                  setShowModal(false);
                  setEditingMedia(null);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="add-media-button" onClick={() => setShowModal(true)}>
        +
      </button>
    </div>
  );
};

export default WatchInProgress;
