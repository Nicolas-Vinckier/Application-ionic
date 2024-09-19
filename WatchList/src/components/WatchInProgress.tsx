import React, { useState, useEffect } from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Media } from "../models/media";
import { mediaService } from "../services/mediaService";
import "./WatchInProgress.css";

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

  const loadMedia = () => {
    const media = mediaService
      .getMediaList()
      .filter((m) => m.status === "inProgress");
    setMediaList(media);
  };

  const addMedia = () => {
    const newMedia: Media = {
      id: Date.now(),
      title: newMediaTitle,
      type: newMediaType,
      status: "inProgress",
      season: newMediaType === "serie" ? newMediaSeason : undefined,
      episode: newMediaType === "serie" ? newMediaEpisode : undefined,
      rating: undefined,
      imageUrl: "",
      description: "Nouvel élément ajouté",
    };

    mediaService.addMedia(newMedia);
    setNewMediaTitle("");
    setShowModal(false);
    loadMedia();
  };

  const updateMedia = (updatedMedia: Media) => {
    const updatedList = mediaList.map((media) =>
      media.id === updatedMedia.id ? updatedMedia : media
    );
    mediaService.saveMediaList(updatedList);
    loadMedia();
  };

  const openEditModal = (media: Media) => {
    setEditingMedia(media);
    setShowModal(true);
  };

  const saveEditedMedia = () => {
    if (editingMedia) {
      updateMedia(editingMedia);
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
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= (rating || 0) ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Films et séries en cours</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonMenu side="start" contentId="main-content">
        <IonItem button routerLink="/home">
          <IonIcon slot="start" icon="{homeOutline}" />
          <IonLabel>En cours</IonLabel>
        </IonItem>
        <IonItem button routerLink="/finish">
          <IonIcon slot="start" icon="{homeOutline}" />
          <IonLabel>Fini</IonLabel>
        </IonItem>
      </IonMenu>
      <IonContent fullscreen id="main-content">
        <div id="WatchInProgress">
          {mediaList.length > 0 ? (
            mediaList.map((media) => (
              <div key={media.id} className="single-movie">
                <div className="movie-info">
                  <img
                    src={media.imageUrl || "default-image.jpg"}
                    alt={media.title}
                  />
                  <h2>{media.title}</h2>
                  {media.type === "serie" && (
                    <h3>
                      Saison {media.season}, Épisode {media.episode}
                    </h3>
                  )}
                  <button onClick={() => openEditModal(media)}>
                    Modification
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
                    <button onClick={() => setFinished(media)}>Fini</button>
                  </div>
                </div>
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
                      <input
                        type="number"
                        value={
                          editingMedia ? editingMedia.season : newMediaSeason
                        }
                        onChange={(e) =>
                          editingMedia
                            ? setEditingMedia({
                                ...editingMedia,
                                season: Number(e.target.value),
                              })
                            : setNewMediaSeason(Number(e.target.value))
                        }
                        min="1"
                      />
                    </div>
                    <div>
                      <label>Épisode :</label>
                      <input
                        type="number"
                        value={
                          editingMedia ? editingMedia.episode : newMediaEpisode
                        }
                        onChange={(e) =>
                          editingMedia
                            ? setEditingMedia({
                                ...editingMedia,
                                episode: Number(e.target.value),
                              })
                            : setNewMediaEpisode(Number(e.target.value))
                        }
                        min="1"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label>Note :</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={editingMedia?.rating || ""}
                    onChange={(e) =>
                      editingMedia &&
                      setEditingMedia({
                        ...editingMedia,
                        rating: Math.min(
                          5,
                          Math.max(0, Number(e.target.value))
                        ),
                      })
                    }
                  />
                </div>

                <button onClick={editingMedia ? saveEditedMedia : addMedia}>
                  {editingMedia ? "Sauvegarder" : "Ajouter"}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingMedia(null);
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <button
            className="add-media-button"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WatchInProgress;
