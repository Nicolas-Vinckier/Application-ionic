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
import "./FinishWatch.css";

interface ContainerProps {}

const FinishWatch: React.FC<ContainerProps> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Films et séries fini</IonTitle>
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
        <div></div>
      </IonContent>
    </IonPage>
  );
};

export default FinishWatch;
