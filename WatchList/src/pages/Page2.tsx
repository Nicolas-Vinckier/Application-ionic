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
import Menu from "../components/Menu";
import FinishWatch from "../components/FinishWatch";

const Page2: React.FC = () => {
  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Film/Série fini</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <FinishWatch />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Page2;
