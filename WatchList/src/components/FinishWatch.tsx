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
import "./Components.css";

interface ContainerProps {}

const FinishWatch: React.FC<ContainerProps> = () => {
  return <div id="FinishWatch">Coucou</div>;
};

export default FinishWatch;
