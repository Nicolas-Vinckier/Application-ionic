import React from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Page.css";
import WatchInProgress from "../components/WatchInProgress";
import Menu from "../components/Menu";

const Page1: React.FC = () => {
  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Film/Série en cours</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <WatchInProgress />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Page1;
