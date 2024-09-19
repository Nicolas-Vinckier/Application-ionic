import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = () => {
    const media = mediaService.getMediaList();
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

  return (
    <div id="WatchInProgress">
      <h1>Films et séries en cours de visionnage</h1>

      {/* Affichage des films et séries */}
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
              <button>Modification</button>
            </div>
            <div className="user-avis">
              <div className="note">
                <p>Note: {media.rating ? media.rating : "Pas encore noté"}</p>
                <p>Dernière modification</p>
              </div>
              {media.type === "serie" && (
                <div className="change-episode-saison">
                  <div className="change-episode">
                    <p>Episode</p>
                    <div>
                    <button className="minus">-</button>
                    <button className="plus">+</button></div>
                  </div>
                  <div className="change-saison">
                    <p>Saison</p>
                    <div>
                    <button className="minus">-</button>
                    <button className="plus">+</button></div>
                  </div>
                </div>
              )}
              <div className="set-finish">
                <button>Fini</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun film ou série en cours de visionnage.</p>
      )}

      {/* Popup modale pour ajouter un nouveau média */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ajouter un film ou une série</h2>
            <input
              type="text"
              value={newMediaTitle}
              onChange={(e) => setNewMediaTitle(e.target.value)}
              placeholder="Nom du film ou série"
              required
            />
            <div>
              <label>
                <input
                  type="radio"
                  value="film"
                  checked={newMediaType === "film"}
                  onChange={() => setNewMediaType("film")}
                />
                Film
              </label>
              <label>
                <input
                  type="radio"
                  value="serie"
                  checked={newMediaType === "serie"}
                  onChange={() => setNewMediaType("serie")}
                />
                Série
              </label>
            </div>

            {/* Affichage des champs saison et épisode uniquement pour une série */}
            {newMediaType === "serie" && (
              <>
                <div>
                  <label>Saison :</label>
                  <input
                    type="number"
                    value={newMediaSeason}
                    onChange={(e) => setNewMediaSeason(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <label>Épisode :</label>
                  <input
                    type="number"
                    value={newMediaEpisode}
                    onChange={(e) => setNewMediaEpisode(Number(e.target.value))}
                    min="1"
                  />
                </div>
              </>
            )}

            <button onClick={addMedia}>Ajouter</button>
            <button onClick={() => setShowModal(false)}>Annuler</button>
          </div>
        </div>
      )}

      {/* Bouton "+" en bas à droite */}
      <button className="add-media-button" onClick={() => setShowModal(true)}>
        +
      </button>
    </div>
  );
};

export default WatchInProgress;
