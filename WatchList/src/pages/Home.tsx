import React from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import WatchInProgress from "../components/WatchInProgress";
import "./Home.css";
import "./Menu.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>WatchList</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <a id="home" className="menu-item" href="/">
              Accueil
            </a>
            <a id="finish" className="menu-item" href="/finish">
              Fini
            </a>{" "}
          </IonToolbar>
        </IonHeader>
        <WatchInProgress />
      </IonContent>
    </IonPage>
  );
};

export default Home;
